"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Zap, Mail, Loader2, 
  ChevronRight, Lock, CreditCard, Sparkles 
} from 'lucide-react';

import { API_BASE_URL } from '../lib/api';

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
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to send verification code');
      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;
    setIsVerifying(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      if (!res.ok) throw new Error('Invalid verification code');
      setIsVerified(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return;
    setLoading(true);
    setError('');

    try {
      const amount = tool.discount_price || tool.price;
      
      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_ids: [tool.id],
          user_email: email,
          amount: amount
        }),
      });

      if (!response.ok) throw new Error('Failed to initiate checkout');
      
      const { payment_session_id, order_id } = await response.json();
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.2)]"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-black transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-10 md:p-12">
              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                  <img src={tool.image_url} alt={tool.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-inter text-slate-900 mb-2">{tool.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-cyan-600">₹{tool.discount_price || tool.price}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 line-through">₹{tool.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Delivery Email
                  </label>
                  <div className="flex gap-3">
                    <div className="relative group flex-grow">
                      <input
                        required
                        type="email"
                        disabled={isOtpSent || isVerified}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        style={{ color: 'black' }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 placeholder-slate-300 focus:outline-none focus:border-cyan-500 transition-all disabled:opacity-50"
                      />
                    </div>
                    {!isVerified && !isOtpSent && (
                      <button
                        onClick={handleSendOtp}
                        disabled={loading || !email}
                        className="px-6 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send OTP'}
                      </button>
                    )}
                  </div>
                </div>

                {isOtpSent && !isVerified && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600">Enter Verification Code</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="000000"
                        style={{ color: 'black' }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 font-mono text-center tracking-[0.5em] focus:outline-none focus:border-cyan-500 transition-all"
                      />
                      <button
                        onClick={handleVerifyOtp}
                        disabled={isVerifying || otp.length < 6}
                        className="px-6 rounded-2xl bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all disabled:opacity-50"
                      >
                        {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                      </button>
                    </div>
                    <button 
                      onClick={() => { setIsOtpSent(false); setOtp(''); }}
                      className="text-[9px] font-bold text-slate-400 hover:text-black transition-colors uppercase tracking-widest underline underline-offset-4"
                    >
                      Change Email
                    </button>
                  </motion.div>
                )}

                {isVerified && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Email Verified Successfully</span>
                  </motion.div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || !isVerified}
                  className="relative group w-full bg-black hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-black py-6 rounded-[2rem] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl overflow-hidden"
                >
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-cyan-400 text-cyan-400" />
                        <span className="text-sm tracking-widest uppercase">Proceed to Checkout</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>

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
