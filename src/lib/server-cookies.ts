import { cookies } from "next/headers";

export interface ParsedCookie {
  name: string;
  value: string;
}

export function extractCookiesFromResponse(res: Response): ParsedCookie[] {
  let raw: string[] = [];
  if (typeof (res.headers as any).getSetCookie === "function") {
    raw = (res.headers as any).getSetCookie() as string[];
  } else {
    const joined = res.headers.get("set-cookie");
    if (joined) raw = joined.split(/,(?=[a-zA-Z0-9_-]+\s*=)/);
  }

  const out: ParsedCookie[] = [];
  for (const c of raw) {
    const first = c.split(";")[0];
    const eq = first.indexOf("=");
    if (eq > -1) {
      const name = first.substring(0, eq).trim();
      const value = first.substring(eq + 1).trim();
      if (name && value) out.push({ name, value });
    }
  }
  return out;
}

export async function persistCookiesFromResponse(res: Response): Promise<string[]> {
  const store = await cookies();
  const names: string[] = [];
  for (const { name, value } of extractCookiesFromResponse(res)) {
    try {
      store.set(name, value, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      names.push(name);
    } catch {
      // ignore cookie set errors
    }
  }
  return names;
}
