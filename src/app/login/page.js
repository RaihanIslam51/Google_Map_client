'use client';

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Cpu, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('12345');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const loginResult = await login(email, password);
    
    if (loginResult.success) {
      setSubmitting(false);
      return;
    }

    if (email === 'admin' || email === 'admin@scrapeflow.com') {
      const registerResult = await register('Admin User', email, password);
      if (registerResult.success) {
        setSubmitting(false);
        return;
      }
      setErrorMsg(registerResult.error || 'Authentication failed');
    } else {
      setErrorMsg(loginResult.error || 'Invalid credentials');
    }
    
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 text-slate-800">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-2xl border border-indigo-100 text-[#4F46E5] flex items-center justify-center mb-4">
            <Cpu className="w-6 h-6 animate-pulse text-[#4F46E5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome to ScrapeFlow
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Google Maps Scraping & Lead Aggregation Platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#F8FAFC] border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8FAFC] border border-slate-200/80 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </div>
        </form>

        <div className="text-center border-t border-slate-100 pt-5">
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-[11px] text-indigo-700 font-medium">
            💡 Default credentials: <strong>admin</strong> / <strong>12345</strong>. Click <strong>Sign In</strong> to launch immediately.
          </div>
        </div>
      </div>
    </div>
  );
}
