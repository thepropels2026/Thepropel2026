"use client";
import Link from 'next/link';
import { ArrowRight, Star, Quote, ChevronDown, Play, BookOpen, Mic } from 'lucide-react';
import { motion } from 'framer-motion'; 
import Image from 'next/image';
import { supabase } from '../lib/supabase'; 

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative min-h-[100dvh] flex flex-col justify-start px-4 sm:px-6 md:px-12 lg:px-24 pt-32 md:pt-36 lg:pt-48 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ perspective: '1000px' }}>
          <div style={{ transform: "rotateX(60deg) scale(2)", transformOrigin: "top center" }} className="absolute inset-0 z-0">
            <motion.div 
              animate={{ y: [0, 40] }} // Infinite vertical scroll effect
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute -inset-[100px] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_10%,transparent_100%)] opacity-30" 
            />
          </div>
          
          <motion.div 
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
            className="absolute -top-[10%] left-[10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ willChange: "transform" }}
            className="absolute bottom-[-20%] right-[5%] w-[700px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ willChange: "transform" }}
            className="absolute top-[40%] left-[40%] w-[800px] h-[300px] bg-white/5 rounded-[100%] blur-[80px]" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center z-10 w-full max-w-7xl mx-auto">
          
          <div className="flex flex-col w-full">
            <div className="inline-block px-4 py-1.5 border border-cyan-500 rounded-full text-[10px] md:text-xs font-bold tracking-[2px] text-cyan-500 uppercase mb-4 md:mb-8 self-start">
              INITIATING LAUNCH SEQUENCE
            </div>

            <div className="staggered-title">
              <span className="l1">Turning</span>
              <span className="l2">India's 75%</span>
              <span className="l3">Students</span>
              <span className="l4">Entrepreneurial</span>
              <span className="l5">Intent into</span>
              <span className="l6 text-glow-gold">Real World Revenue</span>
            </div>

            <p className="text-left mt-0 md:mt-4 text-[#8B9BB4] text-xs md:text-lg max-w-lg mb-4 md:mb-8 font-inter">
              Elevating startups beyond the raw concept phase with predictive AI, zero-gravity scaling,
              and elite mentor networks.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <Link href="/network">
                <button className="btn-glow w-full md:w-auto text-xs md:text-sm py-3 md:py-2">ENGAGE THE NETWORK</button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center lg:items-start w-full lg:ml-16 mt-8 lg:-mt-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-full max-w-[550px] aspect-video rounded-[16px] md:rounded-[20px] bg-black/40 border border-white/10 overflow-hidden group flex flex-col items-center justify-center shadow-2xl mx-auto lg:mx-0"
            >
              <div className="absolute inset-0 bg-[rgba(10,10,15,0.6)]" />
              <div className="z-10 flex flex-col items-center">
                <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full bg-[#00F2FF] flex items-center justify-center mb-2 md:mb-4 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-5 h-5 md:w-8 md:h-8 fill-black text-black ml-1" />
                </div>
                <span className="font-montserrat text-[10px] md:text-sm text-[#F0F4F8]">Propulsion System Overview</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex w-full max-w-[550px] mt-6 bg-black/80 backdrop-blur-md border border-white/10 rounded-[16px] px-6 md:px-8 py-6 flex-col sm:flex-row justify-between items-start shadow-xl mx-auto lg:mx-0 gap-6 min-h-[160px]"
            >
              <div className="flex flex-col items-center sm:items-start flex-1">
                <h3 className="text-white font-montserrat font-bold text-lg mb-3">Related Links</h3>
                <div className="flex flex-col gap-3">
                  <Link href="/guide" className="text-white text-sm font-bold hover:text-[#00F2FF] hover:underline flex items-center gap-2 group transition-colors">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" /> <span className="text-left">Download the report</span>
                  </Link>
                  <Link href="/guide" className="text-white text-sm font-bold hover:text-[#00F2FF] hover:underline flex items-center gap-2 group transition-colors">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" /> <span className="text-left">Zero to One Startup MasterClass</span>
                  </Link>
                  <Link href="/guide" className="text-white text-sm font-bold hover:text-[#00F2FF] hover:underline flex items-center gap-2 group transition-colors">
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" /> <span className="text-left">Download Market Report</span>
                  </Link>
                </div>
              </div>

              <div className="h-px w-full sm:w-px sm:h-auto sm:self-stretch bg-white/20 hidden sm:block mx-1"></div>

              <div className="flex flex-col items-center sm:items-start shrink-0">
                <h3 className="text-white font-montserrat font-bold text-lg mb-3">Socials</h3>
                <div className="flex flex-wrap gap-3 max-w-[140px] justify-center sm:justify-start">
                  <Link href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#00F2FF] hover:border-[#00F2FF] group transition-all">
                    <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                  </Link>
                  <Link href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#00F2FF] hover:border-[#00F2FF] group transition-all">
                    <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </Link>
                  <Link href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#00F2FF] hover:border-[#00F2FF] group transition-all">
                    <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069v-2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </Link>
                  <Link href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#00F2FF] hover:border-[#00F2FF] group transition-all">
                    <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.078 0 12 0 12s0 3.922.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.922 24 12 24 12s0-3.922-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </Link>
                  <Link href="#" className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#00F2FF] hover:border-[#00F2FF] group transition-all">
                    <svg className="w-4 h-4 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white text-black py-16 lg:py-32 mt-16 lg:mt-32 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-center mb-10 lg:mb-16 text-gray-900">Propulsion Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8 text-center font-archivo">
            {[
              { label: 'Founders Associated', value: '1,204+' },
              { label: 'Startups Funded', value: '342' },
              { label: 'Jobs Created', value: '15,000+' },
              { label: 'Investors Network', value: '850+' },
              { label: 'Startup Modules', value: '250+' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-black text-cyan-600 mb-2">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-500 font-inter">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-[#0a0a0f] to-[rgba(255,95,0,0.05)] py-16 lg:py-24 px-6 lg:px-24 mb-16 rounded-[40px] shadow-2xl relative z-10 border border-white/5 mx-auto max-w-[1200px] w-[90%] lg:w-full">
        <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-center mb-4"><span className="text-white">The</span> <span className="text-[#FF5F00]">Propulsion</span> <span className="text-white">Process</span></h2>
        <p className="text-center mb-10 lg:mb-16 text-white/80 font-inter">A tested and proven framework to take you from concept to Series A.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="bg-[#FF5F00]/10 border border-[#FF5F00]/30 p-8 rounded-[20px] relative overflow-hidden transition-transform hover:-translate-y-2 group opacity-0-init animate-fade-in-up delay-100">
            <div className="text-4xl mb-6">🔍</div>
            <div className="text-[5rem] font-extrabold absolute -top-2 right-2 text-[#FF5F00] opacity-10 leading-none">01</div>
            <h3 className="text-xl font-bold text-white mb-2 font-montserrat">Discovery & Validation</h3>
            <p className="text-white/80 text-sm font-inter">Use our AI evaluators and market heat maps to finalize your product blueprint with absolute precision.</p>
          </div>
          <div className="bg-white/90 border border-white p-8 rounded-[20px] relative overflow-hidden transition-transform hover:-translate-y-2 group opacity-0-init animate-fade-in-up delay-200">
            <div className="text-4xl mb-6">⚡</div>
            <div className="text-[5rem] font-extrabold absolute -top-2 right-2 text-black opacity-5 leading-none">02</div>
            <h3 className="text-xl font-bold text-[#FF5F00] mb-2 font-montserrat">MVP Acceleration</h3>
            <p className="text-[#444] text-sm font-inter">Get paired with top-tier engineers and cloud infrastructure credits to build a high-converting prototype.</p>
          </div>
          <div className="bg-[#FF5F00]/10 border border-[#FF5F00]/30 p-8 rounded-[20px] relative overflow-hidden transition-transform hover:-translate-y-2 group opacity-0-init animate-fade-in-up delay-300">
            <div className="text-4xl mb-6">💰</div>
            <div className="text-[5rem] font-extrabold absolute -top-2 right-2 text-[#FF5F00] opacity-10 leading-none">03</div>
            <h3 className="text-xl font-bold text-white mb-2 font-montserrat">Capital Injection</h3>
            <p className="text-white/80 text-sm font-inter">Engage our closed-circuit network of 400+ investors through our structured demo days and syndicate funds.</p>
          </div>
          <div className="bg-white/90 border border-white p-8 rounded-[20px] relative overflow-hidden transition-transform hover:-translate-y-2 group opacity-0-init animate-fade-in-up delay-400">
            <div className="text-4xl mb-6">📈</div>
            <div className="text-[5rem] font-extrabold absolute -top-2 right-2 text-black opacity-5 leading-none">04</div>
            <h3 className="text-xl font-bold text-[#FF5F00] mb-2 font-montserrat">Scale & Dominate</h3>
            <p className="text-[#444] text-sm font-inter">Utilize our legal, marketing, and HR networks to rapidly scale your team and your ARR effectively.</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-white mb-4">Elite <span className="text-cyan-500">Startup</span> Arsenal</h2>
              <p className="text-white/60 font-inter max-w-xl">Don't reinvent the wheel. Use our proprietary systems to automate your growth from day one.</p>
            </div>
            <Link href="/tools" className="group flex items-center gap-2 text-cyan-500 font-bold uppercase tracking-widest hover:text-cyan-400 transition-all">
              EXPLORE ALL TOOLS <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeaturedToolsGrid />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 text-black py-16 lg:py-24 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-center mb-10 lg:mb-16 text-gray-900">What Founders & CEOs Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow relative">
                <Quote className="text-cyan-200 w-12 h-12 absolute top-4 right-4 opacity-50" />
                <div className="flex text-yellow-500 mb-6 font-bold">
                  <Star className="fill-yellow-500 w-4 h-4" />
                  <Star className="fill-yellow-500 w-4 h-4" />
                  <Star className="fill-yellow-500 w-4 h-4" />
                  <Star className="fill-yellow-500 w-4 h-4" />
                  <Star className="fill-yellow-500 w-4 h-4" />
                </div>
                <p className="text-gray-600 italic mb-8 font-inter text-sm">"The Propels helped us transition from a college project to a funded SaaS platform in less than 3 months."</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white shadow-sm" />
                  <div>
                    <h4 className="font-bold font-montserrat text-sm text-gray-900">Rahul Sharma</h4>
                    <p className="text-xs text-gray-500 font-inter">CEO, TechNova</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#050505] py-16 lg:py-24 px-6 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-montserrat font-bold">Investors Committee</h2>
            <Link href="/network" className="text-cyan-500 text-sm font-bold uppercase tracking-widest hover:text-cyan-400">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-800 rounded-full mb-4 border-2 border-cyan-500"></div>
                <h3 className="font-bold text-lg font-montserrat">Aditi Verma</h3>
                <p className="text-cyan-500 text-sm font-bold uppercase tracking-wider mb-2">Partner, Sequoia</p>
                <p className="text-xs text-gray-400 text-center font-inter">Early Stage Deep Tech & B2B SaaS Investments.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a0f] py-16 lg:py-24 px-6 lg:px-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-center mb-10 lg:mb-16">Life at The Propels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 aspect-video bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold font-montserrat mb-2">Annual Hacker House</h3>
                <p className="text-gray-300 font-inter text-sm">Where 50 founders live, build, and ship for 30 days straight.</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden hover:border-cyan-500/50 transition-colors">
                <BookOpen className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="font-bold mb-1">Founder Blogs</h3>
                <p className="text-xs text-gray-400">Read stories from the trenches.</p>
              </div>
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden hover:border-cyan-500/50 transition-colors">
                <Mic className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="font-bold mb-1">Weekly Podcasts</h3>
                <p className="text-xs text-gray-400">Listen to VCs drop knowledge.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-black py-16 lg:py-24 px-6 lg:px-24 rounded-t-[3rem] -mb-20 pb-32 lg:pb-40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-center mb-10 lg:mb-16 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4 font-inter">
            {[
              { q: 'How does The Propels secure seed funding?', a: 'We leverage a direct pipeline to top-tier VCs who review our rigorously vetted "Propulsion Output" metrics.' },
              { q: 'What is the idea evaluator?', a: 'An AI-powered tool that cross-checks your concept against current market trends and historical failure rates.' },
              { q: 'Can I join if I only have an idea?', a: 'Yes! We have modules dedicated to concept validation and MVP building.' },
              { q: 'How does networking work?', a: 'Our platform matches you with mentors and investors based on your industry, stage, and specific needs, much like a professional matching algorithm.' }
            ].map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 font-montserrat">{faq.q}</h3>
                  <p className="text-gray-600 text-sm hidden md:block">{faq.a}</p>
                </div>
                <ChevronDown className="text-cyan-600" />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-black py-16 border-y border-[#FF5F00]/20 my-16 overflow-hidden">
        <h2 className="text-center text-3xl mb-12 text-white font-montserrat font-bold">Powered By <span className="text-[#FF5F00]">World-Class</span> Partners</h2>
        <div className="flex whitespace-nowrap overflow-hidden relative">
          <div className="flex gap-24 animate-scroll-partners w-max">
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex gap-24 ml-24">
                <div className="flex items-center gap-3 text-4xl font-bold text-white/80 hover:text-white transition-opacity"><span className="text-white">AWS</span></div>
                <div className="flex items-center gap-3 text-4xl font-bold text-[#FF5F00]/80 hover:text-[#FF5F00] transition-opacity"><span className="text-[#FF5F00]">Google Cloud</span></div>
                <div className="flex items-center gap-3 text-4xl font-bold text-white/80 hover:text-white transition-opacity"><span className="text-white">Microsoft Startups</span></div>
                <div className="flex items-center gap-3 text-4xl font-bold text-[#FF5F00]/80 hover:text-[#FF5F00] transition-opacity"><span className="text-[#FF5F00]">Stripe</span></div>
                <div className="flex items-center gap-3 text-4xl font-bold text-white/80 hover:text-white transition-opacity"><span className="text-white">Razorpay</span></div>
                <div className="flex items-center gap-3 text-4xl font-bold text-[#FF5F00]/80 hover:text-[#FF5F00] transition-opacity"><span className="text-[#FF5F00]">Y Combinator</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#FF5F00] to-orange-400 py-16 lg:py-32 px-6 lg:px-24 rounded-[40px] text-center my-16 lg:my-24 mx-auto max-w-[1200px] shadow-[0_20px_50px_rgba(255,95,0,0.3)] w-[90%] lg:w-full">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 font-montserrat">Ready to <span className="text-black/80">Propel</span> Your Startup?</h2>
        <p className="text-lg lg:text-xl text-white/90 max-w-2xl mx-auto mb-10 lg:mb-12 font-inter">Join thousands of founders who have successfully scaled their ideas into market-leading companies. Ignite your growth engine today.</p>
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
          <button className="bg-white text-[#FF5F00] px-8 py-4 rounded-lg font-bold uppercase tracking-wide hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all">Register Now</button>
          <Link href="/tools">
            <button className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-white/10 transition-colors w-full sm:w-auto">Explore Tools</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeaturedToolsGrid() {
  const [tools, setTools] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchTopTools() {
      try {
        const { data } = await supabase
          .from('tools_cards')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false });
        setTools(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTopTools();
  }, []);

  if (loading) {
    return [1, 2, 3].map(i => (
      <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
    ));
  }

  if (tools.length === 0) {
    return (
      <div className="col-span-full py-12 text-center bg-white/5 rounded-3xl border border-white/5">
        <p className="text-white/40 font-bold">New tools are being deployed. Check back shortly.</p>
      </div>
    );
  }

  return tools.map((tool) => (
    <Link 
      key={tool.id}
      href="/tools"
      className="group bg-[#0a0a0f] border border-white/10 p-8 rounded-3xl hover:border-cyan-500/50 transition-all relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 overflow-hidden">
          {tool.image_url ? (
            <Image 
              src={tool.image_url} 
              alt={tool.title} 
              width={48} 
              height={48} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          ) : (
            <Wrench className="w-6 h-6" />
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-[10px] font-black text-cyan-500/60 uppercase tracking-widest">{tool.category}</div>
          {new Date(tool.created_at).getTime() > Date.now() - 48 * 60 * 60 * 1000 && (
            <span className="bg-cyan-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">NEW</span>
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2 font-montserrat line-clamp-1">{tool.title}</h3>
      <p className="text-white/40 text-sm line-clamp-2 mb-6 font-inter">{tool.description}</p>
      <div className="flex items-center gap-2 text-xs font-bold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
        Get Started <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  ));
}
