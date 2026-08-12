"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastProvider";
import { Category, GearItem } from "@/types/gear";
import { fetchCategories, createGear, updateGear } from "@/services/api";
import { Loader2, Save, ImageOff } from "lucide-react";

interface GearFormProps {
  mode: "create" | "edit";
  initial?: GearItem | null;
}

interface FieldErrors {
  name?: string;
  description?: string;
  brand?: string;
  rentalPrice?: string;
  stock?: string;
  availableQty?: string;
  categoryId?: string;
}

export default function GearForm({ mode, initial }: GearFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errs, setErrs] = useState<FieldErrors>({});

  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    brand: initial?.brand || "",
    image: initial?.image || "",
    rentalPrice: initial ? String(initial.rentalPrice) : "",
    stock: initial ? String(initial.stock) : "",
    availableQty: initial ? String(initial.availableQty) : "",
    categoryId: initial?.categoryId || "",
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrs((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: FieldErrors = {};
    if (form.name.trim().length < 3) e.name = "Name must be at least 3 characters";
    if (!form.brand.trim()) e.brand = "Brand is required";
    if (!form.description.trim()) e.description = "Description is required";
    const price = parseFloat(form.rentalPrice);
    if (!form.rentalPrice || isNaN(price) || price <= 0) e.rentalPrice = "Enter a valid price";
    const stock = parseInt(form.stock);
    if (isNaN(stock) || stock < 0) e.stock = "Enter a valid stock number";
    const avail = parseInt(form.availableQty);
    if (isNaN(avail) || avail < 0 || avail > stock) e.availableQty = "Available qty must be ≤ stock";
    if (!form.categoryId) e.categoryId = "Select a category";
    setErrs(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      brand: form.brand.trim(),
      image: form.image.trim() || null,
      rentalPrice: parseFloat(form.rentalPrice),
      stock: parseInt(form.stock),
      availableQty: parseInt(form.availableQty),
      categoryId: form.categoryId,
    };

    const res =
      mode === "create"
        ? await createGear(payload)
        : initial
          ? await updateGear(initial.id, payload)
          : null;

    setSubmitting(false);

    if (res?.success) {
      success(mode === "create" ? "Gear listed successfully!" : "Gear updated successfully!");
      router.push("/dashboard/provider");
      router.refresh();
    } else {
      error(res?.message || "Failed to save gear");
    }
  }

  const input =
    "w-full bg-black/5 rounded-xl px-3.5 py-2.5 text-sm text-black placeholder-black/60 focus:outline-none focus:border-primary transition-colors";
  const label = "block text-xs font-medium text-black/60 mb-1.5";
  const errMsg = "text-[11px] text-rose-600 mt-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={label}>Gear name</label>
          <input
            className={input}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Trek Mountain Bike"
          />
          {errs.name && <p className={errMsg}>{errs.name}</p>}
        </div>

        <div>
          <label className={label}>Brand</label>
          <input
            className={input}
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="e.g. Trek"
          />
          {errs.brand && <p className={errMsg}>{errs.brand}</p>}
        </div>

        <div>
          <label className={label}>Category</label>
          <select
            className={input}
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errs.categoryId && <p className={errMsg}>{errs.categoryId}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Description</label>
          <textarea
            rows={3}
            className={input}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the condition, features, and what's included…"
          />
          {errs.description && <p className={errMsg}>{errs.description}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className={label}>Image URL (optional)</label>
          <input
            className={input}
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://example.com/bike.jpg"
          />
          {form.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.image}
              alt="Preview"
              className="mt-2 h-24 w-32 object-cover rounded-xl border border-black/5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.3";
              }}
            />
          )}
        </div>

        <div>
          <label className={label}>Rental price / day ($)</label>
          <input
            className={input}
            type="number"
            min="0"
            step="0.01"
            value={form.rentalPrice}
            onChange={(e) => set("rentalPrice", e.target.value)}
            placeholder="25.00"
          />
          {errs.rentalPrice && <p className={errMsg}>{errs.rentalPrice}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label}>Total stock</label>
            <input
              className={input}
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              placeholder="5"
            />
            {errs.stock && <p className={errMsg}>{errs.stock}</p>}
          </div>
          <div>
            <label className={label}>Available qty</label>
            <input
              className={input}
              type="number"
              min="0"
              value={form.availableQty}
              onChange={(e) => set("availableQty", e.target.value)}
              placeholder="5"
            />
            {errs.availableQty && <p className={errMsg}>{errs.availableQty}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/70 text-black text-sm font-bold disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {mode === "create" ? "List Gear" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/provider")}
          className="px-4 py-3 rounded-xl bg-black/5 text-black/60 text-sm font-semibold hover:bg-black/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
