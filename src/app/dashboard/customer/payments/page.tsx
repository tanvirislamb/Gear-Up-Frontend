"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CreditCard, Loader2, Wallet, Eye } from "lucide-react"
import { Payment } from "@/types/gear"
import { fetchMyPayments, createPayment } from "@/services/api"
import { StatusBadge } from "@/component/StatusBadge"
import { useToast } from "@/context/ToastProvider"

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function CustomerPaymentsPage() {
  const { error } = useToast();
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchMyPayments().then((p) => {
      if (cancelled) return
      setPayments(p)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  async function handlePay(payment: Payment) {
    setPayingId(payment.id)
    try {
      const res = await createPayment(payment.rentalOrderId)
      if (!res?.success || !res.data?.sessionUrl) {
        error(res?.message || "Failed to create payment session")
        setPayingId(null)
        return
      }
      window.location.href = res.data.sessionUrl
    } catch {
      error("Network error while creating payment")
      setPayingId(null)
    }
  }

  const totalPaid = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const pendingCount = payments.filter((p) => p.status === "PENDING").length

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Payments</h1>
          <p className="text-xs text-black/60 mt-1">Your payment history</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Paid", value: `$${totalPaid.toFixed(2)}`, icon: Wallet, color: "text-emerald-600" },
          { label: "Completed", value: payments.filter((p) => p.status === "COMPLETED").length, icon: CreditCard, color: "text-black/60" },
          { label: "Pending", value: pendingCount, icon: Loader2, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white shadow-sm border border-black/3 rounded-2xl p-4">
            <div className={`flex items-center gap-2 text-xs font-semibold ${s.color} mb-2`}>
              <s.icon className="w-4 h-4" />
              {s.label}
            </div>
            <div className="text-2xl font-black text-black">{s.value}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-black/60" />
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white shadow-sm border border-black/3 rounded-2xl p-10 text-center">
          <CreditCard className="w-10 h-10 text-black/60 mx-auto mb-3" />
          <p className="text-sm text-black/60">No payments yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-sm border border-black/3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left text-[11px] uppercase tracking-wide text-black/60">
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Transaction ID</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {payments.map((p) => (
                <tr key={p.id} className="bg-white hover:bg-black/3 transition-colors">
                  <td className="px-4 py-3 text-black/60">{formatDate(p.paidAt || p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/customer/payments/${p.id}`}
                      className="text-black font-medium hover:underline"
                    >
                      {p.rentalOrder?.gearItem?.name || "Order"}
                    </Link>
                    <div className="text-[11px] text-black/60">{p.rentalOrderId}</div>
                  </td>
                  <td className="px-4 py-3 text-black font-semibold">
                    ${Number(p.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-black/60">{p.method}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-black/60 text-xs font-mono truncate max-w-[160px]">
                    {p.transactionId || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/customer/payments/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 text-black text-[11px] font-bold hover:bg-black/10"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </Link>
                      {p.status !== "COMPLETED" && p.rentalOrder?.status === "CONFIRMED" && (
                        <button
                          onClick={() => handlePay(p)}
                          disabled={payingId === p.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary/70 disabled:opacity-60"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          {payingId === p.id ? "Redirecting…" : "Pay Now"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
