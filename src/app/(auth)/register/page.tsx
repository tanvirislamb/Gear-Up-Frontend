"use client";

import { useActionState, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerAction, RegisterFormState } from "./actions";
import { useAuth } from "@/context/AuthProvider";
import { Mountain, ShieldCheck, Store, UserRound, ArrowRight, Check } from "lucide-react";

const initialState: RegisterFormState = { success: false };

function RegisterContent() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const [selectedRole, setSelectedRole] = useState<string>("CUSTOMER");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (state.success) {
      (async () => {
        try {
          if (auth?.refreshUser) await auth.refreshUser();
        } catch { }
        router.push(
          redirect
            ? decodeURIComponent(redirect)
            : state.data?.role === "PROVIDER"
              ? "/dashboard/provider"
              : "/dashboard/customer"
        );
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  const roles = [
    {
      value: "CUSTOMER",
      title: "Renter",
      desc: "Browse & rent sports gear",
      icon: UserRound,
    },
    {
      value: "PROVIDER",
      title: "Gear Provider",
      desc: "List gear & earn income",
      icon: Store,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

      <div className="w-full max-w-lg rounded-3xl overflow-hidden bg-white md:shadow relative z-10">
        <div className="p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-black tracking-tight">Create account</h1>
              <p className="text-xs text-black/60">Join GearUp — rent or list gear today</p>
            </div>
          </div>

          {state.success ? (
            <div className="bg-primary border border-black/5 text-white/60 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-black/5 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-white">Account Created!</h3>
              <p className="text-xs text-white/60">{redirect ? "Taking you back..." : "Taking you to your dashboard..."}</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state.errors?.form && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-xl">
                  {state.errors.form}
                </div>
              )}

              {/* Role selection */}
              <div>
                <label className="block text-xs font-medium text-black/60 mb-2">
                  I want to join as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const active = selectedRole === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setSelectedRole(r.value)}
                        className={`relative p-4 rounded-2xl border text-left transition-all ${active
                          ? "border-black/10 bg-primary"
                          : "border-black/5 bg-white hover:border-black/10"
                          }`}
                      >
                        <input type="hidden" name="role" value={selectedRole} />
                        {active && (
                          <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                        <Icon className={`w-6 h-6 mb-2 ${active ? "text-white" : "text-black/60"}`} />
                        <div className={`text-sm font-bold ${active ? "text-white" : "text-black"}`}>{r.title}</div>
                        <div className={`text-[11px] ${active ? "text-white" : "text-black/60"}`}>{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
                {state.errors?.role && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{state.errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-black/60 mb-1.5">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="name"
                  className="w-full bg-black/3 rounded-xl px-3.5 py-2.5 text-sm text-black placeholder-black/40 focus:outline-none"
                />
                {state.errors?.name && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{state.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-black/60 mb-1.5">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="email"
                  className="w-full bg-black/3 rounded-xl px-3.5 py-2.5 text-sm text-black placeholder-black/40 focus:outline-none"
                />
                {state.errors?.email && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{state.errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-black/60 mb-1.5">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    className="w-full bg-black/3 rounded-xl px-3.5 py-2.5 text-sm text-black placeholder-black/40 focus:outline-none"
                  />
                  {state.errors?.password && (
                    <p className="text-[11px] text-rose-600 mt-1.5">{state.errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-black/60 mb-1.5">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Repeat password"
                    className="w-full bg-black/3 rounded-xl px-3.5 py-2.5 text-sm text-black placeholder-black/40 focus:outline-none"
                  />
                  {state.errors?.confirmPassword && (
                    <p className="text-[11px] text-rose-600 mt-1.5">{state.errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-primary hover:bg-primary/70 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center space-y-3">
            <p className="text-xs text-black/60">
              Already have an account?{" "}
              <Link
                href={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                className="text-black font-semibold hover:text-black/60"
              >
                Sign in
              </Link>
            </p>
            <Link
              href="/"
              className="text-xs text-black/60 hover:text-black inline-flex items-center gap-1"
            >
              <Mountain className="w-3.5 h-3.5" /> Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-65px)] flex items-center justify-center text-black/60">Loading…</div>}>
      <RegisterContent />
    </Suspense>
  );
}
