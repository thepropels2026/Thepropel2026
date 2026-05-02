"use client"; // Enable client-side interactivity
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthContext'; // Custom hook for authentication state
import { useRouter } from 'next/navigation'; // Next.js router for client-side navigation
import Link from 'next/link';
// Import a wide variety of icons for UI representation
import { 
  MapPin, Link as LinkIcon, Building2, Calendar, Star, MessageCircle, 
  Heart, Share2, Briefcase, GraduationCap, Compass, Search, 
  Bell, Settings, Zap, Clock, ChevronRight, ShoppingBag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * Mock Data for the social feed: Simulates activity from other founders and companies.
 */
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

/**
 * Profile component: Displays the logged-in user's profile, social feed, and order history.
 */
export default function Profile() {
  const { isRegistered } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('My Profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Check authentication and load profile data on mount
  useEffect(() => {
    if (!isRegistered) {
      router.push('/register');
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
  }, [isRegistered, router]);

  // Fetch orders when the Orders tab is selected
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
    <div className="bg-slate-50 min-h-screen pt-20 pb-16 font-inter text-slate-800">
      
      {/* Profile Inner Navigation Bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 px-4 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-14">
           <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar h-full">
              <button 
                onClick={() => setActiveTab('My Profile')}
                className={`font-bold text-sm transition-all h-full px-2 whitespace-nowrap relative ${activeTab === 'My Profile' ? 'text-cyan-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                My Profile
                {activeTab === 'My Profile' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />}
              </button>
              <button 
                onClick={() => setActiveTab('Orders')}
                className={`font-bold text-sm transition-all h-full px-2 whitespace-nowrap relative flex items-center gap-2 ${activeTab === 'Orders' ? 'text-cyan-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                My Orders
                <span className="bg-slate-100 text-[10px] px-1.5 py-0.5 rounded-full">{orders.length || '0'}</span>
                {activeTab === 'Orders' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />}
              </button>
              <button className="font-bold text-sm text-slate-500 hover:text-slate-800 transition-colors h-full px-2 whitespace-nowrap">Dashboard</button>
              <button className="font-bold text-sm text-slate-500 hover:text-slate-800 transition-colors h-full px-2 whitespace-nowrap">Connections</button>
           </div>
           <div className="flex gap-4">
              <button className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"><Search className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-cyan-500 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-cyan-500 to-blue-600 relative">
               <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/40 backdrop-blur-md transition-all"><Settings className="w-4 h-4" /></button>
            </div>
            <div className="px-6 pb-6 relative">
              <img 
                src={displayPic} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 bg-white object-cover shadow-md"
              />
              <div className="pt-14">
                <h1 className="text-xl font-bold font-montserrat tracking-tight">{profileData.firstName} {profileData.lastName}</h1>
                <p className="text-sm text-slate-500 font-medium mb-4">{profileData.designation} at <span className="text-cyan-600 font-bold">{profileData.company}</span></p>
                
                <div className="flex gap-4 text-sm font-bold text-slate-600 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex flex-col"><span className="text-lg text-slate-800">4,204</span> <span className="text-[10px] uppercase text-slate-400 tracking-wider">Followers</span></div>
                  <div className="flex flex-col"><span className="text-lg text-slate-800">500+</span> <span className="text-[10px] uppercase text-slate-400 tracking-wider">Connections</span></div>
                </div>

                <div className="space-y-3 text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-slate-400" /> Gurugram, India</div>
                  <div className="flex items-center gap-3"><LinkIcon className="w-4 h-4 text-slate-400" /> propels.in/{profileData.firstName?.toLowerCase()}</div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-slate-400" /> Joined April 2026</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="font-bold font-montserrat flex items-center gap-2 mb-3 text-sm uppercase tracking-wider text-slate-400"><Briefcase className="w-4 h-4 text-cyan-500" /> About</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Passionate founder building the future at {profileData.company}. Focused on scaling products from 0 to 1 and driving sustainable growth.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold font-montserrat flex items-center gap-2 mb-3 text-sm uppercase tracking-wider text-slate-400"><GraduationCap className="w-4 h-4 text-orange-500" /> Education</h3>
              <p className="text-sm text-slate-800 font-bold">{profileData.education}</p>
            </div>

            <div>
              <h3 className="font-bold font-montserrat flex items-center gap-2 mb-3 text-sm uppercase tracking-wider text-slate-400"><Star className="w-4 h-4 text-yellow-500" /> Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills?.split(',').map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-200">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === 'My Profile' ? (
            <>
              {/* Post Creation */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex gap-4 items-start">
                   <img src={displayPic} alt="User" className="w-12 h-12 rounded-full border border-slate-100 bg-slate-50" />
                   <div className="flex-1">
                     <textarea 
                       placeholder={`What are you building, ${profileData.firstName}?`}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm focus:border-cyan-500 outline-none resize-none min-h-[120px] transition-all" 
                     />
                     <div className="flex justify-between items-center mt-4">
                       <div className="flex gap-3">
                         <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"><MapPin className="w-4 h-4" /> Media</button>
                         <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all">📊 Poll</button>
                       </div>
                       <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-black px-8 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95 text-sm">
                         POST NOW
                       </button>
                     </div>
                   </div>
                </div>
              </div>

              {/* Feed */}
              <div className="flex items-center justify-between">
                 <h2 className="font-bold font-montserrat text-lg">Your Propulsion Feed</h2>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 cursor-pointer hover:text-cyan-500">Latest <Clock className="w-3 h-3" /></span>
              </div>

              {mockPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transition-all hover:shadow-md group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <img src={post.avatar} alt={post.author} className="w-14 h-14 rounded-full border border-slate-200 bg-slate-50" />
                      <div>
                        <h3 className="font-bold font-montserrat text-lg group-hover:text-cyan-600 transition-colors">{post.author}</h3>
                        <p className="text-xs text-slate-500 font-medium">{post.role}</p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.time}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">•••</button>
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6 font-medium">{post.content}</p>
                  <div className="flex items-center gap-8 text-sm font-bold text-slate-400 pt-6 border-t border-slate-50">
                    <button className="flex items-center gap-2 hover:text-red-500 transition-colors group/btn">
                      <Heart className="w-5 h-5 group-hover/btn:fill-red-500" /> {post.likes}
                    </button>
                    <button className="flex items-center gap-2 hover:text-cyan-500 transition-colors">
                      <MessageCircle className="w-5 h-5" /> {post.comments}
                    </button>
                    <button className="flex items-center gap-2 hover:text-slate-800 transition-colors ml-auto">
                      <Share2 className="w-5 h-5" /> Share
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : activeTab === 'Orders' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="font-bold font-montserrat text-xl">Inventory & Tools</h2>
                  <p className="text-sm text-slate-400 font-medium">Manage your premium activations and credits.</p>
                </div>
                <div className="w-12 h-12 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              {loadingOrders ? (
                 <div className="space-y-4">
                   {[1,2,3].map(i => (
                     <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                   ))}
                 </div>
              ) : orders.length === 0 ? (
                 <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-200 shadow-sm">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Search className="w-8 h-8 text-slate-200" />
                   </div>
                   <h3 className="text-xl font-bold font-montserrat mb-2">No Activations Found</h3>
                   <p className="text-slate-400 font-medium mb-8 max-w-xs mx-auto">Explore our marketplace to unlock premium tools for your startup.</p>
                   <Link href="/tools" className="bg-cyan-500 text-white font-black px-10 py-4 rounded-2xl hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-500/20 inline-block">
                     BROWSE TOOLS
                   </Link>
                 </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {orders.map(order => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cyan-500/30 transition-all group"
                    >
                       <div className="flex items-center gap-6 w-full md:w-auto">
                         <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
                           {order.tools_cards?.image_url ? (
                             <img src={order.tools_cards.image_url} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <Zap className="w-8 h-8 text-cyan-500" />
                           )}
                         </div>
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold font-montserrat text-lg leading-tight">{order.tools_cards?.title}</h3>
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                               {order.status}
                             </span>
                           </div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ref: {order.cashfree_order_id}</p>
                         </div>
                       </div>

                       <div className="flex items-center justify-between w-full md:w-auto gap-12 border-t md:border-t-0 pt-4 md:pt-0 border-slate-50">
                         <div className="text-center md:text-right">
                           <span className="text-[10px] text-slate-300 font-black uppercase block mb-1">Paid Amount</span>
                           <span className="text-lg font-black">₹{order.amount}</span>
                         </div>
                         
                         {order.status === 'completed' ? (
                           <Link 
                            href={`/activate/${order.cashfree_order_id}`}
                            className="bg-[#0a0a0f] text-white hover:bg-cyan-500 font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center gap-2 group/btn shadow-xl shadow-black/10"
                           >
                             ACTIVATE <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                           </Link>
                         ) : (
                           <button disabled className="bg-slate-100 text-slate-400 font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest cursor-not-allowed">
                             PENDING
                           </button>
                         )}
                       </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {activeTab === 'My Profile' && (
            <div className="text-center py-8">
               <button className="text-cyan-600 font-bold text-sm bg-cyan-50 px-10 py-3 rounded-2xl hover:bg-cyan-100 transition-all border border-cyan-100 shadow-sm">
                 Load More Propulsion Updates
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
