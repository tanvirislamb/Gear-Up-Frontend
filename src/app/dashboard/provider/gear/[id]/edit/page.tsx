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
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    );
  }

  if (!gear) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-black/60">Gear not found.</p>
        <Link href="/dashboard/provider" className="text-black/60 font-semibold text-sm">
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
          className="p-2 rounded-xl bg-black/5 text-black/60 hover:bg-black/5"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="w-10 h-10 rounded-xl bg-[#dad8f9] text-black flex items-center justify-center">
          <Pencil className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-black">Edit Gear</h1>
          <p className="text-xs text-black/60">{gear.name}</p>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-3xl p-6 sm:p-8">
        <GearForm mode="edit" initial={gear} />
      </div>
    </div>
  );
}
