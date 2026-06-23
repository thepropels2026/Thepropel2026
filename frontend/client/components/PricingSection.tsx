"use client";
import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type PricingPlan = {
  id: string;
  plan_key: string;
  title: string;
  subtitle: string;
  price: string;
  price_period: string;
  badge: string | null;
  badge_color: string;
  features: string[];
  cta_label: string;
  cta_link: string;
  is_highlighted: boolean;
  sort_order: number;
};

// Fallback data when Supabase is not seeded yet
const FALLBACK_PLANS: PricingPlan[] = [
  {
    id: '1',
    plan_key: 'individual',
    title: 'The Propels for Individual',
    subtitle: 'For solo founders & students ready to build',
    price: '₹4,999',
    price_period: '/year',
    badge: null,
    badge_color: 'slate',
    features: [
      '1-on-1 Mentor Sessions (4/month)',
      'AI Idea Evaluator Access',
      'Market Research Toolkit',
      'Startup Modules Library (250+)',
      'Investor Network Directory',
      'Community Forum Access',
      'Email Support',
    ],
    cta_label: 'Start Building',
    cta_link: '/register',
    is_highlighted: false,
    sort_order: 1,
  },
  {
    id: '2',
    plan_key: 'teams',
    title: 'The Propels for Teams',
    subtitle: 'For early-stage startups & founding teams',
    price: '₹14,999',
    price_period: '/year',
    badge: 'Most Popular',
    badge_color: 'orange',
    features: [
      'Everything in Individual',
      'Up to 5 Team Members',
      'Group Mentor Sessions (8/month)',
      'Priority Investor Introductions',
      'Demo Day Access',
      'Legal & HR Network Access',
      'Dedicated Success Manager',
      'Slack Community Access',
    ],
    cta_label: 'Scale Your Team',
    cta_link: '/register',
    is_highlighted: true,
    sort_order: 2,
  },
  {
    id: '3',
    plan_key: 'campus',
    title: 'The Propels for Campus',
    subtitle: 'For colleges & institutional partnerships',
    price: 'Custom',
    price_period: 'contact us',
    badge: 'For Institutions',
    badge_color: 'slate',
    features: [
      'Everything in Teams',
      'Unlimited Student Licenses',
      'Campus Entrepreneurship Cell Setup',
      'Curriculum Integration Support',
      'Annual Hackathon Sponsorship',
      'Guest Lecture Series',
      'Placement & Funding Pipeline',
      'White-label Portal',
    ],
    cta_label: 'Contact Us',
    cta_link: 'mailto:support@thepropels.com',
    is_highlighted: false,
    sort_order: 3,
  },
];

