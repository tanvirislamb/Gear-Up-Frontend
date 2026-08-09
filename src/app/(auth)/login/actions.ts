"use server";

import { z } from "zod";
import { persistCookiesFromResponse } from "@/lib/server-cookies";
import { getBase } from "@/lib/proxy";

export type FormState = {
  success: boolean;
  message?: string;
  errors?: { email?: string; password?: string; form?: string };
  data?: any;
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  try {
    const res = await fetch(`${getBase()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || result.success === false) {
      return {
        success: false,
        errors: {
          form: result.message || "Invalid credentials or login failed.",
        },
      };
    }

    await persistCookiesFromResponse(res);

    return {
      success: true,
      message: result.message || "Login successful!",
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      errors: {
        form: err?.message || "An unexpected error occurred during login.",
      },
    };
  }
}
