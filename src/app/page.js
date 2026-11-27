'use client';

import Link from 'next/link';
import {
  MapPin, ArrowRight, Check, Phone, Star, Globe, Search, Layers, Target,
  MessageSquare, Download, ShieldCheck, Zap, Database, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const PREVIEW_LEADS = [
  { name: 'Hotel West Valley', category: 'Hotels', phone: '01996-000080', rating: 4.8, location: 'Gulshan, Dhaka' },
  { name: 'iStore Mobile Shop', category: 'Mobile Shop', phone: '01675-021815', rating: 4.9, location: 'Bashundhara, Dhaka' },
  { name: 'Magpie Restaurant', category: 'Restaurants', phone: '01615-515500', rating: 4.7, location: 'Dhanmondi, Dhaka' },
  { name: 'Smile Dental Care', category: 'Dentists', phone: '01711-234567', rating: 4.6, location: 'Uttara, Dhaka' },
];

const FEATURES = [
  {
    icon: Search,
    title: 'Google Maps discovery',
    desc: 'Search any category in any city and collect businesses with names, addresses, ratings and websites.',
  },
  {
    icon: Phone,
    title: 'Phone & contact details',
    desc: 'Opens each place page to recover phone numbers and addresses that listing pages hide.',
  },
  {
    icon: Layers,
    title: 'Campaign organisation',
    desc: 'Every search becomes a campaign with its location, so leads stay grouped and easy to filter.',
  },
  {
    icon: Target,
    title: 'Target lead tracking',
    desc: 'Bookmark high-value prospects and keep your outreach pipeline in one place.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp & email outreach',
    desc: 'Ready-made Bengali and English templates with one-click personalisation.',
  },
  {
    icon: Download,
    title: 'CSV export',
    desc: 'Export clean, structured lead lists for Excel or any CRM in a single click.',
  },
];

const STEPS = [
  { n: '01', title: 'Search', desc: 'Enter a business category and a location to start a campaign.' },
  { n: '02', title: 'Extract', desc: 'MapPulse collects and enriches every matching business automatically.' },
  { n: '03', title: 'Reach out', desc: 'Filter your leads, message them on WhatsApp or email, and export when ready.' },
];

const CATEGORIES = [
  'Hotels', 'Restaurants', 'Mobile Shops', 'Software Companies', 'Dentists', 'Gyms & Fitness',
  'Diagnostic Centers', 'Jewelry Stores', 'Clothing Stores', 'Pharmacies', 'Real Estate', 'Auto Repair',
  'Schools', 'Interior Design',
];

function Logo({ className = '' }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`} aria-label="MapPulse home">
      <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/30">
        <MapPin className="w-4 h-4 text-white" />
      </span>
      <span className="text-[15px] font-bold text-slate-900 tracking-tight">MapPulse</span>
    </Link>
  );
}

export default function HomePage() {
  const { token } = useAuth();
  const primaryHref = token ? '/dashboard' : '/register';
  const primaryLabel = token ? 'Open dashboard' : 'Get started';

  return (
    <div className="min-h-screen bg-white text-slate-700 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto h-16 px-5 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500" aria-label="Primary">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#categories" className="hover:text-slate-900 transition-colors">Categories</a>
          </nav>

          <div className="flex items-center gap-2">
            {!token && (
              <Link href="/login" id="nav-signin"
                className="hidden sm:inline-flex px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Sign in
              </Link>
            )}
            <Link href={primaryHref} id="nav-cta"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors">
              {primaryLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.14),transparent_70%)]" />
          <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.35] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

          <div className="max-w-6xl mx-auto px-5 pt-16 sm:pt-24 pb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 bg-white text-xs font-semibold text-indigo-700 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              B2B lead generation from Google Maps
            </div>

            <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] max-w-3xl mx-auto">
              Find local business leads,{' '}
              <span className="text-indigo-600">without the busywork</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              MapPulse collects phone numbers, addresses, ratings and websites from Google Maps,
              organises them into campaigns, and helps you reach out — all in one workspace.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={primaryHref} id="hero-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5">
                {primaryLabel}
                <ArrowRight className="w-4 h-4" />
              </Link>
              {!token && (
                <Link href="/login" id="hero-signin"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold transition-colors">
                  Sign in
                </Link>
              )}
            </div>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              {['Approval-based secure access', 'No credit card needed', 'Export to CSV anytime'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Product preview */}
          <div className="max-w-5xl mx-auto px-5 pb-20">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
              {/* window bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                <span className="ml-3 text-[11px] font-medium text-slate-400">Leads CRM</span>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* campaign cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { l: 'All Campaigns', loc: 'All locations', v: '1,851', active: true },
                    { l: 'Schools', loc: 'Dhaka', v: '610' },
                    { l: 'Restaurants', loc: 'Chittagong', v: '499' },
                    { l: 'Interior design', loc: 'Uttara', v: '497' },
                  ].map((c) => (
                    <div key={c.l}
                      className={`rounded-xl p-3.5 text-left border ${
                        c.active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200'
                      }`}>
                      <p className={`text-xs font-bold ${c.active ? 'text-white' : 'text-slate-800'}`}>{c.l}</p>
                      <p className={`mt-0.5 flex items-center gap-1 text-[10.5px] font-medium ${c.active ? 'text-indigo-200' : 'text-indigo-600'}`}>
                        <MapPin className="w-3 h-3" /> {c.loc}
                      </p>
                      <p className={`mt-2 text-xl font-extrabold ${c.active ? 'text-white' : 'text-slate-900'}`}>{c.v}</p>
                    </div>
                  ))}
                </div>

                {/* table (desktop) */}
                <div className="hidden md:block rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-wider">
                        <th className="px-4 py-2.5 font-bold">Business</th>
                        <th className="px-4 py-2.5 font-bold">Category</th>
                        <th className="px-4 py-2.5 font-bold">Phone</th>
                        <th className="px-4 py-2.5 font-bold">Location</th>
                        <th className="px-4 py-2.5 font-bold">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {PREVIEW_LEADS.map((l) => (
                        <tr key={l.name} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900">{l.name}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-[10px]">{l.category}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{l.phone}</td>
                          <td className="px-4 py-3 text-slate-500">{l.location}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400" /> {l.rating}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* list (mobile) */}
                <div className="md:hidden space-y-2.5">
                  {PREVIEW_LEADS.slice(0, 3).map((l) => (
                    <div key={l.name} className="rounded-xl border border-slate-100 p-3 text-left">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{l.name}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400" /> {l.rating}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{l.phone} · {l.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ─────────────────────────────────────── */}
        <section aria-label="Highlights" className="border-y border-slate-100 bg-slate-50/60">
          <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Database, v: '50+', l: 'Business categories' },
              { icon: Phone, v: 'Direct', l: 'Phone number extraction' },
              { icon: MapPin, v: 'Any city', l: 'Location-based campaigns' },
              { icon: ShieldCheck, v: 'Admin approved', l: 'Secure team access' },
            ].map(({ icon: Icon, v, l }) => (
              <div key={l} className="flex flex-col items-center gap-1.5">
                <Icon className="w-5 h-5 text-indigo-500" />
                <p className="text-lg font-bold text-slate-900">{v}</p>
                <p className="text-xs font-medium text-slate-500">{l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ────────────────────────────────────────── */}
        <section id="features" className="max-w-6xl mx-auto px-5 py-20 sm:py-28 scroll-mt-16">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-indigo-600">Features</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to turn maps into pipeline
            </h2>
            <p className="mt-3 text-slate-500 leading-relaxed">
              A focused toolset for collecting, organising and contacting local businesses — nothing you don&apos;t need.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
                <span className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────── */}
        <section id="how-it-works" className="bg-slate-50/70 border-y border-slate-100 scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 py-20 sm:py-28">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-sm font-bold text-indigo-600">How it works</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                From search to outreach in three steps
              </h2>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-5">
              {STEPS.map((s, i) => (
                <div key={s.n} className="relative rounded-2xl bg-white border border-slate-200 p-6">
                  <span className="text-sm font-bold text-indigo-600">{s.n}</span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                  {i < STEPS.length - 1 && (
                    <ChevronRight className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 w-6 h-6 text-slate-300 bg-slate-50 rounded-full z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ──────────────────────────────────────── */}
        <section id="categories" className="max-w-4xl mx-auto px-5 py-20 sm:py-28 text-center scroll-mt-16">
          <p className="text-sm font-bold text-indigo-600">Categories</p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Target any local industry
          </h2>
          <p className="mt-3 text-slate-500">From hotels to dentists — if it&apos;s on Google Maps, you can reach it.</p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {CATEGORIES.map((c) => (
              <span key={c}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50/50 transition-colors cursor-default">
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-5 pb-20 sm:pb-28">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 sm:py-16 text-center">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(99,102,241,0.45),transparent_70%)]" />
            <div className="relative">
              <Zap className="w-6 h-6 text-indigo-300 mx-auto" />
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-xl mx-auto">
                Ready to fill your pipeline?
              </h2>
              <p className="mt-3 text-slate-300 max-w-md mx-auto">
                Request access today. Once a super admin approves your account, you&apos;re ready to start collecting leads.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href={primaryHref} id="cta-primary"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold transition-colors">
                  {primaryLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {!token && (
                  <Link href="/login" id="cta-signin"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-white text-sm font-semibold transition-colors">
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <Logo />
          <p>© {new Date().getFullYear()} MapPulse. All rights reserved.</p>
          <div className="flex items-center gap-5 font-medium">
            <Link href="/login" className="hover:text-slate-900 transition-colors">Sign in</Link>
            <Link href="/register" className="hover:text-slate-900 transition-colors">Request access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
