"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchCategories, fetchGearList } from "@/services/api";
import { Category, GearItem, GearQueryFilters, PaginatedMeta } from "@/types/gear";
import GearCard from "@/component/GearCard";
import GearFilterSidebar from "@/component/GearFilterSidebar";
import { GearGridSkeleton } from "@/component/Skeletons";
import { SlidersHorizontal, PackageSearch, RotateCcw, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";

export default function GearCatalogPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta>({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initial filter values from URL searchParams
  const [filters, setFilters] = useState<GearQueryFilters>({
    search: searchParams.get("search") || "",
    catagory: searchParams.get("catagory") || "",
    brand: searchParams.get("brand") || "",
    price: searchParams.get("price") || "100",
    page: searchParams.get("page") || "1",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  });

  // Load Categories on Mount
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // Sync state & URL when filters change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchGearList(filters).then((res) => {
      if (isMounted) {
        setGearItems(res.data);
        setMeta(res.meta);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: GearQueryFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Sync to URL
    const params = new URLSearchParams();
    if (updated.search) params.set("search", updated.search);
    if (updated.catagory) params.set("catagory", updated.catagory);
    if (updated.brand) params.set("brand", updated.brand);
    if (updated.price) params.set("price", updated.price);
    if (updated.page && updated.page !== "1") params.set("page", updated.page);
    if (updated.startDate) params.set("startDate", updated.startDate);
    if (updated.endDate) params.set("endDate", updated.endDate);

    const str = params.toString();
    router.push(str ? `/gear?${str}` : "/gear", { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ page: newPage.toString() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-emerald-600 font-semibold">Gear Catalog</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Sports & Outdoor Gear Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Browse available equipment, filter by category, brand, and daily pricing rates.
            </p>
          </div>

          {/* Mobile Filter Drawer Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:text-emerald-600 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1">
          <GearFilterSidebar
            categories={categories}
            initialFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Mobile Filter Drawer Overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-slate-50 h-full p-6 overflow-y-auto shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="font-bold text-base text-slate-900">Filter Gear</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <GearFilterSidebar
                categories={categories}
                initialFilters={filters}
                onFilterChange={(updated) => {
                  handleFilterChange(updated);
                  setMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-3 text-xs text-slate-700">
            <span className="font-semibold">
              Showing <span className="text-emerald-600 font-bold">{gearItems.length}</span> of{" "}
              <span className="text-slate-900 font-bold">{meta.total}</span> gear items
            </span>

            {/* Active Filters Indicators */}
            {(filters.search || filters.catagory || filters.brand) && (
              <button
                onClick={() => handleFilterChange({ search: "", catagory: "", brand: "", price: "100", page: "1" })}
                className="text-slate-500 hover:text-emerald-600 flex items-center gap-1 text-[11px] font-medium"
              >
                <RotateCcw className="w-3 h-3" /> Clear Active Filters
              </button>
            )}
          </div>

          {/* Gear Cards Grid */}
          {loading ? (
            <GearGridSkeleton count={6} />
          ) : gearItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gearItems.map((gear) => (
                <GearCard key={gear.id} gear={gear} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <PackageSearch className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Equipment Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn&apos;t find any gear matching your search or active filter criteria. Try adjusting your filters or price range.
              </p>
              <button
                onClick={() => handleFilterChange({ search: "", catagory: "", brand: "", price: "100", page: "1" })}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page <= 1}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: meta.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === meta.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
