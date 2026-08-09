import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  return forward(`provider/gear/${id}`, req, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  return forward(`provider/gear/${id}`, req, { method: "DELETE" });
}
