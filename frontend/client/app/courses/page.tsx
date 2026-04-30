"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Play, 
  Video, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Course = {
  id: string;
  title: string;
  image_url: string;
  mentor: string;
  description: string;
  actual_price: number;
  discounted_price: number;
  enroll_link: string;
  created_at: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6">
            <TrendingUp className="w-4 h-4" /> Professional Mastery
          </div>
          <h1 className="text-5xl md:text-7xl font-montserrat font-bold mb-6 tracking-tight">Master the <span className="text-orange-500">Unicorn</span> Playbook</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Expert-led courses designed to give you an unfair advantage in the startup ecosystem.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course, idx) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden hover:border-orange-500/50 transition-all duration-500"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image src={course.image_url} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><Play className="w-4 h-4 fill-black text-black" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Video Training</span>
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mentor: {course.mentor}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-montserrat group-hover:text-orange-500 transition-colors">{course.title}</h3>
                  <p className="text-slate-400 text-sm mb-8 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-slate-500 text-xs line-through">₹{course.actual_price}</span>
                      <span className="text-3xl font-black text-white">₹{course.discounted_price}</span>
                    </div>
                    <Link href={course.enroll_link} target="_blank" className="bg-white text-black px-6 py-3 rounded-2xl font-bold text-xs uppercase hover:bg-orange-500 transition-colors">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
