import Link from "next/link"
import Image from "next/image"
import { fetchCategories, fetchGearList } from "@/services/api"
import GearCard from "@/component/GearCard"
import { ArrowRight, Mountain, ShieldCheck, Calendar, Sparkles, Bike, Tent, Waves, Snowflake, Dumbbell, Compass, Award, Headphones } from "lucide-react"

export const revalidate = 300;

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
      {/* Banner / Hero Section matching sample.png design with hero.png background */}
      <section className="relative w-full min-h-[640px] md:min-h-[900px] flex items-center overflow-hidden bg-slate-950">
        <Image
          src="/hero.png"
          alt="Rent Gear. Live Adventure."
          fill
          priority
          className="object-cover object-center select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 via-50% to-black/25 lg:to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 py-16 sm:py-24">
          <div className="max-w-3xl space-y-8 text-left">

            {/* Top Pill / Badge with Mountain Icon & Brushed Edge */}
            <div className="inline-flex items-center">
              <div className="relative px-5 py-2.5 flex items-center gap-3">
                {/* SVG Rough Brush Badge Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full text-white/20 fill-black/65 stroke-white/40 stroke-[1.5]"
                  viewBox="0 0 340 50"
                  preserveAspectRatio="none"
                >
                  <path d="M4 10C25 3 60 7 120 4C180 2 250 6 320 3C332 5 338 12 335 25 C338 38 322 45 300 47C230 44 160 48 90 45C50 47 20 43 4 36C-1 28 0 18 4 10Z" />
                </svg>
                <div className="relative z-10 flex items-center justify-center p-1 rounded border border-white/60 bg-black/40">
                  <Mountain className="w-4 h-4 text-primary" />
                </div>
                <span className="relative z-10 text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                  GEAR TODAY, ADVENTURES TOMORROW
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="font-bebas text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tight uppercase leading-[0.9] drop-shadow-md">
                RENT GEAR.
              </h1>
              <h1 className="font-bebas text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tight uppercase leading-[0.9] drop-shadow-md">
                <span className="text-primary">LIVE</span> ADVENTURE.
              </h1>
            </div>

            {/* Subtitle / Paragraph */}
            <p className="text-base sm:text-lg text-slate-200 max-w-xl font-medium leading-relaxed drop-shadow-sm">
              Top-quality outdoor & sports gear rentals for every adventure. Affordable, reliable, and ready when you are.
            </p>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 pt-4 items-center text-white">
              {/* Feature 1 */}
              <div className="flex items-center gap-3 sm:pr-4 lg:pr-6 sm:border-r sm:border-white/25">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div className="text-[11px] sm:text-xs font-black tracking-wider leading-tight uppercase">
                  <div>VERIFIED</div>
                  <div>EQUIPMENT</div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3 sm:px-4 lg:px-6 sm:border-r sm:border-white/25">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div className="text-[11px] sm:text-xs font-black tracking-wider leading-tight uppercase">
                  <div>FLEXIBLE</div>
                  <div>RENTALS</div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3 sm:px-4 lg:px-6 sm:border-r sm:border-white/25">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="text-[11px] sm:text-xs font-black tracking-wider leading-tight uppercase">
                  <div>QUALITY</div>
                  <div>GUARANTEED</div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-center gap-3 sm:pl-4 lg:pl-6">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <div className="text-[11px] sm:text-xs font-black tracking-wider leading-tight uppercase">
                  <div>SUPPORT</div>
                  <div>WHEN YOU NEED IT</div>
                </div>
              </div>
            </div>

            {/* CTA Button with Orange Brush Edge Style */}
            <div className="pt-4">
              <Link
                href="/gear"
                className="relative inline-flex items-center justify-center group focus:outline-none"
              >
                {/* SVG Brush stroke button background */}
                <svg
                  className="absolute inset-0 w-full h-full text-primary fill-current filter drop-shadow-xl group-hover:brightness-110 group-active:scale-[0.99] transition-all duration-200"
                  viewBox="0 0 310 58"
                  preserveAspectRatio="none"
                >
                  <path d="M5 12C20 3 60 7 130 3C200 1 260 5 302 2C308 8 311 20 307 35C309 46 300 53 275 55C210 52 145 56 75 53C35 55 12 50 5 42C-1 32 0 20 5 12Z" />
                </svg>
                <span className="relative z-10 px-8 py-4 text-sm sm:text-base font-black text-black uppercase tracking-wider flex items-center gap-2.5">
                  YOUR ADVENTURE STARTS HERE
                  <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1.5 transition-transform" />
                </span>
              </Link>
            </div>

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
                className="group p-5 rounded-2xl bg-white shadow-sm transition-all duration-300 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 text-black/60 group-hover:bg-primary group-hover:text-black flex items-center justify-center transition-colors duration-300">
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
        <div className="bg-white border border-black/3 shadow-md rounded-3xl p-8 sm:p-12 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-black/60 uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl font-extrabold text-black tracking-tight">How GearUp Works</h2>
            <p className="text-sm text-black/60">Rent premium sports gear in 4 hassle-free steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            <div className="space-y-3 p-6 rounded-2xl bg-white border border-black/5 relative">
              <span className="text-3xl font-black text-black/10 absolute top-4 right-4">01</span>
              <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-bold">
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
              <div className="w-10 h-10 rounded-xl bg-primary text-black flex items-center justify-center font-bold">
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
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 sm:p-12">
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
