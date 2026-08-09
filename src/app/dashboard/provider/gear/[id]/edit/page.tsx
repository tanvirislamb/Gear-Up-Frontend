"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchGearById } from "@/services/api";
import { GearItem } from "@/types/gear";
import GearForm from "@/component/GearForm";
import { Loader2, Pencil, ArrowLeft } from "lucide-react";

export default function EditGearPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [gear, setGear] = useState<GearItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGearById(id).then((g) => {
      setGear(g);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-slate-400">Gear not found.</p>
        <Link href="/dashboard/provider" className="text-emerald-400 font-semibold text-sm">
          Back to inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/provider"
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
          <Pencil className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white">Edit Gear</h1>
          <p className="text-xs text-slate-400">{gear.name}</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <GearForm mode="edit" initial={gear} />
      </div>
    </div>
  );
}
