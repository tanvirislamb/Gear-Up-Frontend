"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Mountain, Search, Menu, X } from "lucide-react"
import { useAuth } from "@/context/AuthProvider"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const auth = (() => {
    try {
      return useAuth()
    }
    catch (e) {
      return null
    }
  })()
  const user = auth?.user || null
  const logout = auth?.logout

  const dashboardHref = user
    ? user.role === "PROVIDER"
      ? "/dashboard/provider"
      : user.role === "ADMIN"
        ? "/dashboard/admin"
        : "/dashboard/customer"
    : "/login"

  const loginRedirect = pathname === "/login" || pathname === "/register" ? "/" : pathname

  const navLinks = [
    { title: "Home", href: "/" },
    { title: "Browse Gear", href: "/gear" },
    ...(user ? [{ title: "Dashboard", href: dashboardHref }] : []),
  ]

  return (
    <header className="fixed w-full top-0 z-50 bg-white border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#dad8f9] p-2 text-white flex items-center justify-center font-bold">
              <Mountain className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl">
                GearUp
              </span>
              <span className="text-[10px] text-black/60 font-semibold tracking-wider uppercase -mt-1">
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
                className={"px-4 py-2 rounded-xl text-sm font-medium text-black/60 hover:text-black hover:bg-[#dad8f9] transition-colors"}>
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/gear"
              className="p-2 rounded-lg text-black/60 cursor-pointer"
              title="Search gear"
            >
              <Search className="w-5 h-5" />
            </Link>

            <div className="h-4 w-px bg-black/50" />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-black mr-2">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-black/60">{user.email}</div>
                </div>
                <button onClick={async () => {
                  if (logout) await logout()
                  router.push("/")
                }} className="px-3 py-2 rounded-lg text-sm font-medium text-black/60 hover:text-black hover:bg-black/10 transition-colors cursor-pointer">Logout</button>
              </div>
            ) : (
              <>
                <Link
                  href={`/login?redirect=${encodeURIComponent(loginRedirect)}`}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-black/60 hover:bg-black/5 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href={`/login?redirect=${encodeURIComponent(loginRedirect)}`}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#dad8f9] text-black"
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
              className="p-2 rounded-lg text-black/50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/2 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-black/60"
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-2">
            {user ? (
              <div className="p-3 rounded-lg bg-white">
                <div className="font-semibold text-sm">{user.name}</div>
                <div className="text-xs text-black/60">{user.email}</div>
                <button onClick={async () => {
                  if (logout) await logout()
                  router.push("/")
                  setMobileMenuOpen(false)
                }}
                  className="mt-3 w-full text-center px-4 py-2.5 rounded-xl border border-black/10 text-sm font-semibold text-black/60 hover:bg-white">Logout</button>
              </div>
            ) : (
              <>
                <Link
                  href={`/login?redirect=${encodeURIComponent(loginRedirect)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-2xl text-sm font-semibold border border-black/10 text-black"
                >
                  Sign In
                </Link>
                <Link
                  href={`/login?redirect=${encodeURIComponent(loginRedirect)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-2xl text-sm font-semibold bg-[#dad8f9] text-black"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
export default Navbar