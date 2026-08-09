import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-800">
        <h1 className="text-2xl font-extrabold text-emerald-600">Payment Successful</h1>
        <p className="mt-3 text-sm text-slate-700">Thank you! Your payment was completed successfully. Your rental order status will update shortly.</p>
        <div className="mt-6">
          <Link href="/dashboard/customer" className="px-4 py-2 bg-emerald-500 text-slate-900 rounded-xl font-semibold">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
