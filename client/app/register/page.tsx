"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full p-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Join The Propels</h1>
        <form className="space-y-6">
          <input type="text" placeholder="Full Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-400" />
          <input type="email" placeholder="Work Email" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-400" />
          <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
