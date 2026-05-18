"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Zap, Mail, Loader2, 
  ChevronRight, Lock, CreditCard, Sparkles 
} from 'lucide-react';

import { API_BASE_URL } from '../lib/api';
import { useAuth } from './AuthContext';

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
  const { isRegistered, user, setLoginModalOpen, setRegisterModalOpen } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Autofill email from profile if available or user is logged in
  useEffect(() => {
    if (isOpen) {
      if (isRegistered && user?.email) {
        setEmail(user.email);
        setIsVerified(false); // Force OTP verification during checkout
      } else {
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
    }
  }, [isOpen, isRegistered, user]);

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
            <style dangerouslySetInnerHTML={{ __html: `
              #checkout-email-input, #checkout-otp-input {
                color: black !important;
                -webkit-text-fill-color: black !important;
              }
              #checkout-email-input::placeholder, #checkout-otp-input::placeholder {
                color: #94a3b8 !important;
                -webkit-text-fill-color: #94a3b8 !important;
              }
            `}} />

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

              {!isRegistered ? (
                <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto text-orange-600 border border-orange-200 shadow-sm">
                    <Lock className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Authentication Required</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                      To complete secure checkout on The Propels, you must have an active identity. Credentials will be used to dispatch the tools.
                    </p>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => {
                        onClose();
                        setLoginModalOpen(true);
                      }}
                      className="flex-1 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        onClose();
                        setRegisterModalOpen(true);
                      }}
                      className="flex-[1.5] py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
                    >
                      Create Propels ID
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Delivery Email
                    </label>
                    <div className="flex gap-3">
                      <div className="relative group flex-grow">
                        <input
                          id="checkout-email-input"
                          required
                          type="email"
                          disabled={isOtpSent || isVerified}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 placeholder-slate-300 focus:outline-none focus:border-cyan-500 transition-all disabled:opacity-80 font-semibold"
                        />
                      </div>
                      {!isVerified ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={!email || loading || isOtpSent}
                          className="px-6 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:bg-slate-300 transition-all"
                        >
                          {loading && !isOtpSent ? <Loader2 className="w-4 h-4 animate-spin" /> : isOtpSent ? 'Sent' : 'Verify'}
                        </button>
                      ) : (
                        <span className="px-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm">
                          <ShieldCheck className="w-4 h-4" /> Verified ID
                        </span>
                      )}
                    </div>
                  </div>

                  {isOtpSent && !isVerified && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> Verification Code
                      </label>
                      <div className="flex gap-3">
                        <input
                          id="checkout-otp-input"
                          type="text"
                          required
                          placeholder="6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-center tracking-[0.5em] font-bold focus:outline-none focus:border-cyan-500 transition-all text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={otp.length < 6 || isVerifying}
                          className="px-8 rounded-2xl bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="relative group w-full bg-black hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-black py-6 rounded-[2rem] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl overflow-hidden"
                  >
                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <Zap className="w-5 h-5 fill-cyan-400 text-cyan-400" />
                          <span className="text-sm tracking-widest uppercase">Proceed to Secure Checkout</span>
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between opacity-40">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-600" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">SSL Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-600" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">PCI DSS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-cyan-600" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-800">CASHFREE</span>
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
