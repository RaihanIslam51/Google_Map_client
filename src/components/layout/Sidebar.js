'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Database, ShoppingBag,
  MessageSquare, FileText, Settings, Send, Cpu, Users,
  AlertCircle, LogOut, Compass, MapPin, X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MENU_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/discovery', icon: Compass, label: 'Discovery Engine' },
  { href: '/dashboard/businesses', icon: Database, label: 'Leads CRM' },
  { href: '/dashboard/target-leads', icon: ShoppingBag, label: 'Target Leads' },
  { href: '/dashboard/whatsapp-templates', icon: MessageSquare, label: 'WhatsApp Templates' },
  { href: '/dashboard/email-templates', icon: FileText, label: 'Email Templates' },
  { href: '/dashboard/settings', icon: Settings, label: 'Platform Settings' },
  { href: '/dashboard/send-mail', icon: Send, label: 'Send Mail' },
  { href: '/dashboard/websites', icon: Cpu, label: 'Website Scanner' },
  { href: '/dashboard/users', icon: Users, label: 'Users' },
  { href: '/dashboard/control-panel', icon: AlertCircle, label: 'Control Panel' },
];

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const SidebarInner = () => (
    <div className="flex flex-col h-full">
      {/* BRAND Header */}
      <div className="px-3 pt-2 pb-5 border-b border-slate-100 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight leading-none">MapPulse</h2>
            <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest mt-1">B2B LEAD ENGINE</p>
          </div>
        </div>
        {/* Mobile close icon */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* MENU Header */}
      <div className="px-3 py-1">
        <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">
          NAVIGATION MENU
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#EEF0FA] text-[#4F46E5] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-4 mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FFF0F0] border border-rose-100 text-rose-600 text-sm font-semibold hover:bg-rose-100/80 transition-all group"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200/80 min-h-screen p-4 text-slate-700">
        <SidebarInner />
      </aside>

      {/* Mobile Overlay & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white flex flex-col h-full p-4 text-slate-700 shadow-2xl z-10 overflow-y-auto">
            <SidebarInner />
          </aside>
        </div>
      )}
    </>
  );
}
