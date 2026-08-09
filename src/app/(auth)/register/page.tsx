"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction, RegisterFormState } from "./actions";
import { useAuth } from "@/context/AuthProvider";
import { Mountain, ShieldCheck, Store, UserRound, ArrowRight, Check } from "lucide-react";

const initialState: RegisterFormState = { success: false };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const [selectedRole, setSelectedRole] = useState<string>("CUSTOMER");
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
        } catch {}
        router.push(
          state.data?.role === "PROVIDER" ? "/dashboard/provider" : "/dashboard/customer"
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
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur relative z-10">
        <div className="p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">Create account</h1>
              <p className="text-xs text-slate-400">Join GearUp — rent or list gear today</p>
            </div>
          </div>

          {state.success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-white">Account Created!</h3>
              <p className="text-xs text-emerald-300/80">Taking you to your dashboard...</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state.errors?.form && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3.5 rounded-xl">
                  {state.errors.form}
                </div>
              )}

              {/* Role selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
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
                        className={`relative p-4 rounded-2xl border text-left transition-all ${
                          active
                            ? "border-emerald-500/60 bg-emerald-500/10"
                            : "border-slate-800 bg-slate-950/60 hover:border-slate-600"
                        }`}
                      >
                        <input type="hidden" name="role" value={selectedRole} />
                        {active && (
                          <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                        <Icon className={`w-6 h-6 mb-2 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                        <div className="text-sm font-bold text-white">{r.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
                {state.errors?.role && (
                  <p className="text-[11px] text-rose-400 mt-1.5">{state.errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {state.errors?.name && (
                  <p className="text-[11px] text-rose-400 mt-1.5">{state.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                {state.errors?.email && (
                  <p className="text-[11px] text-rose-400 mt-1.5">{state.errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Min. 6 characters"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {state.errors?.password && (
                    <p className="text-[11px] text-rose-400 mt-1.5">{state.errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Repeat password"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {state.errors?.confirmPassword && (
                    <p className="text-[11px] text-rose-400 mt-1.5">{state.errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPending ? (
                  <span className="animate-spin w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full" />
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
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300">
                Sign in
              </Link>
            </p>
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1"
            >
              <Mountain className="w-3.5 h-3.5" /> Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
