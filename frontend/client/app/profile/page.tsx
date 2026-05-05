"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, Link as LinkIcon, Building2, Calendar, Star, MessageCircle, 
  Heart, Share2, Briefcase, GraduationCap, Compass, Search, 
  Bell, Settings, Zap, Clock, ChevronRight, ShoppingBag, 
  Sparkles, ShieldCheck, User as UserIcon
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const mockPosts = [
  {
    id: 1,
    author: "Jane Doe",
    role: "Founder at Sparkle AI",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jane",
    time: "2 hours ago",
    content: "Just closed our pre-seed round of $1.2M led by Sequoia Surge! Exciting times ahead as we scale our engineering team. We're actively hiring React developers, DMs are open! 🚀 #Fundraising #Startups #Hiring",
    likes: 342,
    comments: 56,
  },
  {
    id: 2,
    author: "Aryan Patel",
    role: "PM at Zomato",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aryan",
    time: "5 hours ago",
    content: "The biggest mistake early founders make is building the product before finding distribution. Spent the whole weekend reading 'Traction' and rethinking our entire GTM motion.",
    likes: 890,
    comments: 104,
  }
];

export default function Profile() {
  const { isRegistered, setRegisterModalOpen } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('My Profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!isRegistered) {
      setRegisterModalOpen(true);
      router.push('/');
      return;
    }

    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      setProfileData(JSON.parse(savedData));
    } else {
      setProfileData({
        firstName: "New",
        lastName: "Founder",
        identifier: "founder@example.com",
        picture: "https://api.dicebear.com/7.x/notionists/svg?seed=Founder",
        designation: "Founder",
        company: "Stealth Startup",
        education: "University",
        skills: "Product Management, React, Growth",
        interests: "AI, FinTech",
      });
    }
  }, [isRegistered, router, setRegisterModalOpen]);

  useEffect(() => {
    if (activeTab === 'Orders' && profileData?.identifier) {
      async function fetchOrders() {
        setLoadingOrders(true);
        try {
          const { data, error } = await supabase
            .from('transactions')
            .select('*, tools_cards(*)')
            .eq('user_email', profileData.identifier)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          setOrders(data || []);
        } catch (err) {
          console.error('Error fetching orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      }
      fetchOrders();
    }
  }, [activeTab, profileData]);

  if (!profileData) return null;

  const displayPic = profileData.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${profileData.firstName}`;

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- PROFILE HEADER & NAV --- */}
        <div className="mb-12 flex flex-col md:flex-row items-end justify-between gap-8">
           <div className="flex items-center gap-8">
              <div className="relative group">
                 <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                 <img 
                   src={displayPic} 
                   alt="Profile" 
                   className="w-32 h-32 rounded-3xl border-4 border-white/10 relative z-10 object-cover shadow-2xl bg-[#0a0a0f]"
                 />
                 <div className="absolute -bottom-2 -right-2 z-20 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-xl border-4 border-[#080808]">
                    <ShieldCheck className="w-5 h-5" />
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[8px] font-black uppercase tracking-[0.3em]">
                    <Zap className="w-3 h-3" /> System Verified Founder
                 </div>
                 <h1 className="text-4xl md:text-5xl font-montserrat font-black italic tracking-tighter uppercase leading-none">
                   {profileData.firstName} <span className="text-white/20">{profileData.lastName}</span>
                 </h1>
                 <p className="text-white/40 text-sm font-medium italic">
                    {profileData.designation} @ <span className="text-white">{profileData.company}</span>
                 </p>
              </div>
           </div>

           <div className="flex bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
              {['My Profile', 'Orders'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-white/20 hover:text-white/40'}`}
                >
                  {tab}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
           
           {/* LEFT COLUMN: INTEL */}
           <div className="lg:col-span-1 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-8 text-6xl font-black text-white/[0.02] italic pointer-events-none uppercase">Bio</div>
                 <div className="space-y-8 relative z-10">
                    <div>
                       <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><MapPin className="w-3 h-3 text-cyan-500" /> Current Node</h3>
                       <p className="text-sm font-bold text-white/80">Gurugram, India</p>
                    </div>
                    <div>
                       <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><Building2 className="w-3 h-3 text-orange-500" /> Primary Affiliation</h3>
                       <p className="text-sm font-bold text-white/80">{profileData.company}</p>
                    </div>
                    <div>
                       <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><GraduationCap className="w-3 h-3 text-purple-500" /> Intellectual Track</h3>
                       <p className="text-sm font-bold text-white/80">{profileData.qualification || 'Elite Founder'}</p>
                    </div>
                    <div className="pt-6 border-t border-white/5">
                       <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Core Stacks</h3>
                       <div className="flex flex-wrap gap-2">
                          {profileData.skills?.split(',').map((s: string, i: number) => (
                             <span key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">{s.trim()}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>

              <div className="bg-gradient-to-br from-cyan-950/20 to-transparent border border-cyan-500/10 rounded-[40px] p-10 flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                    <Sparkles className="w-8 h-8" />
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2 italic">Founder Score</h4>
                 <p className="text-4xl font-montserrat font-black italic tracking-tighter text-cyan-400">842</p>
                 <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mt-4">Top 5% Ecosystem Node</p>
              </div>
           </div>

           {/* RIGHT COLUMN: MAIN CONTENT */}
           <div className="lg:col-span-3 space-y-10">
              <AnimatePresence mode="wait">
                 {activeTab === 'My Profile' ? (
                   <motion.div 
                     key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                     className="space-y-10"
                   >
                      {/* Post Creation */}
                      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 rounded-[40px] shadow-2xl relative group">
                         <div className="flex gap-8 items-start">
                            <img src={displayPic} alt="User" className="w-16 h-16 rounded-2xl border border-white/10 bg-[#0a0a0f] object-cover" />
                            <div className="flex-1 space-y-6">
                               <textarea 
                                 placeholder={`Log your propulsion status, ${profileData.firstName}...`}
                                 className="w-full bg-transparent text-lg font-medium text-white placeholder:text-white/10 focus:outline-none resize-none min-h-[100px] italic" 
                               />
                               <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                  <div className="flex gap-4">
                                     <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                                        Attach Media
                                     </button>
                                     <button className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/40 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                                        Poll Ecosystem
                                     </button>
                                  </div>
                                  <button className="h-14 px-12 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-105 transition-all shadow-xl">
                                     EXECUTE POST
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Feed */}
                      <div className="space-y-10">
                         <div className="flex items-center justify-between px-6">
                            <h2 className="text-xl font-montserrat font-black italic tracking-tighter uppercase">Ecosystem Propulsion Feed</h2>
                            <div className="flex items-center gap-6">
                               <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 cursor-pointer">Live Node <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" /></span>
                            </div>
                         </div>

                         {mockPosts.map((post, i) => (
                           <motion.div 
                             key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                             className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] shadow-2xl relative overflow-hidden group"
                           >
                              <div className="absolute top-0 right-0 p-12 text-9xl font-black text-white/[0.01] italic pointer-events-none group-hover:text-white/[0.02] transition-all">POST</div>
                              <div className="flex justify-between items-start mb-10">
                                 <div className="flex gap-6 items-center">
                                    <img src={post.avatar} alt={post.author} className="w-16 h-16 rounded-3xl border border-white/10 bg-[#0a0a0f] object-cover" />
                                    <div>
                                       <h3 className="text-2xl font-montserrat font-black text-white uppercase italic tracking-tighter group-hover:text-cyan-400 transition-colors">{post.author}</h3>
                                       <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{post.role}</p>
                                       <p className="text-[9px] text-white/10 mt-2 flex items-center gap-2 font-bold uppercase tracking-widest"><Clock className="w-3.5 h-3.5" /> {post.time}</p>
                                    </div>
                                 </div>
                              </div>
                              <p className="text-white/60 text-lg leading-relaxed mb-10 italic font-medium">"{post.content}"</p>
                              <div className="flex items-center gap-10 text-[10px] font-black text-white/20 pt-10 border-t border-white/5">
                                 <button className="flex items-center gap-3 hover:text-red-500 transition-colors uppercase tracking-widest group/btn">
                                    <Heart className="w-5 h-5 group-hover/btn:fill-red-500" /> {post.likes} <span className="opacity-40">Appreciations</span>
                                 </button>
                                 <button className="flex items-center gap-3 hover:text-cyan-500 transition-colors uppercase tracking-widest">
                                    <MessageCircle className="w-5 h-5" /> {post.comments} <span className="opacity-40">Insights</span>
                                 </button>
                                 <button className="flex items-center gap-3 hover:text-white transition-colors ml-auto uppercase tracking-widest">
                                    <Share2 className="w-5 h-5" /> Broadcast
                                 </button>
                              </div>
                           </motion.div>
                         ))}
                      </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                     className="space-y-8"
                   >
                      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-12 rounded-[40px] flex items-center justify-between shadow-2xl">
                         <div>
                            <h2 className="text-3xl font-montserrat font-black italic tracking-tighter uppercase">Arsenal Inventory</h2>
                            <p className="text-white/20 text-xs font-black uppercase tracking-widest mt-2">Authenticated Activations & Tooling</p>
                         </div>
                         <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center text-white/40">
                            <ShoppingBag className="w-8 h-8" />
                         </div>
                      </div>

                      {loadingOrders ? (
                         <div className="space-y-6">
                            {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 rounded-[40px] animate-pulse border border-white/5" />)}
                         </div>
                      ) : orders.length === 0 ? (
                         <div className="bg-white/[0.02] rounded-[50px] p-24 text-center border border-white/5 shadow-2xl">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10">
                               <Search className="w-10 h-10 text-white/10" />
                            </div>
                            <h3 className="text-3xl font-montserrat font-black italic tracking-tighter uppercase text-white/40 mb-4">No Assets Acquired</h3>
                            <p className="text-white/20 font-black uppercase tracking-widest mb-12 max-w-xs mx-auto text-[10px]">Your arsenal is empty. Initialize market acquisition protocol.</p>
                            <Link href="/tools" className="h-16 px-16 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-2xl inline-flex items-center text-xs uppercase tracking-[0.2em]">
                               BROWSE ARSENAL
                            </Link>
                         </div>
                      ) : (
                         <div className="grid grid-cols-1 gap-6">
                            {orders.map(order => (
                              <motion.div 
                                key={order.id} whileHover={{ x: 10 }}
                                className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-white/[0.05] transition-all group shadow-2xl"
                              >
                                 <div className="flex items-center gap-8 w-full md:w-auto">
                                    <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                                       {order.tools_cards?.image_url ? (
                                         <img src={order.tools_cards.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                       ) : (
                                         <Zap className="w-10 h-10 text-cyan-500" />
                                       )}
                                    </div>
                                    <div className="space-y-2">
                                       <div className="flex items-center gap-3">
                                          <h3 className="text-2xl font-montserrat font-black italic tracking-tighter uppercase group-hover:text-cyan-400 transition-colors">{order.tools_cards?.title}</h3>
                                          <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full border ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                            {order.status}
                                          </span>
                                       </div>
                                       <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">Protocol ID: {order.cashfree_order_id}</p>
                                    </div>
                                 </div>

                                 <div className="flex items-center justify-between w-full md:w-auto gap-16 border-t md:border-t-0 pt-8 md:pt-0 border-white/5">
                                    <div className="text-center md:text-right">
                                       <span className="text-[8px] font-black uppercase tracking-widest text-white/20 block mb-1">Acquisition Cost</span>
                                       <span className="text-2xl font-black italic tracking-tighter">₹{order.amount}</span>
                                    </div>
                                    
                                    {order.status === 'completed' ? (
                                      <Link 
                                       href={`/activate/${order.cashfree_order_id}`}
                                       className="h-14 px-10 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 group/btn shadow-xl"
                                      >
                                        ACTIVATE NODE <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                      </Link>
                                    ) : (
                                      <button disabled className="h-14 px-10 bg-white/5 text-white/20 border border-white/10 font-black rounded-xl text-[10px] uppercase tracking-widest cursor-not-allowed">
                                        SYNCING...
                                      </button>
                                    )}
                                 </div>
                              </motion.div>
                            ))}
                         </div>
                      )}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
