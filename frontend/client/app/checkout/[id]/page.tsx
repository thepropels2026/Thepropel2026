"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Loader2, ShieldCheck, Lock, CreditCard, 
  ArrowRight, Zap, CheckCircle, Sparkles,
  ShieldAlert, Fingerprint, RefreshCcw,
  Wallet, QrCode, Building as Building2, Check, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { API_BASE_URL } from '../../../lib/api';

type PaymentTab = 'upi' | 'card' | 'netbanking' | 'wallet';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<PaymentTab>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // UPI Form State
  const [upiId, setUpiId] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(15);
  
  // Netbanking Form State
  const [selectedBank, setSelectedBank] = useState('');
  
  // Wallet Form State
  const [selectedWallet, setSelectedWallet] = useState('');

  // Terms & Conditions Acceptance state
  const [termsAccepted, setTermsAccepted] = useState(false);


  // 3D Secure Verification Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setError('Order session identifier not found.');
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*, tool_id(*))')
          .eq('cashfree_order_id', orderId)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          setError('Handshake failed. Order not found in database.');
          setLoading(false);
          return;
        }
        setOrder(data);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Error fetching order details.');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  // QR Countdown Effect
  useEffect(() => {
    if (showQr && qrCountdown > 0) {
      const timer = setTimeout(() => setQrCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showQr && qrCountdown === 0) {
      handleDirectPaymentSimulation("UPI Scan and Pay");
    }
  }, [showQr, qrCountdown]);

  const handleDirectPaymentSimulation = async (method: string) => {
    setIsProcessing(true);
    setProcessingStep('Establishing secure link to gateway...');
    
    await new Promise(r => setTimeout(r, 1200));
    setProcessingStep(`Authorizing transaction via ${method}...`);
    
    await new Promise(r => setTimeout(r, 1200));
    setProcessingStep('Updating secure vault records...');

    try {
      const res = await fetch(`${API_BASE_URL}/api/checkout/simulate-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      });
      if (!res.ok) throw new Error('Simulation endpoint returned failure');
      
      setProcessingStep('Handshake completed successfully!');
      await new Promise(r => setTimeout(r, 800));
      setPaymentSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Payment authorization completed, but verification failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) return;
    setShowOtpModal(true);
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) return;
    setIsOtpVerifying(true);
    await new Promise(r => setTimeout(r, 1500));
    setShowOtpModal(false);
    setIsOtpVerifying(false);
    await handleDirectPaymentSimulation("Credit/Debit Card");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading Payment Terminal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-6">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Handshake Error</h3>
        <p className="text-slate-400 text-sm max-w-md text-center mb-8">{error}</p>
        <button onClick={() => router.push('/tools')} className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const subtotal = order.order_items.reduce((sum: number, item: any) => sum + Number(item.amount), 0);
  const platformFee = Math.round(subtotal * 0.10 * 100) / 100;
  const gst = Math.round((subtotal + platformFee) * 0.18 * 100) / 100;
  const grandTotal = order.total_amount;

  return (
    <div className="min-h-screen bg-[#020203] text-white flex flex-col justify-start items-center p-4 md:p-8 relative overflow-hidden font-inter">
      {/* Background Aesthetics */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      </div>

      {/* Main Terminal Frame */}
      <div className="max-w-6xl w-full relative z-10 pt-20 pb-16 flex flex-col gap-8">
        
        {/* Terminal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] mb-2 text-white/50">
              <Lock className="w-3 h-3 text-cyan-400" /> Secure Terminal Session
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight italic">
              PROPEL <span className="text-cyan-500">PAYMENT</span> TERMINAL
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end text-slate-400 text-xs">
            <p className="font-semibold text-white">Order ID: <span className="font-mono text-cyan-500">{orderId}</span></p>
            <p className="text-[10px] uppercase tracking-wider font-bold">Delivery to: {order.user_email}</p>
          </div>
        </div>

        {paymentSuccess ? (
          /* Payment Success State */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl mx-auto bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-2xl"
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
              <div className="border-t border-white/10 pt-4 flex justify-between text-sm text-slate-200 font-bold">
                <span>Consolidated Receipt Details:</span>
                <a href={`/receipt/${orderId}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                  View Receipt Receipt <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <button 
              onClick={() => router.push('/tools')} 
              className="w-full py-4 bg-white text-black hover:bg-slate-200 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
            >
              Continue to Marketplace
            </button>
          </motion.div>
        ) : isProcessing ? (
          /* Processing Screen */
          <div className="w-full max-w-md mx-auto py-24 text-center">
            <div className="relative mb-10 inline-block">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 border-t-2 border-r-2 border-cyan-500 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Fingerprint className="w-10 h-10 text-white/20 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Securing Handshake</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">{processingStep}</p>
          </div>
        ) : (
          /* Dual-Pane Terminal Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Pane: Payment Form */}
            <div className="lg:col-span-7 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
              
              {/* Tab Navigation */}
              <div className="grid grid-cols-4 gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
                {[
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'upi', label: 'UPI', icon: QrCode },
                  { id: 'netbanking', label: 'Bank', icon: Building2 },
                  { id: 'wallet', label: 'Wallet', icon: Wallet }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as PaymentTab);
                      setShowQr(false);
                    }}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-cyan-500 text-black shadow-md' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Universal Terms & Conditions Consent */}
              <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <input
                  type="checkbox"
                  id="checkout-terms-checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/10 text-cyan-500 focus:ring-cyan-500 cursor-pointer accent-cyan-500"
                />
                <label htmlFor="checkout-terms-checkbox" className="text-[10px] text-slate-400 leading-normal font-bold uppercase tracking-wide cursor-pointer select-none">
                  I agree to the <a href="/terms" target="_blank" rel="noreferrer" className="text-cyan-400 font-extrabold hover:underline">Terms & Conditions</a> and <a href="/privacy" target="_blank" rel="noreferrer" className="text-cyan-400 font-extrabold hover:underline">Privacy Policy</a>. Credentials will be sent to {order.user_email}.
                </label>
              </div>


              {/* CARD PAYMENT FORM */}
              {activeTab === 'card' && (
                <form onSubmit={handleCardPayClick} className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Card Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                      className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-semibold tracking-wide outline-none focus:border-cyan-500 focus:bg-cyan-500/5 transition-all text-white placeholder-slate-700" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="SUSHANT SHARMA" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-semibold tracking-wide outline-none focus:border-cyan-500 focus:bg-cyan-500/5 transition-all text-white placeholder-slate-700" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                      <input 
                        type="text" 
                        required
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value.replace(/\D/g, '').replace(/(.{2})/, '$1/').slice(0, 5))}
                        className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-semibold tracking-wide outline-none focus:border-cyan-500 focus:bg-cyan-500/5 transition-all text-white placeholder-slate-700 text-center" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">CVV Code</label>
                      <input 
                        type="password" 
                        required
                        maxLength={3}
                        placeholder="•••" 
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-semibold tracking-wide outline-none focus:border-cyan-500 focus:bg-cyan-500/5 transition-all text-white placeholder-slate-700 text-center" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!termsAccepted}
                    className="w-full py-4 mt-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.25)] disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

              )}

              {/* UPI PAYMENT FORM */}
              {activeTab === 'upi' && (
                <div className="space-y-6 animate-fade-in">
                  {!showQr ? (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Enter UPI ID</label>
                        <input 
                          type="text" 
                          placeholder="username@upi"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl py-3.5 px-4 text-sm font-semibold tracking-wide outline-none focus:border-cyan-500 focus:bg-cyan-500/5 transition-all text-white placeholder-slate-700" 
                        />
                      </div>
                      <button 
                        onClick={() => handleDirectPaymentSimulation(`UPI ID (${upiId})`)}
                        disabled={!upiId.includes('@') || !termsAccepted}
                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.25)] disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        <span>Verify & Pay ₹{grandTotal.toLocaleString('en-IN')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">OR GENERATE QR CODE</span>
                        <div className="flex-grow border-t border-white/10"></div>
                      </div>

                      <button 
                        onClick={() => { setShowQr(true); setQrCountdown(15); }}
                        disabled={!termsAccepted}
                        className="w-full py-4 bg-white/5 hover:bg-white/10 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-800/20 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <QrCode className="w-4 h-4 text-cyan-400" />
                        <span>Show QR Code Scanner</span>
                      </button>

                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-6 bg-[#0a0a0c] border border-white/5 rounded-3xl space-y-4 text-center">
                      <div className="bg-white p-4 rounded-2xl flex items-center justify-center">
                        {/* Interactive Premium Placeholder Mock QR Code */}
                        <div className="w-40 h-40 border-4 border-slate-900 bg-slate-100 flex flex-col items-center justify-center p-2 relative">
                          <QrCode className="w-32 h-32 text-slate-950" />
                          <div className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-ping" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Scan and Pay with UPI App</h4>
                        <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-widest">Awaiting scanner detection...</p>
                        <p className="text-cyan-400 text-xs font-black uppercase tracking-[0.2em] mt-3">Simulated check in {qrCountdown}s</p>
                      </div>
                      <button 
                        onClick={() => setShowQr(false)}
                        className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
                      >
                        Cancel QR Scanner
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* NETBANKING PAYMENT FORM */}
              {activeTab === 'netbanking' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Bank</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'sbi', name: 'State Bank of India' },
                        { id: 'hdfc', name: 'HDFC Bank' },
                        { id: 'icici', name: 'ICICI Bank' },
                        { id: 'axis', name: 'Axis Bank' }
                      ].map(bank => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-start gap-3 transition-all text-left ${
                            selectedBank === bank.id 
                              ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400' 
                              : 'border-white/10 bg-[#0a0a0c] text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedBank === bank.id ? 'border-cyan-400 bg-cyan-400/20' : 'border-slate-600'}`}>
                            {selectedBank === bank.id && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />}
                          </div>
                          <span>{bank.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDirectPaymentSimulation(`Netbanking (${selectedBank})`)}
                    disabled={!selectedBank || !termsAccepted}
                    className="w-full py-4 mt-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.25)] disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <span>Authorize Netbanking Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              )}

              {/* WALLETS PAYMENT FORM */}
              {activeTab === 'wallet' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Wallet</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'paytm', name: 'Paytm' },
                        { id: 'phonepe', name: 'PhonePe' },
                        { id: 'amazonpay', name: 'Amazon Pay' }
                      ].map(wallet => (
                        <button
                          key={wallet.id}
                          type="button"
                          onClick={() => setSelectedWallet(wallet.id)}
                          className={`p-4 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-3 transition-all ${
                            selectedWallet === wallet.id 
                              ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400' 
                              : 'border-white/10 bg-[#0a0a0c] text-slate-300 hover:border-white/20'
                          }`}
                        >
                          <span className="text-sm font-black">{wallet.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDirectPaymentSimulation(`Wallet (${selectedWallet})`)}
                    disabled={!selectedWallet || !termsAccepted}
                    className="w-full py-4 mt-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(6,182,212,0.25)] disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Wallet Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              )}

            </div>

            {/* Right Pane: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Order Items Summary */}
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-2xl shadow-2xl space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" /> Order Summary
                  </h3>
                </div>

                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 items-center bg-white/5 border border-white/5 rounded-2xl p-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/10 flex-shrink-0">
                        <img src={item.tool_id?.image_url} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-slate-200">{item.tool_id?.title}</h4>
                        <span className="text-[10px] text-cyan-400 font-black uppercase tracking-wider">₹{Number(item.amount).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Billing details table */}
                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Tools Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Platform Fee (10%)</span>
                    <span>₹{platformFee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-dashed border-white/10 pt-4 flex justify-between items-end">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-300">Total Paid</span>
                    <span className="text-2xl font-black text-cyan-400">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

              </div>

              {/* Guarantees Box */}
              <div className="bg-[#050508] border border-cyan-500/10 rounded-3xl p-5 space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Security handshake active</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Your transaction is encrypted using 256-bit SSL protocols. Vouchers will be dispatched to your verified delivery email immediately after payment verification.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* 3D Secure / Bank OTP Simulation Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOtpModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 overflow-hidden font-sans"
            >
              {/* Bank Simulator Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-none">Propel Trust Bank</h3>
                    <span className="text-[9px] font-black text-cyan-600 uppercase tracking-widest mt-1 block">3D Secure v2</span>
                  </div>
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-1 rounded">
                  TEST PORTAL
                </div>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs text-slate-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Merchant Name:</span>
                    <strong className="text-slate-800">THE PROPELS</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction Amount:</span>
                    <strong className="text-slate-800">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Card ending:</span>
                    <strong className="text-slate-800">*{cardNumber.slice(-4)}</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Enter 3D-Secure One Time Password (OTP)</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    placeholder="Enter 123456" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-center text-sm font-extrabold tracking-widest text-slate-900 outline-none focus:border-cyan-500 focus:bg-white transition-all placeholder:text-slate-300"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1.5 leading-relaxed">
                    <AlertCircle className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                    Enter <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">123456</span> to simulate a successful payment transaction.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowOtpModal(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isOtpVerifying || otpCode.length < 4}
                    className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-slate-200 disabled:text-slate-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isOtpVerifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Submit OTP</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
