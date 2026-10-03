'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Map, Download, ArrowRight, Loader2, Sparkles,
  Phone, Star, Zap, Target, Layers, Play
} from 'lucide-react';

const PREVIEW_LEADS = [
  { name: 'Hotel West Valley', category: 'Hotels', phone: '01996-000080', rating: 4.8, location: 'Gulshan, Dhaka', website: 'westvalleyhotel.com' },
  { name: 'iStore Mobile Shop', category: 'Mobile Shop', phone: '01675-021815', rating: 4.9, location: 'Bashundhara, Dhaka', website: 'istorebd.com' },
  { name: 'Magpie Restaurant', category: 'Restaurants', phone: '01615-515500', rating: 4.7, location: 'Dhanmondi, Dhaka', website: 'magpierestaurant.com' },
];

const CATEGORY_TAGS = [
  { label: 'Hotels', icon: '🏨' },
  { label: 'Mobile Shop', icon: '📱' },
  { label: 'Restaurants', icon: '🍽️' },
  { label: 'Software Companies', icon: '💻' },
  { label: 'Dentists', icon: '🦷' },
  { label: 'Gym & Fitness', icon: '🏋️' },
  { label: 'Diagnostic Center', icon: '🏥' },
  { label: 'Jewelry Store', icon: '💍' },
  { label: 'Clothing Store', icon: '👗' },
  { label: 'Pharmacies', icon: '💊' },
  { label: 'Real Estate', icon: '🏢' },
  { label: 'Automobile Repair', icon: '🚗' },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]" suppressHydrationWarning>
        <Loader2 className="w-6 h-6 text-[#4F46E5] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-500/20 selection:text-indigo-700 overflow-x-hidden" suppressHydrationWarning>
      
      {/* ─── Navigation Header ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 shadow-2xs">
        <div className="mcontainer mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-[#6D28D9] to-[#4F46E5] rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
              <Map className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight block leading-none">
                MAPPULSE
              </span>
              <span className="text-[9px] sm:text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest block mt-0.5">
                B2B Lead Engine
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-[#4F46E5] transition-colors">Features</a>
            <a href="#categories" className="hover:text-[#4F46E5] transition-colors">Categories</a>
            <a href="#preview" className="hover:text-[#4F46E5] transition-colors">Live Preview</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-2.5 sm:px-3 py-2 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4.5 py-2 sm:py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] sm:text-xs text-[#4F46E5] font-extrabold mb-5 sm:mb-6 shadow-2xs max-w-full text-center">
          <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
          <span className="truncate">REAL CHROMIUM GOOGLE MAPS SCRAPER</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] max-w-4xl mx-auto">
          Extract Verified B2B Leads From Google Maps{' '}
          <span className="bg-gradient-to-r from-[#6D28D9] via-[#4F46E5] to-[#2563EB] bg-clip-text text-transparent block sm:inline">
            10x Faster
          </span>
        </h1>

        <p className="text-slate-500 text-xs sm:text-sm md:text-base font-medium max-w-2xl mx-auto mt-4 sm:mt-5 leading-relaxed px-2">
          Automate B2B lead generation across 50+ business categories. Extract direct mobile phone numbers, addresses, ratings, websites, and scores into your CRM seamlessly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-7 sm:mt-8 max-w-md sm:max-w-none mx-auto">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] hover:from-[#5B21B6] hover:to-[#4338CA] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Open Admin Dashboard</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Try Discovery Tool</span>
          </Link>
        </div>

        {/* Live Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-slate-200/80">
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xl sm:text-2xl font-black text-slate-900">2,370+</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400">Scraped B2B Leads</p>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xl sm:text-2xl font-black text-emerald-600">99.4%</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400">Phone Success</p>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xl sm:text-2xl font-black text-[#4F46E5]">50+</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400">Categories</p>
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-xl sm:text-2xl font-black text-purple-600">&lt; 2 sec</p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400">Speed / Lead</p>
          </div>
        </div>
      </section>

      {/* ─── Interactive Live Lead Preview Mockup ────────────────────────── */}
      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900">Live Extracted Leads Database Preview</h2>
            </div>
            <span className="self-start sm:self-auto bg-emerald-50 text-emerald-700 font-extrabold text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-100">
              REAL-TIME CHROMIUM SCRAPER
            </span>
          </div>

          {/* ── Mobile Card List View (< md) ───────────────────────── */}
          <div className="md:hidden space-y-3">
            {PREVIEW_LEADS.map((lead, i) => (
              <div key={i} className="bg-slate-50/60 border border-slate-100 rounded-2xl p-3.5 space-y-2 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-[#4F46E5] text-xs sm:text-sm">{lead.name}</h3>
                    <span className="inline-block mt-0.5 bg-indigo-50 text-indigo-700 font-semibold text-[10px] px-2 py-0.5 rounded-md border border-indigo-100">
                      {lead.category}
                    </span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                    Saved in CRM
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{lead.phone}</span>
                  </div>

                  <div className="font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{lead.rating}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-medium">{lead.location}</p>
              </div>
            ))}
          </div>

          {/* ── Desktop Table View (≥ md) ──────────────────────────── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="px-5 py-3">Business Name</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Phone Number</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {PREVIEW_LEADS.map((lead, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[#4F46E5]">{lead.name}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-indigo-50 text-indigo-700 font-semibold text-[10px] px-2 py-0.5 rounded-md border border-indigo-100">
                        {lead.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{lead.location}</td>
                    <td className="px-5 py-3.5 font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{lead.rating}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] px-2.5 py-0.5 rounded-full inline-block">
                        Saved in CRM
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Built for Modern B2B Lead Scraping
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 px-2">
            Everything you need to collect, organize, and outreach B2B prospects efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Map,
              title: 'Playwright Chromium Scraper',
              desc: 'Launches real headless Chromium instances to extract complete Google Maps business details without bot blocking.',
              color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
            },
            {
              icon: Layers,
              title: 'Dynamic Campaign Folders',
              desc: 'Leads CRM page automatically organizes leads into search campaign folders like Hotels, Mobile Shops, and Dentists.',
              color: 'text-purple-600 bg-purple-50 border-purple-100',
            },
            {
              icon: Phone,
              title: 'Deep Phone & Address Extraction',
              desc: 'Visits individual place detail pages automatically to recover hidden mobile phone numbers and full addresses.',
              color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
            },
            {
              icon: Target,
              title: 'Target Leads Management',
              desc: 'Bookmark high-value prospect accounts and track sales pipeline status from New to Contacted to Meeting Booked.',
              color: 'text-amber-600 bg-amber-50 border-amber-100',
            },
            {
              icon: Zap,
              title: 'WhatsApp & Email Outreach Hub',
              desc: 'Pre-loaded with 18+ B2B outreach templates in Bengali & English with 1-click variable copy for instant messaging.',
              color: 'text-blue-600 bg-blue-50 border-blue-100',
            },
            {
              icon: Download,
              title: 'One-Click CSV / JSON Export',
              desc: 'Export your extracted leads into clean CSV files with all fields structured for Microsoft Excel or CRM import.',
              color: 'text-rose-600 bg-rose-50 border-rose-100',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-2.5 text-left"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                  <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Supported Categories ────────────────────────────────────────── */}
      <section id="categories" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            50+ Industry Categories Supported
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-2 px-2">
            Target local businesses across any city or industry instantly
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
          {CATEGORY_TAGS.map((tag) => (
            <div
              key={tag.label}
              className="flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-200/80 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 shadow-2xs hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer shrink-0"
            >
              <span className="text-sm sm:text-base">{tag.icon}</span>
              <span>{tag.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="bg-gradient-to-r from-[#6D28D9] via-[#4F46E5] to-[#2563EB] rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center text-white shadow-2xl space-y-4 sm:space-y-6">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight max-w-2xl mx-auto leading-snug">
            Ready to Supercharge Your B2B Sales Pipeline?
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Launch ScrapeFlow now to extract live leads from Google Maps and start cold outreach instantly.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white hover:bg-slate-100 text-[#4F46E5] font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
            >
              <span>Launch Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/80 py-6 sm:py-8 bg-white text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <Map className="w-4 h-4 text-indigo-600" />
            <span className="text-slate-800 font-black">MAPPULSE</span>
            <span>— Google Maps B2B Lead Generator</span>
          </div>
          <p>© {new Date().getFullYear()} MapPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
