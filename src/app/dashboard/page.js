'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Database, Target, PhoneCall, Globe, Users,
  BarChart3, Sparkles, Building2, ExternalLink
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { analyticsApi } from '../../lib/api/analytics';

export default function LightDashboardPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-real-stats'],
    queryFn: () => analyticsApi.getDashboardStats(),
    refetchInterval: 10000, // auto refresh real-time metrics every 10s
  });

  const stats = statsData?.data || {};
  const totalLeads = Number(stats.totalLeads || 0);
  const targetCount = Number(stats.targetCount || 0);
  const hasPhoneCount = Number(stats.hasPhoneCount || 0);
  const hasWebsiteCount = Number(stats.hasWebsiteCount || 0);
  const noWebsiteCount = Number(stats.noWebsiteCount || 0);

  const targetPercent = totalLeads > 0 ? Math.round((targetCount / totalLeads) * 100) : 0;
  const phonePercent = totalLeads > 0 ? Math.round((hasPhoneCount / totalLeads) * 100) : 0;
  const websitePercent = totalLeads > 0 ? Math.round((hasWebsiteCount / totalLeads) * 100) : 0;

  const activityData = Array.isArray(stats.activity) && stats.activity.length > 0
    ? stats.activity
    : [
        { date: 'Day 1', contacted: 0, scraped: 0 },
        { date: 'Day 2', contacted: 0, scraped: 0 },
        { date: 'Day 3', contacted: 0, scraped: 0 },
        { date: 'Day 4', contacted: 0, scraped: 0 },
        { date: 'Day 5', contacted: 0, scraped: 0 },
        { date: 'Day 6', contacted: 0, scraped: 0 },
        { date: 'Today', contacted: targetCount, scraped: totalLeads },
      ];

  const maxScrapedValue = Math.max(10, ...activityData.map(a => Number(a.scraped || 0)));

  return (
    <div className="space-y-4 sm:space-y-6 container mx-auto py-1 sm:py-2 text-slate-800">
      {/* ─── Top 4 Metric Cards Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: TOTAL LEADS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">TOTAL LEADS</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{totalLeads.toLocaleString()}</p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">All Real Scraped Database</p>
          </div>
          <div className="w-11 h-11 sm:w-13 sm:h-13 bg-[#4F46E5] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Database className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Card 2: TARGET LEADS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">TARGET LEADS</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{targetCount.toLocaleString()}</p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">{targetPercent}% of total database</p>
          </div>
          <div className="w-11 h-11 sm:w-13 sm:h-13 bg-[#6366F1] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Target className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Card 3: PHONE NUMBER READY */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">WHATSAPP / PHONE READY</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{hasPhoneCount.toLocaleString()}</p>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">{phonePercent}% phone coverage</p>
          </div>
          <div className="w-11 h-11 sm:w-13 sm:h-13 bg-[#10B981] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Card 4: NO WEBSITE PROSPECTS */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">NO WEBSITE PROSPECTS</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{noWebsiteCount.toLocaleString()}</p>
            <p className="text-[11px] sm:text-xs text-amber-600 font-bold">High Web Design Opportunities</p>
          </div>
          <div className="w-11 h-11 sm:w-13 sm:h-13 bg-[#F59E0B] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* ─── Pipeline Analytics Main Container ────────────────────────────── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-[#4F46E5]">
              <BarChart3 className="w-4.5 h-4.5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Pipeline & Scraper Analytics</h2>
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live MongoDB Database Metrics
          </span>
        </div>

        {/* 4 Mini KPI Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* KPI 1 */}
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-[#EEF0FA] text-[#6366F1] flex items-center justify-center mb-3">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{totalLeads}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Scraped Leads in DB</p>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{targetCount}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Target Accounts</p>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{hasPhoneCount}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Phone Contacts</p>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-slate-50/60 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{hasWebsiteCount}</p>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Active Websites</p>
            </div>
          </div>
        </div>

        {/* 7-Day Lead Activity Bar Chart */}
        <div className="pt-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4">
            REAL 7-DAY SCRAPING ACTIVITY
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} domain={[0, Math.ceil(maxScrapedValue * 1.2)]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', borderColor: '#E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ color: '#64748B', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="contacted" name="Targeted" fill="#A5B4FC" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="scraped" name="Leads Scraped" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#A5B4FC]" />
              <span>Targeted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#6366F1]" />
              <span>Leads Scraped</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
