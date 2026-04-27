"use client";
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Rocket, 
  Users, 
  Briefcase, 
  Zap, 
  Globe, 
  TrendingUp, 
  Shield, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#050505] text-white overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('/grid.svg')] opacity-20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">Propelling Global Unicorns</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-montserrat font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Accelerating <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 animate-gradient">Founder's Success</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed">
              We provide the strategic framework, elite network, and growth capital to scale your vision from zero to global dominance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register" className="group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                <span className="relative z-10 flex items-center gap-2">
                  Apply to Platform <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/about" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl backdrop-blur-md transition-all">
                The Methodology
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Proof Section */}
      <section className="py-24 border-y border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: 'Portfolio Value', value: '$2.4B+' },
              { label: 'Global Founders', value: '150+' },
              { label: 'Exits to Date', value: '12' },
              { label: 'Growth Network', value: '500+' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-extrabold font-montserrat mb-2 text-white">{stat.value}</div>
                <div className="text-sm font-bold tracking-widest uppercase text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">Built for the <span className="text-cyan-400">1% of Founders</span></h2>
            <p className="max-w-2xl text-slate-400 text-lg">Our ecosystem is designed around three fundamental pillars that define hyper-growth companies.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8 text-cyan-400" />,
                title: "Velocity Engine",
                desc: "We don't just advise; we execute. Our sprint-based methodology compresses years of growth into months.",
                tags: ["GTM Strategy", "Growth Loops"]
              },
              {
                icon: <Globe className="w-8 h-8 text-blue-500" />,
                title: "Elite Network",
                desc: "Direct access to Tier-1 investors, strategic partners, and unicorn founders globally.",
                tags: ["Capital Access", "Strategic M&A"]
              },
              {
                icon: <Shield className="w-8 h-8 text-indigo-500" />,
                title: "Scale Infrastructure",
                desc: "Enterprise-grade operations and tech stack designed to handle millions of users and high-frequency transactions.",
                tags: ["Cloud Architecture", "Ops Scaling"]
              }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm group hover:bg-white/[0.08] transition-all"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 font-montserrat">{pillar.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-8">{pillar.desc}</p>
                <div className="flex gap-2">
                  {pillar.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative p-12 md:p-24 bg-gradient-to-br from-cyan-600 to-indigo-800 rounded-[3rem] overflow-hidden text-center">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold font-montserrat text-white mb-8 tracking-tighter">
                Ready to Propel Your <br /> Vision to the World?
              </h2>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                We accept applications on a rolling basis. Join the next cohort of transformative founders.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/register" className="px-10 py-5 bg-white text-slate-900 font-extrabold rounded-2xl shadow-2xl hover:scale-105 transition-transform">
                  Start Application
                </Link>
                <Link href="/network" className="px-10 py-5 bg-transparent border-2 border-white/20 text-white font-extrabold rounded-2xl hover:bg-white/10 transition-colors">
                  Explore Network
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
