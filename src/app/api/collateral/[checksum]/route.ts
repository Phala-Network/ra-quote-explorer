import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-static";

export async function GET(
  _req: NextRequest,
  { params }: { params: { checksum: string } },
) {
  const apiPrefix = process.env.API_PREFIX;
  if (!apiPrefix) {
    throw new Error("API_PREFIX environment variable is not set");
  }
  const response = await fetch(
    `${apiPrefix}/api/collateral/${params.checksum}`,
  );

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
