"use client"; // Enable client-side interactivity
import React, { useEffect, useState } from 'react'; // React core hooks
import Link from 'next/link'; // Client-side routing
import { Briefcase, BarChart, FileText, Wrench, Globe, Layout, DollarSign, Activity, Terminal } from 'lucide-react'; // Icon set
import { supabase } from '@/lib/supabase'; // Supabase client initialization
import { motion } from 'framer-motion'; // Animation engine

// Type definition for a Tool card from the database
type ToolCard = {
  id: string; // Unique tool ID
  title: string; // Tool name
  description: string; // Brief summary
  image_url: string; // Path to thumbnail
  redirect_link: string; // External tool URL
  category: string; // Tool grouping (e.g., Finance)
  price: number; // Cost (0 for free)
};

/**
 * getIconForCategory: Maps category names to specific Lucide icons.
 */
const getIconForCategory = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'infrastructure': return <Terminal className="w-10 h-10" />;
    case 'finance': return <DollarSign className="w-10 h-10" />;
    case 'marketing': return <Globe className="w-10 h-10" />;
    case 'productivity': return <Activity className="w-10 h-10" />;
    default: return <Wrench className="w-10 h-10" />;
  }
};

/**
 * getBgColorForCategory: Returns category-specific Tailwind color classes.
 */
const getBgColorForCategory = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'infrastructure': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    case 'finance': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'marketing': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'productivity': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  }
};

export default function Tools() {
  // State for holding tool records and loading status
  const [tools, setTools] = useState<ToolCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tools from the 'tools_cards' table on mount
  useEffect(() => {
    async function fetchTools() {
      try {
        const { data, error } = await supabase
          .from('tools_cards')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setTools(data as ToolCard[]);
      } catch (err: any) {
        console.error('Error fetching tools:', err.message);
        setError('Failed to connect to the database.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTools();
  }, []);

  return (
    <div className="flex flex-col gap-16 px-6 md:px-12 lg:px-24 py-16 min-h-[80vh]">
      {/* Page Header */}
      <div className="max-w-4xl text-center mx-auto mt-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat tracking-tight">Propulsion <span className="text-cyan-500">Tools</span></h1>
        <p className="text-lg md:text-xl text-gray-400 font-inter">Leverage our curated systems to scale your startup instantly.</p>
      </div>

      {/* Conditional Rendering based on state */}
      {isLoading ? ( // Show spinner
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : error ? ( // Show error message
        <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-2xl mx-auto max-w-2xl w-full">
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      ) : tools.length === 0 ? ( // Show empty state
        <div className="text-center py-20 text-gray-500 mx-auto max-w-2xl w-full">
          <Wrench className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="font-semibold text-lg">No tools available yet.</p>
        </div>
      ) : ( // Render tools grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={tool.id}
            >
              <Link href={tool.redirect_link || "#"} target="_blank" className="group flex flex-col h-full bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl hover:border-cyan-500/50 transition-all">
                {/* Tool icon and Price tag */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${getBgColorForCategory(tool.category)} shadow-inner`}>
                    {tool.image_url ? <img src={tool.image_url} alt={tool.title} className="w-10 h-10 object-contain" /> : getIconForCategory(tool.category)}
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/80 uppercase">{tool.price > 0 ? `$${tool.price}` : 'Free'}</span>
                </div>
                {/* Tool Category, Title and Description */}
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">{tool.category || 'General'}</span>
                <h2 className="text-2xl font-bold mb-3 text-white font-montserrat">{tool.title}</h2>
                <p className="text-gray-400 text-sm font-inter leading-relaxed flex-grow">{tool.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
