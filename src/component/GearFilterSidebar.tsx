"use client";

import { useState, useEffect } from "react";
import { Search, Filter, RotateCcw, Calendar, DollarSign, Tag, Check, SlidersHorizontal } from "lucide-react";
import { Category, GearQueryFilters } from "@/types/gear";

interface GearFilterSidebarProps {
  categories: Category[];
  initialFilters: GearQueryFilters;
  onFilterChange: (filters: GearQueryFilters) => void;
  availableBrands?: string[];
}

export default function GearFilterSidebar({
  categories,
  initialFilters,
  onFilterChange,
  availableBrands = ["Trek", "The North Face", "Salomon", "Osprey", "Intex", "Bowflex", "Black Diamond", "BOTE"]
}: GearFilterSidebarProps) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.catagory || "");
  const [selectedBrand, setSelectedBrand] = useState(initialFilters.brand || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.price || "100");
  const [startDate, setStartDate] = useState(initialFilters.startDate || "");
  const [endDate, setEndDate] = useState(initialFilters.endDate || "");

  // Update parent when filter states change
  const applyFilters = (updated: Partial<GearQueryFilters>) => {
    const filters: GearQueryFilters = {
      search: updated.search !== undefined ? updated.search : search,
      catagory: updated.catagory !== undefined ? updated.catagory : selectedCategory,
      brand: updated.brand !== undefined ? updated.brand : selectedBrand,
      price: updated.price !== undefined ? updated.price : maxPrice,
      startDate: updated.startDate !== undefined ? updated.startDate : startDate,
      endDate: updated.endDate !== undefined ? updated.endDate : endDate,
      page: "1"
    };
    onFilterChange(filters);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setMaxPrice("100");
    setStartDate("");
    setEndDate("");
    onFilterChange({ page: "1" });
  };

  return (
    <aside className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-6 text-slate-200 backdrop-blur-md sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base text-slate-100">Filter Gear</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-emerald-400" /> Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              applyFilters({ search: e.target.value });
            }}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-400" /> Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory("");
              applyFilters({ catagory: "" });
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === ""
                ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                : "text-slate-300 hover:bg-slate-800/60"
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === "" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => {
                  const val = isSelected ? "" : cat.name;
                  setSelectedCategory(val);
                  applyFilters({ catagory: val });
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                    : "text-slate-300 hover:bg-slate-800/60"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Max Price / Day
          </label>
          <span className="text-xs font-bold text-emerald-400">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="10"
          max="150"
          step="5"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            applyFilters({ price: e.target.value });
          }}
          className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>$10/day</span>
          <span>$150/day</span>
        </div>
      </div>

      {/* Rental Dates Filter */}
      <div className="space-y-3 pt-2 border-t border-slate-800/60">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Availability Dates
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] text-slate-500 block mb-1">Start Date</span>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setStartDate(e.target.value);
                applyFilters({ startDate: e.target.value });
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block mb-1">End Date</span>
            <input
              type="date"
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setEndDate(e.target.value);
                applyFilters({ endDate: e.target.value });
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Brand Filter
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            applyFilters({ brand: e.target.value });
          }}
          className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Brands</option>
          {availableBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
