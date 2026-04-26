"use client";
import React, { useState } from 'react';
import { X, Target, Eye, BookOpen, Mic, Briefcase, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('mission');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-3xl bg-[#0a0a0f] border-l border-white/10 h-full shadow-2xl flex flex-col transform transition-transform overflow-y-auto font-inter relative slide-in-right">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-white/5 sticky top-0 bg-[#0a0a0f]/90 backdrop-blur z-10">
          <h2 className="text-3xl font-montserrat font-bold tracking-wider">About Us</h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Side Nav */}
          <div className="w-64 border-r border-white/5 p-6 space-y-2 shrink-0">
            {[
              { id: 'mission', label: 'Mission', icon: Target },
              { id: 'vision', label: 'Vision', icon: Eye },
              { id: 'founders-note', label: 'Founders Note', icon: FileText },
              { id: 'blogs', label: 'Blogs', icon: BookOpen },
              { id: 'podcasts', label: 'Podcasts', icon: Mic },
              { id: 'careers', label: 'Careers', icon: Briefcase },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'mission' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-montserrat font-bold text-cyan-400 mb-6">Our Mission</h3>
                <p className="text-lg text-gray-300 leading-relaxed font-inter">
                  Our mission is to democratize elite startup building by integrating predictive AI, psychological clarity, and a world-class investor network to propel founders from concept to market dominance at unprecedented speed.
                </p>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-montserrat font-bold text-cyan-400 mb-6">Our Vision</h3>
                <p className="text-lg text-gray-300 leading-relaxed font-inter">
                  To become the global standard for entrepreneurial success, where every visionary idea is met with the intelligence and capital required to change the world.
                </p>
              </div>
            )}

            {activeTab === 'founders-note' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-montserrat font-bold text-cyan-400 mb-6">Founder's Note</h3>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 relative">
                  <div className="absolute text-8xl text-white/5 font-serif -top-4 left-2">"</div>
                  <p className="text-lg text-gray-300 italic relative z-10 mb-6">
                    We built The Propels because the ecosystem was broken. Brilliant minds were restricted by lack of access and capital. We decided to bridge that gap using technology and community.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full border-2 border-white/20"></div>
                    <div>
                      <h4 className="font-bold text-white tracking-widest uppercase">Elias Vance</h4>
                      <p className="text-cyan-500 text-sm">Founder & CEO</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-montserrat font-bold text-cyan-400 mb-6">Latest Insights</h3>
                <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="group cursor-pointer bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/30 transition-all flex">
                      <div className="w-32 h-auto bg-gray-800"></div>
                      <div className="p-4 flex-1">
                        <span className="text-xs text-cyan-500 font-bold uppercase mb-2 block">Startup Growth</span>
                        <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">How to raise Seed funding in 14 days</h4>
                        <p className="text-sm text-gray-400">Mastering the pitch and finding the perfect alignment with early-stage VCs.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'podcasts' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-montserrat font-bold text-cyan-400 mb-6">Propulsion Podcasts</h3>
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-500/20 text-cyan-500 flex items-center justify-center rounded-full">
                          <Mic className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">Episode 0{i}: The Future of AI Startups</h4>
                          <p className="text-xs text-gray-400">45 mins • Deep Dive</p>
                        </div>
                      </div>
                      <button className="text-cyan-500 hover:text-white px-4 py-2 border border-cyan-500/30 hover:bg-cyan-500/20 rounded uppercase text-xs font-bold tracking-widest transition-all">Play</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'careers' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-montserrat font-bold text-cyan-400 mb-6">Join The Propulsion</h3>
                <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                  <Briefcase className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">We're expanding the crew</h4>
                  <p className="text-gray-400 mb-6 text-sm">Looking for AI Engineers, Mentor Liaisons, and UI/UX designers.</p>
                  <Link href="/careers" onClick={onClose} className="btn-glow inline-block">View All Roles</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
