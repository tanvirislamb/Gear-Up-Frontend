"use client"

import { useActionState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { loginAction, FormState } from "./actions"
import { useAuth } from "@/context/AuthProvider"
import { Mountain, ShieldCheck, Calendar, ArrowRight } from "lucide-react"

const initialState: FormState = { success: false }

function LoginContent() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()
  const redirect = searchParams.get("redirect")

  useEffect(() => {
    if (state.success) {
      ; (async () => {
        try {
          if (refreshUser) await refreshUser()
        } catch { }
        const target = redirect
          ? decodeURIComponent(redirect)
          : "/"
        router.push(target)
      })()
    }
  }, [state.success])

  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">

      <div className="w-full max-w-md rounded-3xl overflow-hidden md:shadow relative z-10">
        <div className="p-8 lg:p-10">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-black tracking-tight">Welcome back</h1>
              <p className="text-xs text-black/60">Sign in to your GearUp account</p>
            </div>
          </div>

          {state.success ? (
            <div className="bg-primary border border-black/5 text-white/60 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-black/5 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-white">Login Successful!</h3>
              <p className="text-xs text-white/60">Taking you back...</p>
            </div>
          ) : (
            <form action={formAction} className="space-y-4">
              {state.errors?.form && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-xl">
                  {state.errors.form}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-black/60 mb-1.5">Email</label>
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

              <div>
                <label className="block text-xs font-medium text-black/60 mb-1.5">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-black/5 rounded-xl px-3.5 py-2.5 text-sm text-black placeholder-black/40 focus:outline-none"
                />
                {state.errors?.password && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{state.errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-4 bg-primary text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
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
            <p className="text-xs text-black/60">
              Don&apos;t have an account?{" "}
              <Link
                href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                className="text-black font-semibold hover:text-black/60"
              >
                Create one
              </Link>
            </p>
            <Link
              href="/"
              className="text-xs text-black/60 hover:text-black inline-flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" /> Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LogInPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-65px)] flex items-center justify-center text-black/60">Loading…</div>}>
      <LoginContent />
    </Suspense>
  )
}
