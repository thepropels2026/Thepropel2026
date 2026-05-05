"use client";
import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, ArrowRight, ShieldCheck, Globe, Zap, Facebook, Youtube, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 py-24 relative overflow-hidden font-inter">
      {/* --- GRID BACKGROUND --- */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="font-montserrat text-xl font-black text-white uppercase tracking-tighter italic leading-none">THE PROPELS</span>
                <svg className="w-full h-2 mt-1" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 5C20 2 40 8 60 5C80 2 100 8 120 5" stroke="#00F2FF" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                </svg>
              </div>
            </Link>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
              Turning India's entrepreneurial intent into real-world revenue through systematic propulsion.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Protocol</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-white/60">
              <Link href="/about" className="hover:text-cyan-400 transition-colors">About Mission</Link>
              <Link href="/tools" className="hover:text-cyan-400 transition-colors">Arsenal</Link>
              <Link href="/network" className="hover:text-cyan-400 transition-colors">Network</Link>
              <Link href="/careers" className="hover:text-cyan-400 transition-colors">Careers</Link>
            </div>
          </div>

          {/* Resources */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Intelligence</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-white/60">
              <Link href="/market-research" className="hover:text-cyan-400 transition-colors">Market Intel</Link>
              <Link href="/guide" className="hover:text-cyan-400 transition-colors">Founder's Guide</Link>
              <Link href="/success-stories" className="hover:text-cyan-400 transition-colors">Case Studies</Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors">Annual Report</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Contact</h4>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                  <Mail className="w-4 h-4 text-cyan-500" /> hello@thepropels.com
               </div>
               <div className="flex items-center gap-3 text-xs font-bold text-white/60">
                  <Phone className="w-4 h-4 text-cyan-500" /> +91 99999 99999
               </div>
               <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Current Coordinates</p>
                  <div className="h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group cursor-pointer hover:border-cyan-500/30 transition-all">
                     <MapPin className="w-6 h-6 text-cyan-500 group-hover:scale-110 transition-transform" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} THE PROPELS. SYSTEM AUTHORIZED.
           </p>
           <div className="flex items-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-widest">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
