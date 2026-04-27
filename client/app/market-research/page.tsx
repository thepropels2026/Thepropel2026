"use client";
import React, { useState } from 'react';
import { Search, TrendingUp, BarChart3, Target, PieChart, Users, ArrowRight, Zap, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketResearchPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResults(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 lg:px-24 bg-[#050505] text-white font-inter">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Database className="w-3 h-3" /> Data-Driven Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-archivo tracking-tighter mb-6">
            Propels <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Market Intelligence</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Gain an unfair advantage with our real-time market analysis engine. Identify gaps, analyze competitors, and predict trends before they happen.
          </p>
        </div>

        {/* Search Engine */}
        <div className="mb-16">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g. 'SaaS penetration in SEA market 2024' or 'competitor analysis for Fintech'..."
              className="w-full h-20 pl-16 pr-40 bg-white/5 border border-white/10 rounded-2xl text-xl font-medium outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all placeholder:text-gray-600"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-4 top-4 bottom-4 px-8 bg-white text-black font-black rounded-xl hover:bg-cyan-400 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'ANALYZING...' : 'RUN QUERY'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Results / Dashboard */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Market Sentiment</h3>
              </div>
              <div className="text-4xl font-black mb-2 text-cyan-400">84.2%</div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Bullish Projection</p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">TAM Opportunity</h3>
              </div>
              <div className="text-4xl font-black mb-2 text-blue-400">$12.4B</div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Addressable Market</p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg">Market Saturation</h3>
              </div>
              <div className="text-4xl font-black mb-2 text-purple-400">Low</div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">High Disruption Potential</p>
            </div>

            <div className="md:col-span-2 lg:col-span-3 p-10 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px]" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8">Competitive Landscape Matrix</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  <div>
                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-2">Growth Rate</h4>
                    <div className="text-3xl font-black text-green-500 font-archivo">+120% YoY</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-2">Avg. CAC</h4>
                    <div className="text-3xl font-black text-white font-archivo">$42.00</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-2">Churn Prediction</h4>
                    <div className="text-3xl font-black text-white font-archivo">1.2%</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase text-gray-500 mb-2">Competitor Saturation</h4>
                    <div className="text-3xl font-black text-yellow-500 font-archivo">Moderate (42%)</div>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-4">Strategic Recommendation</h3>
                <p className="text-gray-300 font-inter mb-6 leading-relaxed">
                  The market exhibits a clear gap in user experience. While incumbents hold 60% of enterprise contracts, the emerging SMP demographic is largely unaddressed. Recommended action: Focus MVP strictly on onboarding speed.
                </p>

                <button onClick={() => setResults(false)} className="px-6 py-2 border border-white/20 rounded hover:bg-white/10 transition-colors uppercase text-xs font-bold tracking-widest text-gray-400 hover:text-white">Run New Query</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
