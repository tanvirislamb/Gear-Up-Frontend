import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  return forward("admin/rentals", req, { method: "GET" });
}
