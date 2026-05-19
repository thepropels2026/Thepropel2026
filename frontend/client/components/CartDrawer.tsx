"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingCart, Trash2, ArrowRight, 
  Lock, ShieldCheck, Zap, Loader2, Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../lib/api';
import { useAuth } from './AuthContext';

export default function CartDrawer() {
  const { items, removeFromCart, totalAmount, itemCount, isCartOpen, setIsCartOpen } = useCart();
  const { isRegistered, user, setLoginModalOpen, setRegisterModalOpen } = useAuth();
  const onClose = () => setIsCartOpen(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Sync user email when logged in
  useEffect(() => {
    if (isCartOpen) {
      if (isRegistered && user?.email) {
        setEmail(user.email);
        setIsVerified(true);
      } else {
        setEmail('');
        setIsVerified(false);
        setIsOtpSent(false);
        setOtp('');
      }
    }
  }, [isCartOpen, isRegistered, user]);

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
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to send verification code');
      if (data.dev_otp) {
        alert(`[DEVELOPER MODE] Your OTP is: ${data.dev_otp}\n\n(Configure SMTP or Twilio API keys in backend to receive this via real email/SMS)`);
      }
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

  const handleCheckout = async () => {
    if (!email) {
      setError('Please enter your email for tool delivery.');
      return;
    }
    if (!isVerified) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool_ids: items.map(i => i.id),
          user_email: email,
          amount: totalAmount
        }),
      });

      if (!response.ok) throw new Error('Failed to initiate checkout');
      
      const { payment_session_id, order_id } = await response.json();
      
      // Redirect to checkout page
      window.location.href = `/checkout/${order_id}?session=${payment_session_id}`;

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col font-inter"
          >
            <style dangerouslySetInnerHTML={{ __html: `
              #drawer-email-input, #drawer-otp-input {
                color: black !important;
                -webkit-text-fill-color: black !important;
              }
              #drawer-email-input::placeholder, #drawer-otp-input::placeholder {
                color: #94a3b8 !important;
                -webkit-text-fill-color: #94a3b8 !important;
              }
            `}} />
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{itemCount} Tools Selected</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingCart className="w-16 h-16 mb-4 text-slate-200" />
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.id} 
                    className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      <p className="text-cyan-600 text-xs font-bold">₹{item.discount_price || item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-4">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</span>
                     <span className="text-3xl font-black text-slate-900">₹{totalAmount}</span>
                  </div>
                  
                  {!isRegistered ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600">
                        <Lock className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">Authentication Required</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          To purchase premium tools on The Propels, you must have an active identity. Please sign in or create an ID first.
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => {
                            onClose();
                            setLoginModalOpen(true);
                          }}
                          className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                          Sign In
                        </button>
                        <button 
                          onClick={() => {
                            onClose();
                            setRegisterModalOpen(true);
                          }}
                          className="flex-grow py-3 bg-black text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
                        >
                          Create Propels ID
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Email Input */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-cyan-500" /> Delivery Email
                        </label>
                        <div className="flex gap-2">
                          <input 
                            id="drawer-email-input"
                            type="email"
                            disabled={true}
                            placeholder="founder@startup.com"
                            value={email}
                            style={{ color: 'black' }}
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-black transition-all disabled:opacity-80 font-semibold"
                          />
                          <span className="px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified ID
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}

                <div className="flex items-start gap-3 py-2">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-black focus:ring-black"
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-slate-500 leading-relaxed font-medium">
                    I agree to the <a href="/terms" className="text-cyan-600 font-bold hover:underline">Terms & Conditions</a> and <a href="/privacy" className="text-cyan-600 font-bold hover:underline">Privacy Policy</a>. I understand that the tool credentials will be sent to the verified email address above.
                  </label>
                </div>

                {isRegistered && (
                  <button 
                    onClick={handleCheckout}
                    disabled={loading || !termsAccepted || (!isVerified && items.length > 0)}
                    className="w-full bg-black hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span className="text-sm uppercase tracking-widest">Checkout Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}

                <div className="flex items-center justify-center gap-6 opacity-30">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-900" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Secure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-900" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Encrypted</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
