"use server";

import { z } from "zod";
import { persistCookiesFromResponse } from "@/lib/server-cookies";
import { getBase } from "@/lib/proxy";

export type RegisterFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    form?: string;
  };
  data?: any;
};

const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "PROVIDER"], {
      message: "Please select a role",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as string;

  const parsed = registerSchema.safeParse({
    name,
    email,
    password,
    confirmPassword,
    role,
  });
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      errors: {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
        role: fieldErrors.role?.[0],
      },
    };
  }

  try {
    const res = await fetch(`${getBase()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || result.success === false) {
      return {
        success: false,
        errors: {
          form: result.message || "Registration failed. Please try again.",
        },
      };
    }

    await persistCookiesFromResponse(res);

    return {
      success: true,
      message: result.message || "Account created successfully!",
      data: result.data,
    };
  } catch (err: any) {
    return {
      success: false,
      errors: {
        form: err?.message || "An unexpected error occurred during registration.",
      },
    };
  }
}
