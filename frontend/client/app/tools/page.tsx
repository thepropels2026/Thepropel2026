"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, BarChart, FileText, Wrench, Globe, Layout, 
  DollarSign, Activity, Terminal, Search, Filter, ArrowRight, User,
  Sparkles, Zap, ShieldCheck, Loader2
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
        setError("Network sync failed. Please verify connection.");
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
              <Zap className="w-3 h-3" /> Startup Arsenal
            </div>
            <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-8 leading-[1.1] tracking-tighter italic">
              Automated <br/>
              <span className="relative">
                Growth Engine.
                <svg className="absolute -bottom-4 left-0 w-full h-4" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 15C50 5 100 25 150 15C200 5 250 25 295 15" stroke="#00F2FF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M5 10C50 0 100 20 150 10C200 0 250 20 295 10" stroke="#FF5F00" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              Deploy the exact frameworks, automations, and infrastructures used by global unicorns to scale from zero to Series A.
            </p>
          </motion.div>
        </div>

        {/* --- FILTERS & SEARCH --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl"
        >
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-white text-black shadow-xl' 
                    : 'bg-white/5 text-white/30 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-80 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search the arsenal..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[20px] py-4 pl-14 pr-6 text-xs text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-white/10 font-bold"
                />
             </div>
             <button onClick={() => window.location.reload()} className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <RefreshCw className={`w-4 h-4 text-white/40 ${isLoading ? 'animate-spin' : ''}`} />
             </button>
          </div>
        </motion.div>

        {/* --- GRID --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[450px] rounded-[40px] bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="py-32 text-center bg-white/[0.02] border border-white/10 rounded-[40px]">
             <Wrench className="w-16 h-16 text-white/10 mx-auto mb-6" />
             <h3 className="text-2xl font-black text-white/40 uppercase italic tracking-tight">No Assets Found</h3>
             <p className="text-white/20 text-xs font-bold uppercase tracking-widest mt-2">Adjust your terminal filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div 
                    onClick={() => handleToolClick(tool)}
                    className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] overflow-hidden cursor-pointer transition-all hover:bg-white/[0.05] hover:border-white/20 flex flex-col h-full shadow-2xl relative"
                  >
                    {/* Inner Glow */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                    
                    {/* Image Area */}
                    <div className="relative h-64 w-full bg-black/40">
                      {tool.image_url ? (
                        <Image 
                          src={tool.image_url} 
                          alt={tool.title} 
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                           <Terminal className="w-12 h-12 text-white/10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] to-transparent opacity-80" />
                      
                      <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                         <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white/60">
                            {tool.category}
                         </span>
                         {new Date(tool.created_at).getTime() > Date.now() - 48 * 60 * 60 * 1000 && (
                            <span className="px-3 py-1 bg-cyan-500 text-black rounded-full text-[8px] font-black uppercase tracking-widest">
                               PROTOTYPE NEW
                            </span>
                         )}
                      </div>
                    </div>

                    <div className="p-10 pt-6 flex flex-col flex-1">
                      <h3 className="text-2xl font-montserrat font-black text-white mb-4 uppercase tracking-tighter italic leading-tight group-hover:text-cyan-400 transition-colors">
                        {tool.title}
                      </h3>
                      
                      {/* Price Section */}
                      <div className="mb-6 flex items-baseline gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        {tool.discount_price ? (
                          <>
                            <span className="text-3xl font-black text-white tracking-tighter italic">₹{tool.discount_price}</span>
                            <span className="text-xs text-white/20 font-black line-through">₹{tool.price}</span>
                          </>
                        ) : (
                          <span className="text-3xl font-black text-white tracking-tighter italic">₹{tool.price}</span>
                        )}
                      </div>

                      <p className="text-white/40 text-sm font-medium leading-relaxed line-clamp-3 mb-10 italic">
                        "{tool.description}"
                      </p>

                      <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-[10px] font-black text-cyan-500 uppercase tracking-[0.2em] group-hover:translate-x-2 transition-all">
                            Initiate Download <ArrowRight className="w-4 h-4" />
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            <ShieldCheck className="w-6 h-6" />
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
