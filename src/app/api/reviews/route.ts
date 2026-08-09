import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return forward("reviews", req, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
