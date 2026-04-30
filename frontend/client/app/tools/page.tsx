"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, BarChart, FileText, Wrench, Globe, Layout, DollarSign, Activity, Terminal } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

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

// Helper function to pick an icon based on category
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
    case 'finance': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'marketing': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'productivity': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default: return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  }
};

const getHoverBorderColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'infrastructure': return 'hover:border-cyan-500/50';
    case 'finance': return 'hover:border-green-500/50';
    case 'marketing': return 'hover:border-orange-500/50';
    case 'productivity': return 'hover:border-purple-500/50';
    default: return 'hover:border-cyan-500/50';
  }
}

export default function Tools() {
  const [tools, setTools] = useState<ToolCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTools() {
      try {
        const { data, error } = await supabase
          .from('tools_cards')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setTools(data as ToolCard[]);
        }
      } catch (err: any) {
        console.error('Error fetching tools:', err.message);
        setError('Failed to connect to the database. Please check your Supabase API keys.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTools();
  }, []);

  return (
    <div className="flex flex-col gap-16 px-6 md:px-12 lg:px-24 py-16 min-h-[80vh]">
      <div className="max-w-4xl text-center mx-auto mt-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-montserrat tracking-tight">Propulsion <span className="text-cyan-500">Tools</span></h1>
        <p className="text-lg md:text-xl text-gray-400 font-inter">Leverage our curated systems to structure, evaluate, and scale your startup instantly.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-red-500/10 border border-red-500/20 rounded-2xl mx-auto max-w-2xl w-full">
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      ) : tools.length === 0 ? (
        <div className="text-center py-20 text-gray-500 mx-auto max-w-2xl w-full">
          <Wrench className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="font-semibold text-lg">No tools available yet.</p>
          <p className="text-sm">Head over to the Admin Portal to add your first tools.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              key={tool.id}
            >
              <Link 
                href={tool.redirect_link || "#"} 
                target={tool.redirect_link ? "_blank" : "_self"}
                className={`group flex flex-col h-full bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl transition-all duration-300 relative overflow-hidden hover:-translate-y-2 hover:shadow-2xl ${getHoverBorderColor(tool.category)}`}
              >
                {/* Large Background Icon */}
                <div className="absolute -top-10 -right-10 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none scale-150">
                  {getIconForCategory(tool.category)}
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${getBgColorForCategory(tool.category)} shadow-inner`}>
                    {tool.image_url ? (
                      <img src={tool.image_url} alt={tool.title} className="w-10 h-10 object-contain rounded-md" />
                    ) : (
                      getIconForCategory(tool.category)
                    )}
                  </div>
                  {tool.price > 0 ? (
                    <div className="flex flex-col items-end gap-1">
                      {tool.discount_price && tool.discount_price > 0 && tool.discount_price < tool.price ? (
                        <>
                          <span className="text-[10px] font-bold px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 uppercase tracking-wider">
                            ${tool.discount_price}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500 line-through">
                            ${tool.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/80 uppercase tracking-wider">
                          ${tool.price}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 uppercase tracking-wider">
                      Free
                    </span>
                  )}
                </div>
                
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{tool.category || 'General'}</span>
                </div>
                
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
