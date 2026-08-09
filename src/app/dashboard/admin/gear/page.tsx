"use client";

import React, { useCallback, useEffect, useState } from "react";
import { GearItem } from "@/types/gear";
import { fetchAdminGear } from "@/services/api";
import { Loader2, Package, ImageOff } from "lucide-react";

export default function AdminGearPage() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setGear(await fetchAdminGear());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Content Moderation — Gear</h1>
          <p className="text-xs text-slate-500">All gear listings across providers</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      ) : gear.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-500">
          No gear listings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Gear</th>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price/day</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {gear.map((g) => (
                <tr key={g.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {g.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={g.image}
                          alt={g.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                          <ImageOff className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">{g.name}</div>
                        <div className="text-[11px] text-slate-500">{g.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-800">{g.provider?.name || "—"}</div>
                    <div className="text-[11px] text-slate-500">{g.provider?.email || ""}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {g.catagory?.name || g.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-800 font-semibold">
                    ${Number(g.rentalPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{g.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        g.availableQty > 0
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {g.availableQty}
                    </span>
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
