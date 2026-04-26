"use client"; // Enable client-side interactivity
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthContext'; // Custom hook for authentication state
import { useRouter } from 'next/navigation'; // Next.js router for client-side navigation
// Import a wide variety of icons for UI representation
import { MapPin, Link as LinkIcon, Building2, Calendar, Star, MessageCircle, Heart, Share2, Briefcase, GraduationCap, Compass, Search, Bell, Settings } from 'lucide-react';

/**
 * Mock Data for the social feed: Simulates activity from other founders and companies.
 */
const mockPosts = [
  {
    id: 1,
    author: "Jane Doe",
    role: "Founder at Sparkle AI",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Jane",
    time: "2 hours ago",
    content: "Just closed our pre-seed round of $1.2M led by Sequoia Surge! Exciting times ahead as we scale our engineering team. We're actively hiring React developers, DMs are open! 🚀 #Fundraising #Startups #Hiring",
    likes: 342,
    comments: 56,
  },
  {
    id: 2,
    author: "Aryan Patel",
    role: "PM at Zomato",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aryan",
    time: "5 hours ago",
    content: "The biggest mistake early founders make is building the product before finding distribution. Spent the whole weekend reading 'Traction' and rethinking our entire GTM motion.",
    likes: 890,
    comments: 104,
  },
  {
    id: 3,
    author: "Global Ventures",
    role: "Venture Capital Firm",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=VC",
    time: "1 day ago",
    content: "We are actively looking for SaaS startups in the cybersecurity space. If you're building something innovative with clear USP, drop your pitch deck below or DM us.",
    likes: 1205,
    comments: 420,
  }
];

/**
 * Profile component: Displays the logged-in user's profile and social feed.
 */
