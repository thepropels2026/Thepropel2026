"use client"; // Enable client-side rendering for interactivity (state, hooks)
import React, { useState } from 'react';
import Link from 'next/link'; // Next.js link for optimized client-side navigation
import { useAuth } from './AuthContext'; // Access global authentication state
// Import icons from lucide-react for visual navigation cues
import { UserCircle, Home, Rocket, Wrench, PieChart, Globe, Map, Menu, X } from 'lucide-react';
import Image from 'next/image';

/**
 * Header component: The main navigation bar for the application.
 * Includes logo, desktop navigation, mobile navigation, and user authentication actions.
 * Redesigned to match the high-end two-tier typography from the reference image.
 */
export default function Header() {
  // Extract auth state and logout function from context
  const { isRegistered, logout, setRegisterModalOpen } = useAuth();
  // State to manage mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-[100] flex flex-col w-full shadow-2xl">
        {/* Top Secondary Bar - Inspired by reference image hierarchy */}
        <div className="bg-[#050505] py-2 px-8 hidden md:flex justify-end gap-6 items-center font-inter font-medium text-[11px] text-white/50 border-b border-white/5 uppercase tracking-wide">
          <Link href="#" className="hover:text-white transition-colors">Enterprise L&D</Link>
          <Link href="#" className="hover:text-white transition-colors">For Companies</Link>
          <Link href="/careers" className="hover:text-white transition-colors">Jobs</Link>
          <Link href="/success-stories" className="hover:text-white transition-colors">Events</Link>
          <Link href="#" className="hover:text-white transition-colors">Become a Master</Link>
          <Link href="#" className="hover:text-white transition-colors">Blog</Link>
        </div>

        {/* Main Navigation Bar - Bold Typography and Dark Aesthetic */}
        <header className="bg-[#0a0a0f]/95 backdrop-blur-xl px-4 md:px-12 py-4 flex justify-between items-center relative z-20 border-b border-white/5">
          {/* Logo and Brand Identity */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0">
            <Image src="/logo.png" alt="The Propels Logo" width={44} height={44} className="h-9 w-9 md:h-11 md:w-11 object-contain" />
            <span className="font-montserrat text-lg md:text-xl font-black tracking-tight uppercase text-white">THE PROPELS</span>
          </Link>

          {/* Desktop Navigation Links - Centered bold Inter font */}
          <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 items-center font-inter font-black uppercase tracking-tighter text-[14px] text-white">
            <Link href="/" className="hover:text-cyan-500 transition-colors duration-150 flex items-center gap-2">Home</Link>
            <Link href="/about" className="hover:text-cyan-500 transition-colors duration-150 flex items-center gap-2">About</Link>
            <Link href="/tools" className="hover:text-cyan-500 transition-colors duration-150 flex items-center gap-2">Tools</Link>
            <Link href="/market-research" className="hover:text-cyan-500 transition-colors duration-150 flex items-center gap-2 text-center whitespace-nowrap">Market Research</Link>
            <Link href="/network" className="hover:text-cyan-500 transition-colors duration-150 flex items-center gap-2">Network</Link>
            <Link href="/guide" className="hover:text-cyan-500 transition-colors duration-150 flex items-center gap-2">Guide</Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isRegistered ? (
              <div className="flex items-center gap-4">
                <Link href="/profile" className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-wider rounded-md hover:bg-white/10 transition-colors">
                  <UserCircle className="w-4 h-4" /> My Profile
                </Link>
                <button className="text-white/40 hover:text-white transition-colors font-black text-[11px] uppercase" onClick={logout}>Sign Out</button>
              </div>
            ) : (
              <button className="btn-glow" onClick={() => setRegisterModalOpen(true)}>Register</button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-white hover:text-cyan-500 transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-[#0a0a0f] flex flex-col font-inter font-black uppercase tracking-tight text-[15px] text-white w-full border-t border-white/10 p-6 gap-6 z-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="hover:text-cyan-500 py-1">Home</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="hover:text-cyan-500 py-1">About</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/tools" className="hover:text-cyan-500 py-1">Tools</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/market-research" className="hover:text-cyan-500 py-1">Market Research</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/network" className="hover:text-cyan-500 py-1">Network</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/guide" className="hover:text-cyan-500 py-1">Guide</Link>
            
            <div className="border-t border-white/10 pt-6 flex flex-col gap-4">
              {isRegistered ? (
                <>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="flex items-center gap-2 text-white">
                    <UserCircle className="w-5 h-5" /> My Profile
                  </Link>
                  <button className="text-left text-white/50 uppercase text-xs" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Sign Out</button>
                </>
              ) : (
                <button className="btn-glow w-full py-4" onClick={() => { setRegisterModalOpen(true); setIsMobileMenuOpen(false); }}>Register</button>
              )}
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
