import Link from "next/link";
import Image from "next/image";
import { fetchCategories, fetchGearList } from "@/services/api";
import GearCard from "@/component/GearCard";
import { ArrowRight, Mountain, ShieldCheck, Calendar, Sparkles, CheckCircle2, Bike, Tent, Waves, Snowflake, Dumbbell, Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await fetchCategories();
  const { data: featuredGear } = await fetchGearList({ limit: "6" });

  const categoryIcons: Record<string, any> = {
    "Cycling": Bike,
    "Camping & Hiking": Tent,
    "Water Sports": Waves,
    "Winter Sports": Snowflake,
    "Fitness & Training": Dumbbell,
    "Climbing": Compass,
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-slate-900/80">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Outdoor & Sports Gear Rental</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Rent Sports & Outdoor Gear{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Instantly.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Unlock top-tier mountain bikes, 4-season tents, kayaks, skis, and climbing gear without the high upfront cost. Rent from verified local providers with instant booking and damage protection.
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/gear"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <span>Explore All Gear</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-semibold border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200 transition-colors flex items-center justify-center"
                >
                  How It Works
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Insured Rentals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>Verified Equipment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Flexible Dates</span>
                </div>
              </div>
            </div>

            {/* Right Hero Feature Card Stack */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80"
                  alt="Outdoor Camping Gear"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Featured Gear</span>
                    <span className="text-xs font-bold text-slate-200 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                      $32 / day
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white">Wilderness 4-Person All-Season Tent</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">Alpine rated double-wall tent with aluminum alloy poles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Browse Collections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Explore Gear by Category
            </h2>
          </div>
          <Link
            href="/gear"
            className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const IconComp = categoryIcons[cat.name] || Mountain;
            return (
              <Link
                key={cat.id}
                href={`/gear?catagory=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center transition-colors duration-300">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm text-slate-200 group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Gear Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Top Outdoor Selections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Featured Gear Available Now
            </h2>
          </div>
          <Link
            href="/gear"
            className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <span>See Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGear.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      </section>

      {/* How It Works Guide */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">How GearUp Works</h2>
            <p className="text-sm text-slate-400">Rent premium sports gear in 4 hassle-free steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="space-y-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 relative">
              <span className="text-3xl font-black text-emerald-500/20 absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <Mountain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Find Your Gear</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Search through bikes, tents, kayaks, skis, and climbing equipment.</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 relative">
              <span className="text-3xl font-black text-teal-500/20 absolute top-4 right-4">02</span>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Pick Rental Dates</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Choose your start and end dates with real-time daily rate calculation.</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 relative">
              <span className="text-3xl font-black text-emerald-500/20 absolute top-4 right-4">03</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Pickup Equipment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Coordinate pickup or delivery from verified local gear shop providers.</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 relative">
              <span className="text-3xl font-black text-teal-500/20 absolute top-4 right-4">04</span>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">Return & Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Return gear after your trip and share your experience with the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">For Shop Owners & Gear Owners</span>
            <h2 className="text-3xl font-black text-white">Have Outdoor Gear Sitting Idle?</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              List your equipment on GearUp and earn steady passive income. Manage your inventory, approve orders, and reach thousands of adventure seekers.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>Become a Gear Provider</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}