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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-roboto">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-80 border-r border-slate-200 bg-white p-8 flex flex-col shadow-sm">
          <div className="flex items-center gap-4 mb-12">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
              <Image src={user?.picture || "https://api.dicebear.com/7.x/notionists/svg?seed=user"} alt="Profile" fill className="object-cover" />
            </div>
            <div>
              <h2 className="font-roboto font-black text-sm uppercase tracking-tighter text-slate-900">{user?.firstName || 'User'}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tier 1 Operator</p>
            </div>
          </div>

          <nav className="space-y-2 flex-grow">
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
            <div className="pt-8 border-t border-slate-100 mt-8 space-y-2">
              <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
              <button 
                onClick={logout}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </nav>
          
          <div className="mt-auto pt-10">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-slate-300 transition-all">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield className="w-12 h-12 text-slate-900" />
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocol Status</p>
               <h4 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" /> Encrypted
               </h4>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto pt-28 lg:pt-20">
          
          <div className="max-w-4xl mx-auto">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                
                {/* Welcome Header */}
                <header>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">
                      <Sparkles className="w-3 h-3 text-orange-500" /> System Ready
                   </div>
                   <h1 className="text-4xl md:text-5xl font-roboto font-black text-slate-900 tracking-tighter leading-none mb-4 italic">
                      Welcome Back, <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">{user?.firstName}</span>
                   </h1>
                   <p className="text-slate-500 text-sm font-medium tracking-wide">Interface active. All subsystems operational.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Active Plan" value={userPlan?.pricing_plans?.plan_key || 'Free Tier'} icon={Zap} color="text-orange-600" />
                  <StatCard label="Tools Unlocked" value={purchasedTools.length.toString()} icon={Wrench} color="text-cyan-600" />
                  <StatCard label="Success Index" value="84%" icon={Activity} color="text-emerald-600" />
                </div>

                {/* Main Progress Card */}
                <section className="bg-white border border-slate-200 rounded-3xl p-10 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                      <Zap className="w-40 h-40 text-slate-900" />
                   </div>
                   
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Current Trajectory</p>
                        <h3 className="text-2xl font-roboto font-black uppercase italic text-slate-900 leading-tight">
                           {userPlan?.pricing_plans?.title || 'The Propels Individual'}
                        </h3>
                      </div>
                      <div className="text-right">
                         <span className="text-4xl font-roboto font-black text-orange-600 italic">
                            {userPlan?.progress_percent || 0}%
                         </span>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Onboarding Completed</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${userPlan?.progress_percent || 0}%` }} 
                           transition={{ duration: 1.5, ease: "easeOut" }}
                           className="h-full bg-gradient-to-r from-orange-600 to-orange-400" 
                         />
                      </div>
                      <div className="flex justify-between items-center">
                         <p className="text-xs font-bold text-slate-500">Current: <span className="text-slate-900">Foundational Audit</span></p>
                         <button className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg border border-orange-100">
                            Resume Session <ChevronRight className="w-3 h-3" />
                         </button>
                      </div>
                   </div>
                </section>

                {/* Recent Purchases / Tools */}
                <section>
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Acquired Assets</h3>
                      <button onClick={() => setActiveTab('tools')} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-900 transition-colors">View Library</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {purchasedTools.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all group shadow-sm">
                           <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-slate-300 transition-colors">
                              {item.tools_cards?.image_url ? (
                                <img src={item.tools_cards.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                              ) : <Wrench className="w-5 h-5 text-slate-300" />}
                           </div>
                           <div className="flex-grow">
                              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">{item.tools_cards?.title}</h4>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest">{item.tools_cards?.category}</p>
                           </div>
                           <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-all" />
                        </div>
                      ))}
                      {purchasedTools.length === 0 && (
                        <div className="col-span-2 p-12 text-center border border-dashed border-slate-200 rounded-3xl bg-white/50">
                           <AlertCircle className="w-8 h-8 text-slate-200 mx-auto mb-4" />
                           <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No assets acquired yet.</p>
                        </div>
                      )}
                   </div>
                </section>

              </motion.div>
            )}

            {/* Other tabs */}
            {activeTab !== 'overview' && (
               <div className="flex flex-col items-center justify-center h-full py-40">
                  <Clock className="w-12 h-12 text-slate-200 mb-6" />
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300">Protocol Under Expansion</h3>
                  <button onClick={() => setActiveTab('overview')} className="mt-8 text-[10px] font-black text-orange-600 uppercase tracking-widest border border-orange-200 px-6 py-3 rounded-full hover:bg-orange-50 transition-all">Back to Overview</button>
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
      className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all group border ${
        active 
          ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent hover:border-slate-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`w-4 h-4 ${active ? 'text-orange-500' : 'group-hover:text-orange-600 transition-colors'}`} />
        <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${active ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all shadow-sm">
       <div className="flex justify-between items-start mb-6">
          <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-100 ${color} shadow-sm`}>
             <Icon className="w-4 h-4" />
          </div>
       </div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <h4 className="text-xl font-roboto font-black text-slate-900 italic uppercase tracking-tighter">{value}</h4>
    </div>
  );
}
