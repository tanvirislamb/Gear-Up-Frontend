import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return forward(`rentals/${id}`, req, { method: "GET" });
}
