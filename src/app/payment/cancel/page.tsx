import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900/80 border border-slate-800 rounded-3xl p-8 text-center text-slate-200">
        <h1 className="text-2xl font-extrabold text-rose-400">Payment Cancelled</h1>
        <p className="mt-3 text-sm text-slate-300">Your payment was canceled or failed. No charges were made. You can retry from your dashboard.</p>
        <div className="mt-6">
          <Link href="/dashboard/customer" className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-xl font-semibold">Return to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
