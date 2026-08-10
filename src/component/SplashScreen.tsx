"use client"

import { useEffect, useState } from "react"
import { Mountain } from "lucide-react"
import { useAuth } from "@/context/AuthProvider"

export default function SplashScreen() {
  const { loading } = useAuth()
  const [hidden, setHidden] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (loading) return
    const fadeTimer = setTimeout(() => setHidden(true), 50)
    const removeTimer = setTimeout(() => setGone(true), 550)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [loading])

  if (gone) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-white transition-opacity duration-500 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      aria-hidden={hidden}
    >
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#dad8f9] p-3 text-black flex items-center justify-center">
          <Mountain className="w-9 h-9 stroke-[2.5]" />
        </div>
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black tracking-tight">GearUp</div>
          <div className="text-[10px] text-black/60 font-semibold tracking-widest uppercase">
            Outdoor Rentals
          </div>
        </div>
      </div>
    </div>
  )
}
