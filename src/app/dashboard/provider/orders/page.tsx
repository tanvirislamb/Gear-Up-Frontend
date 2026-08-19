"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useToast } from "@/context/ToastProvider"
import { RentalOrder } from "@/types/gear"
import { fetchProviderOrders, updateOrderStatus } from "@/services/api"
import { StatusBadge } from "@/component/StatusBadge"
import { Loader2, ShoppingCart, Check, Truck, PackageCheck, XCircle } from "lucide-react"

interface Action {
  status: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  style: string
}

function actionsFor(status: string): Action[] {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors"
  switch (status) {
    case "PLACED":
      return [
        {
          status: "CONFIRMED",
          label: "Confirm",
          icon: Check,
          style: `${base} bg-blue-50 text-blue-600 hover:bg-blue-500/25`,
        },
        {
          status: "CANCELLED",
          label: "Cancel",
          icon: XCircle,
          style: `${base} bg-rose-50 text-rose-600 hover:bg-rose-500/25`,
        },
      ]
    case "PAID":
      return [
        {
          status: "PICKED_UP",
          label: "Mark Picked Up",
          icon: Truck,
          style: `${base} bg-primary text-white hover:bg-primary/70`,
        },
      ]
    case "PICKED_UP":
      return [
        {
          status: "RETURNED",
          label: "Mark Returned",
          icon: PackageCheck,
          style: `${base} bg-black/5 text-black/60 hover:bg-black/5`,
        },
      ]
    default:
      return []
  }
}

function formatDate(iso?: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ProviderOrdersPage() {
  const { success, error } = useToast()
  const [orders, setOrders] = useState<RentalOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const o = await fetchProviderOrders()
    setOrders(o)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleStatus(order: RentalOrder, status: string) {
    setBusyId(order.id)
    const res = await updateOrderStatus(order.id, status)
    setBusyId(null)
    if (res?.success) {
      success(`Order marked as ${status.replace(/_/g, " ")}`)
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: status as RentalOrder["status"] } : o))
      )
    } else {
      error(res?.message || "Failed to update order")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-black">Incoming Orders</h1>
          <p className="text-xs text-black/60">Confirm, pick up, and return rentals</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-black/60" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-black/3 shadow-sm rounded-2xl p-10 text-center">
          <ShoppingCart className="w-10 h-10 text-black/60 mx-auto mb-3" />
          <p className="text-sm text-black/60">No orders for your gear yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/3 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left text-[11px] uppercase tracking-wide text-black/60">
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Gear</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {orders.map((order) => {
                const actions = actionsFor(order.status);
                return (
                  <tr key={order.id} className="bg-white hover:bg-black/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-black">{order.customer?.name || "Customer"}</div>
                      <div className="text-[11px] text-black/60">{order.customer?.email || ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-black font-medium">{order.gearItem?.name || "Gear"}</div>
                      <div className="text-[11px] text-black/60">
                        {order.gearItem?.brand || ""} · Qty {order.quantity}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-black/60">
                      <div>{formatDate(order.startDate)}</div>
                      <div className="text-[11px] text-black/60">→ {formatDate(order.endDate)}</div>
                    </td>
                    <td className="px-4 py-3 text-black font-semibold">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {busyId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-black/60" />
                        ) : (
                          actions.map((a) => (
                            <button
                              key={a.status}
                              onClick={() => handleStatus(order, a.status)}
                              className={a.style}
                            >
                              <a.icon className="w-3.5 h-3.5" />
                              {a.label}
                            </button>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
