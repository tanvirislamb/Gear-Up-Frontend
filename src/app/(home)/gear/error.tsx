"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GearError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Gear page error boundary caught an exception:", error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-500/20">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
        <p className="text-xs text-slate-500">
          We encountered an unexpected error while loading the gear catalog. Please try again or return to the homepage.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors inline-flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-800 hover:bg-slate-100 transition-colors inline-flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
