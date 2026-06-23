"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Eye, Sparkles, Quote, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import Image from 'next/image';

const MENTORS = [
  {
    name: "Dr. Aris Thorne",
    role: "AI Research & Systems Lead",
    bio: "Former Lead AI Scientist at deep tech lab. Specializes in scaling neural networks, predictive LLMs, and decentralized agentic systems.",
    image: "/images/mentor_3.png",
    linkedin: "#",
    tag: "DEEP TECH"
  },
  {
    name: "Elena Rostova",
    role: "Venture Partner & GTM Strategist",
    bio: "12+ years directing product strategies for hyper-growth startups. Handled product launches with over $200M in cumulative ARR.",
    image: "/images/mentor_2.png",
    linkedin: "#",
    tag: "PRODUCT & CAPITAL"
  },
  {
    name: "Marcus Vance",
    role: "Scale Architect & Advisor",
    bio: "Ex-founder with two multi-million dollar exits. Advises early-stage founding teams on building operational structures and customer acquisition loops.",
    image: "/images/mentor_1.png",
    linkedin: "#",
    tag: "SCALING & OPS"
  }
];

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-inter overflow-hidden relative">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_30%,#000_20%,transparent_100%)]" />
        
        {/* Breathing Orbs */}
        <div className="absolute -top-[10%] left-[5%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[5%] w-[700px] h-[500px] bg-[#FF5F00]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 px-6 md:px-12 lg:px-24 pt-32 pb-16 max-w-7xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left"
        >
          <div className="inline-block px-4 py-1.5 border border-white/20 rounded text-[10px] font-bold tracking-[2px] text-white/50 uppercase mb-8">
            MISSION CONTROL // ARCHITECTING GROWTH
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6 leading-[0.95] tracking-tight uppercase font-sans">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600">Propulsion</span> <br/>
            <span className="text-white font-light tracking-[0.15em] text-2xl md:text-4xl block mt-3 opacity-90">Ecosystem</span>
          </h1>
          <p className="text-[#8B9BB4] text-lg md:text-xl max-w-2xl mb-12 font-medium leading-relaxed">
            We are not just a platform; we are a high-velocity engine designed to turn raw entrepreneurial intent into market-dominating reality.
          </p>
        </motion.div>

        {/* --- MISSION & VISION CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group p-8 md:p-12 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:border-cyan-500/50 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Target className="w-40 h-40" />
            </div>
            <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-8">
              <Rocket className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Our Mission <span className="w-8 h-px bg-cyan-500/50" />
            </h2>
            <p className="text-[#8B9BB4] text-lg leading-relaxed font-medium">
              “To democratize elite startup building by integrating predictive AI, psychological clarity, and a world-class investor network to propel founders from concept to market dominance at unprecedented speed.”
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group p-8 md:p-12 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:border-orange-500/50 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <Eye className="w-40 h-40" />
            </div>
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 mb-8">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Our Vision <span className="w-8 h-px bg-orange-500/50" />
            </h2>
            <p className="text-[#8B9BB4] text-lg leading-relaxed font-medium">
              “To become the global standard for entrepreneurial success, where every visionary idea is met with the intelligence and capital required to change the world.”
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- FOUNDER SECTION --- */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Founder Image Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative w-full max-w-[400px] aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group"
            >
              <Image 
                src="/images/founder.png" 
                alt="Sushant - Founder of The Propels" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10">
                <h4 className="text-2xl font-bold">Sushant</h4>
                <p className="text-cyan-500 font-bold uppercase tracking-widest text-[10px]">Founder & CEO, THE PROPELS</p>
              </div>
            </motion.div>

            {/* Founder Note Area */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <Quote className="w-12 h-12 text-cyan-500/20 mb-8" />
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                Architecting the <span className="text-cyan-500">Node</span> of Future Leaders.
              </h2>
              
              <div className="space-y-6 text-[#8B9BB4] text-lg leading-relaxed font-medium">
                <p>
                  At The Propels, we don't just build companies; we architect ecosystems where intent meets infrastructure. India's greatest untapped resource isn't its numbers—it's the raw, entrepreneurial velocity of its youth.
                </p>
                <p className="italic text-white border-l-2 border-orange-500 pl-6 py-2 bg-orange-500/5 rounded-r-xl">
                  "We are here to bridge the gap between a concept on a napkin and a revenue-generating node that changes the world. Join us in the propulsion sequence."
                </p>
                <p>
                  Our system is built on transparency, predictive intelligence, and an unwavering commitment to the founder's journey. We invite you to engage the network and build what lasts.
                </p>
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold uppercase tracking-widest">
                  <Zap className="w-4 h-4 text-orange-500" /> High Velocity
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold uppercase tracking-widest">
                  <Shield className="w-4 h-4 text-cyan-500" /> Absolute Integrity
                </div>
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold uppercase tracking-widest">
                  <Globe className="w-4 h-4 text-white/50" /> Global Scale
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- MENTORS & ADVISORS SECTION --- */}
      <section className="relative z-10 py-24 px-6 md:px-12 lg:px-24 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded text-[10px] font-bold tracking-[2px] text-white/40 uppercase mb-6">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Guiding Minds
            </div>
            <h2 className="text-3xl lg:text-4xl font-montserrat font-black text-white tracking-tight mb-4 uppercase">
              Mentors & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5F00] to-orange-500 drop-shadow-[0_0_15px_rgba(255,95,0,0.3)]">Advisors</span>
            </h2>
            <p className="text-[#8B9BB4] text-base max-w-xl mx-auto leading-relaxed">
              Connect with world-class builders, technical pioneers, and venture partners committed to your propulsion sequence.
            </p>
          </div>

          {/* Mentor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MENTORS.map((mentor, index) => (
              <motion.div
                key={mentor.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative flex flex-col rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)]"
              >
                {/* Photo Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={mentor.image}
                    alt={mentor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                  
                  {/* Tag badge on top of image */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 border border-white/10 backdrop-blur-md rounded-full text-[9px] font-black tracking-widest text-cyan-400 uppercase">
                    {mentor.tag}
                  </div>
                </div>

                {/* Info & Description */}
                <div className="p-8 pt-4 flex flex-col flex-1 relative z-10 -mt-8 bg-gradient-to-b from-[#050505]/95 to-transparent">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="text-xs text-[#FF5F00] font-black uppercase tracking-wider mb-4">
                    {mentor.role}
                  </p>
                  <p className="text-sm text-[#8B9BB4] leading-relaxed mb-6 font-medium">
                    {mentor.bio}
                  </p>

                  {/* LinkedIn / Connect Button */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <a
                      href={mentor.linkedin}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white uppercase tracking-wider transition-colors"
                    >
                      Connect Node <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="relative z-10 py-32 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to initiate your sequence?</h2>
          <button className="btn-glow px-12 py-4 flex items-center gap-3 mx-auto">
            JOIN THE NETWORK <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

    </div>
  );
}

