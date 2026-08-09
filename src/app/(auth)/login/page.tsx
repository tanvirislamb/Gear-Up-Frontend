"use client";

import { useActionState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { loginAction, FormState } from "./actions";
import { useAuth } from "@/context/AuthProvider";
import { Mountain, ShieldCheck, Calendar, ArrowRight } from "lucide-react";

const initialState: FormState = { success: false };

function LoginContent() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (state.success) {
      (async () => {
        try {
          if (refreshUser) await refreshUser();
        } catch {}
        const target = redirect
          ? decodeURIComponent(redirect)
          : "/";
        router.push(target);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-2xl backdrop-blur relative z-10">
        <div className="p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
              <p className="text-xs text-slate-500">Sign in to your GearUp account</p>
            </div>
          </div>

          {state.success ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-slate-900">Login Successful!</h3>
              <p className="text-xs text-emerald-600/80">Taking you back...</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state.errors?.form && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-xl">
                  {state.errors.form}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {state.errors?.email && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{state.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {state.errors?.password && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{state.errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPending ? (
                  <span className="animate-spin w-4 h-4 border-2 border-slate-200 border-t-transparent rounded-full" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center space-y-3">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                className="text-emerald-600 font-semibold hover:text-emerald-600"
              >
                Create one
              </Link>
            </p>
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" /> Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LogInPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-65px)] flex items-center justify-center text-slate-500">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
