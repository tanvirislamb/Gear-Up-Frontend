"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Payment } from "@/types/gear"
import { fetchPaymentById, createPayment } from "@/services/api"
import { StatusBadge } from "@/component/StatusBadge"
import { useToast } from "@/context/ToastProvider"
import { ArrowLeft, CreditCard, Loader2, Calendar, Hash, Banknote } from "lucide-react"

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const { error } = useToast()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetchPaymentById(id).then((p) => {
      setPayment(p)
      setLoading(false)
    })
  }, [id])

  async function handlePay() {
    if (!payment) return
    setPaying(true)
    try {
      const res = await createPayment(payment.rentalOrderId)
      if (!res?.success || !res.data?.sessionUrl) {
        error(res?.message || "Failed to create payment session")
        setPaying(false)
        return
      }
      window.location.href = res.data.sessionUrl
    } catch {
      error("Network error while creating payment")
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-black/60">Payment not found.</p>
        <Link href="/dashboard/customer/payments" className="text-black/60 font-semibold text-sm">
          Back to payments
        </Link>
      </div>
    )
  }

  const gear = payment.rentalOrder?.gearItem

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard/customer/payments"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-black/60 hover:text-black"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Payments
      </Link>

      <div className="bg-white shadow-sm border border-black/3 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-black">Payment Details</h1>
          <StatusBadge status={payment.status} />
        </div>

        <div className="space-y-3 border-t border-black/5 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-black/60 flex items-center gap-1.5">
              <Banknote className="w-4 h-4" /> Amount
            </span>
            <span className="text-2xl font-black text-black">
              ${Number(payment.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-black/60">Gear</span>
            <span className="text-black font-semibold">{gear?.name || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-black/60">Provider</span>
            <span className="text-black font-semibold">{gear?.provider?.name || "—"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-black/60">Method</span>
            <span className="text-black font-semibold">{payment.method}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-black/60 flex items-center gap-1.5">
              <Hash className="w-4 h-4" /> Transaction ID
            </span>
            <span className="text-black font-semibold text-xs font-mono">
              {payment.transactionId || "—"}
            </span>
          </div>
          {payment.rentalOrder && (
            <>
              <div className="flex justify-between text-sm border-t border-black/5 pt-3">
                <span className="text-black/60 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Rental period
                </span>
                <span className="text-black font-semibold">
                  {formatDate(payment.rentalOrder.startDate)} →{" "}
                  {formatDate(payment.rentalOrder.endDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-black/60">Quantity</span>
                <span className="text-black font-semibold">{payment.rentalOrder.quantity}</span>
              </div>
            </>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-black/60">Payment date</span>
            <span className="text-black font-semibold">{formatDateTime(payment.paidAt || payment.createdAt)}</span>
          </div>
        </div>

        {payment.status !== "COMPLETED" && payment.rentalOrder?.status === "CONFIRMED" && (
          <button
            onClick={handlePay}
            disabled={paying}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/70 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <CreditCard className="w-4 h-4" />
            {paying ? "Creating secure checkout…" : "Pay with Stripe"}
          </button>
        )}

        {payment.status === "COMPLETED" && (
          <div className="text-center text-sm text-white bg-primary rounded-2xl py-3 flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment completed
          </div>
        )}

        {payment.status === "PENDING" && payment.rentalOrder?.status !== "CONFIRMED" && (
          <div className="text-center text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-2xl py-3">
            Awaiting order confirmation before payment can be processed.
          </div>
        )}

        {payment.status === "FAILED" && (
          <div className="text-center text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl py-3">
            This payment has failed. Please try again.
          </div>
        )}
      </div>
    </div>
  )
}
