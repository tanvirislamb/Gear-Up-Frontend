"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { GearItem, RentalOrder } from "@/types/gear";
import { fetchGearList, fetchProviderOrders, deleteGear } from "@/services/api";
import { StatusBadge } from "@/component/StatusBadge";
import {
  Package,
  ShoppingCart,
  AlertCircle,
  Loader2,
  Pencil,
  Trash2,
  PlusCircle,
  ImageOff,
} from "lucide-react";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const router = useRouter();
  const [gear, setGear] = useState<GearItem[]>([]);
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [gearRes, ordersRes] = await Promise.all([
      fetchGearList({ limit: "1000" }),
      fetchProviderOrders(),
    ]);
    const mine = user
      ? gearRes.data.filter((g) => g.providerId === user.id)
      : [];
    setGear(mine);
    setOrders(ordersRes);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this gear listing? This cannot be undone.")) return;
    setDeletingId(id);
    const res = await deleteGear(id);
    setDeletingId(null);
    if (res?.success) {
      success("Gear deleted");
      setGear((prev) => prev.filter((g) => g.id !== id));
    } else {
      error(res?.message || "Failed to delete gear");
    }
  }

  const pendingOrders = orders.filter((o) => o.status === "PLACED").length;
  const activeRentals = orders.filter((o) =>
    ["CONFIRMED", "PAID", "PICKED_UP"].includes(o.status)
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Provider Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your inventory and orders</p>
        </div>
        <Link
          href="/dashboard/provider/gear/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-bold hover:from-emerald-400 hover:to-teal-300"
        >
          <PlusCircle className="w-4 h-4" /> Add Gear
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Listed Gear", value: gear.length, icon: Package, color: "text-emerald-400" },
          { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-blue-400" },
          { label: "Pending Approval", value: pendingOrders, icon: AlertCircle, color: "text-amber-400" },
          { label: "Active Rentals", value: activeRentals, icon: Package, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
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
      ) : gear.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center">
          <Package className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            You haven&apos;t listed any gear yet.{" "}
            <Link href="/dashboard/provider/gear/new" className="text-emerald-400 font-semibold">
              Add your first item
            </Link>
          </p>
        </div>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Inventory</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900/80 text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-semibold">Gear</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price/day</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Available</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {gear.map((g) => (
                  <tr key={g.id} className="bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {g.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={g.image}
                            alt={g.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-600 flex items-center justify-center">
                            <ImageOff className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">{g.name}</div>
                          <div className="text-[11px] text-slate-500">{g.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{g.catagory?.name || g.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-slate-200 font-semibold">
                      ${Number(g.rentalPrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">{g.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          g.availableQty > 0
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-rose-500/15 text-rose-300"
                        }`}
                      >
                        {g.availableQty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/provider/gear/${g.id}/edit`}
                          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(g.id)}
                          disabled={deletingId === g.id}
                          className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/15"
                          title="Delete"
                        >
                          {deletingId === g.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
