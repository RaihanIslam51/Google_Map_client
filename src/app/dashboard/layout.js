'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { Map } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { loading, token } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Persist collapse state across page navigations
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) setSidebarCollapsed(saved === 'true');
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  if (!mounted || loading) {
    return (
      <div 
        className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]"
        suppressHydrationWarning
      >
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-4" suppressHydrationWarning>
          <Map className="w-8 h-8 text-indigo-600 animate-pulse" />
        </div>
        <p className="text-sm font-medium tracking-wide text-slate-500 animate-pulse" suppressHydrationWarning>
          Loading dashboard...
        </p>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800" suppressHydrationWarning>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        collapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]" suppressHydrationWarning>
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 p-3 sm:p-5 lg:p-8 overflow-y-auto bg-[#F8FAFC]" suppressHydrationWarning>
          {children}
        </main>
      </div>
    </div>
  );
}
