import Link from "next/link"
import Image from "next/image"
import { fetchCategories, fetchGearList } from "@/services/api"
import GearCard from "@/component/GearCard"
import { ArrowRight, Mountain, ShieldCheck, Calendar, Sparkles, CheckCircle2, Bike, Tent, Waves, Snowflake, Dumbbell, Compass } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const categories = await fetchCategories()
  const { data: featuredGear } = await fetchGearList({ limit: "6" })

  const categoryIcons: Record<string, any> = {
    "Cycling": Bike,
    "Camping & Hiking": Tent,
    "Water Sports": Waves,
    "Winter Sports": Snowflake,
    "Fitness & Training": Dumbbell,
    "Climbing": Compass,
  }

  return (
    <div className="space-y-20 pb-20">
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-black/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#dad8f9]/60 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-[300px] h-[300px] bg-[#dad8f9]/20 blur-2xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/5 text-black/60 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Outdoor & Sports Gear Rental</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black tracking-tight leading-[1.1]">
                Rent Sports & Outdoor Gear{" "}
                <span className="bg-[#dad8f9] px-3 rounded-xl">
                  Instantly.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-black/60 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Unlock top-tier mountain bikes, 4-season tents, kayaks, skis, and climbing gear without the high upfront cost. Rent from verified local providers with instant booking and damage protection.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/gear"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold bg-[#dad8f9] hover:bg-[#dad8f9]/70 text-black shadow-xl shadow-[#dad8f9]/30 hover:shadow-[#dad8f9]/50 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-[0.98]"
                >
                  <span>Explore All Gear</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-semibold border border-black/5 bg-white hover:bg-black/5 text-black/60 transition-colors flex items-center justify-center"
                >
                  How It Works
                </Link>
              </div>

              <div className="pt-6 border-t border-black/5 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-black/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black/60" />
                  <span>100% Insured Rentals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black/60" />
                  <span>Verified Equipment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-black/60" />
                  <span>Flexible Dates</span>
                </div>
              </div>
            </div>

            {featuredGear[0] && (
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-black/5 shadow-2xl group">
                  {featuredGear[0].image ? (
                    <Image
                      src={featuredGear[0].image}
                      alt={featuredGear[0].name}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/5 flex items-center justify-center text-black/60 text-sm">{featuredGear[0].name}</div>
                  )}
                  <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-black/5 space-y-2 shadow-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-black/60 uppercase tracking-wider">Featured Gear</span>
                      <span className="text-xs font-bold text-black bg-black/5 px-2.5 py-1 rounded-xl border border-black/5">
                        ${featuredGear[0].rentalPrice} / day
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-black">{featuredGear[0].name}</h3>
                    <p className="text-xs text-black/60 line-clamp-1">{featuredGear[0].description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-black/60 uppercase tracking-wider">Browse Collections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mt-1">
              Explore Gear by Category
            </h2>
          </div>
          <Link
            href="/gear"
            className="text-xs font-bold text-black/60 hover:text-black flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const IconComp = categoryIcons[cat.name] || Mountain
            return (
              <Link
                key={cat.id}
                href={`/gear?catagory=${encodeURIComponent(cat.name)}`}
                className="group p-5 rounded-2xl bg-white border border-black/5 hover:shadow-xl hover:shadow-[#dad8f9]/10 transition-all duration-300 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 text-black/60 group-hover:bg-[#dad8f9] group-hover:text-black flex items-center justify-center transition-colors duration-300">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-sm text-black group-hover:text-black/60 transition-colors">
                  {cat.name}
                </h3>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-black/60 uppercase tracking-wider">Top Outdoor Selections</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight mt-1">
              Featured Gear Available Now
            </h2>
          </div>
          <Link
            href="/gear"
            className="text-xs font-bold text-black/60 hover:text-black flex items-center gap-1 transition-colors"
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

      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white border border-black/5 rounded-3xl p-8 sm:p-12 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-black/60 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl font-extrabold text-black tracking-tight">How GearUp Works</h2>
            <p className="text-sm text-black/60">Rent premium sports gear in 4 hassle-free steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="space-y-3 p-6 rounded-2xl bg-white border border-black/5 relative">
              <span className="text-3xl font-black text-black/10 absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-xl bg-[#dad8f9] text-black flex items-center justify-center font-bold">
                <Mountain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black">Find Your Gear</h3>
              <p className="text-xs text-black/60 leading-relaxed">Search through bikes, tents, kayaks, skis, and climbing equipment.</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-white border border-black/5 relative">
              <span className="text-3xl font-black text-black/10 absolute top-4 right-4">02</span>
              <div className="w-10 h-10 rounded-xl bg-black/5 text-black/60 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black">Pick Rental Dates</h3>
              <p className="text-xs text-black/60 leading-relaxed">Choose your start and end dates with real-time daily rate calculation.</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-white border border-black/5 relative">
              <span className="text-3xl font-black text-black/10 absolute top-4 right-4">03</span>
              <div className="w-10 h-10 rounded-xl bg-[#dad8f9] text-black flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black">Pickup Equipment</h3>
              <p className="text-xs text-black/60 leading-relaxed">Coordinate pickup or delivery from verified local gear shop providers.</p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-white border border-black/5 relative">
              <span className="text-3xl font-black text-black/10 absolute top-4 right-4">04</span>
              <div className="w-10 h-10 rounded-xl bg-black/5 text-black/60 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-black">Return & Review</h3>
              <p className="text-xs text-black/60 leading-relaxed">Return gear after your trip and share your experience with the community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#dad8f9] p-8 sm:p-12">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-extrabold text-black/60 uppercase tracking-widest">For Shop Owners & Gear Owners</span>
            <h2 className="text-3xl font-black text-black">Have Outdoor Gear Sitting Idle?</h2>
            <p className="text-sm text-black/60 leading-relaxed">
              List your equipment on GearUp and earn steady passive income. Manage your inventory, approve orders, and reach thousands of adventure seekers.
            </p>
            <div className="pt-2">
              <Link
                href={`/login?redirect=${encodeURIComponent("/dashboard/provider")}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-extrabold bg-black hover:bg-black/80 text-white transition-all"
              >
                <span>Become a Gear Provider</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
