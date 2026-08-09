import Link from "next/link";
import { Mountain, ShieldCheck, Truck, Clock, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-500 border-t border-slate-200 mt-auto">
      {/* Platform Features Highlight */}
      <div className="border-b border-slate-200/80 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Insured Gear</h4>
              <p className="text-xs text-slate-500">All equipment damage covered</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Flexible Pickup</h4>
              <p className="text-xs text-slate-500">Local pickup or direct delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Instant Booking</h4>
              <p className="text-xs text-slate-500">Select dates & rent instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Verified Providers</h4>
              <p className="text-xs text-slate-500">Vetted rental shops & experts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 p-2 text-slate-950 flex items-center justify-center font-bold">
                <Mountain className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">GearUp</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              GearUp connects outdoor enthusiasts with premium sports and adventure gear rentals. Discover bikes, tents, kayaks, skis, and climbing equipment anytime.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
              <span>© 2026 GearUp Inc. All rights reserved.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Navigation</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link></li>
              <li><Link href="/gear" className="hover:text-emerald-600 transition-colors">Browse Gear</Link></li>
              <li><Link href="/gear" className="hover:text-emerald-600 transition-colors">All Categories</Link></li>
              <li><Link href={`/login?redirect=${encodeURIComponent("/dashboard/customer")}`} className="hover:text-emerald-600 transition-colors">Customer Portal</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Gear Categories</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/gear?catagory=Cycling" className="hover:text-emerald-600 transition-colors">Mountain & Road Bikes</Link></li>
              <li><Link href="/gear?catagory=Camping+%26+Hiking" className="hover:text-emerald-600 transition-colors">Camping & Tents</Link></li>
              <li><Link href="/gear?catagory=Water+Sports" className="hover:text-emerald-600 transition-colors">Kayaks & Paddleboards</Link></li>
              <li><Link href="/gear?catagory=Winter+Sports" className="hover:text-emerald-600 transition-colors">Skis & Snowboards</Link></li>
              <li><Link href="/gear?catagory=Climbing" className="hover:text-emerald-600 transition-colors">Climbing Equipment</Link></li>
            </ul>
          </div>

          {/* Account / Support */}
          <div>
            <h5 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">For Providers</h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link href={`/login?redirect=${encodeURIComponent("/dashboard/provider")}`} className="hover:text-emerald-600 transition-colors">List Your Gear</Link></li>
              <li><Link href={`/login?redirect=${encodeURIComponent("/dashboard/provider")}`} className="hover:text-emerald-600 transition-colors">Provider Dashboard</Link></li>
              <li><Link href={`/login?redirect=${encodeURIComponent("/dashboard/provider")}`} className="hover:text-emerald-600 transition-colors">Partner Requirements</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