export default function PricingSection() {
  const { setRegisterModalOpen } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const { data, error } = await supabase
          .from('pricing_plans')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          // Parse JSON features if they came back as string
          const parsed = data.map((p: any) => {
            let featuresList: string[] = [];
            if (Array.isArray(p.features)) {
              featuresList = p.features;
            } else if (typeof p.features === 'string') {
              const str = p.features.trim();
              if (str.startsWith('[') && str.endsWith(']')) {
                try {
                  featuresList = JSON.parse(str);
                } catch {
                  featuresList = str.split(',').map((s: string) => s.trim().replace(/^["']|["']$/g, ''));
                }
              } else if (str.startsWith('{') && str.endsWith('}')) {
                // PostgreSQL text[] array format: {"feature 1", "feature 2"}
                featuresList = str
                  .slice(1, -1)
                  .split(',')
                  .map((s: string) => s.trim().replace(/^["']|["']$/g, ''))
                  .filter(Boolean);
              } else {
                featuresList = str.split('\n').map((s: string) => s.trim()).filter(Boolean);
              }
            }
            return {
              ...p,
              features: featuresList,
            };
          });
          setPlans(parsed);
        }
      } catch (err: any) {
        console.error("Error fetching pricing plans from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleCTA = (plan: PricingPlan) => {
    if (plan.cta_label.toLowerCase() === 'contact us') {
      window.location.href = 'mailto:support@thepropels.com';
    } else if (plan.cta_link.startsWith('mailto:')) {
      window.location.href = plan.cta_link;
    } else {
      setRegisterModalOpen(true);
    }
  };

  return (
    <section className="py-20 lg:py-32 px-6 lg:px-24 bg-[#0c0c0e]">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded text-[10px] font-bold tracking-[2px] text-white/40 uppercase mb-6">
            <Sparkles className="w-3 h-3" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl lg:text-4xl font-montserrat font-black text-white tracking-tight mb-4">
            One Platform.<br />
            <span className="text-[#FF5F00] drop-shadow-[0_0_15px_rgba(255,95,0,0.4)]">Every Stage of Your Journey.</span>
          </h2>
          <p className="text-white/50 font-inter max-w-xl mx-auto leading-relaxed">
            Whether you're a solo founder, a founding team, or an institution — we have a plan built precisely for you.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[600px] rounded-lg bg-white/[0.03] border border-white/8 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} onCTA={handleCTA} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

function PricingCard({ plan, onCTA }: { plan: PricingPlan; onCTA: (p: PricingPlan) => void }) {
  const highlighted = plan.is_highlighted;

  return (
    <div
      className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
        highlighted
          ? 'bg-[#FF5F00] border border-[#FF5F00]/80 shadow-[0_0_60px_-10px_rgba(255,95,0,0.5)] scale-[1.02] z-10'
          : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] hover:border-white/20'
      }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div
          className={`absolute top-5 right-5 px-3 py-1 rounded text-[9px] font-black uppercase tracking-[0.15em] border ${
            plan.badge_color === 'orange'
              ? 'bg-[#FF5F00] text-white border-[#FF5F00]/20'
              : plan.badge_color === 'indigo'
              ? 'bg-indigo-600 text-white border-indigo-600/20 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
              : plan.badge_color === 'emerald'
              ? 'bg-emerald-600 text-white border-emerald-600/20'
              : highlighted
              ? 'bg-black/20 text-white/80 border-white/10'
              : 'bg-white/8 border-white/15 text-white/50'
          }`}
        >
          {plan.badge}
        </div>
      )}

      {/* Card Header */}
      <div className={`p-8 pb-6 border-b ${highlighted ? 'border-white/20' : 'border-white/8'}`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${highlighted ? 'text-white/70' : 'text-white/35'}`}>
          {plan.plan_key === 'individual' ? 'Solo' : plan.plan_key === 'teams' ? 'Startup' : 'Institution'}
        </p>

        <h3 className={`font-montserrat font-black text-xl leading-snug mb-2 pr-16 ${highlighted ? 'text-white' : 'text-white'}`}>
          {plan.title}
        </h3>

        <p className={`text-sm leading-relaxed mb-6 ${highlighted ? 'text-white/80' : 'text-white/40'}`}>
          {plan.subtitle}
        </p>

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className={`font-inter font-black text-5xl tracking-tight ${highlighted ? 'text-white' : 'text-white'}`}>
            {plan.price}
          </span>
          {plan.price !== 'Custom' && (
            <span className={`text-sm font-bold mb-2 ${highlighted ? 'text-white/60' : 'text-white/30'}`}>
              {plan.price_period}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onCTA(plan)}
          className={`mt-6 w-full py-3.5 rounded-md font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-150 ${
            highlighted
              ? 'bg-white text-[#FF5F00] hover:bg-white/90'
              : 'bg-white/8 border border-white/15 text-white/80 hover:bg-white/12 hover:border-white/25'
          }`}
        >
          {plan.cta_label}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Features List */}
      <div className="p-8 flex flex-col gap-4 flex-1">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${highlighted ? 'text-white/60' : 'text-white/25'}`}>
          What's included
        </p>
        <ul className="space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                highlighted ? 'bg-white/20' : 'bg-white/8'
              }`}>
                <Check className={`w-2.5 h-2.5 ${highlighted ? 'text-white' : 'text-white/50'}`} />
              </div>
              <span className={`text-sm leading-relaxed ${
                i === 0 && plan.plan_key !== 'individual'
                  ? highlighted ? 'text-white font-bold' : 'text-white/70 font-bold'
                  : highlighted ? 'text-white/85' : 'text-white/50'
              }`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
