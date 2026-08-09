import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://gearup-sooty-one.vercel.app/api";

async function fetchOrders(cookieHeader: string) {
  const res = await fetch(`${API_BASE}/rentals`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });
  if (!res.ok) return { success: false, data: [] };
  return await res.json();
}

export default async function CustomerDashboard() {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("token");
  const cookieHeader = tokenCookie ? `token=${tokenCookie.value}` : "";

  const ordersRes = await fetchOrders(cookieHeader);
  const orders = ordersRes?.data || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Customer Dashboard</h1>
          <p className="text-xs text-slate-400">Your rental orders and payment actions</p>
        </div>
        <div>
          <Link href="/" className="text-xs text-emerald-400 font-semibold">Return to shop</Link>
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">No orders found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white">{order.gearItem?.name || order.gearItemId}</div>
                  <div className="text-xs text-slate-400">Order ID: {order.id} • {order.startDate?.slice(0,10)} → {order.endDate?.slice(0,10)}</div>
                  <div className="text-xs text-slate-400 mt-1">Status: <span className="font-semibold text-emerald-300">{order.status}</span></div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">${order.totalAmount?.toFixed ? order.totalAmount.toFixed(2) : order.totalAmount}</div>
                    <div className="text-xs text-slate-400">Qty: {order.quantity}</div>
                  </div>

                  {/* Payment/Action Button will POST to /api/payments */}
                  <div>
                    {/* Use a client-side component loaded via dynamic import to avoid server/client mixing */}
                    <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_ORDER = ${JSON.stringify(order)}` }} />
                    <a
                      href="#"
                      data-order-id={order.id}
                      data-order-status={order.status}
                      className="pay-button inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-900 text-xs font-bold"
                    >
                      {order.status === 'CONFIRMED' ? 'Pay Now' : order.status === 'PLACED' ? 'Awaiting Confirmation' : 'View Details'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          async function handlePay(e){
            e.preventDefault();
            const el = e.currentTarget;
            const id = el.getAttribute('data-order-id');
            const status = el.getAttribute('data-order-status');
            if(status !== 'CONFIRMED'){
              alert('Order must be CONFIRMED before payment.');
              return;
            }
            el.setAttribute('disabled','true');
            el.textContent = 'Creating checkout...';
            try{
              const res = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rentalOrderId: id, method: 'STRIPE' }) });
              const json = await res.json();
              if(!res.ok){
                alert(json.message || 'Failed to create payment');
                el.removeAttribute('disabled');
                el.textContent = 'Pay Now';
                return;
              }
              const sessionUrl = json?.data?.sessionUrl || json?.data?.sessionUrl;
              if(sessionUrl){
                window.location.href = sessionUrl;
              } else {
                alert('Payment session not returned');
                el.removeAttribute('disabled');
                el.textContent = 'Pay Now';
              }
            }catch(err){
              alert('Network error creating payment');
              el.removeAttribute('disabled');
              el.textContent = 'Pay Now';
            }
          }

          document.addEventListener('click', function(ev){
            const target = ev.target;
            const btn = target.closest && target.closest('.pay-button');
            if(btn){ handlePay(ev); }
          });
        })();
      `}} />
    </div>
  );
}
