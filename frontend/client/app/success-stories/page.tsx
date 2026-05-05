"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, Zap, ArrowRight, PlayCircle, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

type Niche = 'All' | 'AI' | 'E-commerce' | 'SaaS';

type Story = {
  id: string;
  founder_name: string;
  startup_name: string;
  niche: Niche;
  metric: string;
  metric_label: string;
  summary: string;
  avatar_url: string;
  media_url: string;
  media_type: 'image' | 'video';
};

const FILTERS: Niche[] = ['All', 'AI', 'E-commerce', 'SaaS'];

export default function SuccessStories() {
  const [selectedNiche, setSelectedNiche] = useState<Niche>('All');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from('success_stories')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStories(data || []);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  const filteredStories = stories.filter(
    (story) => selectedNiche === 'All' || story.niche === selectedNiche
  );

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADER --- */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <TrendingUp className="w-3 h-3" /> Proven Alpha
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
              Elite <br/>
              <span className="relative">
                Success Nodes.
                <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#00F2FF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M5 10C50 0 100 20 150 10C200 0 250 20 295 10" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>
            <p className="text-white/40 text-lg font-medium leading-relaxed max-w-2xl italic">
              Real humans. Real revenue. Discover how ambitious nodes transformed concepts into scalable, revenue-generating businesses through the Propels protocol.
            </p>
          </motion.div>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="flex gap-4 p-2 bg-white/[0.03] rounded-[2rem] border border-white/5 w-fit mb-20 overflow-x-auto hide-scrollbar max-w-full">
          {FILTERS.map((niche) => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`h-14 px-10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedNiche === niche 
                  ? 'bg-white text-black shadow-2xl' 
                  : 'text-white/40 hover:bg-white/5'
              }`}
            >
              {niche}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {Array(3).fill(0).map((_, i) => (
               <div key={i} className="h-[500px] rounded-[40px] bg-white/5 animate-pulse border border-white/10" />
             ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story, index) => (
                <motion.div
                  layout
                  key={story.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/success-stories/${story.id}`} className="group bg-white rounded-[40px] p-1 shadow-2xl overflow-hidden flex flex-col h-full hover:-translate-y-2 transition-all duration-500">
                    <div className="h-64 relative overflow-hidden rounded-t-[39px]">
                       <Image 
                         src={story.media_url} 
                         alt={story.founder_name} 
                         fill
                         className="object-cover group-hover:scale-110 transition-transform duration-700"
                       />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                       <div className="absolute top-6 right-6">
                          <span className="text-[8px] font-black px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white uppercase tracking-[0.2em]">
                            {story.niche}
                          </span>
                       </div>
                       {story.media_type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 scale-90 group-hover:scale-100 transition-transform">
                                <PlayCircle className="w-8 h-8 text-white" />
                             </div>
                          </div>
                       )}
                    </div>
                    
                    <div className="p-10 pt-0 -mt-10 relative z-10 flex flex-col flex-grow bg-white rounded-b-[39px]">
                       <div className="flex items-end gap-5 mb-8">
                          <div className="w-20 h-20 rounded-3xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
                             <Image 
                               src={story.avatar_url} 
                               alt={story.founder_name} 
                               width={80} 
                               height={80} 
                               className="w-full h-full object-cover" 
                             />
                          </div>
                          <div className="pb-1">
                             <h3 className="font-black text-2xl font-montserrat text-slate-900 uppercase italic tracking-tighter leading-none mb-1">{story.founder_name}</h3>
                             <p className="text-cyan-600 text-[10px] font-black uppercase tracking-widest">{story.startup_name}</p>
                          </div>
                       </div>

                       <div className="mb-8 flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-inner">
                          <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                             <Zap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                             <div className="text-2xl font-black text-slate-900 font-montserrat tracking-tighter italic leading-none mb-1">
                               {story.metric}
                             </div>
                             <div className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">
                               {story.metric_label}
                             </div>
                          </div>
                       </div>

                       <p className="text-slate-500 text-sm font-medium italic leading-relaxed mb-10 flex-grow">
                         "{story.summary}"
                       </p>

                       <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between group-hover:text-cyan-600 transition-colors">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">View Node Profile</span>
                          <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white group-hover:bg-cyan-600 transition-all shadow-xl">
                             <ArrowRight className="w-5 h-5" />
                          </div>
                       </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredStories.length === 0 && (
          <div className="text-center py-32 bg-white/[0.02] border border-white/10 rounded-[40px]">
             <Users className="w-16 h-16 text-white/10 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-white/40 uppercase italic tracking-tight">No Success Nodes Detected</h3>
          </div>
        )}

      </div>
    </div>
  );
}
