import { NextRequest } from "next/server";
import { forward } from "@/lib/proxy";

export async function POST(req: NextRequest) {
  const headers = new Headers({ "Content-Type": "application/json" });
  // Clear local auth cookies; backend has no logout endpoint.
  headers.append(
    "set-cookie",
    "accessToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax"
  );
  headers.append(
    "set-cookie",
    "refreshToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax"
  );
  headers.append("set-cookie", "token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");

  try {
    await forward("auth/logout", req, { method: "POST" });
  } catch {
    // ignore backend logout errors
  }

  return new Response(JSON.stringify({ success: true, message: "Logged out" }), {
    status: 200,
    headers,
  });
}
