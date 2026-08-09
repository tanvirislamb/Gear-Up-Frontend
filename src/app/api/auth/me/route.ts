import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function GET(req: NextRequest) {
  try {
    const url = `${API_BASE.replace(/\/$/, '')}/auth/me`;
    const cookieHeader = req.headers.get('cookie') || '';
    const res = await fetch(url, { method: 'GET', headers: { cookie: cookieHeader }, cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err:any) {
    return NextResponse.json({ success: false, message: err.message || 'Failed to fetch current user' }, { status: 500 });
  }
}
