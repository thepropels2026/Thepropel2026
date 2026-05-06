"use client"; // Enable client-side rendering for interactivity (state, hooks)
import React, { useState } from 'react';
import Link from 'next/link'; // Next.js link for optimized client-side navigation
import { useAuth } from './AuthContext'; // Access global authentication state
// Import icons from lucide-react for visual navigation cues
import { UserCircle, Home, Rocket, Wrench, PieChart, Globe, Map, Menu, X, Linkedin, LogOut, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Header component: The main navigation bar for the application.
 * Includes logo, desktop navigation, mobile navigation, and user authentication actions.
 */
export default function Header() {
  // Extract auth state and logout function from context
  const { isRegistered, logout, setRegisterModalOpen, setLoginModalOpen } = useAuth();
  // State to manage mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State to manage logout confirmation modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    setIsMobileMenuOpen(false);
  };

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
        <nav className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 items-center font-montserrat font-bold uppercase tracking-[0.1em] text-[12px] text-white/70">
          <Link href="/" className="hover:text-white transition-colors duration-150 flex items-center gap-2"><Home className="w-3.5 h-3.5" /> Home</Link>
          <Link href="/about" className="hover:text-white transition-colors duration-150 flex items-center gap-2"><Rocket className="w-3.5 h-3.5" /> About</Link>
          <Link href="/tools" className="hover:text-white transition-colors duration-150 flex items-center gap-2"><Wrench className="w-3.5 h-3.5" /> Tools</Link>
          <Link href="/market-research" className="hover:text-white transition-colors duration-150 flex items-center gap-2"><PieChart className="w-3.5 h-3.5" /> Market Research</Link>
          <Link href="/network" className="hover:text-white transition-colors duration-150 flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Network</Link>
          <Link href="/guide" className="hover:text-white transition-colors duration-150 flex items-center gap-2"><Map className="w-3.5 h-3.5" /> Guide</Link>
        </nav>

        {/* User Account Actions - Right-aligned */}
        <div className="hidden md:flex items-center gap-5 text-[13px] font-bold tracking-tight font-inter">
          {/* Conditional rendering based on user registration status */}
          {isRegistered ? (
            <div className="flex items-center gap-5">
              {/* Profile Link with Icon */}
              <Link href="/profile" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors duration-150">
                <UserCircle className="w-5 h-5" /> My Profile
              </Link>
              <button className="text-white/50 hover:text-white transition-colors duration-150" onClick={() => setShowLogoutConfirm(true)}>Sign Out</button>
            </div>
          ) : (
            /* Registration & Login CTA for non-authenticated users */
            <div className="flex items-center gap-5">
              <button className="text-white hover:text-cyan-400 transition-colors" onClick={() => setLoginModalOpen(true)}>Login</button>
              <button 
                onClick={() => setRegisterModalOpen(true)}
                className="px-7 py-2.5 bg-white text-black rounded-xl hover:bg-slate-100 transition-all duration-300 font-bold shadow-lg shadow-white/5"
              >
                Register
              </button>
            </div>
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
          <nav className="lg:hidden bg-[#050505]/95 backdrop-blur-xl flex flex-col font-montserrat font-bold uppercase tracking-widest text-[10px] text-white w-full border-t border-white/10 p-4 gap-4 z-10 transition-all">
            {/* Mobile primary links */}
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="hover:text-white transition-colors duration-150 flex items-center gap-2 py-2"><Home className="w-4 h-4" /> Home</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="hover:text-white transition-colors duration-150 flex items-center gap-2 py-2"><Rocket className="w-4 h-4" /> About</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/tools" className="hover:text-white transition-colors duration-150 flex items-center gap-2 py-2"><Wrench className="w-4 h-4" /> Tools</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/market-research" className="hover:text-white transition-colors duration-150 flex items-center gap-2 py-2"><PieChart className="w-4 h-4" /> Market Research</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/network" className="hover:text-white transition-colors duration-150 flex items-center gap-2 py-2"><Globe className="w-4 h-4" /> Network</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/guide" className="hover:text-white transition-colors duration-150 flex items-center gap-2 py-2"><Map className="w-4 h-4" /> Guide</Link>
            
            {/* Mobile authentication area */}
            <div className="border-t border-white/10 mt-2 pt-4 flex flex-col gap-4">
              {isRegistered ? (
                <>
                  <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="flex items-center gap-2 text-white/70">
                    <UserCircle className="w-5 h-5" /> My Profile
                  </Link>
                  <button className="text-left text-white/40 hover:text-white/70 transition-colors duration-150 text-xs" onClick={() => setShowLogoutConfirm(true)}>Sign Out</button>
                </>
              ) : (
                <button className="btn-glow shrink-0 w-full" onClick={() => { setRegisterModalOpen(true); setIsMobileMenuOpen(false); }}>Register</button>
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
        <div className="bg-[#0c0c0e]/95 backdrop-blur-xl py-2 px-8 hidden md:flex justify-center gap-6 items-center font-montserrat font-bold uppercase tracking-widest text-[10px] text-white z-0 border-t border-white/5">
          <Link href="#" className="hover:text-white/70 transition-colors duration-150">Download the Report</Link>
          <Link href="#" className="hover:text-white/70 transition-colors duration-150">Startup Playbook</Link>
          <Link href="#" className="hover:text-white/70 transition-colors duration-150">Curriculum</Link>
          <Link href="/careers" className="hover:text-white/70 transition-colors duration-150">Careers</Link>
          <Link href="/success-stories" className="hover:text-white/70 transition-colors duration-150">Success Stories</Link>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-inter tracking-tight">Confirm Sign Out</h3>
              <p className="text-white/50 text-sm mb-8 font-inter font-medium">Are you sure you want to terminate your current session? You will need to re-authenticate to access your node.</p>
              
              <div className="flex gap-4 font-inter">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-6 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-[11px] hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl font-bold text-[11px] shadow-lg shadow-red-600/20 hover:bg-red-500 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
