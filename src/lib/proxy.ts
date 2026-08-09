import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://gearup-sooty-one.vercel.app/api";

export async function forward(
  path: string,
  req: NextRequest,
  init: RequestInit = {}
): Promise<NextResponse> {
  const base = API_BASE.replace(/\/$/, "");
  const url = `${base}/${path.replace(/^\//, "")}`;
  try {
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    const cookie = req.headers.get("cookie");
    if (cookie) headers.set("cookie", cookie);

    const res = await fetch(url, { ...init, headers, cache: "no-store" });
    const data = await res.json().catch(() => ({}));

    const resHeaders = new Headers();
    const cookies = res.headers.getSetCookie?.() ?? [];
    if (cookies.length > 0) {
      for (const c of cookies) resHeaders.append("set-cookie", c);
    }

    return NextResponse.json(data, { status: res.status, headers: resHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Proxy request failed", data: {} },
      { status: 500 }
    );
  }
}

export const getBase = () => API_BASE.replace(/\/$/, "");
