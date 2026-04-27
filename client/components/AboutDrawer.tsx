"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AboutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutDrawer({ isOpen, onClose }: AboutDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[101] p-12 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold font-montserrat mb-6">About Propels</h2>
                <p className="text-slate-400 leading-relaxed text-lg">
                  We are a strategic growth platform dedicated to helping founders build sustainable, hyper-growth companies. Our methodology combines capital, network, and execution.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 font-montserrat">Quick Links</h3>
                <nav className="flex flex-col gap-4">
                  <a href="/about" className="text-slate-400 hover:text-cyan-400 transition-colors text-lg">Our Mission</a>
                  <a href="/network" className="text-slate-400 hover:text-cyan-400 transition-colors text-lg">The Network</a>
                  <a href="/success-stories" className="text-slate-400 hover:text-cyan-400 transition-colors text-lg">Success Stories</a>
                  <a href="/careers" className="text-slate-400 hover:text-cyan-400 transition-colors text-lg">Careers</a>
                </nav>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
