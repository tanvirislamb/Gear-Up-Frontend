"use client";

import { useState } from "react";
import { Calendar, DollarSign, ShieldCheck, Clock, ArrowRight, Minus, Plus, AlertCircle } from "lucide-react";
import { GearItem } from "@/types/gear";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

interface RentNowWidgetProps {
  gear: GearItem;
}

export default function RentNowWidget({ gear }: RentNowWidgetProps) {
  const router = useRouter();
  const { user } = useAuth();
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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-xl text-slate-800">
      {/* Rate Header */}
      <div className="flex items-baseline justify-between border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">Daily Rental Rate</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold text-slate-900">${gear.rentalPrice}</span>
            <span className="text-sm text-slate-500">/ day</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block mb-1">Availability</span>
          {isAvailable ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
              {gear.availableQty} Units In Stock
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-600 border border-rose-200">
              Unavailable
            </span>
          )}
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600" /> Select Rental Duration
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 font-medium block">Start Date</label>
            <input
              type="date"
              min={todayStr}
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              disabled={!isAvailable}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-500 font-medium block">End Date</label>
            <input
              type="date"
              min={startDate || todayStr}
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              disabled={!isAvailable}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Quantity Counter */}
      {isAvailable && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div>
            <span className="text-xs font-semibold text-slate-700 block">Quantity</span>
            <span className="text-[11px] text-slate-500">Max {gear.availableQty} available</span>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold text-slate-900 px-1">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(gear.availableQty, quantity + 1))}
              disabled={quantity >= gear.availableQty}
              className="w-7 h-7 rounded-lg bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Price Summary Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5">
        <div className="flex justify-between text-xs text-slate-500">
          <span>${gear.rentalPrice} × {rentalDays} {rentalDays === 1 ? "day" : "days"}</span>
          <span>${gear.rentalPrice * rentalDays}</span>
        </div>
        {quantity > 1 && (
          <div className="flex justify-between text-xs text-slate-500">
            <span>Quantity ({quantity} items)</span>
            <span>× {quantity}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Equipment Insurance
          </span>
          <span className="text-emerald-600 font-semibold">Included</span>
        </div>
        <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
          <span className="text-sm font-bold text-slate-800">Estimated Total</span>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600">
              ${totalPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Rent Now Action Button */}
      {isAvailable ? (
        <button
          onClick={() => {
            const checkoutUrl = `/checkout?gearId=${gear.id}&startDate=${startDate}&endDate=${endDate}&qty=${quantity}`;
            if (user) {
              router.push(checkoutUrl);
            } else {
              router.push(`/login?redirect=${encodeURIComponent(checkoutUrl)}`);
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-extrabold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 active:scale-[0.99] group"
        >
          <span>{user ? "Proceed to Book Rental" : "Login to Book Rental"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <button
          disabled
          className="w-full py-4 px-6 rounded-2xl font-bold text-sm bg-slate-100 text-slate-500 cursor-not-allowed text-center"
        >
          Currently Out of Stock
        </button>
      )}

      {/* Trust & Guarantee */}
      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-4 pt-1">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-500" /> Instant confirmation
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Fully refundable
        </span>
      </div>
    </div>
  );
}
