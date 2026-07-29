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
    const res = await fetch("https://gearup-sooty-one.vercel.app/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || result.success === false) {
      return {
        success: false,
        error: result.message || "Invalid credentials or login failed.",
      };
    }

    // Store auth token in cookies if provided
    const cookieStore = await cookies();
    const token = result.token || result.data?.accessToken || result.data?.token;
    if (token) {
      cookieStore.set("token", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
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
