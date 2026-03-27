import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ checksum: string }> },
) {
  const apiPrefix = process.env.API_PREFIX;
  if (!apiPrefix) {
    throw new Error("API_PREFIX environment variable is not set");
  }
  const { checksum } = await params;
  const response = await fetch(
    `${apiPrefix}/attestations/collateral/${checksum}`,
  );

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
