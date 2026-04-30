"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, BarChart, FileText, Wrench, Globe, Layout, 
  DollarSign, Activity, Terminal, Search, Filter, ArrowRight 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

type ToolCard = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  redirect_link: string;
  category: string;
  price: number;
  discount_price?: number;
};

const CATEGORIES = ['All', 'Infrastructure', 'Finance', 'Marketing', 'Productivity'];

const getIconForCategory = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'infrastructure': return <Terminal className="w-10 h-10" />;
    case 'finance': return <DollarSign className="w-10 h-10" />;
    case 'marketing': return <Globe className="w-10 h-10" />;
    case 'productivity': return <Activity className="w-10 h-10" />;
    default: return <Wrench className="w-10 h-10" />;
  }
};

const getBgColorForCategory = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'infrastructure': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'finance': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'marketing': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'productivity': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

const getHoverBorderColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'infrastructure': return 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]';
    case 'finance': return 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]';
    case 'marketing': return 'hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]';
    case 'productivity': return 'hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]';
    default: return 'hover:border-white/20';
  }
}

export default function Tools() {
  const [tools, setTools] = useState<ToolCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchTools() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tools_cards')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setTools(data || []);
      } catch (err: any) {
        console.error('Error fetching tools:', err.message);
        setError('Connection interrupted. Please verify your internet or Supabase configuration.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            <Wrench className="w-3 h-3" /> Core Infrastructure
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-montserrat font-bold mb-6 tracking-tight"
          >
            Startup <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Toolkit.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Access the exact same frameworks and automations used by elite founders to build billion-dollar systems.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/60 hover:text-cyan-400 transition-colors"
              title="Refresh Tools"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-3xl">
            <p className="text-red-400 font-bold mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs font-bold uppercase tracking-widest text-white underline underline-offset-4">Retry Connection</button>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold mb-2">No tools matching your criteria</h3>
            <p className="text-white/40 text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <Link 
                    href={tool.redirect_link || "#"} 
                    target="_blank"
                    className={`group block h-full bg-[#0a0a0f] border border-white/10 p-8 rounded-[2.5rem] transition-all duration-500 relative overflow-hidden ${getHoverBorderColor(tool.category)}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${getBgColorForCategory(tool.category)} shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden`}>
                        {tool.image_url ? (
                          <Image 
                            src={tool.image_url} 
                            alt={tool.title} 
                            width={64} 
                            height={64} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          getIconForCategory(tool.category)
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <div className={`text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter border ${
                          (tool.discount_price === 0 || (!tool.discount_price && tool.price === 0))
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                            : 'bg-white/5 text-white/80 border-white/10'
                        }`}>
                          {tool.discount_price !== undefined && tool.discount_price !== null ? (
                            tool.discount_price === 0 ? 'Free' : `₹${tool.discount_price}`
                          ) : (
                            tool.price === 0 ? 'Free' : `₹${tool.price}`
                          )}
                        </div>
                        {tool.discount_price !== undefined && tool.discount_price !== null && tool.price > tool.discount_price && (
                          <span className="text-[10px] text-white/30 line-through font-bold">₹{tool.price}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3 relative z-10">
                      <span className="text-[10px] uppercase tracking-widest font-black text-cyan-500/60 group-hover:text-cyan-400 transition-colors">{tool.category || 'Utility'}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4 text-white font-montserrat leading-tight group-hover:text-cyan-400 transition-colors relative z-10">{tool.title}</h2>
                    <p className="text-white/50 text-sm font-inter leading-relaxed mb-8 relative z-10">{tool.description}</p>
                    
                    <div className="mt-auto flex items-center gap-2 text-xs font-bold text-white group-hover:text-cyan-400 transition-all relative z-10">
                      Access Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
