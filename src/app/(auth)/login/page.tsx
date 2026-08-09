"use client";

import { useActionState, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link"
import { loginAction, FormState } from "./actions"

const initialState: FormState = {
    success: false,
};

const LogInPage = () => {
    const [state, formAction, isPending] = useActionState(loginAction, initialState)
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(()=>{
      const redirect = searchParams.get('redirect');
      if(state.success){
        if(redirect){
          try{
            router.push(decodeURIComponent(redirect));
          }catch(e){
            router.push(redirect);
          }
        } else {
          router.push('/');
        }
      }
    }, [state.success, searchParams, router])

    return (
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 text-slate-900 relative overflow-hidden">
            {/* Background Soft Pastel Glow Blobs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-xl rounded-3xl overflow-hidden border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60 relative z-10">

                {/* Form Container */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Sign in to your account
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Enter your credentials to access your account dashboard
                        </p>
                    </div>

                    {state.success ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 text-emerald-600">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-1">
                                Welcome Back!
                            </h3>
                            <p className="text-xs text-slate-600 mb-4">
                                {state.message || "Authentication successful. You are now logged in."}
                            </p>
                            <Link
                                href="/"
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-all shadow-sm cursor-pointer inline-block"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                    ) : (
                        <form action={formAction} className="space-y-4">

                            {/* Server Action Error Feedback */}
                            {state.error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-start gap-2">
                                    <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{state.error}</span>
                                </div>
                            )}

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all hover:border-slate-300 cursor-pointer"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        />
                                    </svg>
                                    Google
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all hover:border-slate-300 cursor-pointer"
                                >
                                    <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                    GitHub
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="relative flex items-center justify-center my-4">
                                <div className="border-t border-slate-200 w-full" />
                                <span className="bg-white px-3 text-[10px] uppercase font-semibold text-slate-400 absolute">
                                    Or continue with email
                                </span>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-medium text-slate-700">Password</label>
                                    <a href="#" className="text-[11px] text-slate-600 hover:text-slate-900 font-medium transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-black focus:ring-1 focus:ring-black transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 0110.123 3.937M12 5c.828 0 1.63.1 2.395.29M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    id="remember"
                                    className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-black focus:ring-black cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-xs text-slate-600 select-none cursor-pointer">
                                    Keep me signed in on this device
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full mt-2 py-3 px-4 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In to Dashboard
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Return to Homepage
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LogInPage;