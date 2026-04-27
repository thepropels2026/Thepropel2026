"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Founder Profile</h1>
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-slate-400">Complete your profile to unlock more features.</p>
        </div>
      </div>
    </div>
  );
}
