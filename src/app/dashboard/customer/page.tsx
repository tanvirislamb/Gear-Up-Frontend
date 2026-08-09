"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { RentalOrder, Payment } from "@/types/gear";
import { fetchMyOrders, fetchMyPayments, submitReview } from "@/services/api";
import { StatusBadge } from "@/component/StatusBadge";
import {
  CreditCard,
  Loader2,
  PackageX,
  Star,
  Calendar,
  Wallet,
  BadgeCheck,
} from "lucide-react";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ReviewForm({ order, onDone }: { order: RentalOrder; onDone: () => void }) {
  const { success, error } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await submitReview({
      gearItemId: order.gearItemId,
      rating,
      comment: comment.trim() || undefined,
    });
    setSubmitting(false);
    if (res?.success) {
      success("Review submitted. Thank you!");
      onDone();
    } else {
      error(res?.message || "Failed to submit review");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3"
    >
      <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
        Leave a review
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className="p-0.5"
            aria-label={`${n} stars`}
          >
            <Star
              className={`w-5 h-5 ${
                n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
              }`}
            />
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-2">{rating}/5</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={2}
        className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
      />
      <button
        type="submit"
        disabled={submitting}
        className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, p] = await Promise.all([fetchMyOrders(), fetchMyPayments()]);
    setOrders(o);
    setPayments(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handlePay(order: RentalOrder) {
    if (order.status !== "CONFIRMED") return;
    setPayingId(order.id);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rentalOrderId: order.id, method: "STRIPE" }),
      });
      const json = await res.json();
      if (!res.ok || !json?.data?.sessionUrl) {
        error(json?.message || "Failed to create payment session");
        setPayingId(null);
        return;
      }
      window.location.href = json.data.sessionUrl;
    } catch {
      error("Network error while creating payment");
      setPayingId(null);
    }
  }

  const activeCount = orders.filter(
    (o) => !["RETURNED", "CANCELLED"].includes(o.status)
  ).length;
  const payableCount = orders.filter((o) => o.status === "CONFIRMED").length;
  const returnedCount = orders.filter((o) => o.status === "RETURNED").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track your rental orders and payments
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Rentals", value: activeCount, icon: Calendar, color: "text-emerald-400" },
          { label: "Awaiting Payment", value: payableCount, icon: Wallet, color: "text-blue-400" },
          { label: "Completed Returns", value: returnedCount, icon: BadgeCheck, color: "text-slate-300" },
          { label: "Total Payments", value: payments.length, icon: CreditCard, color: "text-purple-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4"
          >
            <div className={`flex items-center gap-2 text-xs font-semibold ${s.color} mb-2`}>
              <s.icon className="w-4 h-4" />
              {s.label}
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : (
        <>
          {/* Order history */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Rental Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center">
                <PackageX className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">
                  No orders yet.{" "}
                  <Link href="/gear" className="text-emerald-400 font-semibold">
                    Browse gear to get started
                  </Link>
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900/80 text-left text-[11px] uppercase tracking-wide text-slate-400">
                      <th className="px-4 py-3 font-semibold">Gear</th>
                      <th className="px-4 py-3 font-semibold">Dates</th>
                      <th className="px-4 py-3 font-semibold">Qty</th>
                      <th className="px-4 py-3 font-semibold">Total</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.map((order) => (
                      <tr key={order.id} className="bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">
                            {order.gearItem?.name || "Gear item"}
                          </div>
                          <div className="text-[11px] text-slate-500">{order.id}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          <div>{formatDate(order.startDate)}</div>
                          <div className="text-[11px] text-slate-500">→ {formatDate(order.endDate)}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{order.quantity}</td>
                        <td className="px-4 py-3 text-slate-200 font-semibold">
                          ${Number(order.totalAmount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {order.status === "CONFIRMED" && (
                            <button
                              onClick={() => handlePay(order)}
                              disabled={payingId === order.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-[11px] font-bold hover:bg-emerald-400 disabled:opacity-60"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              {payingId === order.id ? "Redirecting…" : "Pay Now"}
                            </button>
                          )}
                          {order.status === "RETURNED" && (
                            <button
                              onClick={() =>
                                setReviewOrderId((id) => (id === order.id ? null : order.id))
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-emerald-300 text-[11px] font-bold hover:bg-slate-700"
                            >
                              <Star className="w-3.5 h-3.5" />
                              Leave Review
                            </button>
                          )}
                          {!["CONFIRMED", "RETURNED"].includes(order.status) && (
                            <button
                              onClick={() => router.push(`/dashboard/customer/orders/${order.id}/pay`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-[11px] font-bold hover:bg-slate-700"
                            >
                              View Details
                            </button>
                          )}
                          {reviewOrderId === order.id && (
                            <ReviewForm
                              order={order}
                              onDone={() => {
                                setReviewOrderId(null);
                                load();
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Payment history */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">Payment History</h2>
            {payments.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center">
                <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No payments yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900/80 text-left text-[11px] uppercase tracking-wide text-slate-400">
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Order</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">Method</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {payments.map((p) => (
                      <tr key={p.id} className="bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
                        <td className="px-4 py-3 text-slate-300">{formatDate(p.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-200 font-medium">
                            {p.rentalOrder?.gearItem?.name || "Order"}
                          </div>
                          <div className="text-[11px] text-slate-500">{p.rentalOrderId}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-200 font-semibold">
                          ${Number(p.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{p.method}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs font-mono truncate max-w-[160px]">
                          {p.transactionId || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
