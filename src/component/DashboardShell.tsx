"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthProvider"
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Users,
  ShieldCheck,
  Mountain,
  LogOut,
  Loader2,
  AlertTriangle,
  CreditCard,
} from "lucide-react"
import { Role } from "@/types/gear"

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>
}

const NAV: Record<Role, NavItem[]> = {
  CUSTOMER: [
    { href: "/dashboard/customer", label: "Overview & Orders", icon: LayoutDashboard },
    { href: "/dashboard/customer/payments", label: "Payments", icon: CreditCard },
  ],
  PROVIDER: [
    { href: "/dashboard/provider", label: "Overview & Inventory", icon: LayoutDashboard },
    { href: "/dashboard/provider/gear/new", label: "Add Gear", icon: PlusCircle },
    { href: "/dashboard/provider/orders", label: "Orders", icon: ShoppingCart },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview & Users", icon: LayoutDashboard },
    { href: "/dashboard/admin/gear", label: "All Gear", icon: Package },
    { href: "/dashboard/admin/rentals", label: "All Rentals", icon: ShoppingCart },
  ],
};

function sectionOf(role: Role, pathname: string): string {
  return pathname.startsWith(`/dashboard/${role.toLowerCase()}`)
    ? role.toLowerCase()
    : ""
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="text-black font-semibold text-sm hover:text-black/60"
        >
          Please sign in to view your dashboard.
        </Link>
      </div>
    )
  }

  const role: Role = (user.role as Role) || "CUSTOMER"
  const section = sectionOf(role, pathname)
  const denied =
    pathname !== `/dashboard/${role.toLowerCase()}` &&
    !pathname.startsWith(`/dashboard/${role.toLowerCase()}/`) &&
    pathname.startsWith("/dashboard")

  const items = NAV[role]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {denied && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 text-sm text-rose-600 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" />
          <span>You don&apos;t have access to this section. Redirecting…</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-white shadow-sm border border-black/3 rounded-2xl p-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 px-2 pb-4 mb-4 border-b border-black/5">
              <div className="w-9 h-9 rounded-lg bg-[#dad8f9] text-black flex items-center justify-center font-bold">
                <Mountain className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-black truncate">{user.name}</div>
                <div className="text-[11px] text-black/60 font-semibold uppercase">
                  {role}
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon
                const active =
                  pathname === item.href ||
                  (item.href !== `/dashboard/${role.toLowerCase()}` &&
                    pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active
                      ? "bg-[#dad8f9]"
                      : "text-black/60 hover:text-black hover:bg-black/5"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-black/5 space-y-1">
              <Link
                href="/"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-black/5"
              >
                <Package className="w-4 h-4" /> Browse Gear
              </Link>
              <button
                onClick={async () => {
                  await logout()
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-black/60 hover:text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
