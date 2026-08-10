export function GearCardSkeleton() {
  return (
    <div className="bg-white border border-black/5 rounded-2xl overflow-hidden animate-pulse flex flex-col h-full">
      <div className="aspect-[4/3] w-full bg-black/5" />
      <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-3 w-1/3 bg-black/5 rounded" />
          <div className="h-5 w-3/4 bg-black/5 rounded" />
          <div className="h-3 w-full bg-black/5 rounded" />
        </div>
        <div className="pt-3 border-t border-black/5 flex items-center justify-between">
          <div className="h-6 w-20 bg-black/5 rounded" />
          <div className="h-8 w-24 bg-black/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function GearGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <GearCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function GearDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-[16/10] w-full bg-black/5 rounded-3xl" />
          <div className="h-8 w-2/3 bg-black/5 rounded" />
          <div className="h-4 w-full bg-black/5 rounded" />
          <div className="h-4 w-5/6 bg-black/5 rounded" />
        </div>
        <div className="h-[480px] bg-white border border-black/5 rounded-3xl p-6" />
      </div>
    </div>
  );
}
