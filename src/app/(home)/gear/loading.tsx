import { GearGridSkeleton } from "@/component/Skeletons";

export default function GearCatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="h-8 w-64 bg-slate-800 rounded animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block h-[400px] bg-slate-900/60 rounded-2xl animate-pulse" />
        <div className="lg:col-span-3">
          <GearGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
