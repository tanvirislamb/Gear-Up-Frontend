import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  return forward("categories", req, { method: "GET" });
}
