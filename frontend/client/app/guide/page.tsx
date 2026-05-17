"use client";
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, ShieldAlert, MonitorUp, Lock, CheckCircle,
  LayoutDashboard, GraduationCap, Library, Search, Map, 
  BookOpen, FileText, FileSpreadsheet, Download, Clock,
  ChevronRight, Circle, Play, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthContext';

// Mock Knowledge Base Data
const kbFiles = [
  { id: 1, title: 'Seed Pitch Deck Template', type: 'pdf', icon: FileText, desc: 'A 15-slide template designed for seed-stage investors.' },
  { id: 2, title: 'Market Research Cheatsheet', type: 'doc', icon: BookOpen, desc: 'Step-by-step guide to finding your Total Addressable Market.' },
  { id: 3, title: 'B2B Financial Modeling', type: 'spreadsheet', icon: FileSpreadsheet, desc: 'Excel template for SaaS revenue projections.' },
  { id: 4, title: 'Co-founder Equity Agreement', type: 'pdf', icon: FileText, desc: 'Standard contract for equity distribution.' },
  { id: 5, title: 'Go-To-Market Blueprint', type: 'pdf', icon: Map, desc: 'Launch strategies for zero-to-one startups.' },
  { id: 6, title: 'Investor CRM Template', type: 'spreadsheet', icon: FileSpreadsheet, desc: 'Track your conversations with angels and VCs.' },
];

