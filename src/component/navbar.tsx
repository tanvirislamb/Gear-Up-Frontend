"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Mountain, Search, Menu, X } from "lucide-react";

import { useAuth } from "@/context/AuthProvider";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const auth = (() => { try { return useAuth(); } catch (e) { return null; } })();
  const user = auth?.user || null;
  const logout = auth?.logout;

  const dashboardHref = user
    ? user.role === "PROVIDER"
      ? "/dashboard/provider"
      : user.role === "ADMIN"
        ? "/dashboard/admin"
        : "/dashboard/customer"
    : "/login";

  const loginRedirect = pathname === "/login" || pathname === "/register" ? "/" : pathname;

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Browse Gear", href: "/gear" },
    ...(user ? [{ title: "Dashboard", href: dashboardHref }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-slate-200 text-slate-900 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 p-2 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Mountain className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                GearUp
              </span>
              <span className="text-[10px] text-emerald-600/90 font-semibold tracking-wider uppercase -mt-1">
                Outdoor Rentals
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.title === "Dashboard"
                    ? "ml-1 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    : "px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                }
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/gear"
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-white transition-colors"
              title="Search gear"
            >
              <Search className="w-5 h-5" />
            </Link>

            <div className="h-4 w-px bg-slate-100" />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-800 mr-2">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <button onClick={async ()=>{ if(logout) await logout(); }} className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors">Logout</button>
              </div>
            ) : (
              <>
                <Link
                  href={`/login?redirect=${encodeURIComponent(loginRedirect)}`}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href={`/login?redirect=${encodeURIComponent(loginRedirect)}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 active:scale-[0.98]"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-slate-50 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-white hover:text-emerald-600"
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            {user ? (
              <div className="p-3 rounded-lg bg-white">
                <div className="font-semibold text-sm">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
                <button onClick={async ()=>{ if(logout) await logout(); setMobileMenuOpen(false); }} className="mt-3 w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-800 hover:bg-white">Logout</button>
              </div>
            ) : (
              <>
                <Link
                  href={`/login?redirect=${encodeURIComponent(loginRedirect)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-800 hover:bg-white"
                >
                  Sign In
                </Link>
                <Link
                  href={`/login?redirect=${encodeURIComponent(loginRedirect)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;