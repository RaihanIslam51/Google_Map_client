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
        className="flex flex-col items-center justify-center min-h-screen bg-slate-50"
        suppressHydrationWarning
      >
        <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/25 mb-4" suppressHydrationWarning>
          <Map className="w-5 h-5 text-white animate-pulse" />
        </div>
        <p className="text-sm font-medium text-slate-500" suppressHydrationWarning>
          Loading your workspace…
        </p>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800" suppressHydrationWarning>
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        collapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50" suppressHydrationWarning>
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          onToggleSidebar={handleToggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50" suppressHydrationWarning>
          {children}
        </main>
      </div>
    </div>
  );
}
