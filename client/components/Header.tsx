"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import AboutDrawer from './AboutDrawer';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black font-montserrat tracking-tighter">
            THE PROPELS
          </Link>
          
          <nav className="hidden md:flex items-center gap-10">
            <Link href="/tools" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Tools</Link>
            <Link href="/network" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Network</Link>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              About
            </button>
            <Link href="/register" className="px-6 py-2.5 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all text-sm">
              Launch App <ArrowUpRight className="w-4 h-4" />
            </Link>
          </nav>

          <button className="md:hidden text-white">
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </header>

      <AboutDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
