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
      className="mt-3 p-4 rounded-xl bg-white border border-slate-200 space-y-3"
    >
      <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
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
                n <= rating ? "fill-amber-400 text-amber-600" : "text-slate-600"
              }`}
            />
          </button>
        ))}
        <span className="text-xs text-slate-500 ml-2">{rating}/5</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={2}
        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your rental orders and payments
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Rentals", value: activeCount, icon: Calendar, color: "text-emerald-600" },
          { label: "Awaiting Payment", value: payableCount, icon: Wallet, color: "text-blue-600" },
          { label: "Completed Returns", value: returnedCount, icon: BadgeCheck, color: "text-slate-700" },
          { label: "Total Payments", value: payments.length, icon: CreditCard, color: "text-purple-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-slate-200 rounded-2xl p-4"
          >
            <div className={`flex items-center gap-2 text-xs font-semibold ${s.color} mb-2`}>
              <s.icon className="w-4 h-4" />
              {s.label}
            </div>
            <div className="text-2xl font-black text-slate-900">{s.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <>
          {/* Order history */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Rental Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                <PackageX className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  No orders yet.{" "}
                  <Link href="/gear" className="text-emerald-600 font-semibold">
                    Browse gear to get started
                  </Link>
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3 font-semibold">Gear</th>
                      <th className="px-4 py-3 font-semibold">Dates</th>
                      <th className="px-4 py-3 font-semibold">Qty</th>
                      <th className="px-4 py-3 font-semibold">Total</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">
                            {order.gearItem?.name || "Gear item"}
                          </div>
                          <div className="text-[11px] text-slate-500">{order.id}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div>{formatDate(order.startDate)}</div>
                          <div className="text-[11px] text-slate-500">→ {formatDate(order.endDate)}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{order.quantity}</td>
                        <td className="px-4 py-3 text-slate-800 font-semibold">
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
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-emerald-600 text-[11px] font-bold hover:bg-slate-200"
                            >
                              <Star className="w-3.5 h-3.5" />
                              Leave Review
                            </button>
                          )}
                          {!["CONFIRMED", "RETURNED"].includes(order.status) && (
                            <button
                              onClick={() => router.push(`/dashboard/customer/orders/${order.id}/pay`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-bold hover:bg-slate-200"
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
            <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
            {payments.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No payments yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Order</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">Method</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {payments.map((p) => (
                      <tr key={p.id} className="bg-white hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-700">{formatDate(p.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-800 font-medium">
                            {p.rentalOrder?.gearItem?.name || "Order"}
                          </div>
                          <div className="text-[11px] text-slate-500">{p.rentalOrderId}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-semibold">
                          ${Number(p.amount).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{p.method}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-mono truncate max-w-[160px]">
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
