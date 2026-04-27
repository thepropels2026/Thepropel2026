"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SuccessStoriesPage() {
  const stories = [
    { id: '1', title: "Nexus AI: From $0 to $10M ARR in 12 Months", industry: "Artificial Intelligence" },
    { id: '2', title: "FinFlow: Disrupting Traditional Banking", industry: "Fintech" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 font-montserrat">Success Stories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map(story => (
            <Link key={story.id} href={`/success-stories/${story.id}`}>
              <div className="p-10 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
                <span className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-4 block">{story.industry}</span>
                <h2 className="text-3xl font-bold group-hover:text-cyan-400 transition-colors">{story.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
