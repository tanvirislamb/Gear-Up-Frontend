"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Shield, ArrowRight, Tag, ImageOff } from "lucide-react";
import { GearItem } from "@/types/gear";
import { useState } from "react";

interface GearCardProps {
  gear: GearItem;
}

export default function GearCard({ gear }: GearCardProps) {
  const [imgError, setImgError] = useState(false);
  const categoryName = gear.catagory?.name || gear.category?.name || "Outdoor Gear";
  const isAvailable = gear.availableQty > 0;
  const isLowStock = isAvailable && gear.availableQty <= 3;
  const hasImage = gear.image && !imgError;

  return (
    <div className="group relative bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        {hasImage ? (
          <Image
            src={gear.image!}
            alt={gear.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 gap-2">
            <ImageOff className="w-10 h-10" />
            <span className="text-xs">{gear.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 pointer-events-none" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <Tag className="w-3 h-3" />
            {categoryName}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                isLowStock
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isLowStock ? "bg-amber-400" : "bg-emerald-400"}`} />
              {isLowStock ? `Only ${gear.availableQty} Left` : "Available"}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Brand Tag */}
        <div className="absolute bottom-3 left-3 text-xs font-medium text-slate-300 bg-slate-950/70 px-2.5 py-0.5 rounded border border-slate-800 backdrop-blur-sm">
          {gear.brand}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{gear.rating || 4.8}</span>
              <span className="text-slate-500">({gear.reviews?.length || 0})</span>
            </div>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Verified
            </span>
          </div>

          <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
            {gear.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {gear.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Rental Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-white">${gear.rentalPrice}</span>
              <span className="text-xs text-slate-400 font-medium">/ day</span>
            </div>
          </div>

          <Link
            href={`/gear/${gear.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 transition-all duration-200 group/btn"
          >
            <span>Rent Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
