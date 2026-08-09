"use client";

import GearForm from "@/component/GearForm";
import { PackagePlus } from "lucide-react";

export default function NewGearPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <PackagePlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Add New Gear</h1>
          <p className="text-xs text-slate-500">Create a listing for a gear item</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
        <GearForm mode="create" />
      </div>
    </div>
  );
}
