import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white border border-black/5 rounded-3xl p-8 sm:p-10 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-black tracking-tight">Payment Successful</h1>
        <p className="text-sm text-black/60">
          Thank you! Your payment was completed successfully. Your rental order status will update shortly.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/customer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-extrabold bg-primary hover:bg-primary/70 text-white transition-all group"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
