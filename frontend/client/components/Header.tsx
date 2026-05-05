"use client"; // Enable client-side rendering for interactivity (state, hooks)
import React, { useState } from 'react';
import Link from 'next/link'; // Next.js link for optimized client-side navigation
import { useAuth } from './AuthContext'; // Access global authentication state
// Import icons from lucide-react for visual navigation cues
import { UserCircle, Home, Rocket, Wrench, PieChart, Globe, Map, Menu, X, Linkedin } from 'lucide-react';
import Image from 'next/image';

/**
 * Header component: The main navigation bar for the application.
 * Includes logo, desktop navigation, mobile navigation, and user authentication actions.
 */
export default function Header() {
  // Extract auth state and logout function from context
  const { isRegistered, logout } = useAuth();
  // State to manage mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Sticky container to keep the header at the top of the viewport */}
      <div className="sticky top-0 z-50 flex flex-col w-full shadow-2xl">
        {/* Main navigation bar with glassmorphism effect and bottom gradient border */}
        <header className="glass-nav px-4 md:px-8 py-2 flex justify-between items-center transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-[#00F2FF] after:via-cyan-600/20 after:to-[#FF5F00] z-20">
        
        {/* Logo and Brand Identity Section */}
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <Image src="/logo.png" alt="The Propels Logo" width={48} height={48} className="h-10 w-10 md:h-12 md:w-12 object-contain brightness-125 filter drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]" />
          <span className="font-montserrat text-lg md:text-xl font-extrabold tracking-wider uppercase text-white">THE PROPELS</span>
        </Link>

        {/* Desktop Navigation Links - Centered using absolute positioning */}
        <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 items-center font-inter font-bold uppercase tracking-widest text-[11px] text-white">
          <Link href="/" className="hover:text-cyan-500 transition-colors flex items-center gap-2"><Home className="w-3 h-3" /> Home</Link>
          <Link href="/about" className="hover:text-cyan-500 transition-colors flex items-center gap-2"><Rocket className="w-3 h-3" /> About</Link>
          <Link href="/tools" className="hover:text-cyan-500 transition-colors flex items-center gap-2"><Wrench className="w-3 h-3" /> Tools</Link>
          <Link href="/market-research" className="hover:text-cyan-500 transition-colors flex items-center gap-2"><PieChart className="w-3 h-3" /> Market Research</Link>
          <Link href="/network" className="hover:text-cyan-500 transition-colors flex items-center gap-2"><Globe className="w-3 h-3" /> Network</Link>
          <Link href="/guide" className="hover:text-cyan-500 transition-colors flex items-center gap-2"><Map className="w-3 h-3" /> Guide</Link>
        </nav>

        {/* User Account Actions - Right-aligned */}
        <div className="hidden md:flex items-center gap-4 text-xs uppercase tracking-widest font-bold">
          {/* Conditional rendering based on user registration status */}
          {isRegistered ? (
            <div className="flex items-center gap-4">
              {/* Profile Link with Icon */}
              <Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors">
                <UserCircle className="w-5 h-5" /> My Profile
              </Link>
              {/* Sign Out Action */}
              <button className="text-white hover:text-red-400 transition-colors" onClick={logout}>Sign Out</button>
            </div>
          ) : (
            /* Registration CTA for non-authenticated users */
            <Link href="/register">
              <button className="btn-glow shrink-0">Register</button>
            </Link>
          )}
        </div>

        {/* Mobile Navigation Toggle Button (visible on small screens) */}
        <button 
          className="lg:hidden text-white hover:text-cyan-500 transition-colors p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        </header>

        {/* Full-width Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-[#050505]/95 backdrop-blur-xl flex flex-col font-inter font-bold uppercase tracking-widest text-[11px] text-white w-full border-t border-white/10 p-4 gap-4 z-10 transition-all">
            {/* Mobile primary links */}
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="hover:text-cyan-500 transition-colors flex items-center gap-2 py-2"><Home className="w-4 h-4" /> Home</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="hover:text-cyan-500 transition-colors flex items-center gap-2 py-2"><Rocket className="w-4 h-4" /> About</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/tools" className="hover:text-cyan-500 transition-colors flex items-center gap-2 py-2"><Wrench className="w-4 h-4" /> Tools</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/market-research" className="hover:text-cyan-500 transition-colors flex items-center gap-2 py-2"><PieChart className="w-4 h-4" /> Market Research</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/network" className="hover:text-cyan-500 transition-colors flex items-center gap-2 py-2"><Globe className="w-4 h-4" /> Network</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/guide" className="hover:text-cyan-500 transition-colors flex items-center gap-2 py-2"><Map className="w-4 h-4" /> Guide</Link>
            
            {/* Mobile authentication area */}
            <div className="border-t border-white/10 mt-2 pt-4 flex flex-col gap-4">
              {isRegistered ? (
                <>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="flex items-center gap-2 text-cyan-400">
                    <UserCircle className="w-5 h-5" /> My Profile
                  </Link>
                  <button className="text-left text-red-400 transition-colors" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Sign Out</button>
                </>
              ) : (
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/register" className="inline-block">
                  <button className="btn-glow shrink-0 w-full">Register</button>
                </Link>
              )}
            </div>
            
            {/* Mobile secondary links */}
            <div className="border-t border-white/10 mt-2 pt-4 flex flex-col gap-3">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="#" className="hover:text-cyan-500 transition-colors">Download the Report</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="#" className="hover:text-cyan-500 transition-colors">Startup Playbook</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="#" className="hover:text-cyan-500 transition-colors">Curriculum</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/careers" className="hover:text-cyan-500 transition-colors">Careers</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/success-stories" className="hover:text-cyan-500 transition-colors">Success Stories</Link>
            </div>
          </nav>
        )}

        {/* Secondary Sub-Header Navigation (Desktop only) */}
        {/* Displays secondary links underneath the main navigation bar */}
        <div className="bg-[#050505]/95 backdrop-blur-xl py-2 px-8 hidden md:flex justify-center gap-6 items-center font-inter font-bold uppercase tracking-widest text-[11px] text-white z-0 transition-all">
          <Link href="#" className="hover:text-cyan-500 transition-colors">Download the Report</Link>
          <Link href="#" className="hover:text-cyan-500 transition-colors">Startup Playbook</Link>
          <Link href="#" className="hover:text-cyan-500 transition-colors">Curriculum</Link>
          <Link href="/careers" className="hover:text-cyan-500 transition-colors">Careers</Link>
          <Link href="/success-stories" className="hover:text-cyan-500 transition-colors">Success Stories</Link>
        </div>
      </div>
    </>
  );
}

