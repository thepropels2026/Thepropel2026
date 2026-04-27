"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Target, Zap, Shield, Rocket } from 'lucide-react';

export default function NetworkPage() {
  const partners = [
    { name: "Global Venture Capital", location: "San Francisco, CA" },
    { name: "Horizon Investments", location: "London, UK" },
    { name: "Asia Growth Fund", location: "Singapore" },
    { name: "Nordic Tech Partners", location: "Stockholm, SE" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-20 px-6 font-inter">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-700 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Users className="w-3 h-3" /> Elite Network
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-montserrat tracking-tight mb-6">
            Connecting <span className="text-cyan-600">Global Pioneers</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            Direct access to the world's most influential investors, strategic partners, and unicorn founders.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white border border-slate-200 rounded-3xl hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
              <p className="text-slate-500 text-sm">{partner.location}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
