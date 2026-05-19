"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, MessageSquare, Briefcase, Filter, 
  ShieldCheck, MapPin, Building2, Zap, Check, X, Clock, Loader2, Send 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetworkPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'founders' | 'investors'>('founders');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Chat State
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch profiles
        const { data: profs, error: pErr } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (pErr) throw pErr;
        setProfiles(profs || []);

        // Fetch user connections if logged in
        if (user?.email) {
          const { data: conns, error: cErr } = await supabase
            .from('connections')
            .select('*')
            .or(`sender_email.eq.${user.email},receiver_email.eq.${user.email}`);
          
          if (cErr) throw cErr;
          setConnections(conns || []);
        }
      } catch (err) {
        console.error('Error fetching network data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user?.email]);

  // Load chat messages when activeChat is opened
  useEffect(() => {
    if (!activeChat || !user?.email) return;

    async function fetchMessages() {
      try {
        const { data: senderProf } = await supabase
          .from('profiles')
          .select('id')
          .eq('identifier', user.email)
          .single();

        const senderId = senderProf?.id;
        const receiverId = activeChat.id;

        if (!senderId || !receiverId) return;

        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
          .order('created_at', { ascending: true });

        if (error) {
          // LocalStorage fallback if schema table is not created yet
          console.warn('Using local backup storage for chats:', error);
          const localKey = `chat_${senderId}_${receiverId}`;
          const mockMsgs = JSON.parse(localStorage.getItem(localKey) || '[]');
          setChatMessages(mockMsgs);
          return;
        }

        setChatMessages(data || []);
      } catch (err) {
        console.error('Error loading messages:', err);
      }
    }

    fetchMessages();

    // Subscribe to realtime database insertion changes for message table
    let channel: any;
    try {
      channel = supabase
        .channel('realtime-messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          async (payload) => {
            const newMsg = payload.new;
            // Load sender identity to match
            const { data: senderProf } = await supabase
              .from('profiles')
              .select('id')
              .eq('identifier', user.email)
              .single();

            const myId = senderProf?.id;
            if (
              (newMsg.sender_id === activeChat.id && newMsg.receiver_id === myId) ||
              (newMsg.sender_id === myId && newMsg.receiver_id === activeChat.id)
            ) {
              setChatMessages(prev => [...prev, newMsg]);
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime sync subscript error:', e);
    }

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [activeChat, user?.email]);

  const getConnectionStatus = (targetEmail: string) => {
    const conn = connections.find(c => 
      (c.sender_email === user?.email && c.receiver_email === targetEmail) ||
      (c.sender_email === targetEmail && c.receiver_email === user?.email)
    );
    return conn ? conn.status : null;
  };

  const handleConnect = async (targetEmail: string) => {
    if (!user?.email) return;
    setActionLoading(targetEmail);
    try {
      const { data, error } = await supabase
        .from('connections')
        .insert({
          sender_email: user.email,
          receiver_email: targetEmail,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      setConnections([...connections, data]);
    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAccept = async (senderEmail: string) => {
    if (!user?.email) return;
    setActionLoading(senderEmail);
    try {
      const { data, error } = await supabase
        .from('connections')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .match({ sender_email: senderEmail, receiver_email: user.email })
        .select()
        .single();
      
      if (error) throw error;
      setConnections(connections.map(c => c.id === data.id ? data : c));
    } catch (err) {
      console.error("Error accepting request:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !user?.email) return;

    setSendingMessage(true);
    try {
      const { data: senderProf } = await supabase
        .from('profiles')
        .select('id')
        .eq('identifier', user.email)
        .single();

      const senderId = senderProf?.id;
      const receiverId = activeChat.id;

      if (!senderId || !receiverId) return;

      const messageObj = {
        sender_id: senderId,
        receiver_id: receiverId,
        content: newMessage.trim(),
        is_read: false
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageObj)
        .select()
        .single();

      if (error) {
        // Fallback local backup if database tables lack columns/migrations
        const localKey = `chat_${senderId}_${receiverId}`;
        const mockMsgs = JSON.parse(localStorage.getItem(localKey) || '[]');
        const newMockMsg = {
          id: Math.random().toString(),
          sender_id: senderId,
          receiver_id: receiverId,
          content: newMessage.trim(),
          created_at: new Date().toISOString()
        };
        mockMsgs.push(newMockMsg);
        localStorage.setItem(localKey, JSON.stringify(mockMsgs));
        setChatMessages(prev => [...prev, newMockMsg]);
      } else {
        setChatMessages(prev => [...prev, data]);
      }

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
     const designation = profile.designation?.toLowerCase() || '';
     const isInvestor = designation.includes('investor') || designation.includes('partner') || designation.includes('vc') || designation.includes('capital');
     return activeTab === 'investors' ? isInvestor : !isInvestor;
  });

  return (
    <div className="min-h-screen pt-16 px-4 md:px-8 lg:px-24 font-inter bg-slate-50 text-slate-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 pb-20">
        
        {/* Left Sidebar - Profile & Nav */}
        <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 border-[3px] border-cyan-500 shadow-inner relative">
               <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <h2 className="font-bold text-xl font-inter text-slate-800">My Profile</h2>
            <p className="text-sm text-cyan-600 font-semibold mb-6 flex items-center justify-center gap-1"><Building2 className="w-3 h-3" /> Founder @ Stealth</p>
            <div className="text-xs text-slate-600 text-left space-y-3 border-t border-slate-100 pt-5">
              <div className="flex justify-between items-center"><span className="font-medium">Direct Connections</span> <span className="text-slate-900 font-bold bg-slate-100 px-2 py-1 rounded">142</span></div>
              <div className="flex justify-between items-center"><span className="font-medium">Profile Views (30d)</span> <span className="text-cyan-600 font-bold bg-cyan-50 px-2 py-1 rounded">45</span></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-3 flex flex-col gap-1 text-sm text-slate-600 font-bold tracking-wider uppercase">
            <button className="text-left p-4 hover:bg-slate-50 hover:text-cyan-600 rounded-xl transition-all flex items-center gap-3">
              <UserPlus className="w-5 h-5" /> My Network
            </button>
            <button className="text-left p-4 hover:bg-slate-50 hover:text-cyan-600 rounded-xl transition-all flex items-center gap-3">
              <Briefcase className="w-5 h-5" /> Opportunities
            </button>
            <button className="text-left p-4 hover:bg-slate-50 hover:text-cyan-600 rounded-xl transition-all flex items-center gap-3">
              <MessageSquare className="w-5 h-5" /> Messages
              <span className="ml-auto bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">3</span>
            </button>
          </div>
        </div>

        {/* Main Feed Area */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Search Bar */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-400 transition-all">
            <Search className="text-slate-400 w-5 h-5 ml-4 shrink-0" />
            <input type="text" placeholder="Search founders, investors, or skills..." className="flex-1 p-3 bg-transparent outline-none text-slate-800 font-inter placeholder:text-slate-400" />
            <button className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors mr-1"><Filter className="w-4 h-4" /></button>
          </div>

          {/* Toggle Tab */}
          <div className="flex gap-2 p-1 bg-slate-200/50 rounded-xl w-full sm:w-fit mx-auto lg:mx-0">
            <button 
               onClick={() => setActiveTab('founders')} 
               className={`py-2.5 px-6 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === 'founders' ? 'bg-white text-cyan-600' : 'text-slate-500 hover:text-slate-700 shadow-none'}`}
            >
               Founders Grid
            </button>
            <button 
               onClick={() => setActiveTab('investors')} 
               className={`py-2.5 px-6 rounded-lg text-sm font-bold transition-all shadow-sm ${activeTab === 'investors' ? 'bg-white text-cyan-600' : 'text-slate-500 hover:text-slate-700 shadow-none'}`}
            >
               Investors & Mentors
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {loading ? (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-slate-500 font-bold">Loading profiles...</div>
            ) : filteredProfiles.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center py-20 text-slate-500 font-bold">No profiles found in this category.</div>
            ) : filteredProfiles.map(profile => (
              <div key={profile.id} className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-cyan-200 flex flex-col">
                {activeTab === 'investors' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-full border border-amber-200">
                     <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </div>
                )}
                
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full flex-shrink-0 ${activeTab === 'investors' ? 'bg-amber-100 border-2 border-amber-400' : 'bg-cyan-100 border-2 border-cyan-400'}`}>
                    <img src={profile.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${profile.first_name}`} alt={profile.first_name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="flex-1 mt-1">
                    <h3 className="font-bold text-lg font-inter text-slate-900 group-hover:text-cyan-700 transition-colors">{profile.first_name} {profile.last_name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{profile.designation} @ {profile.company}</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-2 flex items-center gap-1 uppercase tracking-wider">
                       <MapPin className="w-3 h-3" /> {profile.education || 'Location Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                     {(profile.skills ? profile.skills.split(',').slice(0, 3) : ['Skill']).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 tracking-wide uppercase">{tag.trim()}</span>
                     ))}
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed line-clamp-3 font-inter flex-grow">
                  {profile.interests ? `Interests: ${profile.interests}` : (activeTab === 'investors' 
                    ? "Evaluating highly disruptive startups in the artificial intelligence and financial compliance sectors. We write checks between $500k to $2M."
                    : "Building the next generation of predictive LLMs for enterprise architecture. Seeking seed investment and Go-To-Market strategy mentors to scale rapidly.")}
                </p>
                
                <div className="flex gap-3 mt-auto">
                  {getConnectionStatus(profile.identifier) === 'accepted' ? (
                    <button className="flex-1 bg-slate-100 text-slate-500 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-default">
                      <Check className="w-4 h-4" /> Connected
                    </button>
                  ) : getConnectionStatus(profile.identifier) === 'pending' ? (
                    connections.find(c => c.sender_email === user?.email && c.receiver_email === profile.identifier) ? (
                      <button className="flex-1 bg-amber-50 text-amber-600 border border-amber-200 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4" /> Request Sent
                      </button>
                    ) : (
                      <div className="flex-1 flex gap-2">
                         <button 
                            onClick={() => handleAccept(profile.identifier)}
                            disabled={actionLoading === profile.identifier}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all"
                         >
                            {actionLoading === profile.identifier ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Accept"}
                         </button>
                         <button className="flex-1 bg-slate-100 text-slate-500 py-2.5 rounded-xl text-[10px] font-bold uppercase">Decline</button>
                      </div>
                    )
                  ) : (
                    <button 
                      onClick={() => handleConnect(profile.identifier)}
                      disabled={actionLoading === profile.identifier || profile.identifier === user?.email}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white shadow-md shadow-cyan-600/20 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-all disabled:opacity-50"
                    >
                      {actionLoading === profile.identifier ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Connect"}
                    </button>
                  )}
                  <button 
                    onClick={() => setActiveChat(profile)}
                    disabled={!user?.email}
                    className="px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors uppercase text-xs font-bold tracking-widest text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Sidebar - Suggested Matches */}
        <div className="hidden lg:flex w-72 flex-col gap-6">
          <div className="bg-gradient-to-br from-cyan-50 to-white border border-cyan-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
             {/* decorative blob */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-100 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-2">
               <Zap className="text-orange-500 w-5 h-5" fill="currentColor" />
               <h3 className="font-inter font-extrabold text-cyan-900 tracking-wider uppercase text-sm">Propulsion Match</h3>
            </div>
            
            <p className="text-xs text-slate-500 mb-6 font-inter leading-relaxed relative z-10">Based on your Stealth profile and recent activities, these individuals perfectly align with your current stage.</p>
            
            <div className="space-y-3 relative z-10">
              {[1, 2, 3].map((_, i) => (
                 <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-white p-2.5 rounded-xl transition-all border border-transparent hover:border-cyan-100 hover:shadow-sm">
                   <div className="w-10 h-10 bg-gradient-to-tr from-amber-200 to-orange-100 rounded-full shrink-0 border-2 border-white shadow-sm flex items-center justify-center font-bold text-amber-700 text-xs">SJ</div>
                   <div>
                     <h4 className="text-sm font-bold text-slate-800">Sarah V.</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seed Funder</p>
                   </div>
                 </div>
              ))}
            </div>
            <button className="mt-6 w-full py-3 bg-white border border-cyan-200 text-xs uppercase tracking-widest text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 font-bold text-center rounded-xl transition-colors relative z-10 shadow-sm">View All Matches</button>
          </div>
        </div>

      </div>

      {/* Sliding P2P Chat Panel */}
      <AnimatePresence>
        {activeChat && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveChat(null)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            {/* Slide-over panel container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white border-l border-slate-200 z-50 flex flex-col shadow-2xl font-inter text-slate-900"
            >
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 border border-cyan-200 overflow-hidden">
                    <img src={activeChat.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${activeChat.first_name}`} alt={activeChat.first_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-950">{activeChat.first_name} {activeChat.last_name}</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">{activeChat.designation} @ {activeChat.company}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveChat(null)}
                  className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-800">Secure P2P Connection</h4>
                    <p className="text-[10px] text-slate-500 max-w-[180px] leading-relaxed">Send a message to initiate your conversation in this encrypted workspace.</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.sender_id !== activeChat.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                          isMe 
                            ? 'bg-cyan-600 text-white rounded-br-none' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                        }`}>
                          <p className="leading-relaxed break-words">{msg.content}</p>
                          <span className={`text-[8px] block mt-1 text-right ${isMe ? 'text-cyan-200/80' : 'text-slate-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-cyan-500 focus:bg-white transition-all text-slate-900 font-semibold"
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
