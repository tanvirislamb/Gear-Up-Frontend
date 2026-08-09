import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://gearup-sooty-one.vercel.app/api";

export async function GET(req: NextRequest) {
  try {
    // Forward querystring as-is
    const url = `${API_BASE}/rentals${req.nextUrl.search}`;
    const cookieHeader = req.headers.get("cookie") || "";

    const res = await fetch(url, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to fetch rentals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const url = `${API_BASE}/rentals`;
    const cookieHeader = req.headers.get("cookie") || "";
    const body = await req.json();

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to create rental" }, { status: 500 });
  }
}
