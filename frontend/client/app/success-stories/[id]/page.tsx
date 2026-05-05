"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, Target, Rocket, DollarSign, Zap, ArrowLeft, 
  PlayCircle, Sparkles, ShieldCheck, TrendingUp, Globe,
  Briefcase, GraduationCap, Compass, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types
type Milestone = { title: string; description: string; icon: 'Lightbulb' | 'Target' | 'Rocket' | 'DollarSign' };

type Story = {
  id: string;
  founder_name: string;
  startup_name: string;
  niche: string;
  metric: string;
  metric_label: string;
  summary: string;
  avatar_url: string;
  media_url: string;
  media_type: 'image' | 'video';
  roadmap: Milestone[];
};

const IconMap: Record<string, JSX.Element> = {
  Lightbulb: <Lightbulb className="w-5 h-5 text-cyan-400" />,
  Target: <Target className="w-5 h-5 text-purple-400" />,
  Rocket: <Rocket className="w-5 h-5 text-orange-400" />,
  DollarSign: <DollarSign className="w-5 h-5 text-emerald-400" />
};

export default function StoryDetail({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStory() {
      try {
        const { data, error } = await supabase
          .from('success_stories')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setStory(data);
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStory();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col justify-center items-center text-white">
        <h1 className="text-4xl font-black font-montserrat uppercase italic tracking-tighter mb-4">404: Node Missing</h1>
        <Link href="/success-stories" className="text-cyan-400 font-black uppercase tracking-widest text-[10px] underline">Return to Feed</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-32 pb-24 relative overflow-hidden font-inter">
      
      {/* --- GLOBAL GRID BACKGROUND --- */}
      <div className="fixed inset-0 z-0 opacity-[0.1] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase tracking-widest text-[10px] font-black group">
           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Case Studies
        </button>

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-20">
          <div className="relative group">
             <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
             <img 
               src={story.avatar_url} 
               alt={story.founder_name} 
               className="w-40 h-40 rounded-[3rem] border-4 border-white/10 relative z-10 object-cover shadow-2xl bg-[#0a0a0f]"
             />
             <div className="absolute -bottom-2 -right-2 z-20 w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl border-4 border-[#080808]">
                <ShieldCheck className="w-6 h-6" />
             </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <TrendingUp className="w-3 h-3" /> Authenticated Alpha Story
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black leading-[1.1] tracking-tighter italic uppercase">
              {story.founder_name} <br/>
              <span className="text-white/20">{story.startup_name}</span>
            </h1>
            
            <div className="pt-8 flex flex-wrap gap-6">
               <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 px-8 py-6 rounded-[2.5rem] shadow-2xl">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                    <Zap className="w-7 h-7 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-montserrat tracking-tighter italic leading-none mb-1">{story.metric}</div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">{story.metric_label}</div>
                  </div>
               </div>
               
               <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-3xl border border-white/10 px-8 py-6 rounded-[2.5rem] shadow-2xl opacity-40">
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                    <Globe className="w-7 h-7 text-cyan-500" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white font-montserrat tracking-tighter italic leading-none mb-1">{story.niche}</div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Primary Vector</div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Large Media Display */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full aspect-video bg-black rounded-[4rem] overflow-hidden shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] mb-20 relative group border border-white/10"
        >
          <img src={story.media_url} alt="Startup Showcase" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-60" />
          {story.media_type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-2xl">
                <PlayCircle className="w-10 h-10 text-black ml-1" />
              </div>
            </div>
          )}
          <div className="absolute bottom-12 left-12 max-w-xl">
             <p className="text-lg font-medium italic text-white/60 leading-relaxed">
                "{story.summary}"
             </p>
          </div>
        </motion.div>

        {/* The Roadmap */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center justify-between mb-12">
                 <h2 className="text-3xl font-black font-montserrat italic uppercase tracking-tighter">The Propulsion <span className="text-cyan-500">Log.</span></h2>
                 <div className="h-px flex-1 mx-8 bg-white/5" />
              </div>
              
              <div className="relative border-l border-white/10 ml-8 space-y-16">
                {story.roadmap && story.roadmap.map((milestone, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative pl-16 group"
                  >
                    <div className="absolute -left-[21px] top-0 w-10 h-10 bg-[#080808] border border-white/10 rounded-full flex items-center justify-center shadow-2xl group-hover:border-cyan-500 transition-colors">
                      {IconMap[milestone.icon] || IconMap['Lightbulb']}
                    </div>
                    
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 hover:bg-white/[0.05] transition-all group-hover:-translate-y-1 duration-500 shadow-2xl">
                      <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">Protocol Milestone 0{idx + 1}</div>
                      <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 font-montserrat">{milestone.title}</h4>
                      <p className="text-white/40 leading-relaxed text-base italic font-medium">
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>

           <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                 <div className="bg-gradient-to-br from-cyan-950/20 to-transparent border border-cyan-500/10 rounded-[3rem] p-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                       <Sparkles className="w-8 h-8" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 italic">Neural Match</h4>
                    <p className="text-4xl font-montserrat font-black italic tracking-tighter text-cyan-400">98%</p>
                    <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.3em] mt-6">Protocol Alignment Verified</p>
                 </div>

                 <div className="bg-white rounded-[3rem] p-10 text-black shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-white/[0.05] pointer-events-none">
                       <Zap className="w-12 h-12" />
                    </div>
                    <h4 className="text-xl font-black uppercase italic tracking-tighter mb-4 font-montserrat">Join the Circle</h4>
                    <p className="text-xs font-bold text-slate-500 italic mb-8">Access the exact frameworks {story.founder_name.split(' ')[0]} used to scale.</p>
                    <button onClick={() => router.push('/tools')} className="w-full h-14 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                       BROWSE ARSENAL
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
