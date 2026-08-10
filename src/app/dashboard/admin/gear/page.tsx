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
        <div className="w-10 h-10 rounded-xl bg-[#dad8f9] text-black flex items-center justify-center">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-black">Content Moderation — Gear</h1>
          <p className="text-xs text-black/60">All gear listings across providers</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-black/60" />
        </div>
      ) : gear.length === 0 ? (
        <div className="bg-white border border-black/5 rounded-2xl p-10 text-center text-sm text-black/60">
          No gear listings found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white text-left text-[11px] uppercase tracking-wide text-black/60">
                <th className="px-4 py-3 font-semibold">Gear</th>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price/day</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {gear.map((g) => (
                <tr key={g.id} className="bg-white hover:bg-black/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {g.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={g.image}
                          alt={g.name}
                          className="w-10 h-10 rounded-lg object-cover border border-black/5"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-black/5 text-black/60 flex items-center justify-center">
                          <ImageOff className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-black">{g.name}</div>
                        <div className="text-[11px] text-black/60">{g.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-black">{g.provider?.name || "—"}</div>
                    <div className="text-[11px] text-black/60">{g.provider?.email || ""}</div>
                  </td>
                  <td className="px-4 py-3 text-black/60">
                    {g.catagory?.name || g.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-black font-semibold">
                    ${Number(g.rentalPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-black/60">{g.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        g.availableQty > 0
                          ? "bg-[#dad8f9] text-black"
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
