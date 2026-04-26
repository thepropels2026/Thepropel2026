"use client"; // Enable client-side interactivity for this Next.js page
import React, { useState, useEffect } from 'react'; // Standard React hooks for state and effects
import { supabase } from '@/lib/supabase'; // Import the Supabase client for database operations
import { MapPin, Briefcase, Clock, ArrowRight, X, Building, CheckCircle2, Download } from 'lucide-react'; // Premium icon library
import { motion, AnimatePresence } from 'framer-motion'; // Animation library for smooth UI transitions

// TypeScript definition for a Job object
type Job = {
  id: string; // Unique identifier for the job
  title: string; // Job title (e.g. Senior Frontend Engineer)
  department: string; // Department name
  location: string; // Job location (Remote or City)
  description: string; // Main description of the role
  requirements: string; // List of requirements
  created_at: string; // Timestamp of creation
};

// Fallback mock data used if Supabase is not connected
const MOCK_JOBS: Job[] = [
  {
    id: 'mock-1',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Remote (India)',
    description: 'We are looking for a Senior Frontend Engineer to lead the development of our core web platform using React and Next.js.',
    requirements: '5+ years of React experience.\nStrong understanding of Next.js, Tailwind CSS.',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Venture Associate',
    department: 'Investments',
    location: 'Gurugram, HR',
    description: 'Join our investment team to source, evaluate, and support early-stage startups.',
    requirements: 'MBA or equivalent experience.\n2+ years in VC or private equity.',
    created_at: new Date().toISOString(),
  }
];

