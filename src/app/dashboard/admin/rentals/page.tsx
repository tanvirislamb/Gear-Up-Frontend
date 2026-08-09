"use client";

import React, { useCallback, useEffect, useState } from "react";
import { RentalOrder } from "@/types/gear";
import { fetchAdminRentals } from "@/services/api";
import { StatusBadge } from "@/component/StatusBadge";
import { Loader2, ShoppingCart } from "lucide-react";

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setRentals(await fetchAdminRentals());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">Content Moderation — Rentals</h1>
          <p className="text-xs text-slate-400">All rental orders across the platform</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
        </div>
      ) : rentals.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center text-sm text-slate-400">
          No rental orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900/80 text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Gear</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rentals.map((r) => (
                <tr key={r.id} className="bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-slate-300">{r.id}</div>
                    <div className="text-[11px] text-slate-500">Qty {r.quantity}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{r.customer?.name || "—"}</div>
                    <div className="text-[11px] text-slate-500">{r.customer?.email || ""}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-200">{r.gearItem?.name || "—"}</div>
                    <div className="text-[11px] text-slate-500">{r.gearItem?.brand || ""}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <div>{formatDate(r.startDate)}</div>
                    <div className="text-[11px] text-slate-500">→ {formatDate(r.endDate)}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-200 font-semibold">
                    ${Number(r.totalAmount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
