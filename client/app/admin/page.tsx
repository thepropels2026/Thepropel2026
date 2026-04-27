"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Internal Admin Access</h1>
        <p className="text-slate-400 mb-8">This portal is for authorized Propels personnel only.</p>
        <button className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-xl">
          Secure Login
        </button>
      </div>
    </div>
  );
}
