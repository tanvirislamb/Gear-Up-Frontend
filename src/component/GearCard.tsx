"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Shield, ArrowRight, Tag, ImageOff } from "lucide-react"
import { GearItem } from "@/types/gear"
import { useState } from "react"

interface GearCardProps {
  gear: GearItem
}

export default function GearCard({ gear }: GearCardProps) {
  const [imgError, setImgError] = useState(false)
  const categoryName = gear.catagory?.name || gear.category?.name || "Outdoor Gear"
  const isAvailable = gear.availableQty > 0
  const isLowStock = isAvailable && gear.availableQty <= 3
  const hasImage = gear.image && !imgError

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md flex flex-col h-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
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
          <div className="w-full h-full flex flex-col items-center justify-center text-black/60 gap-2">
            <ImageOff className="w-10 h-10" />
            <span className="text-xs">{gear.name}</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-white text-black/60 border border-black/5 backdrop-blur-md">
            <Tag className="w-3 h-3" />
            {categoryName}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold backdrop-blur-md border ${isLowStock
                ? "bg-primary text-white border-black/5"
                : "bg-white/50 text-black/60 border-black/5"
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isLowStock ? "bg-white" : "bg-black/60"}`} />
              {isLowStock ? `Only ${gear.availableQty} Left` : "Available"}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold bg-black/50 text-black/40 border border-black/5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 mr-1.5" />
              Out of Stock
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 text-xs font-medium text-black/60 bg-white px-2.5 py-0.5 rounded-xl border border-black/5 backdrop-blur-sm">
          {gear.brand}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-xs text-black/60 font-semibold">
              <Star className="w-3.5 h-3.5 fill-black/30 text-black/30" />
              <span>{gear.rating || 4.8}</span>
              <span className="text-black/40">({gear.reviews?.length || 0})</span>
            </div>
            <span className="text-[11px] text-black/60 flex items-center gap-1">
              <Shield className="w-3 h-3 text-black/60" /> Verified
            </span>
          </div>

          <h3 className="font-bold text-lg text-black line-clamp-2 leading-snug">
            {gear.name}
          </h3>

          <p className="text-xs text-black/60 line-clamp-2 mt-2 leading-relaxed">
            {gear.description}
          </p>
        </div>

        <div className="pt-3 border-t border-black/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-black/60 block">Rental Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-black">${gear.rentalPrice}</span>
              <span className="text-xs text-black/60 font-medium">/ day</span>
            </div>
          </div>

          <Link
            href={`/gear/${gear.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-black/5 hover:bg-primary hover:text-white text-black/60 transition-all duration-200 group/btn"
          >
            <span>Rent Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
