import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.search;
  return forward(`rentals${query}`, req, { method: "GET" });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return forward("rentals", req, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
