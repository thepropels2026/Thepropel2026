"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle, Download, ArrowLeft, 
  Package, DollarSign, Calendar, Mail,
  ExternalLink, Sparkles, Printer
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const { clearCart } = useCart();
  
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) return;
      
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('cashfree_order_id', orderId)
          .single();
          
        if (orderError) throw orderError;
        setOrder(orderData);
        
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*, tool_id(*)')
          .eq('order_id', orderData.id);
          
        if (itemsError) throw itemsError;
        setItems(itemsData);
        
        // Clear cart after successful payment verification
        if (orderData.status === 'paid') {
          clearCart();
        }
      } catch (err) {
        console.error('Error fetching receipt:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ArrowLeft className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-slate-500 mb-8">We couldn't find any details for this order ID.</p>
        <button onClick={() => router.push('/tools')} className="bg-black text-white px-8 py-3 rounded-xl font-bold">Return to Tools</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-inter">
      <div className="max-w-3xl mx-auto px-6">
        {/* Success Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 italic uppercase">Payment Successful</h1>
          <p className="text-slate-500 font-medium">Your tools are ready for deployment.</p>
        </motion.div>

        {/* Receipt Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl relative"
        >
          {/* Top Decoration */}
          <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
          
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-slate-100 pb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Sparkles className="w-3 h-3" /> Official Receipt
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="text-lg font-black text-slate-900 font-mono uppercase">{order.cashfree_order_id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="text-sm font-bold text-slate-700">{new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                </div>
              </div>
              <div className="md:text-right space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sent To</p>
                  <p className="text-sm font-bold text-slate-900">{order.user_email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{order.total_amount}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-6 mb-12">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Purchased Assets</h3>
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-cyan-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.tool_id?.title || 'Startup Tool'}</h4>
                      <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">Active License</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
                      <p className="font-bold text-slate-900">₹{item.amount}</p>
                    </div>
                    <a 
                      href={item.assigned_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                      Access <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Print/Download Actions */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-slate-100">
              <button 
                onClick={() => window.print()}
                className="flex-grow flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Printer className="w-4 h-4" /> Print PDF
              </button>
              <button 
                onClick={() => router.push('/tools')}
                className="flex-grow flex items-center justify-center gap-2 px-8 py-4 bg-black hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Return to Toolkit <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
        
        <p className="text-center mt-8 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          A copy of this receipt has been sent to your email.
        </p>
      </div>
    </div>
  );
}
