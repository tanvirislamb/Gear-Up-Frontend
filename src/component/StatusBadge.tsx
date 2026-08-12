import { RentalStatus } from "@/types/gear"

const STYLES: Record<string, string> = {
  PLACED: "bg-amber-50 text-amber-600 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-600 border-blue-200",
  PAID: "bg-purple-50 text-purple-600 border-purple-200",
  PICKED_UP: "bg-primary text-black border-black/5",
  RETURNED: "bg-black/5 text-black/60 border-black/5",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  FAILED: "bg-rose-50 text-rose-600 border-rose-200",
}

export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ")
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${STYLES[status] || "bg-black/5 text-black/60 border-black/5"
        }`}
    >
      {label}
    </span>
  )
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return <StatusBadge status={status} />
}
