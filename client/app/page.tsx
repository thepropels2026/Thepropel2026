"use client"; // Enable client-side rendering for this Next.js component

// Import standard React hooks and Next.js components
import Link from 'next/link'; // For client-side navigation between pages
import { ArrowRight, Star, Quote, ChevronDown, Play, BookOpen, Mic } from 'lucide-react'; // Premium icon library
import { motion } from 'framer-motion'; // Animation library for smooth, hardware-accelerated transitions

/**
 * Home Component: The landing page for The Propels.
 * Designed with high-end aesthetics, 3D backgrounds, and interactive elements.
 */
export default function Home() {
  // The component returns a JSX structure representing the landing page
  return (
    <div className="flex flex-col"> // Main wrapper with vertical flex layout
      
      {/* SECTION 1: HERO - The first fold of the website */}
      <section className="relative min-h-[100dvh] flex flex-col justify-start px-4 sm:px-6 md:px-12 lg:px-24 pt-32 md:pt-36 lg:pt-48 pb-16 overflow-hidden">
        
        {/* Animated 3D Background - Visual centerpiece */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ perspective: '1000px' }}>
          
          {/* 3D Cyber grid animation container */}
          <div style={{ transform: "rotateX(60deg) scale(2)", transformOrigin: "top center" }} className="absolute inset-0 z-0">
            {/* Motion div for the scrolling grid effect */}
            <motion.div 
              animate={{ y: [0, 40] }} // Animates vertical position infinitely
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }} // Smooth linear loop
              className="absolute -inset-[100px] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_10%,transparent_100%)] opacity-30" 
            />
          </div>
          
          {/* Decorative Background Orbs - Cyan */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -50, 0] }} // Floating scale and movement
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} // Slow, organic loop
            style={{ willChange: "transform" }} // Browser optimization for animations
            className="absolute -top-[10%] left-[10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]" 
          />
          
          {/* Decorative Background Orbs - Orange */}
          <motion.div 
            animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, 40, 0] }} // Subtly different movement
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }} // Offset start time
            style={{ willChange: "transform" }} // Performance hint
            className="absolute bottom-[-20%] right-[5%] w-[700px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" 
          />
          
          {/* Center Light Flare */}
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }} // Pulsing rotation
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }} // Extremely slow rotation
            style={{ willChange: "transform" }} // GPU acceleration
            className="absolute top-[40%] left-[40%] w-[800px] h-[300px] bg-white/5 rounded-[100%] blur-[80px]" 
          />
        </div>

        {/* Hero Content Grid - Structured for responsiveness */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center z-10 w-full max-w-7xl mx-auto">
          
          {/* Left Side: Text and CTA */}
          <div className="flex flex-col w-full">
            {/* Cyberpunk-style status badge */}
            <div className="inline-block px-4 py-1.5 border border-cyan-500 rounded-full text-[10px] md:text-xs font-bold tracking-[2px] text-cyan-500 uppercase mb-4 md:mb-8 self-start">
              INITIATING LAUNCH SEQUENCE
            </div>

            {/* High-impact Typography Heading */}
            <div className="staggered-title">
              <span className="l1">Turning</span> // Animated line 1
              <span className="l2">India's 75%</span> // Animated line 2
              <span className="l3">Students</span> // Animated line 3
              <span className="l4">Entrepreneurial</span> // Animated line 4
              <span className="l5">Intent into</span> // Animated line 5
              <span className="l6 text-glow-gold">Real World Revenue</span> // High-highlighted line 6
            </div>

            {/* Supporting Hero Text */}
            <p className="text-left mt-0 md:mt-4 text-[#8B9BB4] text-xs md:text-lg max-w-lg mb-4 md:mb-8 font-inter">
              Elevating startups beyond the raw concept phase with predictive AI, zero-gravity scaling,
              and elite mentor networks.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-col md:flex-row gap-4">
              <Link href="/network"> // Link to the Network page
                <button className="btn-glow w-full md:w-auto text-xs md:text-sm py-3 md:py-2">ENGAGE THE NETWORK</button> // Styled glowing button
              </Link>
            </div>
          </div>

          {/* Right Side: Visual Content (Video Preview) */}
          <div className="flex flex-col items-center lg:items-start w-full lg:ml-16 mt-8 lg:-mt-4">
            {/* Motion-enhanced Video Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }} // Interactive hover effect
              transition={{ type: "spring", stiffness: 300, damping: 20 }} // Spring physics for realism
              className="relative w-full max-w-[550px] aspect-video rounded-[16px] md:rounded-[20px] bg-black/40 border border-white/10 overflow-hidden group flex flex-col items-center justify-center shadow-2xl mx-auto lg:mx-0"
            >
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-[rgba(10,10,15,0.6)]" />
              {/* Icon and label stack */}
              <div className="z-10 flex flex-col items-center">
                {/* Glowing Play Icon */}
                <div className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full bg-[#00F2FF] flex items-center justify-center mb-2 md:mb-4 hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-5 h-5 md:w-8 md:h-8 fill-black text-black ml-1" /> // Play icon component
                </div>
                {/* Sub-label */}
                <span className="font-montserrat text-[10px] md:text-sm text-[#F0F4F8]">Propulsion System Overview</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
           <span className="text-[10px] font-bold tracking-[4px] uppercase">Scroll</span>
           <ChevronDown className="w-4 h-4 animate-bounce" /> // Bouncing arrow icon
        </div>
      </section>

      {/* SECTION 2: METRICS - Social proof and data points */}
      <section className="bg-[#050505] py-24 md:py-32 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {/* Statistic Item 1 */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-4xl md:text-6xl font-black font-montserrat text-white mb-2">75%</span>
            <span className="text-[10px] md:text-xs font-bold text-cyan-500 uppercase tracking-widest text-center md:text-left">Entrepreneurial Intent</span>
          </div>
          {/* Statistic Item 2 */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-4xl md:text-6xl font-black font-montserrat text-white mb-2">12M+</span>
            <span className="text-[10px] md:text-xs font-bold text-orange-500 uppercase tracking-widest text-center md:text-left">Student Visionaries</span>
          </div>
          {/* Statistic Item 3 */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-4xl md:text-6xl font-black font-montserrat text-white mb-2">₹4.2B</span>
            <span className="text-[10px] md:text-xs font-bold text-cyan-500 uppercase tracking-widest text-center md:text-left">Unlocked Capital</span>
          </div>
          {/* Statistic Item 4 */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-4xl md:text-6xl font-black font-montserrat text-white mb-2">0.1%</span>
            <span className="text-[10px] md:text-xs font-bold text-orange-500 uppercase tracking-widest text-center md:text-left">Atmospheric Failure Rate</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE PILLARS - Features and value props */}
      <section className="bg-[#050505] py-24 md:py-48 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 md:mb-32 max-w-2xl">
            <h2 className="text-3xl md:text-6xl font-bold font-montserrat leading-tight mb-8">
              Engineered for <span className="text-cyan-500">Maximum Velocity.</span>
            </h2>
            <div className="h-1 w-24 bg-cyan-500" /> // Decorative line
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Pillar 1: AI */}
            <div className="group">
              <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl w-fit group-hover:border-cyan-500/50 transition-colors">
                <Star className="w-8 h-8 text-cyan-500" /> // Feature icon
              </div>
              <h3 className="text-2xl font-bold mb-4 font-montserrat">Predictive Scaling</h3>
              <p className="text-gray-400 font-inter leading-relaxed">
                Our AI models analyze market gaps and competitive friction to predict your startup's trajectory before you write a single line of code.
              </p>
            </div>

            {/* Pillar 2: Mentors */}
            <div className="group">
              <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl w-fit group-hover:border-orange-500/50 transition-colors">
                <Mic className="w-8 h-8 text-orange-500" /> // Feature icon
              </div>
              <h3 className="text-2xl font-bold mb-4 font-montserrat">Elite Guidance</h3>
              <p className="text-gray-400 font-inter leading-relaxed">
                Connect directly with mentors from top 1% global unicorns who have navigated the same gravitational pulls you're facing.
              </p>
            </div>

            {/* Pillar 3: Resources */}
            <div className="group">
              <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl w-fit group-hover:border-cyan-500/50 transition-colors">
                <BookOpen className="w-8 h-8 text-cyan-500" /> // Feature icon
              </div>
              <h3 className="text-2xl font-bold mb-4 font-montserrat">Propulsion Assets</h3>
              <p className="text-gray-400 font-inter leading-relaxed">
                Access a curated library of legal templates, financial models, and GTM strategies designed for zero-gravity execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TESTIMONIALS - User feedback */}
      <section className="bg-[#080808] py-24 md:py-48 px-6 border-t border-white/5 relative overflow-hidden">
        {/* Decorative ambient background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-32">
             <h2 className="text-4xl md:text-6xl font-black font-montserrat mb-6 tracking-tight">Mission Reports</h2>
             <p className="text-gray-400 uppercase tracking-[6px] text-[10px] md:text-xs font-bold">Feedback from the propelled</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Testimonial Card 1 */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-[32px] hover:bg-white/[0.08] transition-all group">
              <Quote className="w-10 h-10 text-cyan-500 mb-8 opacity-40 group-hover:opacity-100 transition-opacity" />
              <p className="text-lg md:text-2xl font-medium font-inter leading-relaxed mb-8 italic">
                "The Propels didn't just give us advice; they gave us an engine. We went from a student project to ₹2Cr revenue in 6 months using their GTM frameworks."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full" /> // Avatar placeholder
                <div>
                  <h4 className="font-bold text-white">Aryan Sharma</h4>
                  <p className="text-xs text-cyan-500 font-bold uppercase tracking-widest">Founder, Nexus AI</p>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-[32px] hover:bg-white/[0.08] transition-all group">
              <Quote className="w-10 h-10 text-orange-500 mb-8 opacity-40 group-hover:opacity-100 transition-opacity" />
              <p className="text-lg md:text-2xl font-medium font-inter leading-relaxed mb-8 italic">
                "Finding mentors who actually care about your survival is hard. The Propels network is the most concentrated talent pool I've ever accessed."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full" /> // Avatar placeholder
                <div>
                  <h4 className="font-bold text-white">Riya Kapoor</h4>
                  <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">CEO, GreenScale</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA - The closing conversion point */}
      <section className="bg-white text-black py-24 md:py-48 px-6 relative overflow-hidden">
        {/* Subtle background grain or texture can be added here */}
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-9xl font-black font-montserrat tracking-tighter mb-12 uppercase leading-[0.9]">
            Propel <br/> <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#000,rgba(0,0,0,0.3))]">Your Idea.</span>
          </h2>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-16 font-medium text-black/60">
            Stop dreaming in the atmosphere. Join the elite network of founders scaling India's future.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link href="/register"> // Link to registration
              <button className="bg-black text-white px-12 py-6 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3">
                BEGIN LAUNCH <ArrowRight className="w-6 h-6" /> // Closing action icon
              </button>
            </Link>
            <Link href="/about"> // Link to about page
              <button className="px-12 py-6 rounded-full font-bold text-lg border-2 border-black hover:bg-black hover:text-white transition-all">
                LEARN THE SYSTEMS
              </button>
            </Link>
          </div>
        </div>
        
        {/* Decorative giant text in background */}
        <div className="absolute -bottom-20 left-0 right-0 text-[20vw] font-black text-black/[0.03] leading-none select-none pointer-events-none whitespace-nowrap text-center uppercase">
          Propulsion
        </div>
      </section>

    </div>
  );
}