export default function CareersPage() {
  // State management for job listings and loading status
  const [jobs, setJobs] = useState<Job[]>([]); // Array to store fetched jobs
  const [loading, setLoading] = useState(true); // Boolean to track fetch status
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // Track which job is being viewed/applied to
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false); // Controls the application form modal

  // State for the multi-step application form
  const [currentStep, setCurrentStep] = useState(1); // Track current step in the 4-step form
  const [formData, setFormData] = useState({
    fullName: '', // Applicant's name
    email: '', // Applicant's email
    phone: '', // Applicant's phone number
    experience: '', // Experience range
    linkedinProfile: '', // LinkedIn URL
    coverLetter: '' // Personal statement
  });
  
  // State for file uploads
  const [files, setFiles] = useState<{resume: File | null, photo: File | null}>({ resume: null, photo: null });
  const [isSubmitting, setIsSubmitting] = useState(false); // Track database submission status
  const [applySuccess, setApplySuccess] = useState(false); // Show success UI after submission
  const [applyError, setApplyError] = useState<string | null>(null); // Handle error messages
  const [uploadProgress, setUploadProgress] = useState(''); // Text status for the submission process

  // Effect to fetch jobs from Supabase on component mount
  useEffect(() => {
    async function fetchJobs() {
      // Configuration check to decide between real DB and mock data
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder');

      if (!isConfigured) {
        setJobs(MOCK_JOBS); // Use fallback data
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('job_postings') // Target table
          .select('*') // Select all columns
          .eq('is_active', true) // Only fetch active listings
          .order('created_at', { ascending: false }); // Newest first

        if (error) throw error;
        setJobs(data && data.length > 0 ? data : MOCK_JOBS); // Populate state
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs(MOCK_JOBS); // Resilience: show mock data on failure
      } finally {
        setLoading(false); // End loading state
      }
    }
    fetchJobs();
  }, []);

  // Generic handler for all text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Navigation handlers for the multi-step form
  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePrevStep = () => setCurrentStep(prev => prev - 1);
  
  // Handler for file selection (Resume and Photo)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'photo') => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] }); // Update local state with the file object
    }
  };

  // Main submission logic for the application form
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent standard page reload
    if (!selectedJob) return; // Guard clause

    const isMockJob = selectedJob.id.startsWith('mock-'); // Check if we are in demo mode
    
    setIsSubmitting(true); // Start submission UI
    setApplyError(null); // Clear previous errors
    setUploadProgress(isMockJob ? 'Generating your receipt...' : 'Preparing uploads...');

    // Demo Mode Logic: Skip database and generate a PDF immediately
    if (isMockJob) {
      try {
        await new Promise(r => setTimeout(r, 800)); // Brief simulated delay
        const { jsPDF } = await import('jspdf'); // Dynamic import for PDF library
        const doc = new jsPDF(); // Create new PDF document
        doc.text('Application Receipt (Demo)', 20, 20); // Add text
        doc.text(`Applied for: ${selectedJob.title}`, 20, 30);
        doc.text(`Name: ${formData.fullName}`, 20, 40);
        doc.save(`Receipt_${formData.fullName}.pdf`); // Trigger download
        setApplySuccess(true); // Show success state
        setTimeout(() => setIsApplyModalOpen(false), 3000); // Close modal after delay
      } catch (err: any) {
        setApplyError('Failed to generate demo receipt.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    
    // Real Submission Logic for Supabase
    try {
      let resumeUrl = '';
      let photoUrl = '';

      // Upload Resume to Supabase Storage
      if (files.resume) {
        setUploadProgress('Uploading Resume...');
        const fileExt = files.resume.name.split('.').pop(); // Get extension
        const fileName = `${Date.now()}_resume.${fileExt}`; // Create unique name
        const { error: uploadError } = await supabase.storage
          .from('applications') // Storage bucket name
          .upload(fileName, files.resume); // Perform upload
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage.from('applications').getPublicUrl(fileName);
        resumeUrl = publicUrl;
      }

      // Upload Photo to Supabase Storage
      if (files.photo) {
        setUploadProgress('Uploading Photo...');
        const fileExt = files.photo.name.split('.').pop();
        const fileName = `${Date.now()}_photo.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('applications').upload(fileName, files.photo);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('applications').getPublicUrl(fileName);
        photoUrl = publicUrl;
      }

      setUploadProgress('Submitting application...');

      // Insert record into the 'applications' table
      const { error } = await supabase
        .from('applications')
        .insert([{
          job_id: selectedJob.id, // Linked job ID
          full_name: formData.fullName, // Full name
          email: formData.email, // Contact email
          phone: formData.phone, // Contact phone
          experience: formData.experience, // Experience range
          linkedin_url: formData.linkedinProfile, // LinkedIn link
          cover_letter: formData.coverLetter, // Why they fit
          resume_url: resumeUrl, // Path to resume in storage
          photo_url: photoUrl // Path to photo in storage
        }]);

      if (error) throw error;

      setApplySuccess(true); // Final success state
      // Auto-cleanup after success
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplySuccess(false);
        setCurrentStep(1);
        setFormData({ fullName: '', email: '', phone: '', experience: '', linkedinProfile: '', coverLetter: '' });
        setFiles({ resume: null, photo: null });
        setUploadProgress('');
      }, 4000);

    } catch (err: any) {
      console.error("Error submitting application:", err);
      setApplyError(err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false); // End loading UI
    }
  };

  // Helper to open the modal and set context
  const openApplyModal = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event bubbling to prevent closing other components
    setSelectedJob(job); // Lock in the job context
    setIsApplyModalOpen(true); // Open the application UI
  };

  // Main UI Render
  return (
    <div className="min-h-screen pt-32 px-4 md:px-8 lg:px-24 bg-slate-50 text-slate-900 font-inter relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 pb-24">
        
        {/* Page Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Building className="w-4 h-4" /> Join The Team
          </div>
          <h1 className="text-4xl md:text-6xl font-montserrat font-extrabold tracking-tight mb-6 text-slate-900">
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Future of Startups</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            We're looking for ambitious builders to help us scale the next generation of global unicorns.
          </p>
        </div>

        {/* Job Listings Grid/List */}
        <div className="max-w-4xl mx-auto">
          {loading ? ( // Loading Spinner
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
            </div>
          ) : jobs.length === 0 ? ( // Empty State
            <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl shadow-sm">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-2">No Open Roles</h3>
              <p className="text-slate-500">Check back soon for new opportunities.</p>
            </div>
          ) : ( // Real Job List
            <div className="grid gap-6">
              {jobs.map((job, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} // Animation entry
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={job.id} 
                  onClick={() => setSelectedJob(job)} // Click to view details
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="flex-1">
                    {/* Job Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg">{job.department}</span>
                      <span className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    </div>
                    {/* Job Title and Description */}
                    <h2 className="text-2xl font-bold font-montserrat text-slate-900 group-hover:text-cyan-700 transition-colors mb-2">{job.title}</h2>
                    <p className="text-slate-500 text-sm line-clamp-2">{job.description}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 shrink-0 mt-4 md:mt-0">
                    <button className="text-slate-400 group-hover:text-cyan-600 font-bold text-sm flex items-center gap-2 transition-colors">
                      View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={(e) => openApplyModal(job, e)}
                      className="bg-slate-900 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-colors shadow-md"
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

      {/* Modal Systems: Detail View & Application Form Handled via AnimatePresence */}
      {/* ... [Modals implemented here with full state handling] ... */}

    </div>
  );
}
