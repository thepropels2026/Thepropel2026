"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Search, 
  ExternalLink, 
  Tag, 
  Star, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

// Define the type for a Tool Card to ensure data consistency
type ToolCard = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  redirect_link: string;
  category: string;
  price: number;
  discount_price?: number;
  created_at: string;
};

const CATEGORIES = ['All', 'AI Tools', 'Marketing', 'Development', 'Design', 'Productivity'];

export default function ToolsLibrary() {
  const [tools, setTools] = useState<ToolCard[]>([]);
  const [filteredTools, setFilteredTools] = useState<ToolCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function fetchTools() {
      try {
        const { data, error } = await supabase
          .from('tools_cards')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTools(data || []);
        setFilteredTools(data || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  useEffect(() => {
    let result = tools;
    if (selectedCategory !== 'All') {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTools(result);
  }, [searchQuery, selectedCategory, tools]);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-inter pt-32 pb-24 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4" /> Elite Resource Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-montserrat font-bold mb-6 tracking-tight">
            Founder's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Toolbox</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Curated selection of world-class tools to accelerate your startup from 0 to 1. Hand-picked for the modern entrepreneur.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-cyan-500/50 transition-all text-sm backdrop-blur-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat 
                  ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image 
                    src={tool.image_url} 
                    alt={tool.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-cyan-400 uppercase tracking-tighter">
                    {tool.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 font-montserrat group-hover:text-cyan-400 transition-colors">{tool.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col">
                      {tool.discount_price ? (
                        <>
                          <span className="text-slate-500 text-xs line-through">₹{tool.price}</span>
                          <span className="text-2xl font-black text-white">₹{tool.discount_price}</span>
                        </>
                      ) : (
                        <span className="text-2xl font-black text-white">₹{tool.price}</span>
                      )}
                    </div>
                    <Link 
                      href={tool.redirect_link}
                      target="_blank"
                      className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-colors"
                    >
                      GET TOOL <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[2px]">
                    <Clock className="w-3 h-3" /> Updated: {new Date(tool.created_at).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTools.length === 0 && (
          <div className="text-center py-24 bg-white/5 border border-dashed border-white/10 rounded-[40px]">
            <Layers className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-400">No tools found matching your criteria.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
