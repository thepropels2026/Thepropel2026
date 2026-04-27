"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function StoryDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Story {params.id}</h1>
        <p className="text-slate-400 leading-relaxed">
          Deep dive into the journey of how this company scaled to success using The Propels methodology.
        </p>
      </div>
    </div>
  );
}
