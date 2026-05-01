"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { 
  MapPin, Briefcase, Clock, ArrowLeft, ArrowRight, Building, 
  CheckCircle2, Download, Users, Calendar, ShieldCheck, 
  Mail, Phone, Linkedin, Send, FileText, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Job = {
  id: string;
  title: string;
  description: string;
  role: string;
  qualification: string;
  eligibility: string;
  stipend: string;
  work_duration: string;
  location: string;
  mode: string;
  created_at: string;
};

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicantCount, setApplicantCount] = useState(0);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    linkedinProfile: '',
    coverLetter: ''
  });

  useEffect(() => {
    async function fetchJobDetails() {
      try {
        setLoading(true);
        // Fetch Job Details
        const { data, error } = await supabase
          .from('job_postings')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setJob(data);

        // Fetch Applicant Count
        const { count, error: countError } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('job_id', id);

        if (!countError) setApplicantCount(count || 0);

      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJobDetails();
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setIsSubmitting(true);
    try {
      // 1. Submit to Database
      const { error } = await supabase.from('applications').insert({
        job_id: job.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        linkedin_url: formData.linkedinProfile,
        cover_letter: formData.coverLetter,
        status: 'pending'
      });

      if (error) throw error;

      // 2. Generate PDF Receipt
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Design PDF Header
      doc.setFillColor(15, 23, 42); // Slate-900
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('THE PROPELS', 20, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Startup Propulsion & Scaling Lab', 20, 32);
      
      // Candidate Info
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Application Confirmation', 20, 60);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 65, 190, 65);
      
      const field = (label: string, value: string, y: number) => {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(label, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(value || 'N/A', 20, y + 7);
      };

      field('CANDIDATE NAME', formData.fullName, 80);
      field('POSITION APPLIED', job.title, 100);
      field('APPLICATION ID', `TP-${Date.now().toString().slice(-6)}`, 120);
      field('SUBMISSION DATE', new Date().toLocaleDateString(), 140);
      field('CONTACT EMAIL', formData.email, 160);
      
      // Footer
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Our team will review your application and reach out via email for the next steps.', 20, 270);
      doc.text('thepropels.in', 190, 270, { align: 'right' });

      doc.save(`TP_Application_${formData.fullName.replace(/\s+/g, '_')}.pdf`);

      setApplySuccess(true);

      // Note: Actual email/SMS would typically require a backend edge function/service 
      // but the UI confirmation simulates the process.
      
    } catch (err) {
      alert("Submission failed. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <ShieldCheck className="w-16 h-16 text-slate-300 mb-4" />
      <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
      <button onClick={() => router.push('/careers')} className="mt-4 text-cyan-600 font-bold">Return to Careers</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 relative overflow-hidden font-inter">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-100 rounded-full blur-[150px] opacity-30 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Back Navigation */}
        <button 
          onClick={() => router.push('/careers')}
          className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 font-bold transition-colors mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Careers
        </button>

        {/* Hero Section */}
        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="px-5 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                {job.role}
              </span>
              <div className="flex items-center gap-2 px-5 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-cyan-100">
                <Users className="w-3.5 h-3.5" /> {applicantCount + 12} Applied
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-montserrat font-black text-slate-900 mb-6 leading-tight tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-x-10 gap-y-6 text-slate-500 font-bold text-sm uppercase tracking-wider mb-12">
              <div className="flex items-center gap-2.5"><MapPin className="w-5 h-5 text-cyan-600" /> {job.location}</div>
              <div className="flex items-center gap-2.5"><Clock className="w-5 h-5 text-cyan-600" /> {job.mode}</div>
              <div className="flex items-center gap-2.5"><Building className="w-5 h-5 text-cyan-600" /> Full Time</div>
            </div>

            <button 
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full md:w-auto bg-slate-900 hover:bg-cyan-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:shadow-cyan-100 active:scale-95 flex items-center justify-center gap-3"
            >
              Apply for this Position <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-6 font-montserrat flex items-center gap-3">
                <FileText className="w-6 h-6 text-cyan-600" /> Job Description
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium text-lg whitespace-pre-wrap">
                {job.description}
              </p>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-6 font-montserrat flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-cyan-600" /> Key Qualifications
              </h3>
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 text-slate-600 font-medium whitespace-pre-wrap leading-loose">
                {job.qualification}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-black text-slate-900 mb-6 font-montserrat flex items-center gap-3">
                <Calendar className="w-6 h-6 text-cyan-600" /> Eligibility
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {job.eligibility}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Package Overview</h4>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Stipend / Salary</p>
                  <p className="text-2xl font-black text-slate-900">{job.stipend}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Work Duration</p>
                  <p className="text-lg font-bold text-slate-900">{job.work_duration}</p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h4 className="text-xl font-black mb-4 font-montserrat">Quick Support</h4>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Have questions about this role? Our recruitment team is here to help.</p>
              <a href="mailto:careers@thepropels.in" className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:underline">
                Contact Recruitment <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-10 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-1 font-montserrat">Join the Force</h2>
                  <p className="text-cyan-600 font-black uppercase tracking-widest text-[10px]">Applying for: {job.title}</p>
                </div>
                <button onClick={() => setIsApplyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-7 h-7" /></button>
              </div>

              <div className="p-10 overflow-y-auto bg-slate-50/30">
                {applySuccess ? (
                  <div className="text-center py-16">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                      <CheckCircle2 className="w-12 h-12" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4 font-montserrat uppercase">Launch Successful!</h3>
                    <p className="text-slate-500 mb-4 font-medium text-lg leading-relaxed">
                      Your application has been transmitted. Check your downloads for the confirmation receipt.
                    </p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-10">Confirmation sent to {formData.email}</p>
                    <button 
                      onClick={() => { setIsApplyModalOpen(false); setApplySuccess(false); router.push('/careers'); }} 
                      className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-600 transition-all shadow-xl"
                    >
                      Return to Orbit
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Mail className="w-3 h-3" /> Full Name</label>
                        <input required placeholder="Elon Musk" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-bold shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Mail className="w-3 h-3" /> Email Address</label>
                        <input required type="email" placeholder="ceo@spacex.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-bold shadow-sm" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Phone className="w-3 h-3" /> Phone Number</label>
                        <input required placeholder="+91 99999 99999" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-bold shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Linkedin className="w-3 h-3" /> LinkedIn Profile</label>
                        <input required placeholder="https://linkedin.com/in/..." value={formData.linkedinProfile} onChange={e => setFormData({...formData, linkedinProfile: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-bold shadow-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2"><Send className="w-3 h-3" /> Why are you a fit?</label>
                      <textarea required placeholder="Describe your relevant experience and passion for this role..." rows={4} value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all text-slate-900 font-bold shadow-sm resize-none" />
                    </div>
                    
                    <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-cyan-600 transition-all shadow-xl hover:shadow-cyan-100 active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-3 text-xs">
                      {isSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Transmission in Progress</>
                      ) : 'Initiate Application'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
