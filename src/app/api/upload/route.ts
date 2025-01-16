import { ofetch } from "ofetch";
import { z } from "zod";
import { headers } from 'next/headers';
import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined');
}

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL);

// Define maximum file size (20KB)
const MAX_FILE_SIZE = 20 * 1024;

// Rate limiting constants
const MAX_ERRORS_PER_IP = 5;  // Maximum allowed errors per IP
const ERROR_WINDOW = 60 * 60;  // Reset error count after 1 hour (in seconds)
const BLOCK_DURATION = 24 * 60 * 60;  // Block IP for 24 hours if limit exceeded

// Request threshold constants
const MAX_REQUESTS_PER_WINDOW = 10;  // Maximum requests per window
const THRESHOLD_WINDOW = 60;  // 1 minute window (in seconds)

// Create validation schema
const UploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size cannot exceed ${MAX_FILE_SIZE / 1024}KB`
  ).refine(
    (file) => file.size > 0,
    `File cannot be empty`
  ),
});

async function getClientIP(): Promise<string> {
  const headersList = headers();
  return headersList.get('x-forwarded-for') || 
         headersList.get('x-real-ip') || 
         'unknown';
}

async function isIPBlocked(ip: string): Promise<boolean> {
  const blockedUntil = await redis.get(`blocked:${ip}`);
  return !!blockedUntil && Date.now() < Number(blockedUntil);
}

async function incrementRequestCount(ip: string): Promise<{
  count: number;
  remaining: number;
  reset: number;
}> {
  const key = `requests:${ip}`;
  const count = await redis.incr(key);
  
  // Set expiration on first request
  if (count === 1) {
    await redis.expire(key, THRESHOLD_WINDOW);
  }

  // Get TTL for reset time
  const ttl = await redis.ttl(key);
  
  return {
    count,
    remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - count),
    reset: ttl > 0 ? ttl : THRESHOLD_WINDOW
  };
}

async function incrementErrorCount(ip: string): Promise<number> {
  const key = `errors:${ip}`;
  const count = await redis.incr(key);
  
  // Set expiration on first error
  if (count === 1) {
    await redis.expire(key, ERROR_WINDOW);
  }
  
  // If error count exceeds limit, block the IP
  if (count >= MAX_ERRORS_PER_IP) {
    await redis.set(`blocked:${ip}`, Date.now() + BLOCK_DURATION * 1000, 'EX', BLOCK_DURATION);
  }
  
  return count;
}

export async function POST(req: Request) {
  try {
    const ip = await getClientIP();

    // Check if IP is blocked
    if (await isIPBlocked(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many validation errors. Please try again later." }), 
        { 
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Increment and check request count for all requests
    const rateLimit = await incrementRequestCount(ip);
    const rateLimitHeaders = {
      'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': rateLimit.reset.toString(),
      'Content-Type': "application/json",
    };

    if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }), 
        { 
          status: 429,
          headers: {
            ...rateLimitHeaders,
            "Retry-After": rateLimit.reset.toString()
          },
        }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      await incrementErrorCount(ip);
      return new Response(
        JSON.stringify({ error: "Please upload a file" }), 
        { 
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    // Validate file
    const result = UploadSchema.safeParse({ file });
    if (!result.success) {
      const errorCount = await incrementErrorCount(ip);
      return new Response(
        JSON.stringify({ 
          error: result.error.errors[0].message,
          remainingAttempts: Math.max(0, MAX_ERRORS_PER_IP - errorCount)
        }), 
        {
          status: 400,
          headers: rateLimitHeaders,
        }
      );
    }

    const response = await ofetch(
      `${process.env.API_PREFIX}/api/attestations/verify`,
      {
        method: "POST",
        body: formData,
      },
    );

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: rateLimitHeaders,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
