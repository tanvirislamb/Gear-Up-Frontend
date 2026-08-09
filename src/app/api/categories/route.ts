import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://gearup-sooty-one.vercel.app/api";

export async function GET() {
  const res = await fetch(`${API_BASE}/categories`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
