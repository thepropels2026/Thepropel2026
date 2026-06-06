"use client";
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Terminal, Plus, Video, Wrench, Image as ImageIcon, 
  Link as LinkIcon, LogOut, ChevronRight, Award, Briefcase, 
  Download, Eye, Mail, Phone, Linkedin, User, FileText, 
  RefreshCw, Search, Trash2, BookOpen, MapPin, Clock, DollarSign, Check, Library,
  Edit3, X, LayoutDashboard, Users, MessageSquare, ChevronDown, Send, CheckCircle2, TrendingUp, Bell, Percent, ShieldCheck, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../lib/supabase';

export default function AdminPortal() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const getAdminEmail = () => {
    if (typeof window === 'undefined') return '';
    const adminSessionData = localStorage.getItem('adminSessionData');
    if (!adminSessionData) return '';
    try {
      const session = JSON.parse(adminSessionData);
      if (session.expiresAt > Date.now()) {
        return session.email || '';
      }
    } catch (e) {}
    return '';
  };

  const fetchAdminProfiles = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/profiles`, {
        headers: {
          'X-Admin-Email': getAdminEmail()
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to fetch profiles');
      }
      return await res.json();
    } catch (e: any) {
      console.error("Error fetching profiles from backend:", e);
      // fallback to anon supabase client
      return safeFetchData('profiles', q => q.order('created_at', { ascending: false }));
    }
  };

  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'courses' | 'stories' | 'applications' | 'careers' | 'pricing' | 'kb' | 'users' | 'communication'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingType, setEditingType] = useState<string>('');

  // Secure OTP Login States
  const [loginStep, setLoginStep] = useState<'email' | 'otp'>('email');
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Chart view toggle state
  const [chartTab, setChartTab] = useState<'signups' | 'revenue'>('signups');

  // Data states
  const [tools, setTools] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [knowledgeBase, setKnowledgeBase] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // New State variables for Enhanced Interactive Features
  const [totalUsers, setTotalUsers] = useState(0);
  const [startupsToday, setStartupsToday] = useState(0);
  const [dashboardCourses, setDashboardCourses] = useState(0);
  const [dashboardEnrollments, setDashboardEnrollments] = useState(0);
  const [dashboardKb, setDashboardKb] = useState(0);
  const [dashboardJobs, setDashboardJobs] = useState(0);
  const [dashboardApps, setDashboardApps] = useState(0);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allOrderItems, setAllOrderItems] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sidebar expanded sub-states
  const [userDirExpanded, setUserDirExpanded] = useState(false);
  const [commExpanded, setCommExpanded] = useState(false);
  const [activeUserSubTab, setActiveUserSubTab] = useState<'students' | 'mentors' | 'investors' | 'admin_team'>('students');
  const [activeCommSubTab, setActiveCommSubTab] = useState<'broadcast' | 'direct'>('broadcast');

  // Revenue filter states
  const [revenueFilter, setRevenueFilter] = useState<'today' | 'this_month' | 'last_30_days' | 'custom'>('this_month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Tools Demand month filter states
  const [toolsDemandMonth, setToolsDemandMonth] = useState<number>(new Date().getMonth());
  const [toolsDemandYear, setToolsDemandYear] = useState<number>(new Date().getFullYear());

  // User Directory search query
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Communication states
  const [directMsgBody, setDirectMsgBody] = useState('');
  const [broadcastLogs, setBroadcastLogs] = useState<string[]>([]);
  const [directLogs, setDirectLogs] = useState<string[]>([]);
  const [commLoading, setCommLoading] = useState(false);

  useEffect(() => {
    const adminSessionData = localStorage.getItem('adminSessionData');
    if (adminSessionData) {
      try {
        const session = JSON.parse(adminSessionData);
        if (session.email === 'sushantsharma2805@gmail.com' && session.expiresAt > Date.now()) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem('adminSessionData');
        }
      } catch (e) {
        localStorage.removeItem('adminSessionData');
      }
    }
  }, []);

  const safeFetchCount = async (table: string, queryModifier?: (q: any) => any) => {
    try {
      let query = supabase.from(table).select('*', { count: 'exact', head: true });
      if (queryModifier) query = queryModifier(query);
      const { count, error } = await query;
      if (error) throw error;
      return count || 0;
    } catch (e) {
      console.warn(`Failed to fetch count for table ${table}:`, e);
      return 0;
    }
  };

  const safeFetchData = async (table: string, queryModifier?: (q: any) => any) => {
    try {
      let query = supabase.from(table).select('*');
      if (queryModifier) query = queryModifier(query);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn(`Failed to fetch data for table ${table}:`, e);
      return [];
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const todayStart = new Date();
        todayStart.setHours(0,0,0,0);

        const profilesData = await fetchAdminProfiles();
        const usersCount = profilesData.length;
        const startupsTodayCount = profilesData.filter((p: any) => new Date(p.created_at) >= todayStart).length;

        const [
          coursesCount,
          enrollmentsCount,
          kbCount,
          jobsCount,
          appsCount,
          ordersData,
          orderItemsData,
          toolsData
        ] = await Promise.all([
          safeFetchCount('courses'),
          safeFetchCount('user_enrollments'),
          safeFetchCount('knowledge_base'),
          safeFetchCount('job_postings', q => q.eq('is_active', true)),
          safeFetchCount('applications'),
          safeFetchData('orders', q => q.order('created_at', { ascending: false })),
          safeFetchData('order_items', q => q.select('*, orders!inner(status, created_at), tools_cards(title, category)')),
          safeFetchData('tools_cards', q => q.order('created_at', { ascending: false }))
        ]);

        setTotalUsers(usersCount);
        setStartupsToday(startupsTodayCount);
        setDashboardCourses(coursesCount);
        setDashboardEnrollments(enrollmentsCount);
        setDashboardKb(kbCount);
        setDashboardJobs(jobsCount);
        setDashboardApps(appsCount);
        setAllOrders(ordersData);
        setAllOrderItems(orderItemsData);
        setTools(toolsData);
        setAllProfiles(profilesData);
      } else if (activeTab === 'users') {
        const pData = await fetchAdminProfiles();
        setAllProfiles(pData);
      } else if (activeTab === 'tools') {
        const { data, error } = await supabase.from('tools_cards').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setTools(data || []);
      } else if (activeTab === 'courses') {
        const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setCourses(data || []);
      } else if (activeTab === 'stories') {
        const { data, error } = await supabase.from('success_stories').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setStories(data || []);
      } else if (activeTab === 'applications') {
        const { data, error } = await supabase.from('applications').select('*, job_postings(title)').order('created_at', { ascending: false });
        if (error) throw error;
        setApplications(data || []);
      } else if (activeTab === 'careers') {
        const { data, error } = await supabase.from('job_postings').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setJobs(data || []);
      } else if (activeTab === 'pricing') {
        const { data, error } = await supabase.from('pricing_plans').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        setPricingPlans(data || []);
      } else if (activeTab === 'kb') {
        const { data, error } = await supabase.from('knowledge_base').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setKnowledgeBase(data || []);
      }
    } catch (err: any) {
      console.error(`Error fetching ${activeTab}:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchContent();
  }, [activeTab, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (emailInput.toLowerCase() !== 'sushantsharma2805@gmail.com') {
      setError('Unauthorized access. Admin privileges required.');
      return;
    }

    if (loginStep === 'email') {
      setIsSendingOtp(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput.toLowerCase() })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || 'Failed to send OTP email');
        }
        setLoginStep('otp');
        alert("OTP sent to your email. Please check your inbox.");
      } catch (err: any) {
        setError(err.message || "Failed to dispatch OTP. Check SMTP settings.");
      } finally {
        setIsSendingOtp(false);
      }
    } else {
      setIsVerifyingOtp(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput.toLowerCase(), otp: otpInput })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.detail || 'Invalid or expired OTP');
        }
        const sessionData = {
          email: emailInput.toLowerCase(),
          expiresAt: Date.now() + 2 * 60 * 60 * 1000 // 2 hours expiry
        };
        localStorage.setItem('adminSessionData', JSON.stringify(sessionData));
        setIsAdmin(true);
        setError('');
      } catch (err: any) {
        setError(err.message || "Invalid OTP. Please try again.");
      } finally {
        setIsVerifyingOtp(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSessionData');
    setIsAdmin(false);
    setLoginStep('email');
    setOtpInput('');
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      alert("Item removed successfully!");
      fetchContent();
    } catch (err: any) {
      alert("Error removing item: " + err.message);
    }
  };

  const handleEditSave = async (updatedData: any) => {
    try {
      const { id, created_at, ...updatePayload } = updatedData;
      const { error } = await supabase.from(editingType).update(updatePayload).eq('id', id);
      if (error) throw error;
      alert("Successfully updated!");
      setEditingItem(null);
      fetchContent();
    } catch (err: any) {
      alert("Error updating: " + err.message);
    }
  };

  // Calculation functions for Dashboard
  const calcTotalSalesCount = () => {
    const paidOrders = allOrders.filter(o => o.status === 'paid' || o.status === 'completed');
    return filterOrdersByDate(paidOrders).length;
  };

  const calcTotalPaidAmount = () => {
    const paidOrders = allOrders.filter(o => o.status === 'paid' || o.status === 'completed');
    return filterOrdersByDate(paidOrders).reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  };

  const calcTotalProfit = () => {
    return calcTotalPaidAmount() * 0.10;
  };

  const filterOrdersByDate = (ordersList: any[]) => {
    const now = new Date();
    return ordersList.filter(order => {
      const orderDate = new Date(order.created_at);
      if (revenueFilter === 'today') {
        return orderDate.toDateString() === now.toDateString();
      } else if (revenueFilter === 'this_month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      } else if (revenueFilter === 'last_30_days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      } else if (revenueFilter === 'custom') {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start && end) {
          end.setHours(23, 59, 59, 999);
          return orderDate >= start && orderDate <= end;
        } else if (start) {
          return orderDate >= start;
        } else if (end) {
          end.setHours(23, 59, 59, 999);
          return orderDate <= end;
        }
        return true;
      }
      return true;
    });
  };

  const getFilteredToolsDemand = () => {
    const demand: { [key: string]: number } = {};
    allOrderItems.forEach(item => {
      const orderStatus = item.orders?.status;
      if (orderStatus !== 'paid' && orderStatus !== 'completed') return;

      const orderDate = new Date(item.orders?.created_at);
      if (orderDate.getMonth() === toolsDemandMonth && orderDate.getFullYear() === toolsDemandYear) {
        const toolTitle = item.tools_cards?.title || 'Unknown Tool';
        demand[toolTitle] = (demand[toolTitle] || 0) + 1;
      }
    });

    return Object.entries(demand)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getUserGrowthData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIndex = d.getMonth();
      const year = d.getFullYear();
      
      const count = allProfiles.filter(p => {
        const pDate = new Date(p.created_at);
        return pDate.getMonth() === mIndex && pDate.getFullYear() === year;
      }).length;

      const monthlyRev = allOrders
        .filter(o => o.status === 'paid' || o.status === 'completed')
        .filter(o => {
          const oDate = new Date(o.created_at);
          return oDate.getMonth() === mIndex && oDate.getFullYear() === year;
        })
        .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

      data.push({
        label: `${months[mIndex]} ${year.toString().slice(-2)}`,
        users: count,
        revenue: monthlyRev
      });
    }
    return data;
  };

  const calcGrowthPoints = () => {
    const growthData = getUserGrowthData();
    const maxUsers = Math.max(...growthData.map(d => d.users), 1);
    const points = growthData.map((d, i) => {
      const x = 50 + i * 80;
      const y = 160 - (d.users / maxUsers) * 120;
      return { x, y, label: d.label, val: d.users };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`
      : '';

    return { points, linePath, areaPath };
  };

  const calcRevenuePoints = () => {
    const growthData = getUserGrowthData();
    const maxRevenue = Math.max(...growthData.map(d => d.revenue), 1000);
    const points = growthData.map((d, i) => {
      const x = 50 + i * 80;
      const y = 160 - (d.revenue / maxRevenue) * 120;
      return { x, y, label: d.label, val: d.revenue };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`
      : '';

    return { points, linePath, areaPath };
  };

  const calcUserDistribution = () => {
    let studentsCount = 0;
    let mentorsCount = 0;
    let investorsCount = 0;
    let adminsCount = 0;

    allProfiles.forEach(p => {
      const role = p.role || '';
      const designation = (p.designation || '').toLowerCase();
      const email = (p.email || '').toLowerCase();

      if (role === 'student' || role === 'founder' || role === 'user') {
        studentsCount++;
      } else if (role === 'mentor') {
        mentorsCount++;
      } else if (role === 'investor') {
        investorsCount++;
      } else if (role === 'admin') {
        adminsCount++;
      } else {
        if (email === 'sushantsharma2805@gmail.com' || designation.includes('admin')) {
          adminsCount++;
        } else if (designation.includes('investor') || designation.includes('partner') || designation.includes('vc') || designation.includes('capital')) {
          investorsCount++;
        } else if (designation.includes('mentor') || designation.includes('expert') || designation.includes('advisor')) {
          mentorsCount++;
        } else {
          studentsCount++;
        }
      }
    });

    const total = studentsCount + mentorsCount + investorsCount + adminsCount || 1;
    return [
      { name: 'Students/Founders', count: studentsCount, color: '#22d3ee', pct: (studentsCount / total) * 100 },
      { name: 'Mentors', count: mentorsCount, color: '#f97316', pct: (mentorsCount / total) * 100 },
      { name: 'Investors', count: investorsCount, color: '#a855f7', pct: (investorsCount / total) * 100 },
      { name: 'Admin Team', count: adminsCount, color: '#10b981', pct: (adminsCount / total) * 100 },
    ];
  };

  const getUserDistributionSlices = () => {
    const dist = calcUserDistribution();
    let accumulatedPct = 0;
    return dist.map(slice => {
      const offset = 314.159 - (slice.pct / 100) * 314.159;
      const rotation = (accumulatedPct / 100) * 360;
      accumulatedPct += slice.pct;
      return { ...slice, offset, rotation };
    });
  };

  const calcRevenueBarPoints = () => {
    const growthData = getUserGrowthData();
    const maxRevenue = Math.max(...growthData.map(d => d.revenue), 1000);
    return growthData.map((d, i) => {
      const width = 24;
      const height = (d.revenue / maxRevenue) * 110;
      const x = 50 + i * 70;
      const y = 150 - height;
      return { x, y, width, height, label: d.label, val: d.revenue };
    });
  };

  const handleToolsSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredTools = tools.filter(t => {
    if (!searchQuery.trim()) return true;
    const lower = searchQuery.toLowerCase();
    return (t.title || '').toLowerCase().includes(lower) || 
           (t.category || '').toLowerCase().includes(lower);
  });

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/update-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': getAdminEmail()
        },
        body: JSON.stringify({ user_id: userId, role: newRole })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to update user role');
      }
      alert("User role updated successfully!");
      fetchContent();
    } catch (err: any) {
      console.warn("Failed to update role via backend:", err.message);
      // fallback
      try {
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        if (error) throw error;
        alert("User role updated via direct client fallback!");
        fetchContent();
      } catch (fallbackErr: any) {
        alert(`Error updating role: ${err.message}. Direct fallback also failed: ${fallbackErr.message}`);
      }
    }
  };

  const toggleMentorVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verify-mentor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': getAdminEmail()
        },
        body: JSON.stringify({ user_id: userId, is_verified: !currentStatus })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to update verification status');
      }
      alert(`Mentor verification status updated!`);
      fetchContent();
    } catch (err: any) {
      console.warn("Failed to update verification via backend:", err.message);
      // fallback
      try {
        const { error } = await supabase.from('profiles').update({ is_verified: !currentStatus }).eq('id', userId);
        if (error) throw error;
        alert("Verification status updated via direct client fallback!");
        fetchContent();
      } catch (fallbackErr: any) {
        alert(`Error updating verification status: ${err.message}. Direct fallback also failed: ${fallbackErr.message}`);
      }
    }
  };

  const getFilteredProfiles = () => {
    return allProfiles.filter(profile => {
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.toLowerCase();
      const email = (profile.email || '').toLowerCase();
      const designation = (profile.designation || '').toLowerCase();
      const search = userSearchQuery.toLowerCase();
      const matchesSearch = fullName.includes(search) || email.includes(search) || designation.includes(search);
      
      if (!matchesSearch) return false;

      const role = profile.role || '';
      
      if (activeUserSubTab === 'students') {
        if (role) return role === 'student' || role === 'founder' || role === 'user';
        const isInvestor = designation.includes('investor') || designation.includes('partner') || designation.includes('vc') || designation.includes('capital');
        const isMentor = designation.includes('mentor') || designation.includes('expert') || designation.includes('advisor');
        const isAdminTeam = email === 'sushantsharma2805@gmail.com' || designation.includes('admin');
        return !isInvestor && !isMentor && !isAdminTeam;
      }
      
      if (activeUserSubTab === 'mentors') {
        if (role) return role === 'mentor';
        return designation.includes('mentor') || designation.includes('expert') || designation.includes('advisor');
      }

      if (activeUserSubTab === 'investors') {
        if (role) return role === 'investor';
        return designation.includes('investor') || designation.includes('partner') || designation.includes('vc') || designation.includes('capital');
      }

      if (activeUserSubTab === 'admin_team') {
        if (role) return role === 'admin';
        return email === 'sushantsharma2805@gmail.com' || designation.includes('admin');
      }

      return true;
    });
  };

  const handleSendBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const group = formData.get('group') as string;
    const message = formData.get('message') as string;

    setCommLoading(true);
    setBroadcastLogs([]);

    const log = (msg: string) => setBroadcastLogs(prev => [...prev, msg]);

    try {
      log(`[INFO] Preparing broadcast target: ${group}`);
      
      let expectedRecipients = totalUsers;
      if (group === 'students') expectedRecipients = allProfiles.filter(p => !(p.designation || '').toLowerCase().includes('investor') && !(p.designation || '').toLowerCase().includes('mentor')).length;
      else if (group === 'mentors') expectedRecipients = allProfiles.filter(p => (p.designation || '').toLowerCase().includes('mentor')).length;
      else if (group === 'investors') expectedRecipients = allProfiles.filter(p => (p.designation || '').toLowerCase().includes('investor')).length;

      log(`[INFO] Found ${expectedRecipients} recipients in local directory cache.`);
      log(`[INFO] Connecting to system backend to route email queue...`);

      const res = await fetch(`${API_BASE_URL}/api/admin/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': getAdminEmail()
        },
        body: JSON.stringify({ title, group, message })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Server rejected broadcast dispatch');
      }

      const data = await res.json();
      log(`[INFO] Dispatching system broadcast payload: "${title}"`);
      log(`[INFO] Routing email queue to Brevo API SMTP relay...`);
      log(`[SUCCESS] Broadcast dispatched to ${data.sent_count} users successfully!`);
      if (data.failures && data.failures.length > 0) {
        log(`[WARN] Failed to send to: ${data.failures.join(', ')}`);
      }
      alert(`Broadcast alert successfully dispatched to ${data.sent_count} users!`);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      log(`[ERROR] Broadcast dispatch failed: ${err.message}`);
    } finally {
      setCommLoading(false);
    }
  };

  const handleSendDirectAlert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone') as string;
    const channel = formData.get('channel') as string;
    const body = formData.get('body') as string;

    setCommLoading(true);
    setDirectLogs([]);

    const log = (msg: string) => setDirectLogs(prev => [...prev, msg]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': getAdminEmail()
        },
        body: JSON.stringify({ phone, channel, body })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to connect to backend SMS dispatch API');
      }

      const data = await res.json();
      if (data.logs) {
        data.logs.forEach((srvLog: string) => log(srvLog));
      } else {
        log(`[SUCCESS] Alert successfully dispatched to ${phone}!`);
      }

      if (data.status === 'simulated') {
        alert("Direct mobile alert simulated (Twilio credentials missing on server).");
      } else {
        alert("Individual mobile alert sent successfully via Twilio!");
      }
      (e.target as HTMLFormElement).reset();
      setDirectMsgBody('');
    } catch (err: any) {
      log(`[ERROR] Send failed: ${err.message}`);
    } finally {
      setCommLoading(false);
    }
  };

  const handleLoadTemplate = (templateName: string) => {
    if (templateName === 'welcome') {
      setDirectMsgBody("Welcome to THE PROPELS! Your account has been approved. Build, network, and operate like a tier-1 startup founder now.");
    } else if (templateName === 'session') {
      setDirectMsgBody("Hello! Your course session has been scheduled. Check your profile dashboard for details and joining links.");
    } else if (templateName === 'verify') {
      setDirectMsgBody("Congratulations! Your expert mentor profile has been verified by the administrator. You are now active on the public directory.");
    } else {
      setDirectMsgBody('');
    }
  };


  // HANDLERS
  const handleAddTool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const { error } = await supabase.from('tools_cards').insert({
        title: data.title,
        description: data.description,
        image_url: data.image_url,
        redirect_link: data.redirect_link,
        category: data.category,
        price: parseFloat(data.price as string) || 0,
        discount_price: data.discount_price ? parseFloat(data.discount_price as string) : null,
      });
      if (error) throw error;
      alert("Tool added!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAddCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const { error } = await supabase.from('courses').insert({
        title: data.title,
        image_url: data.image_url,
        mentor: data.mentor,
        description: data.description,
        actual_price: parseFloat(data.actual_price as string) || 0,
        discounted_price: parseFloat(data.discounted_price as string) || 0,
        enroll_link: data.enroll_link,
      });
      if (error) throw error;
      alert("Course added!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAddJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const { error } = await supabase.from('job_postings').insert({
        title: data.title,
        description: data.description,
        role: data.role,
        qualification: data.qualification,
        eligibility: data.eligibility,
        stipend: data.stipend,
        work_duration: data.work_duration,
        location: data.location,
        mode: data.mode,
        is_active: true
      });
      if (error) throw error;
      alert("Job posted!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleAddStory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const { error } = await supabase.from('success_stories').insert({
        founder_name: data.founder_name,
        startup_name: data.startup_name,
        niche: data.niche,
        metric: data.metric,
        metric_label: data.metric_label,
        summary: data.summary,
        avatar_url: data.avatar_url,
        media_url: data.media_url,
        media_type: data.media_type || 'image',
      });
      if (error) throw error;
      alert("Story added!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAddKB = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    setLoading(true);
    try {
      let download_link = formData.get('download_link') as string;
      if (file && file.size > 0) {
        download_link = await uploadFile(file, 'kb-documents');
      }

      const { error } = await supabase.from('knowledge_base').insert({
        title: formData.get('title'),
        description: formData.get('description'),
        download_link: download_link,
        file_type: formData.get('file_type') || 'pdf',
        category: formData.get('category') || 'Template'
      });
      if (error) throw error;
      alert("Document added to Knowledge Base!");
      (e.target as HTMLFormElement).reset();
      fetchContent();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    setSelectedCourseId(courseId);
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
      if (error) throw error;
      setModules(data || []);
    } catch (err: any) {
      console.error("Error fetching modules:", err.message);
    }
  };

  const handleAddModule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    setLoading(true);
    try {
      let content_url = formData.get('content_url') as string;
      if (file && file.size > 0) {
        content_url = await uploadFile(file, 'course-content');
      }

      const { error } = await supabase.from('course_modules').insert({
        course_id: selectedCourseId,
        title: formData.get('title'),
        description: formData.get('description'),
        content_url: content_url,
        content_type: formData.get('content_type') || 'video',
        order_index: parseInt(formData.get('order_index') as string) || 0
      });
      if (error) throw error;
      alert("Module added!");
      (e.target as HTMLFormElement).reset();
      fetchModules(selectedCourseId);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePricing = async (id: string, field: string, value: any) => {
    try {
      const updateVal = field === 'features' ? JSON.parse(value) : value;
      const { error } = await supabase.from('pricing_plans').update({ [field]: updateVal, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
      setPricingPlans(prev => prev.map(p => p.id === id ? { ...p, [field]: updateVal } : p));
    } catch (err: any) {
      alert('Error updating: ' + err.message);
    }
  };

  const handleTogglePricingHighlight = async (id: string, current: boolean) => {
    // only one card can be highlighted at a time
    try {
      await supabase.from('pricing_plans').update({ is_highlighted: false }).neq('id', 'none');
      await supabase.from('pricing_plans').update({ is_highlighted: !current }).eq('id', id);
      fetchContent();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const updateAppStatus = async (id: string, status: string) => {
    await supabase.from('applications').update({ status }).eq('id', id);
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const downloadPDF = async (app: any) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Candidate Profile", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${app.full_name}`, 20, 40);
    doc.text(`Email: ${app.email}`, 20, 50);
    doc.text(`Role: ${app.job_postings?.title || 'N/A'}`, 20, 60);
    doc.text(`Experience: ${app.experience}`, 20, 70);
    doc.text(`Status: ${app.status}`, 20, 80);
    doc.save(`${app.full_name}_Profile.pdf`);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#020202] text-slate-300 flex items-center justify-center font-sans p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ShieldAlert className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">THE PROPELS</h1>
          <p className="text-center text-sm text-slate-400 mb-8">Enter administrator credentials to authenticate.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Admin Email</label>
              <input 
                type="email" 
                required 
                disabled={loginStep === 'otp'}
                value={emailInput} 
                onChange={(e) => setEmailInput(e.target.value)} 
                placeholder="admin@thepropels.com" 
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all disabled:opacity-50" 
              />
            </div>

            {loginStep === 'otp' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">6-Digit Secure OTP</label>
                <input 
                  type="text" 
                  required 
                  maxLength={6}
                  value={otpInput} 
                  onChange={(e) => setOtpInput(e.target.value)} 
                  placeholder="123456" 
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all text-center tracking-widest font-mono text-lg font-bold" 
                />
              </motion.div>
            )}

            {error && <p className="text-red-400 text-xs font-semibold">{error}</p>}
            
            <button 
              type="submit" 
              disabled={isSendingOtp || isVerifyingOtp}
              className="w-full bg-white text-black hover:bg-slate-200 font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginStep === 'email' 
                ? (isSendingOtp ? 'Sending OTP...' : 'Send Secure OTP') 
                : (isVerifyingOtp ? 'Verifying...' : 'Verify & Enter Portal')}
            </button>

            {loginStep === 'otp' && (
              <button 
                type="button" 
                onClick={() => { setLoginStep('email'); setError(''); }}
                className="w-full text-slate-500 hover:text-slate-300 text-xs font-bold text-center mt-2 underline block"
              >
                Change Email
              </button>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans relative pb-20">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10 object-contain" />
          <span className="font-montserrat text-lg font-extrabold tracking-wider uppercase text-white hidden sm:block">THE PROPELS <span className="text-cyan-400 text-sm">ADMIN</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full border border-cyan-400/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> SECURE SESSION
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
            <LogOut className="w-4 h-4" /> Exit
          </button>
        </div>
      </nav>

      <main className="pt-28 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto relative z-10 flex gap-8 flex-col md:flex-row items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 top-24 sticky z-20">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shadow-xl">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'text-cyan-400' },
              { id: 'users', name: 'User Directory', icon: Users, color: 'text-orange-400', isDropdown: true, subItems: [
                { id: 'students', name: 'Students/Founders' },
                { id: 'mentors', name: 'Mentors' },
                { id: 'investors', name: 'Investors' },
                { id: 'admin_team', name: 'Admin Team' }
              ]},
              { id: 'communication', name: 'Communication', icon: MessageSquare, color: 'text-purple-400', isDropdown: true, subItems: [
                { id: 'broadcast', name: 'Broadcast' },
                { id: 'direct', name: 'Direct Message' }
              ]},
              { id: 'divider', name: '', icon: null },
              { id: 'tools', name: 'Tools Library', icon: Wrench, color: 'text-cyan-400' },
              { id: 'courses', name: 'Course Manager', icon: Video, color: 'text-orange-400' },
              { id: 'stories', name: 'Success Stories', icon: Award, color: 'text-purple-400' },
              { id: 'careers', name: 'Career Manager', icon: MapPin, color: 'text-yellow-400' },
              { id: 'pricing', name: 'Pricing Plans', icon: DollarSign, color: 'text-emerald-400' },
              { id: 'kb', name: 'Knowledge Base', icon: Library, color: 'text-indigo-400' },
              { id: 'applications', name: 'Applications', icon: Briefcase, color: 'text-rose-400' }
            ].map(tab => {
              if (tab.id === 'divider') {
                return <hr key="divider" className="border-white/10 my-2" />;
              }
              
              if (tab.isDropdown) {
                const isExpanded = tab.id === 'users' ? (userDirExpanded || activeTab === 'users') : (commExpanded || activeTab === 'communication');
                const setExpanded = tab.id === 'users' ? setUserDirExpanded : setCommExpanded;
                const activeSub = tab.id === 'users' ? activeUserSubTab : activeCommSubTab;
                const setActiveSub = tab.id === 'users' ? setActiveUserSubTab : setActiveCommSubTab;

                return (
                  <div key={tab.id} className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setExpanded(!isExpanded)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === tab.id ? 'bg-white/5 text-white border border-white/10' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}
                    >
                      <div className="flex items-center gap-3"><tab.icon className={`w-4 h-4 ${tab.color}`} /> {tab.name}</div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="flex flex-col gap-1 pl-8 overflow-hidden"
                        >
                          {tab.subItems.map(sub => (
                            <button
                              type="button"
                              key={sub.id}
                              onClick={() => {
                                setActiveTab(tab.id as any);
                                setActiveSub(sub.id as any);
                              }}
                              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id && activeSub === sub.id ? 'text-white bg-white/5' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                              • {sub.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === tab.id ? 'bg-white/5 text-white border border-white/10' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}>
                  <div className="flex items-center gap-3">{tab.icon && <tab.icon className={`w-4 h-4 ${tab.color}`} />} {tab.name}</div>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 w-full space-y-8">
          <AnimatePresence>{editingItem && <EditModal item={editingItem} type={editingType} onClose={() => setEditingItem(null)} onSave={handleEditSave} />}</AnimatePresence>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                
                {/* Stats Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Platform Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4 hover:border-cyan-500/30 transition-all duration-300 group">
                      <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Users</p>
                        <h4 className="text-xl font-bold text-white mt-0.5">{totalUsers}</h4>
                      </div>
                    </div>
                    
                    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4 hover:border-orange-500/30 transition-all duration-300 group">
                      <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-400 group-hover:bg-orange-500/20 transition-all">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Startups Today</p>
                        <h4 className="text-xl font-bold text-white mt-0.5">{startupsToday}</h4>
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4 hover:border-emerald-500/30 transition-all duration-300 group">
                      <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Marketplace Tools</p>
                        <h4 className="text-xl font-bold text-white mt-0.5">{tools.length}</h4>
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4 hover:border-indigo-500/30 transition-all duration-300 group">
                      <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                        <Library className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">KB Documents</p>
                        <h4 className="text-xl font-bold text-white mt-0.5">{dashboardKb}</h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0a0a0a]/60 border border-white/5 rounded-2xl p-4 shadow-lg flex items-center gap-4 hover:border-purple-500/20 transition-all duration-300">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Courses & Enrolls</p>
                      <h4 className="text-base font-bold text-white mt-0.5">{dashboardCourses} Courses / {dashboardEnrollments} Enrolled</h4>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a]/60 border border-white/5 rounded-2xl p-4 shadow-lg flex items-center gap-4 hover:border-yellow-500/20 transition-all duration-300">
                    <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-yellow-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Careers & Active Jobs</p>
                      <h4 className="text-base font-bold text-white mt-0.5">{dashboardJobs} Live Postings</h4>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a]/60 border border-white/5 rounded-2xl p-4 shadow-lg flex items-center gap-4 hover:border-rose-500/20 transition-all duration-300">
                    <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Job Applications Count</p>
                      <h4 className="text-base font-bold text-white mt-0.5">{dashboardApps} Submissions</h4>
                    </div>
                  </div>
                </div>

                {/* Revenue Metrics Panel with Date Filter */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 hover:border-white/20 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2"><DollarSign className="w-5 h-5 text-cyan-400" /> Revenue & Sales Performance</h2>
                      <p className="text-xs text-slate-500">Live platform monetization tracking & profit audit.</p>
                    </div>
                    
                    {/* Date Filters Selector */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-xl">
                      {(['today', 'this_month', 'last_30_days', 'custom'] as const).map(filter => (
                        <button
                          type="button"
                          key={filter}
                          onClick={() => setRevenueFilter(filter)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${revenueFilter === filter ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'}`}
                        >
                          {filter === 'today' ? 'Today' : filter === 'this_month' ? 'This Month' : filter === 'last_30_days' ? 'Last 30 Days' : 'Custom'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {revenueFilter === 'custom' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-cyan-500 outline-none" />
                      </div>
                    </motion.div>
                  )}

                  {/* Calculations Display */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-5 text-cyan-400 group-hover:opacity-10 transition-opacity"><ShoppingBag className="w-12 h-12" /></div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Tool Purchases</p>
                      <h3 className="text-3xl font-extrabold text-white">{calcTotalSalesCount()}</h3>
                      <p className="text-[10px] text-cyan-400 mt-2 font-medium">Completed checkout orders</p>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-5 text-emerald-400 group-hover:opacity-10 transition-opacity"><DollarSign className="w-12 h-12" /></div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Sales Amount</p>
                      <h3 className="text-3xl font-extrabold text-emerald-400">₹{calcTotalPaidAmount().toLocaleString('en-IN')}</h3>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">100% direct client payments</p>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-orange-500/20 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-5 text-orange-400 group-hover:opacity-10 transition-opacity"><Percent className="w-12 h-12" /></div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Platform Profit (10%)</p>
                      <h3 className="text-3xl font-extrabold text-orange-400">₹{calcTotalProfit().toLocaleString('en-IN')}</h3>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">10% cut per tool transaction</p>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Growth & Revenue Line Chart */}
                  <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-white/20 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Monthly Platform Growth</h3>
                        <p className="text-xs text-slate-500">Chronological analysis of the last 6 months.</p>
                      </div>
                      
                      {/* Chart toggle buttons */}
                      <div className="flex bg-white/5 border border-white/10 p-0.5 rounded-lg">
                        <button 
                          onClick={() => setChartTab('signups')} 
                          className={`text-[10px] px-2.5 py-1.5 rounded-md font-bold transition-all ${chartTab === 'signups' ? 'bg-cyan-500 text-black' : 'text-slate-400'}`}
                        >
                          Signups
                        </button>
                        <button 
                          onClick={() => setChartTab('revenue')} 
                          className={`text-[10px] px-2.5 py-1.5 rounded-md font-bold transition-all ${chartTab === 'revenue' ? 'bg-purple-500 text-white' : 'text-slate-400'}`}
                        >
                          Revenue
                        </button>
                      </div>
                    </div>

                    {/* SVG Line/Area Chart */}
                    <div className="h-56 w-full flex items-center justify-center relative bg-white/5 rounded-xl border border-white/5 p-4">
                      {allProfiles.length === 0 ? (
                        <div className="text-slate-500 text-xs font-bold">No historical data available</div>
                      ) : (
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="areaGradientCyan" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="areaGradientPurple" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          
                          {/* Grid Lines */}
                          <line x1="50" y1="40" x2="450" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                          <line x1="50" y1="100" x2="450" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                          <line x1="50" y1="160" x2="450" y2="160" stroke="rgba(255,255,255,0.1)" />

                          {chartTab === 'signups' ? (
                            <>
                              {/* Render Area Path */}
                              <path d={calcGrowthPoints().areaPath} fill="url(#areaGradientCyan)" />
                              {/* Render Line Path */}
                              <path d={calcGrowthPoints().linePath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                              {/* Render Nodes */}
                              {calcGrowthPoints().points.map((p, idx) => (
                                <g key={idx} className="group/node cursor-pointer">
                                  <circle cx={p.x} cy={p.y} r="5" fill="#020202" stroke="#06b6d4" strokeWidth="2.5" />
                                  <circle cx={p.x} cy={p.y} r="8" fill="#06b6d4" className="opacity-0 group-hover/node:opacity-30 transition-opacity" />
                                  <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[9px] fill-cyan-400 font-bold opacity-0 group-hover/node:opacity-100 transition-opacity">{p.val} signups</text>
                                </g>
                              ))}
                            </>
                          ) : (
                            <>
                              {/* Render Area Path */}
                              <path d={calcRevenuePoints().areaPath} fill="url(#areaGradientPurple)" />
                              {/* Render Line Path */}
                              <path d={calcRevenuePoints().linePath} fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" />
                              {/* Render Nodes */}
                              {calcRevenuePoints().points.map((p, idx) => (
                                <g key={idx} className="group/node cursor-pointer">
                                  <circle cx={p.x} cy={p.y} r="5" fill="#020202" stroke="#a855f7" strokeWidth="2.5" />
                                  <circle cx={p.x} cy={p.y} r="8" fill="#a855f7" className="opacity-0 group-hover/node:opacity-30 transition-opacity" />
                                  <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[9px] fill-purple-400 font-bold opacity-0 group-hover/node:opacity-100 transition-opacity">₹{p.val.toLocaleString('en-IN')}</text>
                                </g>
                              ))}
                            </>
                          )}

                          {/* X Axis Labels */}
                          {calcGrowthPoints().points.map((p, idx) => (
                            <text key={idx} x={p.x} y="185" textAnchor="middle" className="text-[9px] fill-slate-500 font-bold">{p.label}</text>
                          ))}
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* User Role Distribution Donut Chart */}
                  <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-white/20 transition-all duration-300">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Directory Ratios</h3>
                      <p className="text-xs text-slate-500">Distribution ratio by platform roles.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                      {/* Donut SVG */}
                      <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                          <circle cx="70" cy="70" r="50" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="16" />
                          {getUserDistributionSlices().map((slice, idx) => (
                            slice.pct > 0 && (
                              <circle
                                key={idx}
                                cx="70"
                                cy="70"
                                r="50"
                                fill="transparent"
                                stroke={slice.color}
                                strokeWidth="16"
                                strokeDasharray="314.159"
                                strokeDashoffset={slice.offset}
                                transform={`rotate(${slice.rotation - 90} 70 70)`}
                                className="transition-all duration-500"
                                strokeLinecap="round"
                              />
                            )
                          ))}
                        </svg>
                        <div className="absolute text-center">
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider leading-none">Total Directory</p>
                          <p className="text-xl font-black text-white mt-1">{allProfiles.length}</p>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="space-y-2.5 w-full max-w-[14rem]">
                        {calcUserDistribution().map(slice => (
                          <div key={slice.name} className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 font-semibold text-slate-300">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                              {slice.name}
                            </span>
                            <span className="font-mono text-slate-500 font-bold">{slice.count} ({Math.round(slice.pct)}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Most Demanded Tools & Bar Chart comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tool Demand filter & horizontal bars */}
                  <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-white/20 transition-all duration-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Performing Tools</h3>
                        <p className="text-xs text-slate-500">Sales volume per tool card.</p>
                      </div>
                      
                      {/* Month & Year Selectors */}
                      <div className="flex gap-2">
                        <select
                          value={toolsDemandMonth}
                          onChange={e => setToolsDemandMonth(parseInt(e.target.value))}
                          className="bg-white/5 border border-white/10 text-xs rounded-lg px-2 py-1 outline-none text-white font-semibold"
                        >
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, idx) => (
                            <option key={idx} value={idx} className="bg-[#0a0a0a]">{m}</option>
                          ))}
                        </select>
                        <select
                          value={toolsDemandYear}
                          onChange={e => setToolsDemandYear(parseInt(e.target.value))}
                          className="bg-white/5 border border-white/10 text-xs rounded-lg px-2 py-1 outline-none text-white font-semibold"
                        >
                          {[2025, 2026, 2027].map(y => (
                            <option key={y} value={y} className="bg-[#0a0a0a]">{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 min-h-[14rem] flex flex-col justify-center">
                      {getFilteredToolsDemand().length === 0 ? (
                        <div className="text-center text-slate-600 text-xs font-bold py-12">
                          No tool sales recorded for this month.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {getFilteredToolsDemand().slice(0, 4).map((tool) => {
                            const maxCount = Math.max(...getFilteredToolsDemand().map(d => d.count), 1);
                            const percent = (tool.count / maxCount) * 100;
                            return (
                              <div key={tool.name} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span className="text-slate-300 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    {tool.name}
                                  </span>
                                  <span className="text-cyan-400 font-mono">{tool.count} orders</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Revenue Bar Chart */}
                  <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-white/20 transition-all duration-300">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Revenue Breakdown</h3>
                      <p className="text-xs text-slate-500">Monthly monetization performance comparison.</p>
                    </div>

                    <div className="h-56 w-full flex items-center justify-center relative bg-white/5 rounded-xl border border-white/5 p-4">
                      {allProfiles.length === 0 ? (
                        <div className="text-slate-500 text-xs font-bold">No historical data available</div>
                      ) : (
                        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          <line x1="40" y1="40" x2="460" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                          <line x1="40" y1="95" x2="460" y2="95" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                          <line x1="40" y1="150" x2="460" y2="150" stroke="rgba(255,255,255,0.1)" />

                          {/* Render Bars */}
                          {calcRevenueBarPoints().map((b, idx) => (
                            <g key={idx} className="group/bar cursor-pointer">
                              <rect
                                x={b.x}
                                y={b.y}
                                width={b.width}
                                height={b.height}
                                fill="url(#barGradient)"
                                rx="4"
                                className="transition-all duration-300 hover:fill-emerald-400"
                              />
                              <text x={b.x + b.width / 2} y={b.y - 8} textAnchor="middle" className="text-[9px] fill-emerald-400 font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                ₹{b.val.toLocaleString('en-IN')}
                              </text>
                            </g>
                          ))}

                          {/* X Axis Labels */}
                          {calcRevenueBarPoints().map((b, idx) => (
                            <text key={idx} x={b.x + b.width / 2} y="175" textAnchor="middle" className="text-[9px] fill-slate-500 font-bold">
                              {b.label}
                            </text>
                          ))}
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Available Tools Search list widget */}
                <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 hover:border-white/20 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Startup Tools Directory</h3>
                      <p className="text-xs text-slate-500">Quickly search and modify official marketplace tools.</p>
                    </div>
                    
                    {/* Search bar */}
                    <div className="w-full sm:w-72 bg-[#111] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search tools by title or category..."
                        value={searchQuery}
                        onChange={e => handleToolsSearch(e.target.value)}
                        className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTools.length === 0 ? (
                      <div className="col-span-2 text-center text-slate-600 text-xs py-8">
                        No matching tools found in the library.
                      </div>
                    ) : (
                      filteredTools.slice(0, 4).map(tool => (
                        <div key={tool.id} className="flex gap-4 p-4 bg-[#111] border border-white/5 rounded-xl hover:border-white/10 transition-all group relative">
                          <img src={tool.image_url} className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-white truncate pr-16">{tool.title}</h4>
                              <span className="text-xs font-black text-slate-300">₹{Number(tool.price).toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">{tool.category}</p>
                            <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{tool.description}</p>
                            
                            {/* Quick Edit shortcut on card */}
                            <div className="mt-3 flex justify-end">
                              <button 
                                onClick={() => { setEditingItem(tool); setEditingType('tools_cards'); }}
                                className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                              >
                                <Edit3 className="w-3 h-3" /> Quick Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white capitalize">{activeUserSubTab.replace('_', ' ')} Directory</h2>
                      <p className="text-xs text-slate-500">Manage user profiles, expert credentials, and platform roles.</p>
                    </div>
                    
                    {/* User Search Bar */}
                    <div className="w-full sm:w-72 bg-[#111] border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                      <Search className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="text"
                        placeholder="Search by name, email, designation..."
                        value={userSearchQuery}
                        onChange={e => setUserSearchQuery(e.target.value)}
                        className="bg-transparent text-xs text-white outline-none w-full placeholder:text-slate-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Subtabs selector */}
                  <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-full sm:w-fit">
                    {[
                      { id: 'students', label: 'Students / Founders' },
                      { id: 'mentors', label: 'Mentors' },
                      { id: 'investors', label: 'Investors' },
                      { id: 'admin_team', label: 'Admin Team' }
                    ].map(subTab => (
                      <button
                        type="button"
                        key={subTab.id}
                        onClick={() => setActiveUserSubTab(subTab.id as any)}
                        className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${activeUserSubTab === subTab.id ? 'bg-white text-black shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        {subTab.label}
                      </button>
                    ))}
                  </div>

                  {/* Users List Table/Cards */}
                  <div className="space-y-3">
                    {getFilteredProfiles().length === 0 ? (
                      <div className="text-center text-slate-600 text-xs py-12">
                        No profiles found in this category.
                      </div>
                    ) : (
                      getFilteredProfiles().map(profile => (
                        <div key={profile.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5 hover:border-white/10 transition-all gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold uppercase shrink-0">
                              {profile.first_name ? profile.first_name[0] : 'U'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-white">{profile.first_name} {profile.last_name}</p>
                                {activeUserSubTab === 'mentors' && (
                                  <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider border ${profile.is_verified ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                    {profile.is_verified ? 'Verified Expert' : 'Unverified'}
                                  </span>
                                )}
                                {activeUserSubTab === 'admin_team' && (
                                  <span className="text-[9px] px-2 py-0.5 rounded font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                                    Sub Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{profile.email} • {profile.mobile || 'No Phone'}</p>
                              <p className="text-xs text-slate-400 mt-1 font-medium italic">{profile.designation || 'Founder @ Stealth'} @ {profile.company || 'Stealth Startup'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                            {/* Verification Toggle for Mentors */}
                            {activeUserSubTab === 'mentors' && (
                              <button
                                type="button"
                                onClick={() => toggleMentorVerification(profile.id, profile.is_verified)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${profile.is_verified ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                              >
                                {profile.is_verified ? 'Revoke Verify' : 'Verify Expert'}
                              </button>
                            )}

                            {/* Sub-admin Permissions Info */}
                            {activeUserSubTab === 'admin_team' && (
                              <span className="text-[10px] text-slate-500 font-mono bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg">
                                Roles: Manage DB, Content
                              </span>
                            )}

                            {/* Role Select Dropdown */}
                            <select
                              value={profile.role || (activeUserSubTab === 'students' ? 'student' : activeUserSubTab === 'mentors' ? 'mentor' : activeUserSubTab === 'investors' ? 'investor' : 'admin')}
                              onChange={e => updateUserRole(profile.id, e.target.value)}
                              className="bg-black/40 text-[11px] font-bold border border-white/10 rounded-lg px-2.5 py-1.5 outline-none text-white focus:border-cyan-500"
                            >
                              <option value="student" className="bg-[#0a0a0a]">Student</option>
                              <option value="founder" className="bg-[#0a0a0a]">Founder</option>
                              <option value="mentor" className="bg-[#0a0a0a]">Mentor</option>
                              <option value="investor" className="bg-[#0a0a0a]">Investor</option>
                              <option value="admin" className="bg-[#0a0a0a]">Admin Team</option>
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'communication' && (
              <motion.div key="communication" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white capitalize">{activeCommSubTab} Communication</h2>
                    <p className="text-xs text-slate-500">Contact registered users, send broadcast announcements or mobile alerts.</p>
                  </div>

                  {/* Subtabs selector */}
                  <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl w-full sm:w-fit">
                    <button
                      type="button"
                      onClick={() => setActiveCommSubTab('broadcast')}
                      className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${activeCommSubTab === 'broadcast' ? 'bg-white text-black shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      Broadcast Announcement
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCommSubTab('direct')}
                      className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${activeCommSubTab === 'direct' ? 'bg-white text-black shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      Direct Number Alert
                    </button>
                  </div>

                  {activeCommSubTab === 'broadcast' && (
                    <div className="space-y-5">
                      <form onSubmit={handleSendBroadcast} className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Announcement Title</label>
                            <input name="title" required placeholder="System Maintenance Alert / New Program Launch" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Recipient Category</label>
                            <select name="group" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500">
                              <option value="all">All Registered Users ({totalUsers})</option>
                              <option value="students">Students / Founders Only</option>
                              <option value="mentors">Verified Mentors Only</option>
                              <option value="investors">Onboarded Investors Only</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Message Body (Email & Push Alert)</label>
                          <textarea name="message" required rows={6} placeholder="Type announcement content here..." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500 resize-none" />
                        </div>
                        <div className="flex justify-end">
                          <button type="submit" disabled={commLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-cyan-500/10">
                            {commLoading ? 'Dispatching...' : <><Send className="w-4 h-4" /> Send Broadcast</>}
                          </button>
                        </div>
                      </form>

                      {/* Simulation Logs */}
                      {broadcastLogs.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border border-white/10 rounded-xl p-4 bg-black/40 font-mono text-[10px] text-cyan-400 space-y-1.5 max-h-40 overflow-y-auto">
                          {broadcastLogs.map((log, idx) => (
                            <p key={idx} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[ERROR]') ? 'text-red-400 font-bold' : 'text-slate-400'}>
                              {log}
                            </p>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )}

                  {activeCommSubTab === 'direct' && (
                    <div className="space-y-5">
                      <form onSubmit={handleSendDirectAlert} className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Phone Number</label>
                            <input name="phone" required type="tel" placeholder="+91 98765 43210" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Alert Channel</label>
                            <select name="channel" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500">
                              <option value="sms">SMS Network</option>
                              <option value="whatsapp">WhatsApp Business</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Template Preset</label>
                            <select name="template" onChange={e => handleLoadTemplate(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500">
                              <option value="custom">Custom (Write below)</option>
                              <option value="welcome">Welcome Alert</option>
                              <option value="session">Course Session Schedule</option>
                              <option value="verify">Mentor Verification Alert</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Alert Message Body</label>
                          <textarea name="body" required value={directMsgBody} onChange={e => setDirectMsgBody(e.target.value)} rows={4} placeholder="Your account is approved! Access the operator dashboard now." className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500 resize-none" />
                        </div>
                        <div className="flex justify-end">
                          <button type="submit" disabled={commLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-cyan-500/10">
                            {commLoading ? 'Dispatched' : <><Send className="w-4 h-4" /> Send Direct Alert</>}
                          </button>
                        </div>
                      </form>

                      {/* Simulation Logs */}
                      {directLogs.length > 0 && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border border-white/10 rounded-xl p-4 bg-black/40 font-mono text-[10px] text-cyan-400 space-y-1.5">
                          {directLogs.map((log, idx) => (
                            <p key={idx} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('[ERROR]') ? 'text-red-400' : 'text-slate-400'}>
                              {log}
                            </p>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'tools' && (
              <motion.div key="tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-cyan-400" /> Add New Tool</h2>
                  <form onSubmit={handleAddTool} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="title" required placeholder="Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="category" required placeholder="Category" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="image_url" type="url" required placeholder="Image URL" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="redirect_link" type="url" required placeholder="Redirect Link" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="price" type="number" required placeholder="Price" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <input name="discount_price" type="number" placeholder="Discount Price (Optional)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500" />
                    <textarea name="description" required placeholder="Description" rows={3} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-cyan-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Add Tool</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Existing Tools</h3>
                  <div className="space-y-3">
                    {tools.map(tool => (
                      <div key={tool.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={tool.image_url} className="w-10 h-10 rounded-lg object-cover" />
                          <div><p className="text-sm font-bold text-white">{tool.title}</p><p className="text-xs text-slate-500">{tool.category}</p></div>
                        </div>
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(tool); setEditingType('tools_cards'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('tools_cards', tool.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'kb' && (
              <motion.div key="kb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-400" /> Add KB Document</h2>
                  <form onSubmit={handleAddKB} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="title" required placeholder="Document Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                    <input name="category" placeholder="Category (e.g. Legal, Finance)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                    <select name="file_type" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500">
                      <option value="pdf">PDF</option>
                      <option value="doc">Document</option>
                      <option value="spreadsheet">Spreadsheet</option>
                    </select>
                    <input name="download_link" placeholder="External URL (optional)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                    <div className="md:col-span-2">
                       <label className="text-xs text-slate-400 mb-2 block">Upload File (Recommended)</label>
                       <input name="file" type="file" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500 w-full" />
                    </div>
                    <textarea name="description" required placeholder="Description" rows={3} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-50">{loading ? 'Uploading...' : 'Add Document'}</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Resource Library</h3>
                  <div className="space-y-3">
                    {knowledgeBase.map(kb => (
                      <div key={kb.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/5 p-2 rounded-lg"><Library className="w-5 h-5 text-indigo-400" /></div>
                          <div><p className="text-sm font-bold text-white">{kb.title}</p><p className="text-xs text-slate-500">{kb.category} • {kb.file_type}</p></div>
                        </div>
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(kb); setEditingType('knowledge_base'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('knowledge_base', kb.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'courses' && (
              <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                {selectedCourseId ? (
                   <div className="space-y-6">
                      <button onClick={() => setSelectedCourseId(null)} className="text-orange-400 text-sm font-bold flex items-center gap-1 hover:underline"><Plus className="w-4 h-4 rotate-45" /> Back to Courses</button>
                      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-400" /> Add Module</h2>
                        <form onSubmit={handleAddModule} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <input name="title" required placeholder="Module Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                          <input name="order_index" type="number" required placeholder="Order (0, 1, 2...)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                          <select name="content_type" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500">
                             <option value="video">Video</option>
                             <option value="pdf">PDF</option>
                          </select>
                          <input name="content_url" placeholder="Direct URL (optional)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                          <div className="md:col-span-2">
                             <label className="text-xs text-slate-400 mb-2 block">Upload Content</label>
                             <input name="file" type="file" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-orange-500 w-full" />
                          </div>
                          <textarea name="description" required placeholder="Short Description" rows={2} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500 md:col-span-2 resize-none" />
                          <div className="md:col-span-2 flex justify-end"><button type="submit" disabled={loading} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-50">{loading ? 'Uploading...' : 'Add Module'}</button></div>
                        </form>
                      </div>
                      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4">Course Modules</h3>
                        <div className="space-y-3">
                           {modules.length === 0 && <p className="text-slate-500 text-sm text-center py-4">No modules uploaded yet.</p>}
                           {modules.map(mod => (
                              <div key={mod.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                                 <div className="flex items-center gap-3">
                                    <div className="text-orange-400 font-bold">#{mod.order_index}</div>
                                    <div><p className="text-sm font-bold text-white">{mod.title}</p><p className="text-xs text-slate-500">{mod.content_type}</p></div>
                                 </div>
                                 <button onClick={() => handleDelete('course_modules', mod.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           ))}
                        </div>
                      </div>
                   </div>
                ) : (
                   <div className="space-y-6">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-orange-400" /> Add New Course</h2>
                      <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input name="title" required placeholder="Course Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="mentor" required placeholder="Mentor Name" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="image_url" type="url" required placeholder="Image URL" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="enroll_link" type="url" required placeholder="Enroll Link" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="actual_price" type="number" required placeholder="Actual Price" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <input name="discounted_price" type="number" required placeholder="Discounted Price" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500" />
                        <textarea name="description" required placeholder="Course Description" rows={3} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500 md:col-span-2 resize-none" />
                        <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Add Course</button></div>
                      </form>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                      <h3 className="text-white font-bold mb-4">Existing Courses</h3>
                      <div className="space-y-3">
                        {courses.map(course => (
                          <div key={course.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                              <img src={course.image_url} className="w-10 h-10 rounded-lg object-cover" />
                              <div><p className="text-sm font-bold text-white">{course.title}</p><p className="text-xs text-slate-500">{course.mentor}</p></div>
                            </div>
                            <div className="flex items-center gap-2">
                               <button onClick={() => fetchModules(course.id)} className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-lg border border-orange-500/20 hover:bg-orange-500/20">Manage Modules</button>
                               <button onClick={() => { setEditingItem(course); setEditingType('courses'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('courses', course.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'careers' && (
              <motion.div key="careers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-yellow-400" /> Post New Job</h2>
                  <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="title" required placeholder="Job Title" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="role" required placeholder="Department (e.g. Engineering)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="location" required placeholder="Location" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="mode" required placeholder="Mode (Full-Time / Remote)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="stipend" required placeholder="Salary / Stipend Range" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <input name="work_duration" required placeholder="Duration" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500" />
                    <textarea name="description" required placeholder="Job Description" rows={2} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500 md:col-span-2 resize-none" />
                    <textarea name="qualification" required placeholder="Qualifications" rows={2} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-yellow-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Post Job</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Active Postings</h3>
                  <div className="space-y-3">
                    {jobs.map(job => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-6 h-6 text-yellow-500" />
                          <div><p className="text-sm font-bold text-white">{job.title}</p><p className="text-xs text-slate-500">{job.location} · {job.role}</p></div>
                        </div>
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(job); setEditingType('job_postings'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('job_postings', job.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'stories' && (
              <motion.div key="stories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-5 h-5 text-purple-400" /> Add Success Story</h2>
                  <form onSubmit={handleAddStory} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input name="founder_name" required placeholder="Founder Name" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="startup_name" required placeholder="Startup Name" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="niche" required placeholder="Niche (AI / E-commerce / SaaS)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="metric" required placeholder="Metric (e.g. 50k+)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="avatar_url" type="url" required placeholder="Avatar URL" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <input name="media_url" type="url" required placeholder="Media URL (Image/Video)" className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500" />
                    <textarea name="summary" required placeholder="Founder Summary" rows={3} className="bg-[#111] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 md:col-span-2 resize-none" />
                    <div className="md:col-span-2 flex justify-end"><button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold text-sm">Add Story</button></div>
                  </form>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Success Stories</h3>
                  <div className="space-y-3">
                    {stories.map(story => (
                      <div key={story.id} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <img src={story.avatar_url} className="w-10 h-10 rounded-full object-cover" />
                          <div><p className="text-sm font-bold text-white">{story.founder_name}</p><p className="text-xs text-slate-500">{story.startup_name}</p></div>
                        </div>
                        <div className="flex items-center gap-2"><button onClick={() => { setEditingItem(story); setEditingType('success_stories'); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Edit3 className="w-4 h-4" /> Edit</button><button onClick={() => handleDelete('success_stories', story.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-xs shadow-sm"><Trash2 className="w-4 h-4" /> Delete</button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div key="pricing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" /> Pricing Plans Editor</h2>
                  <p className="text-xs text-slate-500 mb-6">Changes here reflect live on the homepage. Fields save individually on blur.</p>
                  <div className="space-y-8">
                    {pricingPlans.map(plan => (
                      <div key={plan.id} className="border border-white/8 rounded-xl p-6 bg-[#111] space-y-5">
                        {/* Header row */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${plan.is_highlighted ? 'bg-orange-500' : 'bg-white/20'}`} />
                            <span className="text-sm font-bold text-white uppercase tracking-wider">{plan.plan_key}</span>
                            {plan.badge && <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/50 font-bold uppercase tracking-wider">{plan.badge}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleTogglePricingHighlight(plan.id, plan.is_highlighted)}
                              className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                                plan.is_highlighted
                                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                              }`}
                            >
                              {plan.is_highlighted ? '★ Highlighted' : 'Set as Highlight'}
                            </button>
                            <button onClick={() => handleDelete('pricing_plans', plan.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Editable fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                            <input
                              defaultValue={plan.title}
                              onBlur={e => handleUpdatePricing(plan.id, 'title', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Subtitle</label>
                            <input
                              defaultValue={plan.subtitle}
                              onBlur={e => handleUpdatePricing(plan.id, 'subtitle', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Price (e.g. ₹4,999 or Custom)</label>
                            <input
                              defaultValue={plan.price}
                              onBlur={e => handleUpdatePricing(plan.id, 'price', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Price Period (e.g. /year)</label>
                            <input
                              defaultValue={plan.price_period}
                              onBlur={e => handleUpdatePricing(plan.id, 'price_period', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Badge Text (optional)</label>
                            <input
                              defaultValue={plan.badge || ''}
                              onBlur={e => handleUpdatePricing(plan.id, 'badge', e.target.value || null)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">CTA Button Label</label>
                            <input
                              defaultValue={plan.cta_label}
                              onBlur={e => handleUpdatePricing(plan.id, 'cta_label', e.target.value)}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Features (JSON Array)</label>
                            <textarea
                              defaultValue={JSON.stringify(typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features, null, 2)}
                              onBlur={e => handleUpdatePricing(plan.id, 'features', e.target.value)}
                              rows={6}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono outline-none focus:border-emerald-500 resize-none"
                            />
                            <p className="text-[10px] text-slate-600 mt-1">Edit as a JSON array. Each string becomes a feature bullet.</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pricingPlans.length === 0 && (
                    <div className="text-center py-12 text-slate-600">
                      <DollarSign className="w-8 h-8 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No pricing plans found. Run the SQL schema in Supabase first.</p>
                      <code className="text-xs text-emerald-600 mt-2 block">supabase_pricing_schema.sql</code>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                  <div className="border-b border-white/10 px-6 py-5 bg-[#0e0e0e] flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Job Applications</h2>
                      <p className="text-xs text-slate-500">{applications.length} submissions</p>
                    </div>
                    <button onClick={fetchContent} className="p-2 text-slate-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    {applications.map(app => (
                      <div key={app.id} className="bg-[#111] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">{app.full_name ? app.full_name[0] : 'U'}</div>
                          <div><p className="text-sm font-bold text-white">{app.full_name}</p><p className="text-xs text-slate-500">{app.job_postings?.title || 'Unknown Role'} · {app.experience}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select value={app.status || 'pending'} onChange={e => updateAppStatus(app.id, e.target.value)} className="bg-black/40 text-xs border border-white/10 rounded-lg px-2 py-1 outline-none text-white">
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          <button onClick={() => downloadPDF(app)} className="p-2 bg-white/5 rounded-lg hover:text-white"><Download className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}


function EditModal({ item, type, onClose, onSave }: any) {
  const [formData, setFormData] = useState(item);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white capitalize">Edit {type.replace('_', ' ')}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form id="editForm" onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((key) => {
              if (key === 'id' || key === 'created_at') return null;
              if (key === 'description' || key === 'summary' || key === 'qualification') {
                return (
                  <div key={key}>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{key.replace('_', ' ')}</label>
                    <textarea name={key} value={formData[key] || ''} onChange={handleChange} rows={4} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none resize-none" />
                  </div>
                );
              }
              if (Array.isArray(formData[key]) || typeof formData[key] === 'object') {
                 return null;
              }
              return (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{key.replace('_', ' ')}</label>
                  <input name={key} type={typeof formData[key] === 'number' ? 'number' : 'text'} value={formData[key] || ''} onChange={handleChange} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                </div>
              );
            })}
          </form>
        </div>
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button type="submit" form="editForm" className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}
