import { fetchGearById } from "@/services/api";
import RentNowWidget from "@/component/RentNowWidget";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ShieldCheck, Tag, ArrowLeft, Building2, CheckCircle2, MessageSquare, Award } from "lucide-react";

interface GearDetailPageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export default async function GearDetailPage({ params }: GearDetailPageProps) {
  const { id } = await params;
  const gear = await fetchGearById(id);

  if (!gear) {
    notFound();
  }

  const categoryName = gear.catagory?.name || gear.category?.name || "Outdoor Equipment";
  const providerName = gear.provider?.name || "Summit Verified Rental Shop";
  const providerEmail = gear.provider?.email || "support@gearup.com";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-4">
        <Link
          href="/gear"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
        <span className="text-xs text-slate-500 font-mono">ID: {gear.id}</span>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery & Specs */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Hero Image */}
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <Image
              src={gear.image || "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80"}
              alt={gear.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                <Tag className="w-3.5 h-3.5" />
                {categoryName}
              </span>
            </div>
          </div>

          {/* Title & Ratings */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs">
              <span className="font-bold text-slate-300 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                Brand: {gear.brand}
              </span>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{gear.rating || 4.8}</span>
                <span className="text-slate-500">({gear.reviews?.length || 1} Customer Reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {gear.name}
            </h1>
          </div>

          {/* Detailed Description */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs">
              Equipment Specifications & Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {gear.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/60 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Condition</span>
                <span className="text-slate-200 font-semibold mt-0.5 block">Inspected / Like New</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Total Stock</span>
                <span className="text-slate-200 font-semibold mt-0.5 block">{gear.stock} Units</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Insurance</span>
                <span className="text-emerald-400 font-semibold mt-0.5 block">Damage Protected</span>
              </div>
            </div>
          </div>

          {/* Provider Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-base text-white">{providerName}</h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Verified Shop
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{providerEmail}</p>
              </div>
            </div>
            <div className="text-xs text-slate-400 font-medium bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-center sm:text-right">
              ⭐ 99% Order Fulfillment Rate
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Customer Reviews</span>
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {gear.reviews?.length || 0} Ratings
              </span>
            </div>

            {gear.reviews && gear.reviews.length > 0 ? (
              <div className="space-y-4">
                {gear.reviews.map((rev, idx) => (
                  <div key={rev.id || idx} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center">
                          {rev.customer?.name ? rev.customer.name.substring(0, 2).toUpperCase() : "CU"}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-200">
                            {rev.customer?.name || "Verified Customer"}
                          </h5>
                          <span className="text-[10px] text-slate-500">{rev.createdAt || "Recent Rental"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-slate-300 italic pl-10 leading-relaxed">
                        &quot;{rev.comment}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-6 text-center text-xs text-slate-400">
                No customer reviews yet. Be the first to rent and review this item!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Booking Widget */}
        <div className="lg:col-span-5 sticky top-20">
          <RentNowWidget gear={gear} />
        </div>
      </div>
    </div>
  );
}
