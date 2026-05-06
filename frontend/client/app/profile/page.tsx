"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Phone, Settings, LogOut, 
  LayoutDashboard, Wrench, CreditCard, 
  Activity, ChevronRight, Shield, Zap,
  Clock, CheckCircle2, AlertCircle, Sparkles,
  Camera, MapPin, Building2, Briefcase, Plus, Save, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';

export default function ProfileDashboard() {
  const { isRegistered, user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [userPlan, setUserPlan] = useState<any>(null);
  const [purchasedTools, setPurchasedTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profileData, setProfileData] = useState<any>({
    first_name: '',
    last_name: '',
    designation: '',
    company: '',
    location: '',
    bio: '',
    skills: '',
    picture: ''
  });

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

        // Fetch profile
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', user.email)
          .single();
        
        if (profData) {
          setProfileData(profData);
        } else {
          // Initial setup from auth user
          setProfileData({
            first_name: user.firstName || '',
            last_name: user.lastName || '',
            designation: 'Founder @ Stealth',
            company: 'Stealth Startup',
            location: 'Global',
            bio: 'Innovating at the intersection of technology and impact.',
            skills: 'Strategy, Product, Engineering',
            picture: user.picture || ''
          });
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

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[rgba(0,0,0,0.9)] font-inter">
      {/* Global Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 24, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-0 left-1/2 z-[300] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <CheckCircle2 className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
              <SidebarItem 
                icon={User} label="Personal Info" 
                active={activeTab === 'personal'} 
                onClick={() => setActiveTab('personal')} 
              />
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
            
            {activeTab === 'personal' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <header>
                   <h1 className="text-3xl font-bold text-[rgba(0,0,0,0.9)] leading-tight mb-3">
                      Personal Information
                   </h1>
                   <p className="text-[rgba(0,0,0,0.6)] text-sm font-medium">Manage your public identity within the Propels Network.</p>
                </header>

                <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-8">
                   {/* Profile Picture Upload */}
                   <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
                      <div className="relative group">
                         <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                            <Image src={profileData.picture || "https://api.dicebear.com/7.x/notionists/svg?seed=user"} alt="Profile" width={128} height={128} className="object-cover" />
                         </div>
                         <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                            <Camera className="w-6 h-6" />
                            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               setSaving(true);
                               try {
                                  const fileExt = file.name.split('.').pop();
                                  const fileName = `${user.email}-${Math.random()}.${fileExt}`;
                                  const filePath = `avatars/${fileName}`;

                                  const { error: uploadError } = await supabase.storage
                                    .from('profile-pictures')
                                    .upload(filePath, file);

                                  if (uploadError) throw uploadError;

                                  const { data: { publicUrl } } = supabase.storage
                                    .from('profile-pictures')
                                    .getPublicUrl(filePath);

                                  // Update database immediately for image change
                                  const { error: dbError } = await supabase
                                    .from('profiles')
                                    .update({ picture: publicUrl })
                                    .eq('email', user.email);

                                  if (dbError) throw dbError;

                                  setProfileData({ ...profileData, picture: publicUrl });
                                  triggerSuccess("Identity visualization updated.");
                               } catch (err) {
                                  console.error("Error uploading image:", err);
                               } finally {
                                  setSaving(false);
                               }
                            }} />
                         </label>
                      </div>
                      <div className="text-center md:text-left">
                         <h3 className="text-lg font-bold text-slate-800">Profile Picture</h3>
                         <p className="text-xs text-slate-500 font-medium mt-1 mb-4">Upload a high-resolution headshot for your network card.</p>
                         <button 
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                            className="text-[11px] font-bold text-cyan-600 uppercase tracking-widest px-4 py-2 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-all"
                         >
                            Change Avatar
                         </button>
                      </div>
                   </div>

                   {/* Personal Details Form */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ProfileInput label="First Name" value={profileData.first_name} onChange={(val) => setProfileData({...profileData, first_name: val})} />
                      <ProfileInput label="Last Name" value={profileData.last_name} onChange={(val) => setProfileData({...profileData, last_name: val})} />
                      <ProfileInput label="Professional Designation" value={profileData.designation} onChange={(val) => setProfileData({...profileData, designation: val})} placeholder="e.g. Founder, Investor, CTO" />
                      <ProfileInput label="Current Organization" value={profileData.company} onChange={(val) => setProfileData({...profileData, company: val})} />
                      <ProfileInput label="Location" value={profileData.location} onChange={(val) => setProfileData({...profileData, location: val})} />
                      <ProfileInput label="Core Skills" value={profileData.skills} onChange={(val) => setProfileData({...profileData, skills: val})} placeholder="Strategy, React, Venture Capital" />
                      
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Biography</label>
                        <textarea 
                           className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-cyan-500 transition-all resize-none"
                           value={profileData.bio}
                           onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                           placeholder="Tell the network about your mission and what you are building..."
                        />
                      </div>
                   </div>

                   <div className="pt-4 flex justify-end">
                      <button 
                        onClick={async () => {
                           setSaving(true);
                           try {
                              const { error } = await supabase
                                .from('profiles')
                                .upsert({
                                   email: user.email,
                                   ...profileData,
                                   updated_at: new Date().toISOString()
                                });
                              if (error) throw error;
                              triggerSuccess("Protocol data synchronized successfully.");
                           } catch (err) {
                              console.error("Error saving profile:", err);
                           } finally {
                              setSaving(false);
                           }
                        }}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-bold text-xs shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </button>
                   </div>
                </div>
              </motion.div>
            )}

            {/* Other tabs fallback */}
            {activeTab !== 'overview' && activeTab !== 'personal' && (
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

function ProfileInput({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
         type="text"
         className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-cyan-500 transition-all"
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
      />
    </div>
  );
}
