import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.search;
  return forward(`gear${query}`, req, { method: "GET" });
}
