"use server";

import { cookies } from "next/headers";

export type FormState = {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
};

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required.",
    };
  }

  try {
    // Use local proxy so the backend Set-Cookie header is forwarded to the browser
    const res = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store'
    });

    const result = await res.json();

    if (!res.ok || result.success === false) {
      return {
        success: false,
        error: result.message || "Invalid credentials or login failed.",
      };
    }

    // Store auth token or forward Set-Cookie from backend to the browser
    const cookieStore = await cookies();
    // If backend returned a token in JSON, set it as a cookie
    const token = result.token || result.data?.accessToken || result.data?.token;
    if (token) {
      cookieStore.set("token", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    } else {
      // If backend set a Set-Cookie header and proxy forwarded it, parse it and set cookie locally
      const setCookieHeader = res.headers.get('set-cookie');
      if (setCookieHeader) {
        // Extract name and value before first ;
        const first = setCookieHeader.split(';')[0];
        const eq = first.indexOf('=');
        if (eq > -1) {
          const name = first.substring(0, eq).trim();
          const value = first.substring(eq + 1).trim();
          try {
            cookieStore.set(name, value, { httpOnly: true, path: '/', secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
          } catch (e) {
            // ignore cookie set errors
          }
        }
      }
    }

    return {
      success: true,
      message: result.message || "Login successful!",
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An unexpected error occurred during login.",
    };
  }
}
