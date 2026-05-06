"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Settings, LogOut, 
  LayoutDashboard, Wrench, CreditCard, 
  Activity, ChevronRight, Shield, Zap,
  Clock, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

export default function ProfileDashboard() {
  const { isRegistered, user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [userPlan, setUserPlan] = useState<any>(null);
  const [purchasedTools, setPurchasedTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isRegistered) {
      router.push('/');
    }
  }, [isRegistered, router]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        // Fetch subscription
        const { data: subData } = await supabase
          .from('user_subscriptions')
          .select('*, pricing_plans(*)')
          .eq('user_email', user.email)
          .single();
          
        if (subData) {
          setUserPlan(subData);
        } else {
          // Demo fallback
          setUserPlan({
            progress_percent: 15,
            pricing_plans: { title: 'The Propels Individual (Trial)', plan_key: 'Free' }
          });
        }

        // Fetch tools
        const { data: toolsData } = await supabase
          .from('user_tools')
          .select('*, tools_cards(*)')
          .eq('user_email', user.email);
        
        if (toolsData && toolsData.length > 0) {
          setPurchasedTools(toolsData);
        } else {
          // Demo fallback
          setPurchasedTools([
            { tools_cards: { title: 'Founder OS v1.0', category: 'Productivity', image_url: null } }
          ]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (isRegistered) {
      fetchDashboardData();
    }
  }, [isRegistered, user?.email]);

  if (!isRegistered) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-[rgba(0,0,0,0.9)] font-inter">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-80 border-r border-slate-200 bg-white p-8 flex flex-col shadow-sm">
          <div className="flex items-center gap-4 mb-12">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-100 shadow-sm">
              <Image src={user?.picture || "https://api.dicebear.com/7.x/notionists/svg?seed=user"} alt="Profile" fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[rgba(0,0,0,0.9)]">{user?.firstName || 'User'}</h2>
              <p className="text-xs text-[rgba(0,0,0,0.6)]">Tier 1 Operator</p>
            </div>
          </div>

          <nav className="space-y-1 flex-grow">
            <SidebarItem 
              icon={LayoutDashboard} label="Overview" 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <SidebarItem 
              icon={Wrench} label="My Tools" 
              active={activeTab === 'tools'} 
              onClick={() => setActiveTab('tools')} 
              count={purchasedTools.length}
            />
            <SidebarItem 
              icon={CreditCard} label="Subscription" 
              active={activeTab === 'subscription'} 
              onClick={() => setActiveTab('subscription')} 
            />
            <SidebarItem 
              icon={Activity} label="Activity" 
              active={activeTab === 'activity'} 
              onClick={() => setActiveTab('activity')} 
            />
            <div className="pt-6 border-t border-slate-100 mt-6 space-y-1">
              <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)] hover:bg-slate-50 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </nav>
          
          <div className="mt-auto pt-10">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-slate-300 transition-all">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-slate-900">
                  <Shield className="w-10 h-10" />
               </div>
               <p className="text-[10px] font-semibold text-[rgba(0,0,0,0.5)] uppercase tracking-wider mb-1">Protocol Status</p>
               <h4 className="text-xs font-bold text-emerald-600 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Encrypted
               </h4>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto pt-24 lg:pt-16">
          
          <div className="max-w-4xl mx-auto">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                
                {/* Welcome Header */}
                <header>
                   <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-wider mb-5">
                      <Sparkles className="w-3 h-3 text-orange-500" /> System Ready
                   </div>
                   <h1 className="text-3xl md:text-4xl font-bold text-[rgba(0,0,0,0.9)] leading-tight mb-3">
                      Welcome Back, {user?.firstName}
                   </h1>
                   <p className="text-[rgba(0,0,0,0.6)] text-sm font-medium">Interface active. All subsystems operational.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <StatCard label="Active Plan" value={userPlan?.pricing_plans?.plan_key || 'Free Tier'} icon={Zap} color="text-orange-600" />
                  <StatCard label="Tools Unlocked" value={purchasedTools.length.toString()} icon={Wrench} color="text-cyan-600" />
                  <StatCard label="Success Index" value="84%" icon={Activity} color="text-emerald-600" />
                </div>

                {/* Main Progress Card */}
                <section className="bg-white border border-slate-200 rounded-xl p-8 relative overflow-hidden group shadow-sm">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity text-slate-900">
                      <Zap className="w-32 h-32" />
                   </div>
                   
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-wider mb-3">Current Trajectory</p>
                        <h3 className="text-xl font-bold text-[rgba(0,0,0,0.9)] leading-tight">
                           {userPlan?.pricing_plans?.title || 'The Propels Individual'}
                        </h3>
                      </div>
                      <div className="text-right">
                         <span className="text-3xl font-bold text-orange-600">
                            {userPlan?.progress_percent || 0}%
                         </span>
                         <p className="text-[10px] font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-wider mt-1">Onboarding Completed</p>
                      </div>
                   </div>

                   <div className="space-y-5">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${userPlan?.progress_percent || 0}%` }} 
                           transition={{ duration: 1.2 }}
                           className="h-full bg-orange-500" 
                         />
                      </div>
                      <div className="flex justify-between items-center">
                         <p className="text-xs font-medium text-[rgba(0,0,0,0.6)]">Current: <span className="text-[rgba(0,0,0,0.9)] font-semibold">Foundational Audit</span></p>
                         <button className="text-[11px] font-bold text-orange-600 uppercase tracking-wide hover:text-orange-500 transition-colors flex items-center gap-1.5">
                            Resume Session <ChevronRight className="w-3.5 h-3.5" />
                         </button>
                      </div>
                   </div>
                </section>

                {/* Recent Purchases / Tools */}
                <section>
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[rgba(0,0,0,0.4)]">Acquired Assets</h3>
                      <button onClick={() => setActiveTab('tools')} className="text-[11px] font-bold text-[rgba(0,0,0,0.5)] hover:text-[rgba(0,0,0,0.9)] transition-colors">View Library</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchasedTools.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all group shadow-sm">
                           <div className="w-11 h-11 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 group-hover:border-slate-300 transition-colors">
                              {item.tools_cards?.image_url ? (
                                <img src={item.tools_cards.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : <Wrench className="w-5 h-5 text-slate-300" />}
                           </div>
                           <div className="flex-grow">
                              <h4 className="text-sm font-bold text-[rgba(0,0,0,0.9)] leading-tight mb-0.5">{item.tools_cards?.title}</h4>
                              <p className="text-[10px] text-[rgba(0,0,0,0.5)] font-medium uppercase tracking-wider">{item.tools_cards?.category}</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-all" />
                        </div>
                      ))}
                   </div>
                </section>

              </motion.div>
            )}

            {/* Other tabs */}
            {activeTab !== 'overview' && (
               <div className="flex flex-col items-center justify-center h-full py-32">
                  <Clock className="w-10 h-10 text-slate-200 mb-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[rgba(0,0,0,0.3)]">Protocol Under Expansion</h3>
                  <button onClick={() => setActiveTab('overview')} className="mt-6 text-[11px] font-bold text-orange-600 uppercase tracking-wide border border-orange-200 px-5 py-2.5 rounded-full hover:bg-orange-50 transition-all">Back to Overview</button>
               </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
        active 
          ? 'bg-slate-50 text-[rgba(0,0,0,0.9)]' 
          : 'text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)] hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${active ? 'text-[rgba(0,0,0,0.9)]' : 'text-[rgba(0,0,0,0.5)] group-hover:text-[rgba(0,0,0,0.9)]'}`} />
        <span className={`text-sm font-semibold`}>{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-400'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-sm">
       <div className="flex justify-between items-start mb-5">
          <div className={`p-2 rounded-lg bg-slate-50 border border-slate-100 ${color}`}>
             <Icon className="w-4 h-4" />
          </div>
       </div>
       <p className="text-[10px] font-bold text-[rgba(0,0,0,0.5)] uppercase tracking-wider mb-1">{label}</p>
       <h4 className="text-lg font-bold text-[rgba(0,0,0,0.9)]">{value}</h4>
    </div>
  );
}
