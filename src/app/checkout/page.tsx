"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Mountain, ShieldCheck, Calendar, Package, ArrowRight, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toIsoDateTime(value: string) {
  if (!value) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`).toISOString();
  }
  return value;
}

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const gearId = params.get('redirect')?.split('/gear/')[1] || params.get('gearId') || '';
  const startDate = params.get('startDate') || '';
  const endDate = params.get('endDate') || '';
  const qty = parseInt(params.get('qty') || params.get('quantity') || '1', 10) || 1;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gearItemId: gearId, quantity: qty, startDate: toIsoDateTime(startDate), endDate: toIsoDateTime(endDate) })
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Failed to place order');
        setLoading(false);
        return;
      }
      router.push('/dashboard/customer');
    } catch (err: any) {
      setError(err.message || 'Network error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <Link
          href="/gear"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-black/60 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Gear
        </Link>

        <div className="bg-white border border-black/5 rounded-3xl p-8 sm:p-10 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#dad8f9] text-black flex items-center justify-center font-bold">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-black tracking-tight">Confirm Rental</h1>
              <p className="text-xs text-black/60">Review your booking details before placing the order</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-black/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-black/60 flex items-center gap-2">
                <Package className="w-4 h-4 text-black/60" /> Gear
              </span>
              <span className="text-sm font-semibold text-black text-right">{gearId || "—"}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-black/60 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-black/60" /> Rental period
              </span>
              <span className="text-sm font-semibold text-black text-right">
                {formatDate(startDate)} → {formatDate(endDate)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-black/60 flex items-center gap-2">
                <Package className="w-4 h-4 text-black/60" /> Quantity
              </span>
              <span className="text-sm font-semibold text-black">{qty}</span>
            </div>
            <div className="flex items-center justify-between gap-4 pt-3 border-t border-black/5">
              <span className="text-sm text-black/60 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black/60" /> Equipment insurance
              </span>
              <span className="text-sm font-semibold text-black/60">Included</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-extrabold text-sm bg-[#dad8f9] hover:bg-[#dad8f9]/70 text-black transition-all duration-200 active:scale-[0.99] disabled:opacity-70 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Placing Order…</span>
              </>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-black/60">
            Your provider will confirm the rental before payment is collected.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-black/60">Loading…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
