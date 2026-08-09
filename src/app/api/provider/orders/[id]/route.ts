import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  return forward(`provider/orders/${id}`, req, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
