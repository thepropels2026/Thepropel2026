"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, BarChart, FileText, Wrench, Globe, Layout, 
  DollarSign, Activity, Terminal, Search, Filter, ArrowRight, User 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';
import CheckoutModal from '../../components/CheckoutModal';

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
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolCard | null>(null);

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
        console.error('CRITICAL: Supabase Fetch Error', err);
        const errorMessage = err.message || 'Unknown network error';
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Hardcoded Default';
        setError(`Connection failed: ${errorMessage}. (Project: ${url.split('//')[1]?.split('.')[0] || 'Unknown'})`);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTools();
  }, []);

  const handleToolClick = (tool: ToolCard) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

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
                  <div 
                    onClick={() => handleToolClick(tool)} 
                    className={`cursor-pointer group block h-full bg-[#0a0a0f]/40 backdrop-blur-md border border-white/10 p-0 rounded-[2.5rem] transition-all duration-500 relative overflow-hidden ${getHoverBorderColor(tool.category)}`}
                  >
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] group-hover:bg-cyan-500/20 transition-all duration-500" />
                    
                    {/* Image Header */}
                    <div className="relative h-80 w-full overflow-hidden">
                      {tool.image_url ? (
                        <Image 
                          src={tool.image_url} 
                          alt={tool.title} 
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          {getIconForCategory(tool.category)}
                        </div>
                      )}
                      
                      {/* Gradient Overlays for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/40 to-transparent opacity-40" />
                    </div>
                    
                    <div className="p-8 pt-6 relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full border shadow-lg ${getBgColorForCategory(tool.category)}`}>
                          {tool.category || 'Utility'}
                        </span>
                        <div className="flex items-center gap-1.5 text-cyan-400">
                          <Activity className="w-3.5 h-3.5 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">Live System</span>
                        </div>
                      </div>
                      
                      <h2 className="text-3xl font-black mb-2 text-white font-montserrat tracking-tight leading-tight group-hover:text-cyan-400 transition-colors drop-shadow-2xl">
                        {tool.title}
                      </h2>

                      {/* Pricing Section */}
                      <div className="flex items-baseline gap-4 mb-5 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-all">
                        {tool.discount_price !== undefined && tool.discount_price !== null ? (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5 opacity-60">Limited Offer</span>
                              <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">₹{tool.discount_price}</span>
                            </div>
                            {tool.price > tool.discount_price && (
                              <div className="flex flex-col">
                                <span className="text-[10px] text-red-500/60 font-black uppercase tracking-widest mb-0.5">Original</span>
                                <span className="text-xl text-red-600 font-black line-through decoration-[#8b0000] decoration-4 opacity-90">₹{tool.price}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Standard Access</span>
                            <span className="text-4xl font-black text-white tracking-tighter">₹{tool.price}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-white/40 text-sm font-inter leading-relaxed mb-8 line-clamp-2 group-hover:text-white/60 transition-colors">{tool.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 group-hover:text-cyan-300 transition-all">
                          Get Instant Access <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                        <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0a0a0f] bg-slate-800 flex items-center justify-center">
                              <User className="w-3 h-3 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Checkout Modal Overlay */}
      {selectedTool && (
        <CheckoutModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          tool={selectedTool} 
        />
      )}
    </div>
  );
}
