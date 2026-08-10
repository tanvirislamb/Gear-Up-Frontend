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
    <aside className="w-full bg-white border border-black/5 rounded-2xl p-5 space-y-6 text-black backdrop-blur-md sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-black/60" />
          <h3 className="font-bold text-base text-black">Filter Gear</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-black/60 hover:text-black flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-black/60" /> Search
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
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/5 rounded-xl text-sm text-black placeholder-black/60 focus:outline-none focus:border-[#dad8f9] transition-colors"
          />
          <Search className="w-4 h-4 text-black/60 absolute left-3 top-3" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-black/60" /> Category
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          <button
            onClick={() => {
              setSelectedCategory("");
              applyFilters({ catagory: "" });
            }}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === ""
                    ? "bg-[#dad8f9] text-black font-semibold border border-black/5"
                : "text-black/60 hover:bg-black/5"
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === "" && <Check className="w-3.5 h-3.5 text-black/60" />}
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
                ? "bg-[#dad8f9] text-black font-semibold border border-black/5"
                    : "text-black/60 hover:bg-black/5"
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-black/60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-2 border-t border-black/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-black/60" /> Max Price / Day
          </label>
          <span className="text-xs font-bold text-black">${maxPrice}</span>
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
          className="w-full accent-[#dad8f9] cursor-pointer h-1.5 bg-black/5 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-black/60">
          <span>$10/day</span>
          <span>$150/day</span>
        </div>
      </div>

      {/* Rental Dates Filter */}
      <div className="space-y-3 pt-2 border-t border-black/5">
        <label className="text-xs font-semibold uppercase tracking-wider text-black/60 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-black/60" /> Availability Dates
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] text-black/60 block mb-1">Start Date</span>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setStartDate(e.target.value);
                applyFilters({ startDate: e.target.value });
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-black/5 rounded-lg text-xs text-black focus:outline-none focus:border-[#dad8f9]"
            />
          </div>
          <div>
            <span className="text-[11px] text-black/60 block mb-1">End Date</span>
            <input
              type="date"
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setEndDate(e.target.value);
                applyFilters({ endDate: e.target.value });
              }}
              className="w-full px-2.5 py-1.5 bg-white border border-black/5 rounded-lg text-xs text-black focus:outline-none focus:border-[#dad8f9]"
            />
          </div>
        </div>
      </div>

      {/* Brand Selection */}
      <div className="space-y-2.5 pt-2 border-t border-black/5">
        <label className="text-xs font-semibold uppercase tracking-wider text-black/60">
          Brand Filter
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            applyFilters({ brand: e.target.value });
          }}
          className="w-full px-3 py-2 bg-white border border-black/5 rounded-xl text-xs text-black focus:outline-none focus:border-[#dad8f9]"
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
