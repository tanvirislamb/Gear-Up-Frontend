"use client";

import { useState } from "react";
import { Calendar, DollarSign, ShieldCheck, Clock, ArrowRight, Minus, Plus, AlertCircle } from "lucide-react";
import { GearItem } from "@/types/gear";
import Link from "next/link";

interface RentNowWidgetProps {
  gear: GearItem;
}

export default function RentNowWidget({ gear }: RentNowWidgetProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  
  // Default start date = today, end date = +3 days
  const defaultEnd = new Date();
  defaultEnd.setDate(defaultEnd.getDate() + 3);
  const defaultEndStr = defaultEnd.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const isAvailable = gear.availableQty > 0;

  // Calculate rental duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();
  const totalPrice = gear.rentalPrice * rentalDays * quantity;

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setErrorMsg("");
    if (endDate && new Date(val) > new Date(endDate)) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(nextDay.toISOString().split("T")[0]);
    }
  };

  const handleEndDateChange = (val: string) => {
    if (startDate && new Date(val) < new Date(startDate)) {
      setErrorMsg("End date cannot be before start date.");
      return;
    }
    setErrorMsg("");
    setEndDate(val);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl text-slate-200">
      {/* Rate Header */}
      <div className="flex items-baseline justify-between border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Daily Rental Rate</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold text-white">${gear.rentalPrice}</span>
            <span className="text-sm text-slate-400">/ day</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block mb-1">Availability</span>
          {isAvailable ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
              {gear.availableQty} Units In Stock
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-400" /> Select Rental Duration
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-medium block">Start Date</label>
            <input
              type="date"
              min={todayStr}
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              disabled={!isAvailable}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-medium block">End Date</label>
            <input
              type="date"
              min={startDate || todayStr}
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              disabled={!isAvailable}
              className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Quantity Counter */}
      {isAvailable && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
          <div>
            <span className="text-xs font-semibold text-slate-300 block">Quantity</span>
            <span className="text-[11px] text-slate-500">Max {gear.availableQty} available</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-lg bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold text-slate-100 px-1">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(gear.availableQty, quantity + 1))}
              disabled={quantity >= gear.availableQty}
              className="w-7 h-7 rounded-lg bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Price Summary Breakdown */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>${gear.rentalPrice} × {rentalDays} {rentalDays === 1 ? "day" : "days"}</span>
          <span>${gear.rentalPrice * rentalDays}</span>
        </div>
        {quantity > 1 && (
          <div className="flex justify-between text-xs text-slate-400">
            <span>Quantity ({quantity} items)</span>
            <span>× {quantity}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Equipment Insurance
          </span>
          <span className="text-emerald-400 font-semibold">Included</span>
        </div>
        <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
          <span className="text-sm font-bold text-slate-200">Estimated Total</span>
          <div className="text-right">
            <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              ${totalPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Rent Now Action Button */}
      {isAvailable ? (
        <Link
          href={`/login?redirect=/gear/${gear.id}&startDate=${startDate}&endDate=${endDate}&qty=${quantity}`}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-[0.99] group"
        >
          <span>Proceed to Book Rental</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      ) : (
        <button
          disabled
          className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-slate-800 text-slate-500 cursor-not-allowed text-center"
        >
          Currently Out of Stock
        </button>
      )}

      {/* Trust & Guarantee */}
      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-4 pt-1">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" /> Instant confirmation
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Fully refundable
        </span>
      </div>
    </div>
  );
}
