"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Rocket, DollarSign, Zap, ArrowLeft, PlayCircle } from 'lucide-react';
import Link from 'next/link';

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
  Lightbulb: <Lightbulb className="w-5 h-5 text-blue-500" />,
  Target: <Target className="w-5 h-5 text-purple-500" />,
  Rocket: <Rocket className="w-5 h-5 text-orange-500" />,
  DollarSign: <DollarSign className="w-5 h-5 text-green-500" />
};

export default function StoryDetail({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="min-h-screen bg-[#fafafa] flex justify-center items-center">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
    </div>;
  }

  if (!story) {
    return <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center text-slate-800">
      <h1 className="text-2xl font-bold mb-4">Story not found</h1>
      <Link href="/success-stories" className="text-cyan-600 hover:underline">Return to Success Stories</Link>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-inter pb-24">
      {/* Light Theme Navigation Spacer */}
      <div className="h-20 bg-white border-b border-slate-200"></div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Link href="/success-stories" className="inline-flex items-center gap-2 text-slate-500 hover:text-cyan-600 transition-colors font-semibold text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to all stories
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <img src={story.avatar_url} alt={story.founder_name} className="w-32 h-32 rounded-3xl object-cover shadow-lg border-4 border-white" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{story.niche}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-montserrat tracking-tight text-slate-900 mb-2">{story.founder_name}</h1>
            <p className="text-xl text-cyan-600 font-bold mb-6">{story.startup_name}</p>
            
            <div className="inline-flex items-center gap-3 bg-orange-50 border border-orange-100 px-6 py-4 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-black text-orange-600 font-montserrat">{story.metric}</div>
                <div className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{story.metric_label}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Media Display */}
        <div className="w-full aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl mb-16 relative group">
          <img src={story.media_url} alt="Startup Showcase" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
          {story.media_type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors">
              <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl">
                <PlayCircle className="w-10 h-10 text-slate-900 ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* The Roadmap */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-slate-100">
          <h2 className="text-2xl font-black font-montserrat text-slate-900 mb-8 border-b border-slate-100 pb-6">The Journey to {story.metric}</h2>
          
          <div className="relative border-l-2 border-slate-100 ml-6 space-y-12">
            {story.roadmap && story.roadmap.map((milestone, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-10"
              >
                <div className="absolute -left-[21px] top-0 w-10 h-10 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                  {IconMap[milestone.icon] || IconMap['Lightbulb']}
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Milestone 0{idx + 1}</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{milestone.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
