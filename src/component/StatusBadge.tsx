import { RentalStatus } from "@/types/gear";

const STYLES: Record<string, string> = {
  PLACED: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  CONFIRMED: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  PAID: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  PICKED_UP: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  RETURNED: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  CANCELLED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${
        STYLES[status] || "bg-slate-500/15 text-slate-300 border-slate-500/30"
      }`}
    >
      {label}
    </span>
  );
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return <StatusBadge status={status} />;
}
