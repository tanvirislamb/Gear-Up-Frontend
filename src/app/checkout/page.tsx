"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";

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
        body: JSON.stringify({ gearItemId: gearId, quantity: qty, startDate, endDate })
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
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl p-8 text-slate-800">
        <h1 className="text-xl font-extrabold text-slate-900 mb-2">Confirm Rental</h1>
        <p className="text-sm text-slate-500">Gear: {gearId || 'N/A'}</p>
        <p className="text-sm text-slate-500 mt-1">From: {startDate || 'N/A'} — To: {endDate || 'N/A'}</p>
        <p className="text-sm text-slate-500 mt-1">Quantity: {qty}</p>

        {error && <div className="mt-4 text-xs text-rose-600">{error}</div>}

        <div className="mt-6 flex items-center gap-3">
          <button onClick={handlePlaceOrder} disabled={loading} className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-xl font-semibold">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-slate-500">Loading…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
