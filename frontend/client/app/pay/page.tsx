"use client";

import { useState } from "react";
import Script from "next/script";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch the payment session from our backend
      const res = await fetch("http://localhost:8000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_amount: 199.0, // Example amount
          customer_id: "cust_12345",
          customer_email: "test@example.com",
          customer_phone: "9999999999",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const data = await res.json();
      const paymentSessionId = data.payment_session_id;

      if (!paymentSessionId) {
        throw new Error("No payment session returned");
      }

      // 2. Initialize Cashfree instance and invoke checkout
      // @ts-ignore - Cashfree is loaded via external script
      const cashfree = window.Cashfree({
        mode: "sandbox", // Use "production" for live
      });

      cashfree.checkout({
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self", // Redirects in the same tab
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during checkout");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Load Cashfree SDK */}
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />

      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Secure Checkout</h1>
          <p className="text-sm text-slate-500 mt-2">Complete your purchase securely via Cashfree</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600 font-medium">Item Description</span>
            <span className="text-slate-900 font-bold">Premium Subscription</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <span className="text-slate-600 font-medium">Total Amount</span>
            <span className="text-2xl font-black text-slate-900">₹199.00</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl font-medium border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full h-14 bg-black text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </button>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Secured by Cashfree Payments
        </div>
      </div>
    </div>
  );
}