export default function Profile() {
  // Access global authentication state
  const { isRegistered } = useAuth();
  // Initialize router for navigation
  const router = useRouter();
  // State to hold user profile data
  const [profileData, setProfileData] = useState<any>(null);

  // Check authentication and load profile data on mount
  useEffect(() => {
    // If user is not registered, redirect to registration page
    if (!isRegistered) {
      router.push('/register');
      return;
    }

    // Attempt to load profile data from browser's local storage
    const savedData = localStorage.getItem('userProfile');
    if (savedData) {
      // Parse and set the saved profile data
      setProfileData(JSON.parse(savedData));
    } else {
      // Provide fallback mock data if no profile is found (e.g., direct URL access)
      setProfileData({
        firstName: "New",
        lastName: "Founder",
        picture: "https://api.dicebear.com/7.x/notionists/svg?seed=Founder",
        designation: "Founder",
        company: "Stealth Startup",
        education: "University",
        skills: "Product Management, React, Growth",
        interests: "AI, FinTech",
      });
    }
  }, [isRegistered, router]);

  // Don't render anything until profile data is loaded
  if (!profileData) return null;

  // Determine which profile picture to display (user-provided or generated fallback)
  const displayPic = profileData.picture || `https://api.dicebear.com/7.x/notionists/svg?seed=${profileData.firstName}`;

  return (
    <div className="bg-slate-50 min-h-screen pt-20 pb-16 font-inter text-slate-800">
      
      {/* Profile Inner Navigation Bar - Sticky to top during scroll */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 px-4 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-14">
           {/* Navigation Tabs */}
           <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
              <button className="font-bold text-sm text-cyan-600 border-b-2 border-cyan-500 h-full px-2 whitespace-nowrap">My Profile</button>
              <button className="font-bold text-sm text-slate-500 hover:text-slate-800 transition-colors h-full px-2 whitespace-nowrap">Dashboard</button>
              <button className="font-bold text-sm text-slate-500 hover:text-slate-800 transition-colors h-full px-2 whitespace-nowrap">Connections</button>
           </div>
           {/* Right-side quick actions */}
           <div className="flex gap-4">
              <button className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"><Search className="w-5 h-5" /></button>
              <button className="p-2 text-slate-400 hover:text-cyan-500 transition-colors"><Bell className="w-5 h-5" /></button>
           </div>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: Profile Information Summary */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main User Identity Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Gradient Header with Settings Action */}
            <div className="h-24 bg-gradient-to-r from-cyan-500 to-blue-600 relative">
               <button className="absolute top-2 right-2 p-1 bg-white/20 rounded-full text-white hover:bg-white/40"><Settings className="w-4 h-4" /></button>
            </div>
            {/* User Details Area */}
            <div className="px-6 pb-6 relative">
              {/* Profile Image (Overlapping the header) */}
              <img 
                src={displayPic} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-white absolute -top-12 bg-white object-cover shadow-sm"
              />
              <div className="pt-14">
                {/* Name and Designation */}
                <h1 className="text-xl font-bold font-montserrat">{profileData.firstName} {profileData.lastName}</h1>
                <p className="text-sm text-slate-500 font-medium mb-4">{profileData.designation} at <span className="text-cyan-600 font-bold">{profileData.company}</span></p>
                
                {/* Quick Stats: Followers and Connections */}
                <div className="flex gap-4 text-sm font-bold text-slate-600 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex flex-col"><span className="text-lg text-slate-800">4,204</span> <span className="text-[10px] uppercase text-slate-400 tracking-wider">Followers</span></div>
                  <div className="flex flex-col"><span className="text-lg text-slate-800">500+</span> <span className="text-[10px] uppercase text-slate-400 tracking-wider">Connections</span></div>
                </div>

                {/* Additional Info: Location, Personal URL, Join Date */}
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-slate-400" /> Gurugram, India</div>
                  <div className="flex items-center gap-3"><LinkIcon className="w-4 h-4 text-slate-400" /> thepropels.com/in/{profileData.firstName?.toLowerCase()}</div>
                  <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-slate-400" /> Joined April 2026</div>
                </div>
              </div>
            </div>
          </div>

          {/* Extended Details Card (About, Education, Skills, Interests) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
            {/* About Section */}
            <div>
              <h3 className="font-bold font-montserrat flex items-center gap-2 mb-3"><Briefcase className="w-4 h-4 text-cyan-500" /> About</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Passionate founder building the future at {profileData.company}. Focused on scaling products from 0 to 1 and driving sustainable growth through technology and community building.
              </p>
            </div>
            
            {/* Education Section */}
            <div>
              <h3 className="font-bold font-montserrat flex items-center gap-2 mb-3"><GraduationCap className="w-4 h-4 text-orange-500" /> Education</h3>
              <p className="text-sm text-slate-600 font-bold">{profileData.education}</p>
            </div>

            {/* Skills Section - Tag based UI */}
            <div>
              <h3 className="font-bold font-montserrat flex items-center gap-2 mb-3"><Star className="w-4 h-4 text-yellow-500" /> Top Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills?.split(',').map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests Section - Hashtag based UI */}
            <div>
              <h3 className="font-bold font-montserrat flex items-center gap-2 mb-3"><Compass className="w-4 h-4 text-purple-500" /> Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.interests?.split(',').map((interest: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-bold rounded-full border border-cyan-100">
                    #{interest.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Social Feed and Content Creation */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Post Creation Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex gap-4 items-start">
               <img src={displayPic} alt="User" className="w-12 h-12 rounded-full border border-slate-200" />
               <div className="flex-1">
                 {/* Textarea for post content */}
                 <textarea 
                   placeholder={`What are you building, ${profileData.firstName}?`}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:border-cyan-500 outline-none resize-none min-h-[100px]" 
                 />
                 {/* Action Bar for post creation */}
                 <div className="flex justify-between items-center mt-3">
                   <div className="flex gap-2">
                     <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold transition-colors">📷 Media</button>
                     <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold transition-colors">📊 Poll</button>
                   </div>
                   <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 py-2 rounded shadow-md transition-colors text-sm">
                     Post
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Feed Header */}
          <div className="flex items-center justify-between">
             <h2 className="font-bold font-montserrat text-lg">Your Feed</h2>
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-cyan-500">Sort by: Relevancy</span>
          </div>

          {/* List of individual posts mapped from mock data */}
          {mockPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-shadow hover:shadow-md">
              {/* Post Header: Author info and timing */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50" />
                  <div>
                    <h3 className="font-bold font-montserrat">{post.author}</h3>
                    <p className="text-xs text-slate-500">{post.role}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{post.time}</p>
                  </div>
                </div>
                {/* Options button */}
                <button className="text-slate-400 hover:text-cyan-500">•••</button>
              </div>
              
              {/* Main text content of the post */}
              <p className="text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
              
              {/* Interaction Bar: Likes, Comments, Share */}
              <div className="flex items-center gap-6 text-sm font-bold text-slate-500 pt-4 border-t border-slate-100">
                <button className="flex items-center gap-2 hover:text-cyan-600 transition-colors group">
                  <Heart className="w-4 h-4 group-hover:fill-cyan-600" /> {post.likes}
                </button>
                <button className="flex items-center gap-2 hover:text-cyan-600 transition-colors">
                  <MessageCircle className="w-4 h-4" /> {post.comments}
                </button>
                <button className="flex items-center gap-2 hover:text-cyan-600 transition-colors ml-auto">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          ))}

          {/* Bottom Action: Load more updates */}
          <div className="text-center py-8">
             <button className="text-cyan-600 font-bold text-sm bg-cyan-50 px-6 py-2 rounded-full hover:bg-cyan-100 transition-colors border border-cyan-200">
               Load More Updates
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
