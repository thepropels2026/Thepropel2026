"use client";
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function MarketResearchPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(true);
    }, 3000); // simulate API call
  };

  return (
    <div className="min-h-screen pt-24 px-8 md:px-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-montserrat font-bold mb-4">Market Research Intelligence</h1>
        <p className="text-gray-400 font-inter mb-12">Submit your startup parameters, and our predictive AI will parse global databases to deliver actionable market insights.</p>

        {!results && !analyzing && (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col gap-6 animate-in slide-in-from-bottom-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-cyan-500">Core Industry / Tag</label>
              <input required type="text" placeholder="e.g. B2B SaaS, CleanTech, EdTech..." className="bg-white/5 border border-white/10 rounded p-4 outline-none focus:border-cyan-500 transition-colors font-inter" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-cyan-500">Problem Statement</label>
              <textarea required rows={3} placeholder="What pain point are you solving?" className="bg-white/5 border border-white/10 rounded p-4 outline-none focus:border-cyan-500 transition-colors font-inter" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-cyan-500">Target Demographic</label>
              <input required type="text" placeholder="e.g. Gen-Z College Students, Mid-level Managers" className="bg-white/5 border border-white/10 rounded p-4 outline-none focus:border-cyan-500 transition-colors font-inter" />
            </div>

            <button type="submit" className="btn-glow mt-6 flex items-center justify-center gap-2 py-4 text-lg">
              <Search className="w-5 h-5" /> Initiate Neural Scan
            </button>
          </form>
        )}

        {analyzing && (
          <div className="h-64 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <h3 className="font-montserrat font-bold text-xl animate-pulse text-white">Aggregating Market Data...</h3>
            <p className="text-sm text-gray-400 font-inter mt-2">Checking competitor matrices and TAM models.</p>
          </div>
        )}

        {results && (
          <div className="bg-white/5 border border-cyan-500/30 p-8 rounded-2xl animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-montserrat font-bold text-cyan-400 mb-6">Research Complete: Viability High</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#0a0a0f] p-6 rounded-xl border border-white/10">
                <h4 className="text-sm font-bold uppercase text-gray-500 mb-2">Total Addressable Market (TAM)</h4>
                <div className="text-3xl font-black text-white font-archivo">$4.2B+</div>
              </div>
              <div className="bg-[#0a0a0f] p-6 rounded-xl border border-white/10">
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
        )}
      </div>
    </div>
  );
}
