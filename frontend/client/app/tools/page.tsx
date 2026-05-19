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
import { RefreshCw, ShoppingCart } from 'lucide-react';
import CheckoutModal from '../../components/CheckoutModal';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../../components/CartDrawer';
import { useAuth } from '../../components/AuthContext';

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
    case 'infrastructure': return <Terminal className="w-8 h-8" />;
    case 'finance': return <DollarSign className="w-8 h-8" />;
    case 'marketing': return <Globe className="w-8 h-8" />;
    case 'productivity': return <Activity className="w-8 h-8" />;
    default: return <Wrench className="w-8 h-8" />;
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
    case 'infrastructure': return 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]';
    case 'finance': return 'hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]';
    case 'marketing': return 'hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]';
    case 'productivity': return 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]';
    default: return 'hover:border-white/10';
  }
}

export default function Tools() {
  const { isRegistered, setRegisterModalOpen } = useAuth();
  const [tools, setTools] = useState<ToolCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart, setIsCartOpen } = useCart();
  
  // Modal state (keeping legacy single checkout for now, but adding cart support)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolCard | null>(null);

  useEffect(() => {
    async function fetchTools() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Strategy 1: Try centralized backend API
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://thepropels-production.up.railway.app';
        try {
          const response = await fetch(`${apiBase}/api/tools`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              setTools(data);
              return; // Success, exit function
            }
          }
        } catch (apiErr) {
          console.warn('API fetch failed, falling back to direct Supabase:', apiErr);
        }

        // Strategy 2: Fallback to direct Supabase fetch
        const { data, error: sbError } = await supabase
          .from('tools_cards')
          .select('*')
          .order('created_at', { ascending: false });

        if (sbError) throw sbError;
        
        setTools(data || []);
      } catch (err: any) {
        console.error('Final fetch error:', err);
        const errorMessage = err.message || 'Unknown error';
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'mjwadwxwnwkbcfndvnfy';
        const projectId = url.includes('//') ? url.split('//')[1]?.split('.')[0] : url;
        setError(`Connection failed: ${errorMessage}. (Project: ${projectId})`);
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
    <div className="min-h-screen bg-slate-50 text-[rgba(0,0,0,0.9)] pt-32 pb-20 font-inter">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-cyan-100/30 to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Wrench className="w-2.5 h-2.5" /> Core Infrastructure
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-[rgba(0,0,0,0.9)]"
          >
            Startup <span className="text-cyan-600">Toolkit.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-[rgba(0,0,0,0.5)] max-w-xl mx-auto leading-relaxed font-medium"
          >
            Access the exact same frameworks and automations used by elite founders to build billion-dollar systems.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white border border-slate-200 shadow-sm p-4 rounded-2xl">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-[rgba(0,0,0,0.8)] focus:outline-none focus:border-black transition-all"
              />
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-black transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-72 bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 text-sm font-bold mb-3">{error}</p>
            <button onClick={() => window.location.reload()} className="text-[10px] font-bold uppercase tracking-widest text-white underline underline-offset-4">Retry Connection</button>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-white/10" />
            </div>
            <h3 className="text-lg font-bold mb-1">No tools found</h3>
            <p className="text-white/30 text-xs">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  layout
                >
                  <div 
                    onClick={() => handleToolClick(tool)} 
                    className="cursor-pointer group block h-full bg-white border border-slate-200 p-0 rounded-3xl transition-all duration-500 relative overflow-hidden hover:border-cyan-200 hover:shadow-xl"
                  >
                    {/* Background Glow */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-100/20 rounded-full blur-[40px] group-hover:bg-cyan-100/40 transition-all duration-500" />
                    
                    {/* Image Header - Enhanced Full Size */}
                    <div className="relative h-64 w-full overflow-hidden border-b border-slate-100 bg-slate-50">
                      {tool.image_url ? (
                        <Image 
                          src={tool.image_url} 
                          alt={tool.title} 
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105" 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          priority={index < 4}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getIconForCategory(tool.category)}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 pt-4 relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] uppercase tracking-wider font-bold px-3 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                          {tool.category || 'Utility'}
                        </span>
                        <div className="flex items-center gap-1 text-cyan-600">
                          <Activity className="w-2.5 h-2.5 animate-pulse" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">Active</span>
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold mb-1.5 text-[rgba(0,0,0,0.9)] tracking-tight leading-tight group-hover:text-cyan-700 transition-colors">
                        {tool.title}
                      </h2>

                      {/* Pricing Section */}
                      <div className="flex items-baseline gap-3 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-cyan-100 transition-all">
                        {tool.discount_price !== undefined && tool.discount_price !== null ? (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Offer</span>
                              <span className="text-2xl font-bold text-[rgba(0,0,0,0.9)] tracking-tighter">₹{tool.discount_price}</span>
                            </div>
                            {tool.price > tool.discount_price && (
                              <div className="flex flex-col">
                                <span className="text-[9px] text-red-500 font-black uppercase tracking-widest mb-0.5">Retail</span>
                                <span className="text-lg text-red-500/60 font-black line-through decoration-red-600 decoration-[2.5px]">₹{tool.price}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Access</span>
                            <span className="text-2xl font-bold text-[rgba(0,0,0,0.9)] tracking-tighter">₹{tool.price}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[rgba(0,0,0,0.5)] text-xs font-medium leading-relaxed mb-6 line-clamp-2 group-hover:text-[rgba(0,0,0,0.7)] transition-colors">{tool.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isRegistered) {
                              setRegisterModalOpen(true);
                              return;
                            }
                            addToCart(tool);
                            setIsCartOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-50 text-[10px] font-bold uppercase tracking-widest text-cyan-600 hover:bg-cyan-100 transition-all border border-cyan-100"
                        >
                          Add to Cart <ShoppingCart className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex -space-x-1.5">
                          {[1,2].map(i => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                              <User className="w-2.5 h-2.5 text-slate-400" />
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
