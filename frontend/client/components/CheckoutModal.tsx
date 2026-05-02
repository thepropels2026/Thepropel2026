"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Zap, Mail, Loader2, 
  ChevronRight, Lock, CreditCard, Sparkles 
} from 'lucide-react';

interface ToolCard {
  id: string;
  title: string;
  price: number;
  discount_price?: number;
  image_url: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: ToolCard;
}

/**
 * CheckoutModal: A premium, dark-themed checkout overlay.
 * Now redirects to a dedicated white checkout page for focused payment.
 */
const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, tool }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Autofill email from profile if available
  useEffect(() => {
    if (isOpen) {
      const savedData = localStorage.getItem('userProfile');
      if (savedData) {
        try {
          const profile = JSON.parse(savedData);
          if (profile.identifier && profile.identifier.includes('@')) {
            setEmail(profile.identifier);
          }
        } catch (e) {
          console.error('Failed to parse userProfile', e);
        }
      }
    }
  }, [isOpen]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amount = tool.discount_price || tool.price;
      
      // 1. Call backend to create Order and get payment_session_id
      const response = await fetch('http://localhost:8000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_id: tool.id,
          user_email: email,
          amount: amount
        }),
      });

      if (!response.ok) throw new Error('Failed to initiate checkout');
      
      const { payment_session_id, order_id } = await response.json();

      // 2. Redirect to the dedicated white checkout page
      window.location.href = `/checkout/${order_id}?session=${payment_session_id}`;

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-[#0a0a0f] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(6,182,212,0.15)]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-10 md:p-12">
              {/* Tool Summary */}
              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-white/5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                  <img src={tool.image_url} alt={tool.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-montserrat text-white mb-2">{tool.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-cyan-400">₹{tool.discount_price || tool.price}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 line-through">₹{tool.price}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/80 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Delivery Email
                  </label>
                  <div className="relative group">
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-all group-hover:bg-white/[0.08]"
                    />
                    <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500/20 group-hover:text-cyan-500 transition-colors" />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="relative group w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-black font-black py-6 rounded-[2rem] transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_20px_50px_-10px_rgba(6,182,212,0.3)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-6 h-6 fill-current" />
                        <span className="text-lg tracking-tight uppercase">PROCEED TO SECURE PAYMENT</span>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-40">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">PCI DSS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">SECURE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
