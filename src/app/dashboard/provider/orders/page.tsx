"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/context/ToastProvider";
import { RentalOrder } from "@/types/gear";
import { fetchProviderOrders, updateOrderStatus } from "@/services/api";
import { StatusBadge } from "@/component/StatusBadge";
import { Loader2, ShoppingCart, Check, Truck, PackageCheck, XCircle } from "lucide-react";

interface Action {
  status: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  style: string;
}

function actionsFor(status: string): Action[] {
  const base =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors";
  switch (status) {
    case "PLACED":
      return [
        {
          status: "CONFIRMED",
          label: "Confirm",
          icon: Check,
          style: `${base} bg-blue-500/15 text-blue-300 hover:bg-blue-500/25`,
        },
        {
          status: "CANCELLED",
          label: "Cancel",
          icon: XCircle,
          style: `${base} bg-rose-500/15 text-rose-300 hover:bg-rose-500/25`,
        },
      ];
    case "PAID":
      return [
        {
          status: "PICKED_UP",
          label: "Mark Picked Up",
          icon: Truck,
          style: `${base} bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25`,
        },
      ];
    case "PICKED_UP":
      return [
        {
          status: "RETURNED",
          label: "Mark Returned",
          icon: PackageCheck,
          style: `${base} bg-slate-500/15 text-slate-300 hover:bg-slate-500/25`,
        },
      ];
    default:
      return [];
  }
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProviderOrdersPage() {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const o = await fetchProviderOrders();
    setOrders(o);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatus(order: RentalOrder, status: string) {
    setBusyId(order.id);
    const res = await updateOrderStatus(order.id, status);
    setBusyId(null);
    if (res?.success) {
      success(`Order marked as ${status.replace(/_/g, " ")}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: status as RentalOrder["status"] } : o))
      );
    } else {
      error(res?.message || "Failed to update order");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">Incoming Orders</h1>
          <p className="text-xs text-slate-400">Confirm, pick up, and return rentals</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center">
          <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No orders for your gear yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/80 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Gear</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((order) => {
                const actions = actionsFor(order.status);
                return (
                  <tr key={order.id} className="bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{order.customer?.name || "Customer"}</div>
                      <div className="text-[11px] text-slate-500">{order.customer?.email || ""}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-200 font-medium">{order.gearItem?.name || "Gear"}</div>
                      <div className="text-[11px] text-slate-500">
                        {order.gearItem?.brand || ""} · Qty {order.quantity}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>{formatDate(order.startDate)}</div>
                      <div className="text-[11px] text-slate-500">→ {formatDate(order.endDate)}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-200 font-semibold">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {busyId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
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
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
