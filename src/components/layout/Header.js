'use client';

// components/layout/Header.js
import { useState } from 'react';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, Search, User, ChevronRight, X, Plus, Menu, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

const BREADCRUMBS = {
  '/dashboard': [{ label: 'Overview' }],
  '/dashboard/discovery': [{ label: 'Overview', href: '/dashboard' }, { label: 'Discovery Engine' }],
  '/dashboard/businesses': [{ label: 'Overview', href: '/dashboard' }, { label: 'Leads CRM' }],
  '/dashboard/target-leads': [{ label: 'Overview', href: '/dashboard' }, { label: 'Target Leads HQ' }],
  '/dashboard/whatsapp-templates': [{ label: 'Overview', href: '/dashboard' }, { label: 'WhatsApp Templates' }],
  '/dashboard/email-templates': [{ label: 'Overview', href: '/dashboard' }, { label: 'Email Templates' }],
  '/dashboard/send-mail': [{ label: 'Overview', href: '/dashboard' }, { label: 'Email Dispatcher' }],
  '/dashboard/websites': [{ label: 'Overview', href: '/dashboard' }, { label: 'Website Scanner' }],
  '/dashboard/users': [{ label: 'Overview', href: '/dashboard' }, { label: 'User Management' }],
  '/dashboard/control-panel': [{ label: 'Overview', href: '/dashboard' }, { label: 'System Control' }],
  '/dashboard/settings': [{ label: 'Overview', href: '/dashboard' }, { label: 'Settings' }],
};

const PAGE_TITLES = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/discovery': 'Discovery Engine',
  '/dashboard/businesses': 'Leads CRM',
  '/dashboard/target-leads': 'Target Leads HQ',
  '/dashboard/whatsapp-templates': 'WhatsApp Messaging Templates',
  '/dashboard/email-templates': 'Email Templates',
  '/dashboard/send-mail': 'Email Dispatcher',
  '/dashboard/websites': 'Website Scanner',
  '/dashboard/users': 'User Management',
  '/dashboard/control-panel': 'System Control Panel',
  '/dashboard/settings': 'Settings',
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Scraping completed', description: 'Restaurant Dinajpur finished (94 records)', time: '2m ago', read: false },
  { id: 2, title: 'Export ready', description: 'Your CSV export is ready to download', time: '15m ago', read: false },
  { id: 3, title: 'Scraping failed', description: 'Pharmacy Dinajpur encountered an error', time: '1h ago', read: true },
];

export default function Header({ onToggleMobileMenu = () => {} }) {
  const [isReloading, setIsReloading] = React.useState(false);
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);

  const baseRoute = Object.keys(PAGE_TITLES)
    .filter(k => pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0] || '/dashboard';

  const title = PAGE_TITLES[baseRoute] || 'Dashboard';
  const breadcrumbs = BREADCRUMBS[baseRoute] || [{ label: 'Dashboard', href: '/dashboard' }];
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 flex items-center px-4 sm:px-6 gap-3 sticky top-0 z-30">
      {/* Left — Hamburger + Title / Breadcrumb */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap no-scrollbar">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-1.5 shrink-0">
                {bc.href ? (
                  <Link href={bc.href} className="hover:text-slate-800 transition-colors font-medium">{bc.label}</Link>
                ) : (
                  <span className="text-slate-700 font-semibold">{bc.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3 text-slate-400" />}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hard Reload Button */}
      <button
        id="hard-reload-btn"
        onClick={() => {
          setIsReloading(true);
          setTimeout(() => {
            window.location.href = window.location.href;
          }, 300);
        }}
        title="Hard Reload — Full project refresh"
        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 shrink-0
          ${
            isReloading
              ? 'bg-indigo-600 text-white border-indigo-600 scale-95'
              : 'bg-white text-slate-600 border-slate-200/80 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 hover:shadow-sm'
          }`}
      >
        <RotateCcw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
        <span>{isReloading ? 'Reloading...' : 'Hard Reload'}</span>
      </button>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-10 z-20 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-800">Notifications</p>
                  <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {MOCK_NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`px-4 py-3 ${!n.read ? 'bg-indigo-50/50' : ''}`}>
                      <div className="flex items-start gap-3">
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />}
                        <div className={!n.read ? '' : 'pl-4'}>
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.description}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Extract Link */}
        <Link
          href="/dashboard/discovery"
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200"
        >
          <Plus className="w-3.5 h-3.5" />
          Quick Extract
        </Link>
      </div>
    </header>
  );
}
