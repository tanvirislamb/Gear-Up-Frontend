import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.search;
  return forward(`rentals${query}`, req, { method: "GET" });
}

function toIsoDateTime(value: unknown): unknown {
  if (typeof value !== "string" || !value) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`).toISOString();
  }
  return value;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body && typeof body === "object") {
    if (body.startDate) body.startDate = toIsoDateTime(body.startDate);
    if (body.endDate) body.endDate = toIsoDateTime(body.endDate);
  }
  return forward("rentals", req, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
