"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../../lib/api';
import { supabase } from '../../../lib/supabase';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId) {
        setError('No Order ID provided in the URL.');
        setLoading(false);
        return;
      }

      try {
        // 1. Trigger backend verification (which also acts as fulfillment for now)
        const res = await fetch(`${API_BASE_URL}/api/checkout/simulate-success`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_id: orderId }),
        });
        
        if (!res.ok) {
          throw new Error('Backend failed to verify or fulfill the order.');
        }

        // 2. Fetch order details from Supabase to show the success UI
        const { data, error: dbError } = await supabase
          .from('orders')
          .select('*, order_items(*, tool_id(*))')
          .eq('cashfree_order_id', orderId)
          .maybeSingle();

        if (dbError) throw dbError;
        if (!data) throw new Error('Order not found in database.');

        setOrder(data);
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'An error occurred while verifying the payment.');
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Verifying Payment Securely...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-6">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Payment Verification Failed</h3>
        <p className="text-slate-400 text-sm max-w-md text-center mb-8">{error}</p>
        <button onClick={() => router.push('/tools')} className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const grandTotal = order?.total_amount || 0;

  return (
    <div className="min-h-screen bg-[#020203] text-white flex flex-col justify-start items-center p-4 md:p-8 relative overflow-hidden font-inter">
      {/* Background Aesthetics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      </div>

      <div className="max-w-xl w-full relative z-10 pt-20 pb-16 flex flex-col gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black italic uppercase text-white mb-2">Payment Confirmed</h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
            Your transaction of <span className="text-cyan-400 font-extrabold">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span> was successfully authorized. We have dispatched tool credentials and access links to <span className="text-white font-semibold">{order.user_email}</span>.
          </p>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left mb-8 space-y-4">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Receipt Number:</span>
              <span className="font-mono text-white font-bold">{orderId}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Status:</span>
              <span className="text-emerald-400 font-black uppercase tracking-wider">SUCCESS / PAID</span>
            </div>
          </div>

          <button 
            onClick={() => router.push('/tools')} 
            className="w-full py-4 bg-white text-black hover:bg-slate-200 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
          >
            Continue to Marketplace
          </button>
        </motion.div>
      </div>
    </div>
  );
}
