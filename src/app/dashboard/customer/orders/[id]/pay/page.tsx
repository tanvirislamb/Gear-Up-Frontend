"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useToast } from "@/context/ToastProvider";
import { RentalOrder } from "@/types/gear";
import { fetchOrderById, createPayment } from "@/services/api";
import { StatusBadge } from "@/component/StatusBadge";
import { CreditCard, Loader2, ArrowLeft, Calendar, ShieldCheck } from "lucide-react";

export default function PayOrderPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { success, error } = useToast();
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchOrderById(id).then((o) => {
      setOrder(o);
      setLoading(false);
    });
  }, [id]);

  async function handlePay() {
    if (!order) return;
    setPaying(true);
    try {
      const res = await createPayment(order.id);
      if (!res?.success || !res.data?.sessionUrl) {
        error(res?.message || "Failed to create payment session");
        setPaying(false);
        return;
      }
      window.location.href = res.data.sessionUrl;
    } catch {
      error("Network error while creating payment");
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-slate-400">Order not found.</p>
        <Link href="/dashboard/customer" className="text-emerald-400 font-semibold text-sm">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/customer"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-white">Confirm & Pay</h1>
          <StatusBadge status={order.status} />
        </div>

        <div className="space-y-3 border-t border-slate-800 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Gear</span>
            <span className="text-white font-semibold">{order.gearItem?.name || "Gear item"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Rental period
            </span>
            <span className="text-white font-semibold">
              {new Date(order.startDate).toLocaleDateString()} →{" "}
              {new Date(order.endDate).toLocaleDateString()} ({days} day{days > 1 ? "s" : ""})
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Quantity</span>
            <span className="text-white font-semibold">{order.quantity}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-slate-800 pt-3">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Equipment insurance
            </span>
            <span className="text-emerald-400 font-semibold">Included</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-base font-bold text-slate-200">Total due</span>
            <span className="text-2xl font-black text-white">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {order.status === "CONFIRMED" ? (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-60 shadow-lg shadow-emerald-500/20"
          >
            <CreditCard className="w-4 h-4" />
            {paying ? "Creating secure checkout…" : "Pay with Stripe"}
          </button>
        ) : (
          <div className="text-center text-sm text-amber-300/90 bg-amber-500/10 border border-amber-500/30 rounded-2xl py-3">
            Payment is only available once the provider confirms your order.
          </div>
        )}

        <p className="text-[11px] text-slate-500 text-center">
          You&apos;ll be redirected to Stripe's secure checkout. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
