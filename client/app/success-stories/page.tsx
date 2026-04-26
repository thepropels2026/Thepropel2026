"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, Zap, ArrowRight, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#050505] text-white font-inter relative overflow-hidden pt-32 pb-24">
      {/* Background Elements */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
            <TrendingUp className="w-4 h-4" /> Proven Results
          </div>
          <h1 className="text-5xl md:text-7xl font-montserrat font-bold mb-6 tracking-tight">
            Real Founders. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-[#FF5F00]">Real Revenue.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Discover the humans behind the startups. See how ambitious students transformed their ideas into scalable, revenue-generating businesses through The Propels.
          </p>
        </motion.div>

        {/* FILTER BAR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {FILTERS.map((niche) => (
            <button
              key={niche}
              onClick={() => setSelectedNiche(niche)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                selectedNiche === niche
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {niche}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredStories.map((story, index) => (
                <motion.div
                  layout
                  key={story.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/success-stories/${story.id}`} className="group relative bg-[#0a0a0f] border border-white/10 rounded-[2rem] hover:border-cyan-500/30 transition-colors duration-500 overflow-hidden cursor-pointer shadow-xl flex flex-col h-full block">
                    {/* Media Section */}
                    <div className="w-full h-56 md:h-64 relative overflow-hidden bg-black/50">
                      <img 
                        src={story.media_url} 
                        alt={`${story.founder_name}'s journey`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                      {story.media_type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <PlayCircle className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
                      <div className="absolute top-4 right-4 z-10">
                         <span className="text-[10px] font-bold px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white/90 uppercase tracking-widest shadow-lg">
                          {story.niche}
                        </span>
                      </div>
                    </div>
                    
                    <div className="relative z-10 flex flex-col flex-grow p-8 pt-0 -mt-8">
                      {/* Avatar */}
                      <div className="flex items-end gap-4 mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-[#0a0a0f] p-1 shadow-2xl relative z-20 group-hover:-translate-y-2 transition-transform duration-500">
                          <img src={story.avatar_url} alt={story.founder_name} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="pb-1">
                          <h3 className="font-bold text-xl font-montserrat text-white">{story.founder_name}</h3>
                          <p className="text-cyan-400 text-sm font-semibold">{story.startup_name}</p>
                        </div>
                      </div>

                      {/* Key Metric Badge */}
                      <div className="mb-6 flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <div className="text-xl font-black text-white font-montserrat">
                            {story.metric}
                          </div>
                          <div className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                            {story.metric_label}
                          </div>
                        </div>
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                        {story.summary}
                      </p>

                      <div className="mt-auto border-t border-white/5 pt-6 flex items-center justify-between group-hover:text-cyan-300 transition-colors w-full">
                        <span className="text-sm font-bold text-white/80">View Full Story</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Award className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No stories found</h3>
            <p className="text-white/50">There are no success stories available right now.</p>
          </motion.div>
        )}

      </div>
    </div>
);
}
