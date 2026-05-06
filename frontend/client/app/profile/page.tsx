"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin, Calendar, Star, Briefcase, GraduationCap,
  Bell, Settings, Zap, ChevronRight, ShoppingBag,
  User, Package, BarChart3, ArrowRight, Check,
  Wrench, TrendingUp, Award, BookOpen, Clock, ExternalLink
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Profile() {
  const { isRegistered, user, logout } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'plan'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activePlan, setActivePlan] = useState<any>(null);

  useEffect(() => {
    if (!isRegistered) { router.push('/'); return; }
    const saved = localStorage.getItem('userProfile');
    if (saved) setProfileData(JSON.parse(saved));
    else if (user) setProfileData(user);
  }, [isRegistered, router, user]);

  useEffect(() => {
    if (!profileData?.email && !profileData?.identifier) return;
    const email = profileData.email || profileData.identifier;

    async function fetchData() {
      setLoadingOrders(true);
      try {
        const { data: txns } = await supabase
          .from('transactions')
          .select('*, tools_cards(*)')
          .eq('user_email', email)
          .order('created_at', { ascending: false });
        setOrders(txns || []);

        const { data: plan } = await supabase
          .from('user_plans')
          .select('*, pricing_plans(*)')
          .eq('user_email', email)
          .maybeSingle();
        setActivePlan(plan || null);
      } catch { /* silent */ } finally {
        setLoadingOrders(false);
      }
    }
    fetchData();
  }, [profileData]);

  if (!profileData) return (
    <div className="min-h-screen bg-[#0c0c0e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
    </div>
  );

  const displayName = `${profileData.firstName || 'Founder'} ${profileData.lastName || ''}`.trim();
  const email = profileData.email || profileData.identifier || '';
  const avatar = profileData.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}&backgroundColor=1a1a1a&textColor=ffffff`;
  const completedOrders = orders.filter(o => o.status === 'completed');

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tools', label: 'My Tools', icon: Wrench },
    { id: 'plan', label: 'My Plan', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c0e] font-inter text-white pt-20 pb-20">

      {/* Sub-nav */}
      <div className="sticky top-[64px] z-40 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-12">
          <div className="flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 h-12 text-xs font-bold uppercase tracking-widest transition-colors duration-150 border-b-2 ${
                  activeTab === tab.id
                    ? 'text-white border-[#FF5F00]'
                    : 'text-white/35 border-transparent hover:text-white/60'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={logout}
            className="text-[10px] font-bold uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8">

        {/* Profile Hero Card */}
        <div className="relative bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden mb-8">
          {/* Top band */}
          <div className="h-28 bg-gradient-to-r from-[#1a0f00] via-[#0a0a0e] to-[#000f0a]" />
          <div className="px-8 pb-8 -mt-12 flex flex-col sm:flex-row sm:items-end gap-6">
            <div className="w-24 h-24 rounded-lg border-2 border-white/20 overflow-hidden bg-[#111] shrink-0">
              <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 sm:mb-2">
              <h1 className="font-montserrat font-black text-2xl text-white tracking-tight">{displayName}</h1>
              <p className="text-white/40 text-sm mt-1">{email}</p>
              {profileData.qualification && (
                <p className="text-white/30 text-xs mt-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3" /> {profileData.qualification}
                </p>
              )}
            </div>
            {/* Stats row */}
            <div className="flex gap-8 sm:mb-2">
              <div className="text-center">
                <p className="text-xl font-black font-montserrat text-white">{completedOrders.length}</p>
                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Tools Owned</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black font-montserrat text-[#FF5F00]">{activePlan ? '1' : '0'}</p>
                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Active Plan</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── OVERVIEW TAB ─────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left col */}
            <div className="space-y-6">
              {/* Info card */}
              <div className="bg-white/[0.03] border border-white/8 rounded-lg p-6 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Profile Info</h3>
                {[
                  { icon: User, label: 'Name', value: displayName },
                  { icon: Briefcase, label: 'Email', value: email },
                  { icon: Calendar, label: 'Joined', value: 'May 2025' },
                  { icon: GraduationCap, label: 'Qualification', value: profileData.qualification || 'Not set' },
                ].map(row => (
                  <div key={row.label} className="flex items-start gap-3">
                    <row.icon className="w-4 h-4 text-white/25 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] text-white/25 uppercase tracking-wider font-bold">{row.label}</p>
                      <p className="text-sm text-white/70 font-medium">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick links */}
              <div className="bg-white/[0.03] border border-white/8 rounded-lg p-4 space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">Quick Access</h3>
                {[
                  { label: 'Browse Tools', href: '/tools', icon: Wrench },
                  { label: 'Explore Network', href: '/network', icon: TrendingUp },
                  { label: 'View Courses', href: '/courses', icon: BookOpen },
                  { label: 'Career Opportunities', href: '/careers', icon: Briefcase },
                ].map(l => (
                  <Link key={l.label} href={l.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/5 transition-colors group">
                    <l.icon className="w-4 h-4 text-white/25 group-hover:text-white/60 transition-colors" />
                    <span className="text-sm text-white/50 group-hover:text-white/80 font-medium transition-colors">{l.label}</span>
                    <ArrowRight className="w-3 h-3 text-white/20 ml-auto group-hover:translate-x-0.5 group-hover:text-white/50 transition-all" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right col — 2 cols wide */}
            <div className="lg:col-span-2 space-y-6">

              {/* Active Plan summary */}
              {activePlan ? (
                <div className="bg-[#FF5F00]/10 border border-[#FF5F00]/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF5F00]/70">Active Plan</p>
                      <h3 className="text-white font-black font-montserrat text-lg mt-1">{activePlan.pricing_plans?.title || 'The Propels Plan'}</h3>
                    </div>
                    <Award className="w-10 h-10 text-[#FF5F00]/30" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Status', value: 'Active' },
                      { label: 'Price', value: activePlan.pricing_plans?.price || '—' },
                      { label: 'Renewed', value: 'Annually' },
                    ].map(s => (
                      <div key={s.label} className="bg-white/5 rounded-md p-3 text-center">
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{s.label}</p>
                        <p className="text-white font-black mt-1 text-sm">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.03] border border-white/8 border-dashed rounded-lg p-8 text-center">
                  <Award className="w-8 h-8 text-white/15 mx-auto mb-3" />
                  <h3 className="text-white/50 font-bold font-montserrat mb-1">No Active Plan</h3>
                  <p className="text-white/25 text-xs mb-4">Choose a plan to unlock mentors, investor access, and more.</p>
                  <button onClick={() => setActiveTab('plan')}
                    className="text-xs font-black uppercase tracking-wider text-[#FF5F00] border border-[#FF5F00]/30 px-4 py-2 rounded-md hover:bg-[#FF5F00]/10 transition-colors">
                    View Plans
                  </button>
                </div>
              )}

              {/* Recent Tools */}
              <div className="bg-white/[0.03] border border-white/8 rounded-lg p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Recently Acquired Tools</h3>
                  <button onClick={() => setActiveTab('tools')} className="text-[10px] text-[#FF5F00] font-bold uppercase tracking-wider hover:underline">
                    View All
                  </button>
                </div>
                {loadingOrders ? (
                  <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-14 bg-white/5 rounded-md animate-pulse" />)}</div>
                ) : completedOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-7 h-7 text-white/10 mx-auto mb-2" />
                    <p className="text-white/25 text-sm">No tools purchased yet.</p>
                    <Link href="/tools" className="text-xs text-[#FF5F00] mt-2 inline-block hover:underline">Browse Marketplace →</Link>
                  </div>
                ) : completedOrders.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                    <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                      {order.tools_cards?.image_url
                        ? <img src={order.tools_cards.image_url} alt="" className="w-full h-full object-cover" />
                        : <Wrench className="w-4 h-4 text-white/30" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white/80 truncate">{order.tools_cards?.title || 'Unknown Tool'}</p>
                      <p className="text-[10px] text-white/30">₹{order.amount} · {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TOOLS TAB ────────────────────────────────────────── */}
        {activeTab === 'tools' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-white font-black font-montserrat text-xl">Tool Inventory</h2>
                <p className="text-white/30 text-xs mt-1">{completedOrders.length} active tool{completedOrders.length !== 1 ? 's' : ''}</p>
              </div>
              <Link href="/tools" className="flex items-center gap-2 text-xs font-bold text-white/50 border border-white/10 px-4 py-2 rounded-md hover:bg-white/5 transition-colors">
                <ShoppingBag className="w-3.5 h-3.5" /> Get More Tools
              </Link>
            </div>

            {loadingOrders ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-36 bg-white/[0.03] border border-white/8 rounded-lg animate-pulse" />)}
              </div>
            ) : completedOrders.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.02] border border-white/8 border-dashed rounded-lg">
                <Wrench className="w-10 h-10 text-white/10 mx-auto mb-4" />
                <h3 className="text-white/40 font-bold font-montserrat mb-2">No Tools Yet</h3>
                <p className="text-white/20 text-sm mb-6">Purchase tools from the marketplace to see them here.</p>
                <Link href="/tools" className="bg-white/8 border border-white/15 text-white/60 px-6 py-2.5 rounded-md text-sm font-bold hover:bg-white/12 transition-colors inline-block">
                  Explore Marketplace
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map(order => (
                  <div key={order.id}
                    className="group bg-white/[0.03] border border-white/8 rounded-lg p-5 hover:border-white/20 transition-colors duration-200 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#FF5F00]/60 group-hover:w-full transition-all duration-500" />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-md bg-white/5 border border-white/8 flex items-center justify-center overflow-hidden shrink-0">
                        {order.tools_cards?.image_url
                          ? <img src={order.tools_cards.image_url} alt="" className="w-full h-full object-cover" />
                          : <Wrench className="w-5 h-5 text-white/30" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold font-montserrat truncate text-sm">{order.tools_cards?.title || 'Tool'}</h3>
                          <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${
                            order.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>{order.status}</span>
                        </div>
                        <p className="text-white/30 text-xs">₹{order.amount} · Ref: {order.cashfree_order_id?.slice(0, 12)}…</p>
                        <p className="text-white/20 text-[10px] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    {order.status === 'completed' && (
                      <Link href={`/activate/${order.cashfree_order_id}`}
                        className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors">
                        Access Tool <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PLAN TAB ─────────────────────────────────────────── */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            {activePlan ? (
              <div className="space-y-6">
                {/* Plan Header */}
                <div className="bg-[#FF5F00] rounded-lg p-8">
                  <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Your Current Plan</p>
                  <h2 className="text-white font-black font-montserrat text-3xl mb-1">{activePlan.pricing_plans?.title}</h2>
                  <p className="text-white/70 text-sm">{activePlan.pricing_plans?.subtitle}</p>
                  <div className="mt-6 flex gap-4">
                    <div className="bg-white/10 rounded-md px-4 py-3 text-center">
                      <p className="text-white/60 text-[9px] uppercase tracking-widest font-bold">Price</p>
                      <p className="text-white font-black text-lg">{activePlan.pricing_plans?.price}</p>
                    </div>
                    <div className="bg-white/10 rounded-md px-4 py-3 text-center">
                      <p className="text-white/60 text-[9px] uppercase tracking-widest font-bold">Status</p>
                      <p className="text-white font-black text-lg">Active</p>
                    </div>
                  </div>
                </div>
                {/* Progress Modules */}
                <div className="bg-white/[0.03] border border-white/8 rounded-lg p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-5">Plan Features Progress</h3>
                  <div className="space-y-4">
                    {(activePlan.pricing_plans?.features || []).map((feat: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#FF5F00]/20 border border-[#FF5F00]/40 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-[#FF5F00]" />
                        </div>
                        <span className="text-white/60 text-sm">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-white font-black font-montserrat text-2xl mb-2">Choose Your Plan</h2>
                  <p className="text-white/30 text-sm">Unlock mentors, investor access, and growth tools.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: 'individual', label: 'Individual', price: '₹4,999', period: '/year', features: ['4 Mentor Sessions/mo', 'AI Idea Evaluator', 'Market Research Toolkit', 'Startup Modules Library', 'Email Support'], highlighted: false },
                    { key: 'teams', label: 'Teams', price: '₹14,999', period: '/year', features: ['Everything in Individual', 'Up to 5 Members', '8 Group Sessions/mo', 'Investor Introductions', 'Demo Day Access', 'Success Manager'], highlighted: true },
                    { key: 'campus', label: 'Campus', price: 'Custom', period: 'contact us', features: ['Everything in Teams', 'Unlimited Licenses', 'Campus Setup', 'Hackathon Sponsorship', 'White-label Portal'], highlighted: false },
                  ].map(plan => (
                    <div key={plan.key}
                      className={`relative rounded-lg overflow-hidden flex flex-col ${plan.highlighted ? 'bg-[#FF5F00] border border-[#FF5F00]/80' : 'bg-white/[0.03] border border-white/10'}`}>
                      {plan.highlighted && (
                        <div className="absolute top-4 right-4 text-[8px] font-black uppercase tracking-widest bg-black/20 text-white/80 px-2 py-0.5 rounded">Popular</div>
                      )}
                      <div className={`p-6 border-b ${plan.highlighted ? 'border-white/20' : 'border-white/8'}`}>
                        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-2 ${plan.highlighted ? 'text-white/70' : 'text-white/30'}`}>{plan.label}</p>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-black font-montserrat text-white">{plan.price}</span>
                          {plan.price !== 'Custom' && <span className={`text-xs mb-1.5 ${plan.highlighted ? 'text-white/60' : 'text-white/30'}`}>{plan.period}</span>}
                        </div>
                        <Link href="/register"
                          className={`mt-5 w-full py-3 rounded-md text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                            plan.highlighted ? 'bg-white text-[#FF5F00] hover:bg-white/90' : 'bg-white/8 border border-white/15 text-white/70 hover:bg-white/12'
                          }`}>
                          Get Started <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="p-6 space-y-3 flex-1">
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlighted ? 'bg-white/20' : 'bg-white/8'}`}>
                              <Check className={`w-2.5 h-2.5 ${plan.highlighted ? 'text-white' : 'text-white/40'}`} />
                            </div>
                            <span className={`text-xs leading-relaxed ${plan.highlighted ? 'text-white/85' : 'text-white/45'}`}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
