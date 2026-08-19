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
        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-black">Content Moderation — Rentals</h1>
          <p className="text-xs text-black/60">All rental orders across the platform</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-black/60" />
        </div>
      ) : rentals.length === 0 ? (
        <div className="bg-white border border-black/3 shadow-sm rounded-2xl p-10 text-center text-sm text-black/60">
          No rental orders found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/3 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-black/5 text-left text-[11px] uppercase tracking-wide text-black/60">
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Gear</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {rentals.map((r) => (
                <tr key={r.id} className="bg-white hover:bg-black/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono text-xs text-black/60">{r.id}</div>
                    <div className="text-[11px] text-black/60">Qty {r.quantity}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-black font-medium">{r.customer?.name || "—"}</div>
                    <div className="text-[11px] text-black/60">{r.customer?.email || ""}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-black">{r.gearItem?.name || "—"}</div>
                    <div className="text-[11px] text-black/60">{r.gearItem?.brand || ""}</div>
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    <div>{formatDate(r.startDate)}</div>
                    <div className="text-[11px] text-black/60">→ {formatDate(r.endDate)}</div>
                  </td>
                  <td className="px-4 py-3 text-black font-semibold">
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
