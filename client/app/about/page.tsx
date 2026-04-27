"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Shield, Target, Zap, Globe, Users, TrendingUp, Cpu } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Velocity",
      desc: "We move fast, break barriers, and accelerate growth at every stage."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Integrity",
      desc: "Our commitment to ethical scaling ensures sustainable success."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      desc: "We bridge the gap between local innovation and global markets."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold font-montserrat mb-8"
          >
            The Propels <br />
            <span className="text-cyan-400">Mission</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            We are more than just a platform; we are the engine behind the next generation of global unicorns. Our mission is to democratize access to growth capital and elite strategic frameworks.
          </motion.p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {values.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 bg-white/5 border border-white/10 rounded-3xl"
            >
              <div className="w-12 h-12 bg-cyan-400/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 font-montserrat">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
