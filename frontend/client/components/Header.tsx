"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { UserCircle, Home, Rocket, Wrench, PieChart, Globe, Map, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {
  const { isRegistered, logout, setRegisterModalOpen } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <header className={`relative transition-all duration-500 rounded-[2rem] border overflow-hidden ${scrolled ? 'bg-[#0a0a0f]/80 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-transparent border-transparent'}`}>
          {/* Inner Glow (scrolled only) */}
          {scrolled && <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />}

          <div className="px-6 md:px-10 h-16 md:h-20 flex justify-between items-center relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                 <Image src="/logo.png" alt="The Propels Logo" width={48} height={48} className="h-10 w-10 md:h-12 md:w-12 object-contain group-hover:scale-110 transition-transform" />
                 <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="font-montserrat text-sm md:text-lg font-black tracking-tighter uppercase text-white leading-none">THE PROPELS</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-cyan-400 to-orange-500 rounded-full mt-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex gap-8 items-center font-inter font-black uppercase tracking-[0.2em] text-[10px] text-white/40">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/tools" className="hover:text-white transition-colors">Arsenal</Link>
              <Link href="/network" className="hover:text-white transition-colors">Network</Link>
              <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
            </nav>

            {/* Auth Actions */}
            <div className="hidden md:flex items-center gap-6">
              {isRegistered ? (
                <div className="flex items-center gap-6">
                  <Link href="/profile" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-colors">
                    <UserCircle className="w-4 h-4" /> Profile
                  </Link>
                  <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-colors" onClick={logout}>Exit</button>
                </div>
              ) : (
                <button 
                  onClick={() => setRegisterModalOpen(true)}
                  className="h-11 px-8 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl"
                >
                  Register
                </button>
              )}
            </div>

            {/* Mobile Toggle */}
            <button className="lg:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Nav Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.nav 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-[#0a0a0f] border-t border-white/5 flex flex-col p-8 gap-6 font-black uppercase tracking-[0.3em] text-[10px] text-white/40"
              >
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="hover:text-white">Home</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="hover:text-white">About</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/tools" className="hover:text-white">Arsenal</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/network" className="hover:text-white">Network</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/careers" className="hover:text-white">Careers</Link>
                <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                   {isRegistered ? (
                     <button onClick={logout} className="text-red-500 text-left">Sign Out</button>
                   ) : (
                     <button 
                        onClick={() => { setIsMobileMenuOpen(false); setRegisterModalOpen(true); }} 
                        className="w-full h-12 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px]"
                     >
                        Register Now
                     </button>
                   )}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        {/* Secondary Bar - Only shown when NOT scrolled and on desktop */}
        {!scrolled && (
          <div className="hidden lg:flex justify-center gap-8 mt-6 font-inter font-black uppercase tracking-[0.3em] text-[9px] text-white/20">
            <Link href="/market-research" className="hover:text-cyan-400 transition-colors">Market Intelligence</Link>
            <Link href="/guide" className="hover:text-cyan-400 transition-colors">Founder's Guide</Link>
            <Link href="/success-stories" className="hover:text-cyan-400 transition-colors">Success Stories</Link>
          </div>
        )}
      </div>
    </div>
  );
}
