"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MapPin, Briefcase, Clock, ArrowRight, X, Building, CheckCircle2, Download } from 'lucide-react';
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

const MOCK_JOBS: Job[] = [
  {
    id: 'mock-1',
    title: 'Senior Frontend Engineer',
    role: 'Engineering',
    location: 'Remote (India)',
    mode: 'Full-Time',
    stipend: '$100k - $120k',
    work_duration: 'Permanent',
    description: 'We are looking for a Senior Frontend Engineer to lead the development of our core web platform using React and Next.js. You will work closely with design and product teams to deliver a world-class user experience for our founder community.',
    qualification: '5+ years of React experience.\nStrong understanding of Next.js, Tailwind CSS, and performance optimization.',
    eligibility: 'Must be legally authorized to work in India or willing to relocate.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Venture Associate',
    role: 'Investments',
    location: 'Gurugram, HR',
    mode: 'Full-Time',
    stipend: '₹12L - ₹15L',
    work_duration: 'Permanent',
    description: 'Join our investment team to source, evaluate, and support early-stage startups. You will conduct market research, due diligence, and help portfolio companies scale from zero to one.',
    qualification: 'MBA or equivalent experience.\n2+ years in VC, private equity, or a high-growth startup.',
    eligibility: 'Open to fresh graduates with exceptional academic records.',
    created_at: new Date().toISOString(),
  },
];

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Application Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    linkedinProfile: '',
    coverLetter: ''
  });
  const [files, setFiles] = useState<{resume: File | null, photo: File | null}>({ resume: null, photo: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      // Check if Supabase is configured with real credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

      if (!isConfigured) {
        // No real Supabase credentials — use mock data so page still works
        setJobs(MOCK_JOBS);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('job_postings')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        // If DB is empty, fall back to mock data
        setJobs(data && data.length > 0 ? data : MOCK_JOBS);
      } catch (err) {
        console.error(\"Error fetching jobs:\", err);
        // On any error, show mock data so page doesn't appear broken
        setJobs(MOCK_JOBS);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePrevStep = () => setCurrentStep(prev => prev - 1);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'photo') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    // Demo mode: mock job IDs start with 'mock-'
    const isMockJob = selectedJob.id.startsWith('mock-');
    
    setIsSubmitting(true);
    setApplyError(null);
    setUploadProgress(isMockJob ? 'Generating your receipt...' : 'Preparing uploads...');

    // If demo/mock mode, skip all Supabase calls and go straight to PDF
    if (isMockJob) {
      try {
        await new Promise(r => setTimeout(r, 800)); // simulate brief delay
        setUploadProgress('Generating your receipt...');
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentW = pageW - margin * 2;
        doc.setFillColor(8, 145, 178);
        doc.rect(0, 0, pageW, 32, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text('The Propels', margin, 14);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('APPLICATION RECEIPT (DEMO)', margin, 22);
        doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`, pageW - margin, 22, { align: 'right' });
        doc.setTextColor(30, 41, 59);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text(`Applied for: ${selectedJob.title}`, margin, 48);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`${selectedJob.role} · ${selectedJob.location}`, margin, 55);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, 61, pageW - margin, 61);
        let y = 71;
        const field = (label: string, value: string) => {
          doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
          doc.text(label.toUpperCase(), margin, y);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(15, 23, 42);
          doc.text(value || '—', margin, y + 6); y += 16;
        };
        field('Full Name', formData.fullName);
        field('Professional Email', formData.email);
        field('Phone Number', formData.phone);
        field('LinkedIn Profile', formData.linkedinProfile);
        field('Years of Experience', formData.experience);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(100, 116, 139);
        doc.text(\"WHY YOU'RE A FIT\", margin, y); y += 6;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(15, 23, 42);
        const splitCover = doc.splitTextToSize(formData.coverLetter || '—', contentW);
        doc.text(splitCover, margin, y); y += splitCover.length * 6 + 16;
        doc.setDrawColor(226, 232, 240); doc.line(margin, y, pageW - margin, y); y += 8;
        doc.setFontSize(8); doc.setTextColor(148, 163, 184);
        doc.text('This is a demo receipt. Connect Supabase to enable live submissions.', margin, y, { maxWidth: contentW });
        doc.text('thepropels.in', pageW - margin, y, { align: 'right' });
        doc.save(`Application_Receipt_${formData.fullName.replace(/\s+/g, '_')}.pdf`);
        setApplySuccess(true);
        setTimeout(() => {
          setIsApplyModalOpen(false); setApplySuccess(false); setCurrentStep(1);
          setFormData({ fullName: '', email: '', phone: '', experience: '', linkedinProfile: '', coverLetter: '' });
          setFiles({ resume: null, photo: null }); setUploadProgress('');
        }, 4000);
      } catch (err: any) {
        setApplyError(err.message || 'Failed to generate receipt.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    

    try {
      let resumeUrl = '';
      let photoUrl = '';

      // Upload Resume
      if (files.resume) {
        setUploadProgress('Uploading Resume...');
        const fileExt = files.resume.name.split('.').pop();
        const fileName = `${Date.now()}_resume.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(fileName, files.resume);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('applications').getPublicUrl(fileName);
        resumeUrl = publicUrl;
      }

      // Upload Photo
      if (files.photo) {
        setUploadProgress('Uploading Photo...');
        const fileExt = files.photo.name.split('.').pop();
        const fileName = `${Date.now()}_photo.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('applications')
          .upload(fileName, files.photo);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('applications').getPublicUrl(fileName);
        photoUrl = publicUrl;
      }

      setUploadProgress('Submitting application...');

      const { error } = await supabase
        .from('applications')
        .insert([{
          job_id: selectedJob.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          linkedin_url: formData.linkedinProfile,
          cover_letter: formData.coverLetter,
          resume_url: resumeUrl,
          photo_url: photoUrl
        }]);

      if (error) throw error;

      // Generate and download applicant receipt PDF
      setUploadProgress('Generating your receipt...');
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentW = pageW - margin * 2;

      // Header bar
      doc.setFillColor(8, 145, 178); // cyan-600
      doc.rect(0, 0, pageW, 32, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('The Propels', margin, 14);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('APPLICATION RECEIPT', margin, 22);
      doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`, pageW - margin, 22, { align: 'right' });

      // Job title section
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(`Applied for: ${selectedJob.title}`, margin, 48);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`${selectedJob.role} · ${selectedJob.location}`, margin, 55);

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 61, pageW - margin, 61);

      // Section: Applicant Details
      let y = 71;
      const field = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(label.toUpperCase(), margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(value || '—', margin, y + 6);
        y += 16;
      };

      field('Full Name', formData.fullName);
      field('Professional Email', formData.email);
      field('Phone Number', formData.phone);
      field('LinkedIn Profile', formData.linkedinProfile);
      field('Years of Experience', formData.experience);

      // Cover letter block
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(\"WHY YOU'RE A FIT\", margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const splitCover = doc.splitTextToSize(formData.coverLetter || '—', contentW);
      doc.text(splitCover, margin, y);
      y += splitCover.length * 6 + 10;

      // Files row
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('ATTACHMENTS', margin, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(files.resume ? `✓ Resume uploaded: ${files.resume.name}` : '— No resume uploaded', margin, y);
      y += 8;
      doc.text(files.photo ? `✓ Photo uploaded: ${files.photo.name}` : '— No photo uploaded', margin, y);
      y += 16;

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageW - margin, y);
      y += 8;
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('This is an auto-generated receipt for your records. The Propels team will contact you at the email above.', margin, y, { maxWidth: contentW });
      doc.text('thepropels.in', pageW - margin, y, { align: 'right' });

      doc.save(`Application_Receipt_${formData.fullName.replace(/\s+/g, '_')}.pdf`);
      
      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
        setCurrentStep(1);
        setFormData({ fullName: '', email: '', phone: '', experience: '', linkedinProfile: '', coverLetter: '' });
        setFiles({ resume: null, photo: null });
        setUploadProgress('');
      }, 4000);

    } catch (err: any) {
      console.error(\"Error submitting application:\", err);
      setApplyError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openApplyModal = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className=\"min-h-screen pt-32 px-4 md:px-8 lg:px-24 bg-slate-50 text-slate-900 font-inter relative overflow-hidden\">
      
      {/* Decorative Background */}
      <div className=\"absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-[120px] opacity-60 pointer-events-none\" />
      <div className=\"absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none\" />

      <div className=\"max-w-7xl mx-auto relative z-10 pb-24\">
        
        {/* Header Section */}
        <div className=\"text-center mb-16 max-w-3xl mx-auto\">
          <div className=\"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm\">
            <Building className=\"w-4 h-4\" /> Join The Team
          </div>
          <h1 className=\"text-4xl md:text-6xl font-montserrat font-extrabold tracking-tight mb-6 text-slate-900\">
            Build the <span className=\"text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600\">Future of Startups</span>
          </h1>
          <p className=\"text-lg text-slate-600 leading-relaxed font-medium\">
            We're looking for ambitious builders, thinkers, and innovators to help us scale the next generation of global unicorns.
          </p>
        </div>

        {/* Job Listings */}
        <div className=\"max-w-4xl mx-auto\">
          {loading ? (
            <div className=\"flex justify-center items-center py-20\">
              <div className=\"w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin\"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className=\"text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm\">
              <Briefcase className=\"w-16 h-16 text-slate-300 mx-auto mb-4\" />
              <h3 className=\"text-xl font-bold text-slate-800 mb-2\">No Open Roles</h3>
              <p className=\"text-slate-500\">We aren't actively hiring right now, but check back soon!</p>
            </div>
          ) : (
            <div className=\"grid gap-6\">
              {jobs.map((job, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={job.id} 
                  onClick={() => setSelectedJob(job)}
                  className=\"bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6\"
                >
                  <div className=\"flex-1\">
                    <div className=\"flex flex-wrap items-center gap-3 mb-4\">
                      <span className=\"px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg\">
                        {job.role}
                      </span>
                      <span className=\"flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider\">
                        <MapPin className=\"w-3.5 h-3.5\" /> {job.location}
                      </span>
                      <span className=\"flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider\">
                        <Clock className=\"w-3.5 h-3.5\" /> {job.mode}
                      </span>
                    </div>
                    <h2 className=\"text-2xl font-bold font-montserrat text-slate-900 group-hover:text-cyan-700 transition-colors mb-2\">
                      {job.title}
                    </h2>
                    <p className=\"text-slate-500 text-sm line-clamp-2\">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className=\"flex items-center gap-4 shrink-0 mt-4 md:mt-0\">
                    <button className=\"text-slate-400 group-hover:text-cyan-600 font-bold text-sm flex items-center gap-2 transition-colors\">
                      View Details <ArrowRight className=\"w-4 h-4 group-hover:translate-x-1 transition-transform\" />
                    </button>
                    <button 
                      onClick={(e) => openApplyModal(job, e)}
                      className=\"bg-slate-900 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors shadow-md\"
                    >
                      Apply Now
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedJob && !isApplyModalOpen && (
          <div className=\"fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6\">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className=\"absolute inset-0 bg-slate-900/60 backdrop-blur-sm\"
              onClick={() => setSelectedJob(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className=\"bg-white w-full max-w-3xl max-h-[90vh] rounded-[2rem] shadow-2xl relative z-10 flex flex-col overflow-hidden\"
            >
              <div className=\"p-8 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white/80 backdrop-blur-md z-20\">
                <div>
                  <div className=\"flex gap-2 mb-3 flex-wrap\">
                    <span className=\"px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold uppercase tracking-wider rounded-lg\">
                      {selectedJob.role}
                    </span>
                    <span className=\"px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg\">
                      <MapPin className=\"w-3.5 h-3.5 inline mr-1 -mt-0.5\" />{selectedJob.location}
                    </span>
                    <span className=\"px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg\">
                      {selectedJob.mode}
                    </span>
                    <span className=\"px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg\">
                      Stipend: {selectedJob.stipend}
                    </span>
                    <span className=\"px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg\">
                      Duration: {selectedJob.work_duration}
                    </span>
                  </div>
                  <h2 className=\"text-3xl font-extrabold font-montserrat text-slate-900\">{selectedJob.title}</h2>
                </div>
                <button onClick={() => setSelectedJob(null)} className=\"p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors\">
                  <X className=\"w-5 h-5\" />
                </button>
              </div>
              
              <div className=\"p-8 overflow-y-auto flex-1 text-slate-600 leading-relaxed space-y-8\">
                <div>
                  <h3 className=\"text-lg font-bold text-slate-900 mb-3 font-montserrat\">Job Description</h3>
                  <p className=\"whitespace-pre-wrap\">{selectedJob.description}</p>
                </div>
                <div>
                  <h3 className=\"text-lg font-bold text-slate-900 mb-3 font-montserrat\">Qualification</h3>
                  <p className=\"whitespace-pre-wrap\">{selectedJob.qualification}</p>
                </div>
                <div>
                  <h3 className=\"text-lg font-bold text-slate-900 mb-3 font-montserrat\">Eligibility</h3>
                  <p className=\"whitespace-pre-wrap\">{selectedJob.eligibility}</p>
                </div>
              </div>

              <div className=\"p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4 shrink-0\">
                 <button onClick={() => setSelectedJob(null)} className=\"px-6 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors\">
                   Close
                 </button>
                 <button onClick={() => setIsApplyModalOpen(true)} className=\"px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md transition-colors\">
                   Apply for this role
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Apply Now Modal */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <div className=\"fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6\">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className=\"absolute inset-0 bg-slate-900/60 backdrop-blur-sm\"
              onClick={() => { if(!isSubmitting) setIsApplyModalOpen(false) }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className=\"bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl relative z-10 flex flex-col overflow-hidden\"
            >
              <div className=\"p-6 border-b border-slate-100 flex justify-between items-center bg-white z-20 shrink-0\">
                <div>
                  <h2 className=\"text-2xl font-extrabold font-montserrat text-slate-900\">Submit Application</h2>
                  <p className=\"text-sm font-medium text-cyan-600 mt-1\">Applying for: {selectedJob.title}</p>
                </div>
                {!isSubmitting && !applySuccess && (
                  <button onClick={() => setIsApplyModalOpen(false)} className=\"p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors\">
                    <X className=\"w-5 h-5\" />
                  </button>
                )}
              </div>
              
              <div className=\"p-6 overflow-y-auto flex-1 bg-slate-50\">
                {applySuccess ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className=\"flex flex-col items-center justify-center py-12 text-center\">
                    <div className=\"w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6\">
                      <CheckCircle2 className=\"w-10 h-10\" />
                    </div>
                    <h3 className=\"text-2xl font-bold text-slate-900 mb-2 font-montserrat\">Application Received!</h3>
                    <p className=\"text-slate-600 mb-4\">Thank you for applying. Our team will review your application and get back to you soon.</p>
                    <div className=\"flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-xl text-sm font-bold border border-cyan-200\">
                      <Download className=\"w-4 h-4\" /> Your application receipt has been downloaded as a PDF.
                    </div>
                  </motion.div>
                ) : (
                  <form id=\"applyForm\" onSubmit={currentStep === 4 ? handleApply : (e) => { e.preventDefault(); handleNextStep(); }} className=\"space-y-6\">
                    {/* Progress Bar */}
                    <div className=\"flex items-center justify-between mb-8 relative\">
                       <div className=\"absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full\" />
                       <div className={`absolute top-1/2 left-0 h-1 bg-cyan-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-300 ${currentStep === 1 ? 'w-0' : currentStep === 2 ? 'w-1/3' : currentStep === 3 ? 'w-2/3' : 'w-full'}`} />
                       
                       {[1, 2, 3, 4].map(step => (
                         <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-300'}`}>
                           {step}
                         </div>
                       ))}
                    </div>

                    {applyError && (
                      <div className=\"p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-200\">
                        {applyError}
                      </div>
                    )}

                    <AnimatePresence mode=\"wait\">
                      {currentStep === 1 && (
                        <motion.div key=\"step1\" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className=\"space-y-5\">
                          <h3 className=\"text-lg font-bold text-slate-800 mb-4 font-montserrat\">1. Personal Information</h3>
                          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                            <div>
                              <label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2\">Full Name <span className=\"text-red-500\">*</span></label>
                              <input required type=\"text\" name=\"fullName\" value={formData.fullName} onChange={handleInputChange} className=\"w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all\" />
                            </div>
                            <div>
                              <label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2\">Professional Email <span className=\"text-red-500\">*</span></label>
                              <input required type=\"email\" name=\"email\" value={formData.email} onChange={handleInputChange} className=\"w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all\" />
                            </div>
                          </div>
                          <div className=\"grid grid-cols-1 md:grid-cols-2 gap-5\">
                            <div>
                              <label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2\">Phone Number <span className=\"text-red-500\">*</span></label>
                              <input required type=\"tel\" name=\"phone\" value={formData.phone} onChange={handleInputChange} className=\"w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all\" />
                            </div>
                            <div>
                              <label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2\">LinkedIn Profile <span className=\"text-red-500\">*</span></label>
                              <input required type=\"url\" name=\"linkedinProfile\" placeholder=\"https://linkedin.com/in/...\" value={formData.linkedinProfile} onChange={handleInputChange} className=\"w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all\" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div key=\"step2\" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className=\"space-y-5\">
                          <h3 className=\"text-lg font-bold text-slate-800 mb-4 font-montserrat\">2. Experience & Fit</h3>
                          <div>
                            <label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2\">Years of Experience <span className=\"text-red-500\">*</span></label>
                            <select required name=\"experience\" value={formData.experience} onChange={handleInputChange} className=\"w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all\">
                              <option value=\"\">Select...</option>
                              <option value=\"0-1 years\">0-1 years</option>
                              <option value=\"2-4 years\">2-4 years</option>
                              <option value=\"5-8 years\">5-8 years</option>
                              <option value=\"9+ years\">9+ years</option>
                            </select>
                          </div>
                          <div>
                            <label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2\">Tell us why you're a fit <span className=\"text-red-500\">*</span></label>
                            <textarea required name=\"coverLetter\" rows={4} value={formData.coverLetter} onChange={handleInputChange} placeholder=\"Briefly describe your relevant experience...\" className=\"w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none\" />
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div key=\"step3\" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className=\"space-y-5\">
                          <h3 className=\"text-lg font-bold text-slate-800 mb-4 font-montserrat\">3. Attachments</h3>
                          <div className=\"bg-white border border-slate-200 border-dashed rounded-xl p-6 text-center\">
                            <label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3\">Resume (PDF) <span className=\"text-red-500\">*</span></label>
                            <input required type=\"file\" accept=\".pdf\" onChange={(e) => handleFileChange(e, 'resume')} className=\"w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition-colors\" />
                            {files.resume && <p className=\"text-xs text-green-600 font-bold mt-2\">Selected: {files.resume.name}</p>}
                          </div>
                          <div className=\"bg-white border border-slate-200 border-dashed rounded-xl p-6 text-center\">
                            <label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3\">Applicant Photo (Optional)</label>
                            <input type=\"file\" accept=\"image/*\" onChange={(e) => handleFileChange(e, 'photo')} className=\"w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition-colors\" />
                            {files.photo && <p className=\"text-xs text-green-600 font-bold mt-2\">Selected: {files.photo.name}</p>}
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div key=\"step4\" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className=\"space-y-5\">
                          <h3 className=\"text-lg font-bold text-slate-800 mb-4 font-montserrat\">4. Review Application</h3>
                          <div className=\"bg-white rounded-xl p-5 border border-slate-200 text-sm text-slate-600 space-y-3\">
                            <p><strong className=\"text-slate-900\">Name:</strong> {formData.fullName}</p>
                            <p><strong className=\"text-slate-900\">Email:</strong> {formData.email}</p>
                            <p><strong className=\"text-slate-900\">Phone:</strong> {formData.phone}</p>
                            <p><strong className=\"text-slate-900\">LinkedIn:</strong> {formData.linkedinProfile}</p>
                            <p><strong className=\"text-slate-900\">Experience:</strong> {formData.experience}</p>
                            <p><strong className=\"text-slate-900\">Files:</strong> {files.resume ? 'Resume Attached' : 'Missing Resume'}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                )}
              </div>

              {!applySuccess && (
                <div className=\"p-6 border-t border-slate-100 bg-white flex justify-between items-center shrink-0\">
                   {currentStep > 1 ? (
                     <button type=\"button\" onClick={handlePrevStep} disabled={isSubmitting} className=\"px-6 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50\">
                       Back
                     </button>
                   ) : (
                     <button type=\"button\" onClick={() => setIsApplyModalOpen(false)} disabled={isSubmitting} className=\"px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50\">
                       Cancel
                     </button>
                   )}
                   
                   <button 
                     form=\"applyForm\" 
                     type=\"submit\" 
                     disabled={isSubmitting}
                     className=\"px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 ml-auto\"
                   >
                     {isSubmitting ? (
                       <><div className=\"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin\"></div> {uploadProgress || 'Submitting...'}</>
                     ) : currentStep === 4 ? 'Submit Application' : 'Next Step'}
                   </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
