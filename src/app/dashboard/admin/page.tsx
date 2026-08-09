"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/context/ToastProvider";
import { User, GearItem, RentalOrder, UserStatus } from "@/types/gear";
import {
  fetchAdminUsers,
  fetchAdminGear,
  fetchAdminRentals,
  updateUserStatus,
} from "@/services/api";
import {
  Loader2,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldOff,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const PAGE_SIZE = 8;

export default function AdminDashboard() {
  const { success, error } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [gear, setGear] = useState<GearItem[]>([]);
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [u, g, r] = await Promise.all([
      fetchAdminUsers(),
      fetchAdminGear(),
      fetchAdminRentals(),
    ]);
    setUsers(u);
    setGear(g);
    setRentals(r);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function toggleStatus(user: User) {
    const next: UserStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setBusyId(user.id);
    const res = await updateUserStatus(user.id, next);
    setBusyId(null);
    if (res?.success) {
      success(`${user.name} is now ${next.toLowerCase()}`);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)));
    } else {
      error(res?.message || "Failed to update user");
    }
  }

  const revenue = rentals
    .filter((r) => !["CANCELLED", "PLACED"].includes(r.status))
    .reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-emerald-600" },
    { label: "Gear Listed", value: gear.length, icon: Package, color: "text-blue-600" },
    { label: "Rental Orders", value: rentals.length, icon: ShoppingCart, color: "text-purple-600" },
    { label: "Revenue (booked)", value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Platform overview & user moderation</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <div className={`flex items-center gap-2 text-xs font-semibold ${s.color} mb-2`}>
              <s.icon className="w-4 h-4" />
              {s.label}
            </div>
            <div className="text-2xl font-black text-slate-900 truncate">{s.value}</div>
          </div>
        ))}
      </div>

      {/* User management */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" /> User Management
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users…"
              className="w-full sm:w-64 bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pageItems.map((u) => (
                    <tr key={u.id} className="bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-emerald-600 font-bold text-xs flex items-center justify-center">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-slate-100 text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            u.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {u.status === "ACTIVE" ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <ShieldOff className="w-3 h-3" />
                          )}
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={busyId === u.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                            u.status === "ACTIVE"
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          } disabled:opacity-60`}
                        >
                          {busyId === u.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : u.status === "ACTIVE" ? (
                            <ShieldOff className="w-3.5 h-3.5" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          )}
                          {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
