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
          <h1 className="text-2xl font-extrabold text-black tracking-tight">
            Provider Dashboard
          </h1>
          <p className="text-xs text-black/60 mt-1">Manage your inventory and orders</p>
        </div>
        <Link
          href="/dashboard/provider/gear/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#dad8f9] hover:bg-[#dad8f9]/70 text-black text-xs font-bold"
        >
          <PlusCircle className="w-4 h-4" /> Add Gear
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Listed Gear", value: gear.length, icon: Package, color: "text-black/60" },
          { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-blue-600" },
          { label: "Pending Approval", value: pendingOrders, icon: AlertCircle, color: "text-amber-600" },
          { label: "Active Rentals", value: activeRentals, icon: Package, color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-black/3 shadow-sm rounded-2xl p-4">
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
      ) : gear.length === 0 ? (
        <div className="bg-white border border-black/3 shadow-sm rounded-2xl p-10 text-center">
          <Package className="w-10 h-10 text-black/60 mx-auto mb-3" />
          <p className="text-sm text-black/60">
            You haven&apos;t listed any gear yet.{" "}
            <Link href="/dashboard/provider/gear/new" className="text-black/60 font-semibold">
              Add your first item
            </Link>
          </p>
        </div>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-black">Inventory</h2>
          <div className="overflow-x-auto rounded-2xl border border-black/3 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/5 text-left text-[11px] uppercase tracking-wide text-black/60">
                  <th className="px-4 py-3 font-semibold">Gear</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price/day</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Available</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
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
                    <td className="px-4 py-3 text-black/60">{g.catagory?.name || g.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-black font-semibold">
                      ${Number(g.rentalPrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-black/60">{g.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${g.availableQty > 0
                          ? "bg-[#dad8f9] text-black"
                          : "bg-rose-50 text-rose-600"
                          }`}
                      >
                        {g.availableQty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/provider/gear/${g.id}/edit`}
                          className="p-2 rounded-lg bg-black/5 text-black/60 hover:bg-black/5 hover:text-black"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(g.id)}
                          disabled={deletingId === g.id}
                          className="p-2 rounded-lg bg-black/5 text-rose-600 hover:bg-rose-50"
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
