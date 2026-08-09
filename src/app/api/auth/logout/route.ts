import { NextRequest, NextResponse } from "next/server";

// Proxy logout if backend supports, otherwise clear cookie
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function POST(req: NextRequest) {
  try {
    // Attempt to call backend logout if available
    try {
      await fetch(`${API_BASE.replace(/\/$/, '')}/auth/logout`, { method: 'POST', headers: { cookie: req.headers.get('cookie') || '' }, cache: 'no-store' });
    } catch (e) {
      // ignore
    }

    // Clear cookie by setting expired cookie
    const headers: Record<string,string> = {
      'set-cookie': `token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax;`,
    };

    return NextResponse.json({ success: true, message: 'Logged out' }, { status: 200, headers });
  } catch (err:any) {
    return NextResponse.json({ success: false, message: err.message || 'Logout failed' }, { status: 500 });
  }
}