export default function GuideLmsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [courses, setCourses] = useState<any[]>([]);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [kbResources, setKbResources] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const tabs = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Learning', icon: GraduationCap },
    { name: 'Courses', icon: Library },
    { name: 'Knowledge Base', icon: Search },
    { name: 'Blueprint', icon: Map },
  ];

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    console.log("Fetching LMS data for user:", user?.id);
    try {
      // 0. Check Subscription
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_email', user?.email)
        .single();
      
      setSubscription(subData);

      // 1. Fetch Courses
      const { data: coursesData, error: cErr } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (cErr) throw cErr;
      setCourses(coursesData || []);

      // 2. Fetch All Modules
      const { data: modulesData, error: mErr } = await supabase.from('course_modules').select('*').order('order_index', { ascending: true });
      if (mErr) throw mErr;
      setAllModules(modulesData || []);

      // 2.5 Fetch Enrollments
      let enrolledData: any[] = [];
      if (user?.id) {
         const { data: eData } = await supabase.from('user_enrollments').select('*').eq('user_id', user.id);
         enrolledData = eData || [];
         setEnrollments(enrolledData);
      }

      // 3. Fetch Knowledge Base
      const { data: kbData, error: kErr } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false });
      if (kErr) throw kErr;
      setKbResources(kbData || []);

      // 4. Fetch User Progress if logged in
      if (user) {
        const { data: progressData, error: pErr } = await supabase
          .from('user_course_progress')
          .select('*')
          .eq('user_id', user.id);
        if (pErr) throw pErr;
        setUserProgress(progressData || []);
        console.log("User progress fetched:", progressData?.length);
        
        // Initial sync to ensure consistency (only for enrolled modules)
        const enrolledCourseIds = enrolledData.map(e => e.course_id);
        const enrolledModules = modulesData?.filter(m => enrolledCourseIds.includes(m.course_id)) || [];
        syncGlobalProgress(progressData || [], enrolledModules);
      } else {
        setUserProgress([]);
      }
    } catch (err) {
      console.error("Error fetching LMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  const syncGlobalProgress = async (currentProgress: any[], currentModules: any[]) => {
    if (!user?.email) return;
    
    const totalModules = currentModules.length;
    let percentage = 0;
    
    if (totalModules > 0) {
      const totalWatchedSum = currentModules.reduce((acc: number, mod: any) => {
        const prog = currentProgress.find((p: any) => p.module_id === mod.id);
        return acc + (prog?.watched_percentage || 0);
      }, 0);
      percentage = Math.round(totalWatchedSum / totalModules);
    }

    console.log("Syncing global progress to database:", percentage + "%");
    try {
      await supabase
        .from('user_subscriptions')
        .update({ progress_percent: percentage })
        .eq('user_email', user.email);
    } catch (err) {
      console.error("Error syncing global progress:", err);
    }
  };

  const markModuleComplete = async (moduleId: string, courseId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('user_course_progress').upsert({
        user_id: user.id,
        module_id: moduleId,
        course_id: courseId,
        watched_percentage: 100
      }, { onConflict: 'user_id,module_id' });
      if (error) throw error;
      
      // Update local state and sync
      const { data: updatedProgress } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (updatedProgress) {
        setUserProgress(updatedProgress);
        const enrolledCourseIds = enrollments.map(e => e.course_id);
        const enrolledModules = allModules.filter(m => enrolledCourseIds.includes(m.course_id));
        syncGlobalProgress(updatedProgress, enrolledModules);
      }
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  const updateWatchProgress = async (moduleId: string, courseId: string, percentage: number, position: number) => {
    if (!user) return;
    try {
      // 1. Update local state for immediate feedback
      const updatedProgress = [...userProgress];
      const index = updatedProgress.findIndex(p => p.module_id === moduleId);
      if (index > -1) {
        updatedProgress[index] = { ...updatedProgress[index], watched_percentage: percentage, last_position: position };
      } else {
        updatedProgress.push({ user_id: user.id, module_id: moduleId, course_id: courseId, watched_percentage: percentage, last_position: position });
      }
      setUserProgress(updatedProgress);

      // 2. Database update (Silent)
      await supabase.from('user_course_progress').upsert({
        user_id: user.id,
        module_id: moduleId,
        course_id: courseId,
        watched_percentage: percentage,
        last_position: position
      }, { onConflict: 'user_id,module_id' });

      // 3. Global sync
      const enrolledCourseIds = enrollments.map(e => e.course_id);
      const enrolledModules = allModules.filter(m => enrolledCourseIds.includes(m.course_id));
      syncGlobalProgress(updatedProgress, enrolledModules);
    } catch (err) {
      console.error("Error updating watch progress:", err);
    }
  };

  const handleEnrollUser = async (courseId: string) => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('user_enrollments').insert({
        user_id: user.id,
        course_id: courseId
      }).select().single();
      
      if (error && error.code !== '23505') throw error; // Ignore unique constraint if already enrolled
      
      if (data) {
        setEnrollments(prev => [...prev, data]);
        // Switch to learning tab after enrollment
        setActiveTab('Learning');
      }
    } catch (err) {
      console.error("Error enrolling user:", err);
      alert("Could not enroll in course. Please try again.");
    }
  };

  // Removed auth guard to keep sections visible


  // Removed subscription guard to keep sections visible


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-inter pb-20 pt-24">
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-6 py-4 font-bold text-sm tracking-wide whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.name 
                  ? 'border-cyan-500 text-cyan-600 bg-cyan-50/50' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'Dashboard' && <DashboardTab courses={courses} allModules={allModules} userProgress={userProgress} enrollments={enrollments} loading={loading} setActiveTab={setActiveTab} />}
          {activeTab === 'Learning' && <LearningTab courses={courses} allModules={allModules} userProgress={userProgress} enrollments={enrollments} markComplete={markModuleComplete} updateProgress={updateWatchProgress} loading={loading} />}
          {activeTab === 'Courses' && <CoursesTab courses={courses} allModules={allModules} enrollments={enrollments} onEnroll={handleEnrollUser} loading={loading} />}
          {activeTab === 'Knowledge Base' && <KnowledgeBaseTab resources={kbResources} loading={loading} />}
          {activeTab === 'Blueprint' && <BlueprintTab userProgress={userProgress} allModules={allModules} setActiveTab={setActiveTab} />}
        </motion.div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 1. DASHBOARD TAB
