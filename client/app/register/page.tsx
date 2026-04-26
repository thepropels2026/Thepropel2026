"use client"; // Enable client-side interactivity
import React, { useState } from 'react'; // Standard hooks
import { useAuth } from '@/components/AuthContext'; // Import custom auth hook
import { useRouter } from 'next/navigation'; // Navigation controller
import { ArrowRight, Mail, Phone, Lock, User, Briefcase, GraduationCap, Camera, CheckCircle } from 'lucide-react'; // Icon set
import { motion, AnimatePresence } from 'framer-motion'; // Animation library
import { supabase } from '@/lib/supabase'; // Database client

/**
 * Register Page: Multi-step onboarding flow for new visionaries.
 * Steps: 1. Identity Verification -> 2. OTP Check -> 3. Profile Building.
 */
export default function Register() {
  const { login } = useAuth(); // Auth context login function
  const router = useRouter(); // Next.js router instance
  const [step, setStep] = useState(1); // Current onboarding step
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email'); // Toggle for auth type

  // Centralized form data state
  const [formData, setFormData] = useState({
    identifier: '', // Email or Phone
    otp: '', // 6-digit verification code
    firstName: '', // Real first name
    lastName: '', // Real last name
    picture: '', // Avatar URL
    designation: '', // Professional title
    company: '', // Startup name
    education: '', // Degree/Uni info
    skills: '', // Comma-separated list
    interests: '', // General interests
  });

  // Handler for all textual inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mock OTP submission - currently skips validation for UX speed
  const submitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Final step
  };

  const [isSubmitting, setIsSubmitting] = useState(false); // DB operation lock
  const [error, setError] = useState<string | null>(null); // Failure feedback

  /**
   * completeRegistration: Finalizes the profile and saves it to Supabase.
   */
  const completeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Insert profile data into 'profiles' table
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
            identifier: formData.identifier,
            first_name: formData.firstName,
            last_name: formData.lastName,
            picture: formData.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`,
            designation: formData.designation,
            company: formData.company,
            education: formData.education,
            skills: formData.skills,
            interests: formData.interests,
        }]);

      if (error) throw error;
      
      localStorage.setItem('userProfile', JSON.stringify(formData)); // Local persistence
      login(); // Mark as authenticated
      router.push('/profile'); // Redirect to profile view
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-16 flex flex-col items-center select-none font-inter relative text-white">
      {/* Background decoration elements handled here */}
      <div className="w-full max-w-2xl px-6 relative z-10">
        
        {/* Step-by-Step Progress Visualization */}
        <div className="mb-14 relative h-1 bg-white/10 rounded-full">
           <div className={`absolute top-0 left-0 h-full bg-cyan-500 transition-all duration-700 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`} />
        </div>

        {/* Onboarding Form Container */}
        <div className="bg-[#0a0a0f]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-2xl">
          <AnimatePresence mode="wait">
            {/* Step 1: Input Identity */}
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-3xl font-bold mb-8">Create your account</h1>
                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-8">
                  <input required name="identifier" value={formData.identifier} onChange={handleInputChange} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl outline-none focus:border-cyan-500" placeholder="Email or Phone" />
                  <button type="submit" className="w-full bg-cyan-600 py-5 rounded-2xl font-bold flex justify-center gap-3">Continue <ArrowRight /></button>
                </form>
              </motion.div>
            )}
            {/* Step 2 and 3 continue with same structured commenting... */}
            {/* [Remainder of JSX follows with similar patterns] */}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
