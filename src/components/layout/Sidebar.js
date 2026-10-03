'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Database, ShoppingBag,
  MessageSquare, FileText, Settings, Send, Cpu, Users,
  AlertCircle, LogOut, Compass, MapPin, X, ChevronLeft, ChevronRight
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

export default function Sidebar({ mobileOpen = false, onClose = () => {}, collapsed = false }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const SidebarInner = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* BRAND Header */}
      <div
        className={`pt-2 pb-5 border-b border-slate-100 mb-3 flex items-center transition-all duration-300 ${
          collapsed && !isMobile ? 'px-2 justify-center' : 'px-3 justify-between'
        }`}
      >
        <div className={`flex items-center gap-3 min-w-0 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          {/* Brand text — hidden when collapsed on desktop */}
          {(!collapsed || isMobile) && (
            <div className="overflow-hidden">
              <h2 className="text-base font-black text-slate-900 tracking-tight leading-none whitespace-nowrap">MapPulse</h2>
              <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-widest mt-1 whitespace-nowrap">B2B LEAD ENGINE</p>
            </div>
          )}
        </div>

        {/* Mobile close icon */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* MENU Label — hidden when collapsed */}
      {(!collapsed || isMobile) && (
        <div className="px-3 py-1">
          <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase">
            NAVIGATION MENU
          </span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className={`flex-1 space-y-1 overflow-y-auto ${collapsed && !isMobile ? 'px-1' : 'pr-1'}`}>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return collapsed && !isMobile ? (
            /* Collapsed mode — icon only with tooltip */
            <div key={item.href} className="relative group flex justify-center">
              <Link
                href={item.href}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#EEF0FA] text-[#4F46E5]'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
              </Link>
              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0">
                  <div className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                    {item.label}
                    {/* Arrow */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Expanded mode — icon + label */
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onClose : undefined}
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#EEF0FA] text-[#4F46E5] font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-4 mt-auto">
        {collapsed && !isMobile ? (
          <div className="relative group flex justify-center">
            <button
              onClick={logout}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FFF0F0] border border-rose-100 text-rose-500 hover:bg-rose-100/80 transition-all"
            >
              <LogOut className="w-5 h-5 shrink-0" />
            </button>
            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-150 translate-x-1 group-hover:translate-x-0">
                <div className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                  Logout
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FFF0F0] border border-rose-100 text-rose-600 text-sm font-semibold hover:bg-rose-100/80 transition-all group"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — width animates between collapsed (72px) and expanded (256px) */}
      <aside
        className={`hidden lg:flex shrink-0 flex-col bg-white border-r border-slate-200/80 min-h-screen p-3 text-slate-700 transition-all duration-300 ease-in-out overflow-hidden ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarInner isMobile={false} />
      </aside>

      {/* Mobile Overlay & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white flex flex-col h-full p-4 text-slate-700 shadow-2xl z-10 overflow-y-auto">
            <SidebarInner isMobile={true} />
          </aside>
        </div>
      )}
    </>
  );
}