// ------------------------------------------------------------------
function DashboardTab({ courses, allModules, userProgress, enrollments, loading, setActiveTab }: any) {
  const enrolledCourseIds = enrollments.map((e: any) => e.course_id);
  const enrolledModules = allModules.filter((m: any) => enrolledCourseIds.includes(m.course_id));
  
  const totalModules = enrolledModules.length;
  const totalWatchedSum = enrolledModules.reduce((acc: number, mod: any) => {
    const prog = userProgress.find((p: any) => p.module_id === mod.id);
    return acc + (prog?.watched_percentage || 0);
  }, 0);
  const percentage = totalModules > 0 ? Math.round(totalWatchedSum / totalModules) : 0;
  const completedModules = userProgress.filter((p: any) => 
    enrolledModules.some((m: any) => m.id === p.module_id) && p.watched_percentage === 100
  ).length;
  
  console.log("DashboardTab Render:", { totalModules, completedModules, percentage, enrolledCourseIds });

  // Find the first module that isn't completed in enrolled courses
  const nextModule = enrolledModules.find((m: any) => !userProgress.some((p: any) => p.module_id === m.id && p.watched_percentage === 100));
  const ongoingCourse = nextModule ? courses.find((c: any) => c.id === nextModule.course_id) : null;

  if (loading) return <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-inter font-bold text-slate-900 mb-2">Welcome Back, Innovator</h1>
         <p className="text-slate-600">Track your module completion and upcoming tasks.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Progress Tracking Card */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-1 md:col-span-2 flex items-center gap-8">
            <div className="relative w-32 h-32 shrink-0">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-cyan-500" strokeDasharray={`${percentage}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold font-inter text-slate-800">{percentage}%</span>
                  <span className="text-[10px] uppercase text-slate-500 font-bold">Progress</span>
               </div>
            </div>
            <div>
               <h3 className="text-xl font-bold mb-2 text-slate-800">
                 {totalModules === 0 ? 'No Modules Available' : ongoingCourse ? `Ongoing: ${ongoingCourse.title}` : 'No Active Course'}
               </h3>
               <p className="text-slate-500 text-sm mb-4">
                 {totalModules === 0 ? 'Content is being uploaded. Please check back later.' : nextModule ? `You are currently at ${nextModule.title}. Complete it to progress further.` : 'All modules completed! Wait for more content.'}
               </p>
               {nextModule && totalModules > 0 && (
                 <button 
                   onClick={() => setActiveTab('Learning')}
                   className="bg-cyan-50 text-cyan-700 font-bold px-4 py-2 rounded border border-cyan-100 hover:bg-cyan-100 transition shadow-sm text-sm"
                 >
                   Resume Module
                 </button>
               )}
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center gap-4">
            <div className="pb-4 border-b border-slate-100">
               <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Modules Cleared</div>
               <div className="text-3xl font-inter font-black text-slate-800">
                 {String(completedModules).padStart(2, '0')}<span className="text-base text-slate-400 font-normal">/{String(totalModules).padStart(2, '0')}</span>
               </div>
            </div>
            <div>
               <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Hours Logged</div>
               <div className="text-xl font-inter font-bold text-slate-800">
                  {percentage > 0 ? (percentage * 0.25).toFixed(1) : "0.0"} <span className="text-sm text-slate-400 font-normal">hrs</span>
               </div>
            </div>
         </div>
      </div>

      {/* Upcoming Flow */}
      <div>
        <h2 className="text-xl font-bold font-inter text-slate-800 mb-4">Upcoming Modules</h2>
        <div className="space-y-3">
          {enrolledModules.filter((m: any) => !userProgress.some((p: any) => p.module_id === m.id)).slice(0, 3).map((item: any, i: number) => (
             <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-slate-400" />
                 </div>
                 <div>
                    <div className="text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">Module {item.order_index}</div>
                    <div className="font-bold text-slate-800">{item.title}</div>
                 </div>
               </div>
               <div className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded">Pending</div>
             </div>
          ))}
          {enrolledModules.length === 0 && <p className="text-slate-500 italic">No modules uploaded yet. Coming Soon.</p>}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 2. LEARNING TAB (Former page.tsx LMS code)
// ------------------------------------------------------------------
function LearningTab({ courses, allModules, userProgress, enrollments, markComplete, updateProgress, loading }: any) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const enrolledCourseIds = enrollments.map((e: any) => e.course_id);
  const enrolledCourses = courses.filter((c: any) => enrolledCourseIds.includes(c.id));
  const enrolledModules = allModules.filter((m: any) => enrolledCourseIds.includes(m.course_id));

  // Courses that have modules
  const coursesWithContent = enrolledCourses.filter((c: any) => enrolledModules.some((m: any) => m.course_id === c.id));
  const courseModules = enrolledModules.filter((m: any) => m.course_id === selectedCourseId);

  useEffect(() => {
    if (!selectedCourseId && coursesWithContent.length > 0) {
      setSelectedCourseId(coursesWithContent[0].id);
    }
  }, [coursesWithContent]);

  useEffect(() => {
    if (courseModules.length > 0 && !activeModuleId) {
      setActiveModuleId(courseModules[0].id);
    }
  }, [courseModules]);

  const activeModule = allModules.find((m: any) => m.id === activeModuleId);
  const isCompleted = userProgress.some((p: any) => p.module_id === activeModuleId && p.watched_percentage === 100);

  const handleTimeUpdate = () => {
    if (videoRef.current && activeModule && selectedCourseId) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0) {
        const percentage = Math.floor((currentTime / duration) * 100);
        // Save progress every 5% to avoid excessive DB calls
        const currentProg = userProgress.find((p: any) => p.module_id === activeModule.id);
        if (percentage > (currentProg?.watched_percentage || 0) && percentage % 5 === 0) {
           updateProgress(activeModule.id, selectedCourseId, percentage, currentTime);
        }
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && activeModule) {
      const prog = userProgress.find((p: any) => p.module_id === activeModule.id);
      if (prog?.last_position) {
        videoRef.current.currentTime = prog.last_position;
      }
    }
  }, [activeModuleId]);

  const [isExamMode, setIsExamMode] = useState(false);
  const [examStatus, setExamStatus] = useState<"pending" | "running" | "failed" | "passed">("pending");
  const [warnings, setWarnings] = useState(0);

  // Security Monitors for Exam Mode
  useEffect(() => {
    if (examStatus !== 'running') return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(w => w + 1);
        alert("SECURITY WARNING: You switched tabs or minimized the window. Further infractions will terminate the exam.");
      }
    };
    const handleBlur = () => {
      setWarnings(w => w + 1);
      alert("SECURITY WARNING: You clicked outside the exam window.");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [examStatus]);

  useEffect(() => {
    if (warnings >= 3 && examStatus === 'running') {
      setExamStatus('failed');
      alert("EXAM TERMINATED: Security protocol breached.");
    }
  }, [warnings, examStatus]);

  const startExam = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setIsExamMode(true);
      setExamStatus('running');
      setWarnings(0);
    } catch (err) {
      alert("Microphone and Camera access must be granted to start the exam.");
    }
  };

  const handleClearModule = async () => {
     if (activeModule && selectedCourseId) {
        await markComplete(activeModule.id, selectedCourseId);
        setExamStatus('passed');
     }
  };

  if (loading) return <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div></div>;

  if (enrolledCourseIds.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center">
            <GraduationCap className="w-16 h-16 text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">Not Enrolled</h2>
            <p className="text-slate-500 max-w-sm mt-2">You haven't enrolled in any courses yet. Please visit the Courses tab to enroll.</p>
         </div>
      );
  }

  if (coursesWithContent.length === 0) {
     return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center">
           <Library className="w-16 h-16 text-slate-300 mb-4" />
           <h2 className="text-2xl font-bold text-slate-800">Coming Soon</h2>
           <p className="text-slate-500 max-w-sm mt-2">Our team is currently preparing the curriculum. Check back shortly for uploaded modules.</p>
        </div>
     );
  }

  if (isExamMode) {
    if (examStatus === 'failed') {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-2xl border border-red-200 mt-8">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-2">Security Breach Detected</h1>
            <p className="text-red-700 mb-6 font-inter text-sm max-w-md text-center">Your exam has been rejected due to multiple tab switches or out-of-focus events. Please contact administration.</p>
            <button onClick={() => { setIsExamMode(false); setExamStatus('pending'); }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition">Return to Dashboard</button>
        </div>
      );
    }

    if (examStatus === 'passed') {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-cyan-50 rounded-2xl border border-cyan-200 mt-8">
            <CheckCircle className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-cyan-900 mb-2">Module Cleared</h1>
            <p className="text-cyan-700 mb-6 font-inter text-sm max-w-md text-center">Exam completed successfully. Your progress has been updated.</p>
            <button onClick={() => { setIsExamMode(false); setExamStatus('pending'); }} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded transition">Continue Curriculum</button>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="sticky top-20 w-full bg-red-600 text-white font-bold p-3 flex justify-between z-50 text-sm tracking-widest rounded-t-xl mt-4 shadow-lg">
          <span>STRICT EXAM MODE ACTIVE</span>
          <span>WARNINGS: {warnings} / 3</span>
          <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> MONITORING ENABLED</span>
        </div>
        <div className="bg-white border border-slate-200 shadow-md p-8 rounded-b-xl border-t-0">
          <h2 className="text-2xl font-inter font-bold text-slate-800 mb-2">{activeModule?.title} - Evaluation</h2>
          <p className="text-slate-500 mb-8 border-b border-slate-100 pb-4">Do not switch tabs, minimize the browser, or interact with other applications.</p>
          
          <div className="space-y-8">
            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg mb-4">1. Did you fully understand the concepts presented in this module?</h3>
              <div className="space-y-3">
                {['Yes, completely', 'Mostly understood', 'Requires review', 'Not at all'].map(opt => (
                  <label key={opt} className="flex flex-row items-center gap-3 p-4 border border-slate-200 bg-white rounded cursor-pointer hover:border-cyan-400 transition hover:shadow-sm">
                    <input type="radio" name="q1" className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-slate-300" />
                    <span className="text-slate-700 font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={handleClearModule} className="bg-slate-900 text-white hover:bg-slate-800 w-full py-4 rounded-xl font-bold text-lg shadow-md transition">Submit Secure Exam</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Course Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
         {coursesWithContent.map((c: any) => (
            <button 
               key={c.id} 
               onClick={() => { setSelectedCourseId(c.id); setActiveModuleId(null); }}
               className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCourseId === c.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
               {c.title}
            </button>
         ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Module Sidebar */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          <h2 className="text-xl font-inter font-bold text-slate-800">Modules</h2>
          <div className="flex flex-col gap-3">
            {courseModules.map((mod: any) => (
              <button 
                key={mod.id} 
                onClick={() => setActiveModuleId(mod.id)} 
                className={`text-left p-4 rounded-xl border transition-all pointer-events-auto flex items-start gap-3 ${activeModuleId === mod.id ? 'bg-cyan-50 border-cyan-300 text-cyan-900 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm'}`}
              >
                <div className="mt-1">
                   {userProgress.some((p: any) => p.module_id === mod.id) ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                   ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                   )}
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 mb-1">Module {mod.order_index}</div>
                  <h3 className="font-bold text-sm leading-tight">{mod.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Video & Material Area */}
        <div className="flex-1">
          {activeModule ? (
             <>
               <div className="bg-slate-900 aspect-video rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center relative overflow-hidden mb-6 group cursor-pointer">
                  {activeModule.content_url ? (
                     <video 
                        ref={videoRef}
                        src={activeModule.content_url} 
                        controls 
                        onTimeUpdate={handleTimeUpdate}
                        className="w-full h-full object-cover"
                        poster={courses.find((c: any) => c.id === selectedCourseId)?.image_url}
                     />
                  ) : (
                     <div className="flex flex-col items-center">
                        <Play className="w-12 h-12 text-white/50 mb-4" />
                        <p className="text-white/50 font-bold">Video Content Pending</p>
                     </div>
                  )}
               </div>
               
               <h1 className="text-3xl font-inter font-bold text-slate-900 mb-4">{activeModule.title}</h1>
               <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                 {activeModule.description || 'Watch this module to unlock the evaluation checkpoint and progress in the curriculum.'}
               </p>

               {/* Exam Trigger Block */}
               {!isCompleted ? (
                 <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-6 shadow-inner">
                     <div className="bg-orange-100 p-3 rounded-full shrink-0">
                        <MonitorUp className="w-8 h-8 text-orange-600" />
                     </div>
                     <div>
                       <h3 className="text-xl font-bold font-inter text-orange-900 mb-2">Module Evaluation Checkpoint</h3>
                       <p className="text-sm text-orange-800 text-opacity-80 mb-6 leading-relaxed">
                         To mark this module as complete, you must clear the security-verified evaluation. Any attempt to switch tabs or minimize the browser will result in rejection.
                       </p>
                       <button onClick={startExam} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors w-full sm:w-auto">
                         Verify Hardware & Start Exam
                       </button>
                     </div>
                 </div>
               ) : (
                 <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4 text-emerald-800 font-bold">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                    You have successfully completed this module.
                 </div>
               )}
             </>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-400 font-medium">
                Select a module to begin learning.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 3. COURSES TAB
// ------------------------------------------------------------------
function CoursesTab({ courses, allModules, enrollments, onEnroll, loading }: any) {
  if (loading) return <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div></div>;
  
  const enrolledCourseIds = enrollments?.map((e: any) => e.course_id) || [];

  const displayCourses = courses.map((c: any, i: number) => {
    const grads = ['from-blue-500 to-indigo-600', 'from-orange-400 to-pink-500', 'from-emerald-500 to-teal-700', 'from-purple-500 to-fuchsia-600'];
    const moduleCount = allModules.filter((m: any) => m.course_id === c.id).length;
    return {
      title: c.title,
      category: moduleCount > 0 ? `${moduleCount} Modules` : 'Coming Soon',
      grad: grads[i % grads.length],
      actual_price: c.actual_price,
      discounted_price: c.discounted_price,
      enroll_link: c.enroll_link,
      description: c.description,
      moduleCount
    };
  });

  return (
    <div>
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold font-inter text-slate-800">Available Masterclasses</h2>
            <p className="text-slate-500 mt-1">Unlock premium curriculum with your subscription.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             <div className="col-span-full py-10 flex justify-center">
               <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
             </div>
          ) : displayCourses.length > 0 ? displayCourses.map((course: any, i: number) => (
            <div key={i} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
               {/* Abstract Gradient Thumbnail */}
               <div className={`h-40 bg-gradient-to-tr ${course.grad} relative p-6 flex items-end overflow-hidden`}>
                  <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30 tracking-wider ${course.moduleCount > 0 ? 'bg-white/20' : 'bg-red-500/40'}`}>
                     {course.category}
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="absolute top-10 left-10 w-16 h-16 bg-white/20 rounded-full blur-xl" />
               </div>
               
               <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-cyan-600 transition-colors">{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-grow">{course.description || 'Comprehensive templates and walkthrough videos included to accelerate your journey.'}</p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                     <div className="flex flex-col">
                        <span className="text-[12px] text-red-500 font-black uppercase tracking-widest line-through decoration-red-600 decoration-2 mb-1">₹{course.actual_price}</span>
                        <span className="text-2xl font-inter font-black text-slate-900 tracking-tighter">₹{course.discounted_price}</span>
                     </div>
                     {enrolledCourseIds.includes(course.id) ? (
                        <button disabled className="bg-slate-200 text-slate-500 font-bold px-5 py-2 rounded-lg text-sm shadow-sm text-center cursor-not-allowed">
                           Enrolled
                        </button>
                     ) : (
                        <button onClick={() => onEnroll(course.id)} className="bg-slate-900 text-white font-bold px-5 py-2 rounded-lg hover:bg-cyan-600 transition-colors text-sm shadow-md text-center">
                           Enroll Now
                        </button>
                     )}
                  </div>
               </div>
            </div>
          )) : (
             <div className="col-span-full py-20 text-center bg-white border border-slate-200 rounded-2xl">
                <Library className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No courses found. Check back later.</p>
             </div>
          )}
       </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 4. KNOWLEDGE BASE TAB
// ------------------------------------------------------------------
function KnowledgeBaseTab({ resources, loading }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  const displayFiles = resources.map((r: any) => ({
    id: r.id,
    title: r.title,
    desc: r.description,
    download_link: r.download_link,
    icon: r.file_type === 'pdf' ? FileText : (r.file_type === 'spreadsheet' ? FileSpreadsheet : BookOpen)
  }));
  
  const filteredFiles = displayFiles.filter((f: any) => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-inter font-bold text-slate-800 mb-4">Startup Resource Library</h2>
        <p className="text-slate-500 max-w-xl mx-auto">Find critical templates, legal documents, and research cheatsheets tailored for the propels ecosystem.</p>
      </div>

      <div className="relative mb-10 shadow-lg lg:scale-105 transition-transform group">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search for pitch decks, financial sheets, agreements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg text-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-0 transition-all font-medium placeholder-slate-400"
        />
      </div>

      <div className="space-y-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file: any) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={file.id} 
              className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5 hover:shadow-md transition-all hover:border-cyan-300 group cursor-pointer"
            >
              <div className="bg-slate-50 p-4 rounded-xl shrink-0 group-hover:bg-cyan-50 transition-colors border border-slate-100 group-hover:border-cyan-100">
                <file.icon className="w-8 h-8 text-slate-600 group-hover:text-cyan-600 transition-colors" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-cyan-700 transition-colors">{file.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{file.desc}</p>
              </div>
              {file.download_link ? (
                <a href={file.download_link} target="_blank" rel="noreferrer" className="hidden sm:flex text-slate-400 hover:text-cyan-600 transition-colors items-center gap-2 font-bold text-sm bg-slate-50 px-4 py-2 rounded-lg group-hover:bg-cyan-50 group-hover:text-cyan-600">
                  <Download className="w-4 h-4" /> Download
                </a>
              ) : (
                <div className="hidden sm:flex text-slate-300 items-center gap-2 font-bold text-sm bg-slate-50 px-4 py-2 rounded-lg">
                  <Lock className="w-4 h-4" /> Locked
                </div>
              )}
            </motion.div>
          ))
        ) : (
           <div className="text-center p-12 bg-white border border-slate-200 border-dashed rounded-2xl">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <div className="text-slate-500 font-medium">No resources found matching "{searchQuery}"</div>
           </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 5. BLUEPRINT TAB
// ------------------------------------------------------------------
function BlueprintTab({ userProgress, allModules, setActiveTab }: any) {
  const steps = allModules.length > 0 ? allModules.map((m: any, i: number) => {
    const isCompleted = userProgress.some((p: any) => p.module_id === m.id);
    const isActive = !isCompleted && (i === 0 || userProgress.some((p: any) => p.module_id === allModules[i-1]?.id));
    return {
      title: m.title,
      desc: m.description || 'Module content description pending.',
      status: isCompleted ? 'completed' : (isActive ? 'active' : 'locked')
    };
  }) : [
    { title: 'The Genesis', desc: 'Identify core problem, analyze market gaps, and synthesize a bare-bones thesis.', status: 'active' },
    { title: 'Market Validation', desc: 'Customer interviews, landing page smoke tests, and intent gathering without code.', status: 'locked' },
    { title: 'MVP Assembly', desc: 'Building the fundamental feature set that solves the strict pain point efficiently.', status: 'locked' },
    { title: 'Early Traction Engine', desc: 'Acquiring the first 100 paying customers through unscalable efforts and targeted outreach.', status: 'locked' },
    { title: 'Seed Funding & Scale', desc: 'Real-world revenue demonstration, pitch deck creation, and investor networking.', status: 'locked' },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-10 w-full text-center sm:text-left">
         <h2 className="text-3xl font-inter font-bold text-slate-800 mb-2">The Propels Growth Blueprint</h2>
         <p className="text-slate-500">Your tailored curriculum roadmap from scratch to scalable revenue.</p>
      </div>

      <div className="relative border-l-4 border-slate-200 ml-4 md:ml-10 space-y-12 pb-10">
         {steps.map((step: any, idx: number) => (
            <div key={idx} className="relative pl-8 md:pl-12 group">
               {/* Node Line Marker */}
               <div className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full border-4 shadow-sm z-10 transition-colors duration-500 ${
                 step.status === 'completed' ? 'bg-cyan-500 border-cyan-100 shadow-cyan-500/30' :
                 step.status === 'active' ? 'bg-orange-500 border-orange-100 shadow-orange-500/50 scale-125' :
                 'bg-white border-slate-300'
               }`}>
                 {step.status === 'completed' && <CheckSquare className="w-3 h-3 text-white absolute inset-0 m-auto mt-[0.5px] ml-[2.5px]" />}
               </div>
               
               {/* Content Block */}
               <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                  step.status === 'active' ? 'bg-white border-orange-200 shadow-lg -translate-y-1' :
                  step.status === 'completed' ? 'bg-cyan-50/30 border-cyan-100 hover:border-cyan-300' :
                  'bg-white/50 border-slate-200 opacity-70 grayscale'
               }`}>
                  <div className="flex items-center justify-between mb-2">
                     <h3 className={`text-xl font-bold font-inter ${
                       step.status === 'active' ? 'text-orange-600' :
                       step.status === 'completed' ? 'text-cyan-800' :
                       'text-slate-600'
                     }`}>
                        Step 0{idx + 1}: {step.title}
                     </h3>
                     <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                        step.status === 'completed' ? 'bg-cyan-100 text-cyan-700' :
                        step.status === 'active' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-500'
                     }`}>
                       {step.status}
                     </span>
                  </div>
                  <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                  
                  {step.status === 'active' && (
                     <button 
                       onClick={() => setActiveTab('Learning')}
                       className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded shadow-md shadow-orange-500/20 transition-all text-sm flex items-center gap-2"
                     >
                        Enter Curriculum <ChevronRight className="w-4 h-4" />
                     </button>
                  )}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
