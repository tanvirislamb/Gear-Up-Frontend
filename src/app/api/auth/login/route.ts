import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = `${API_BASE.replace(/\/$/, '')}/auth/login`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    });

    const data = await res.json();
    const setCookie = res.headers.get('set-cookie');

    const headers: Record<string,string> = {};
    if (setCookie) headers['set-cookie'] = setCookie;

    return NextResponse.json(data, { status: res.status, headers });
  } catch (err:any) {
    return NextResponse.json({ success: false, message: err.message || 'Login proxy failed' }, { status: 500 });
  }
}
