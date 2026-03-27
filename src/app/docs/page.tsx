import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "REST API documentation for TEE Attestation Explorer. Verify Intel SGX and TDX attestation quotes programmatically. No API key required.",
  alternates: {
    canonical: "/docs",
  },
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-muted rounded-md px-4 py-3 overflow-x-auto text-sm font-mono whitespace-pre">
      {children}
    </pre>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">{children}</code>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            {headers.map((h) => (
              <th key={h} className="text-left py-2 pr-4 font-semibold text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 font-mono text-xs align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-muted py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-4xl font-black tracking-tight mb-2">API Documentation</h1>
          <p className="text-muted-foreground font-light">
            Programmatic access to TEE attestation verification — no API key required.
          </p>
        </div>

        <div className="bg-background rounded-lg border p-6 sm:p-8 space-y-10">
          <section>
            <h2 className="text-xl font-semibold mb-3">Documentation Index</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border p-4 bg-muted/40">
                <p className="font-semibold mb-1">API Documentation</p>
                <p className="text-sm text-muted-foreground mb-3">
                  HTTP endpoints for uploading quotes, redirects, limits, and response formats.
                </p>
                <Link href="/docs" className="text-sm underline hover:text-foreground transition-colors">
                  You are here
                </Link>
              </div>
              <div className="rounded-lg border p-4 bg-muted/40">
                <p className="font-semibold mb-1">dcap-qvl Library Docs</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn how to use the open-source dcap-qvl libraries in Rust, JavaScript, Python,
                  and Go.
                </p>
                <Link href="/docs/dcap-qvl" className="text-sm underline hover:text-foreground transition-colors">
                  Open dcap-qvl docs
                </Link>
              </div>
            </div>
          </section>

          <hr />

          {/* Rate Limits */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Rate Limits</h2>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>10 requests per minute per IP address</li>
              <li>5 validation errors per hour before the IP is blocked for 24 hours</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Each response includes{" "}
              <InlineCode>X-RateLimit-Limit</InlineCode>,{" "}
              <InlineCode>X-RateLimit-Remaining</InlineCode>, and{" "}
              <InlineCode>X-RateLimit-Reset</InlineCode> headers.
            </p>
          </section>

          <hr />

          {/* Upload API */}
          <section>
            <h2 className="text-xl font-semibold mb-1">POST /api/upload</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Submit an attestation quote for verification. Returns a checksum and a permalink to
              the report page.
            </p>

            <h3 className="text-sm font-semibold mb-2">Request</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Content-Type: <InlineCode>multipart/form-data</InlineCode>. Maximum file size: 20 KB.
              Maximum hex string length: 40 KB (20 KB in bytes). Provide either{" "}
              <InlineCode>file</InlineCode> or <InlineCode>hex</InlineCode>, not both.
            </p>
            <Table
              headers={["Parameter", "Type", "Required", "Description"]}
              rows={[
                ["file", "File", "No*", "Binary quote file"],
                ["hex", "String", "No*", "Hex-encoded quote string (0x prefix optional)"],
              ]}
            />

            <h3 className="text-sm font-semibold mt-6 mb-2">Success Response (200)</h3>
            <CodeBlock>{`{
  "success": true,
  "checksum": "0x...",
  "url": "https://proof.t16z.com/reports/0x..."
}`}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">Error Responses</h3>
            <Table
              headers={["Status", "Cause", "Body"]}
              rows={[
                ["400", "Missing or invalid input", `{ "error": "...", "remainingAttempts": N }`],
                ["403", "IP blocked (too many errors)", `{ "error": "Too many validation errors. Please try again later." }`],
                ["429", "Rate limit exceeded", `{ "error": "Too many requests. Please try again later." }`],
              ]}
            />
          </section>

          <hr />

          {/* Raw redirect API */}
          <section>
            <h2 className="text-xl font-semibold mb-1">
              GET /raw/[checksum]?hex=&#123;hexString&#125;
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Verify a hex-encoded quote and redirect to the report page. Useful for linking
              directly to a report from a hex string.
            </p>
            <Table
              headers={["Parameter", "Type", "Required", "Description"]}
              rows={[
                ["hex", "String", "Yes", "Hex-encoded quote (0x prefix optional, even-length, valid hex chars)"],
              ]}
            />
            <p className="text-sm text-muted-foreground mt-3">
              Returns <InlineCode>301</InlineCode> redirect to{" "}
              <InlineCode>/reports/&#123;checksum&#125;</InlineCode> on success, or{" "}
              <InlineCode>400 Bad Request</InlineCode> on invalid input.
            </p>
          </section>

          <hr />

          {/* Code Examples */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Code Examples</h2>

            <h3 className="text-sm font-semibold mb-2">curl</h3>
            <CodeBlock>{`# Binary file
curl -X POST -F "file=@/path/to/quote.bin" https://proof.t16z.com/api/upload

# Hex string
curl -X POST -F "hex=03000200..." https://proof.t16z.com/api/upload`}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">Python</h3>
            <CodeBlock>{`import requests

# Binary file
with open("quote.bin", "rb") as f:
    r = requests.post("https://proof.t16z.com/api/upload", files={"file": f})
print(r.json())  # {"success": true, "checksum": "0x...", "url": "..."}

# Hex string
hex_quote = "03000200..."  # remove 0x prefix if present
r = requests.post("https://proof.t16z.com/api/upload", data={"hex": hex_quote})
print(r.json())`}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">Python (async)</h3>
            <CodeBlock>{`import asyncio, httpx

async def verify(hex_quote: str):
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://proof.t16z.com/api/upload",
            data={"hex": hex_quote.removeprefix("0x")},
        )
        return r.json()

result = asyncio.run(verify("03000200..."))`}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">Node.js</h3>
            <CodeBlock>{`import { createReadStream } from "fs";

// Binary file
const form = new FormData();
form.append("file", new Blob([createReadStream("quote.bin")]));
const res = await fetch("https://proof.t16z.com/api/upload", {
  method: "POST",
  body: form,
});
console.log(await res.json());

// Hex string
const form2 = new FormData();
form2.append("hex", "03000200..."); // omit 0x prefix
const res2 = await fetch("https://proof.t16z.com/api/upload", {
  method: "POST",
  body: form2,
});
console.log(await res2.json());`}</CodeBlock>

            <h3 className="text-sm font-semibold mt-6 mb-2">Browser</h3>
            <CodeBlock>{`// From a file input
const file = document.querySelector('input[type="file"]').files[0];
const form = new FormData();
form.append("file", file);
const res = await fetch("https://proof.t16z.com/api/upload", {
  method: "POST",
  body: form,
});
const { url } = await res.json();
window.location.href = url;`}</CodeBlock>
          </section>

        </div>

        <footer className="mt-8 pb-4">
          <div className="inline-flex gap-1.5 justify-center items-center w-full">
            <img
              src="/apple-touch-icon.png"
              className="w-5 h-5 rounded-full overflow-hidden"
              alt="Phala"
            />
            <p className="text-muted-foreground text-sm">
              Developed by the{" "}
              <a
                href="https://phala.network"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                Phala team
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
