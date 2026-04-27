"use client";
import React, { useState } from 'react';
import { Search, Filter, ArrowRight, ExternalLink, Zap, Star, LayoutGrid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ToolsPage() {
  const tools = [
    { title: "Propels Market Intel", description: "Real-time market analysis engine.", price: "Free", category: "Research" },
    { title: "ScaleOps", description: "Operations automation for hyper-growth teams.", price: "$49/mo", category: "Operations" },
  ];

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 lg:px-24 bg-[#050505] text-white font-inter">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 font-montserrat">Founder Tools</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col"
            >
              <h2 className="text-2xl font-bold mb-4">{tool.title}</h2>
              <p className="text-slate-400 mb-6 flex-grow">{tool.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-cyan-400 font-bold">{tool.price}</span>
                <button className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm">View Tool</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
