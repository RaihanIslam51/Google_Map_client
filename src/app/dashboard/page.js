'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Database, Target, PhoneCall, Globe, Users,
  ArrowUpRight, Compass, Download
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

  const metricCards = [
    {
      label: 'Total leads',
      value: totalLeads,
      hint: 'In your database',
      icon: Database,
      tone: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Target leads',
      value: targetCount,
      hint: `${targetPercent}% of total`,
      icon: Target,
      tone: 'bg-violet-50 text-violet-600',
    },
    {
      label: 'Phone ready',
      value: hasPhoneCount,
      hint: `${phonePercent}% coverage`,
      icon: PhoneCall,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'No website',
      value: noWebsiteCount,
      hint: 'Web design opportunities',
      icon: Globe,
      tone: 'bg-amber-50 text-amber-600',
    },
  ];

  const coverage = [
    { label: 'Phone coverage', percent: phonePercent, count: hasPhoneCount, bar: 'bg-emerald-500' },
    { label: 'Has website', percent: websitePercent, count: hasWebsiteCount, bar: 'bg-sky-500' },
    { label: 'Targeted', percent: targetPercent, count: targetCount, bar: 'bg-violet-500' },
  ];

  const cardCls = 'bg-white border border-slate-200 rounded-xl';

  return (
    <div className="space-y-6 container mx-auto text-slate-800">
      {/* ─── Page heading ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            A live snapshot of your lead pipeline and scraping activity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 mr-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-emerald-500'}`} />
            {isLoading ? 'Syncing…' : 'Live'}
          </span>
          <Link
            href="/dashboard/businesses"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-white border border-slate-200 text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> View leads
          </Link>
          <Link
            href="/dashboard/discovery"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[13px] font-semibold text-white shadow-sm shadow-indigo-600/20 transition-colors"
          >
            <Compass className="w-3.5 h-3.5" /> New extraction
          </Link>
        </div>
      </div>

      {/* ─── Metric cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, hint, icon: Icon, tone }) => (
          <div key={label} className={`${cardCls} p-5 hover:border-slate-300 transition-colors`}>
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-slate-500">{label}</p>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${tone}`}>
                <Icon className="w-4 h-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
              {value.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
          </div>
        ))}
      </div>

      {/* ─── Activity + Coverage ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className={`${cardCls} lg:col-span-2 p-5 sm:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Scraping activity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Leads collected over the last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C7D2FE]" /> Targeted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#4F46E5]" /> Leads scraped
              </span>
            </div>
          </div>

          <div className="h-64 w-full mt-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} domain={[0, Math.ceil(maxScrapedValue * 1.2)]} />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '10px', borderColor: '#E2E8F0', boxShadow: '0 10px 15px -3px rgba(15,23,42,0.08)', fontSize: '12px' }}
                  labelStyle={{ color: '#64748B', fontSize: '11px', fontWeight: 600 }}
                />
                <Bar dataKey="contacted" name="Targeted" fill="#C7D2FE" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="scraped" name="Leads Scraped" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Coverage */}
        <div className={`${cardCls} p-5 sm:p-6 flex flex-col`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Lead quality</h2>
              <p className="text-xs text-slate-500 mt-0.5">How complete your data is</p>
            </div>
            <span className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-6 space-y-5 flex-1">
            {coverage.map(({ label, percent, count, bar }) => (
              <div key={label}>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="text-slate-500 tabular-nums">
                    <span className="font-semibold text-slate-900">{count.toLocaleString()}</span> · {percent}%
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${bar} transition-all duration-500`} style={{ width: `${percent}%` }} />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/target-leads"
            className="mt-6 inline-flex items-center justify-between h-10 px-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-[13px] font-semibold text-slate-700 transition-colors"
          >
            Open target leads
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* ─── Mini KPI row ─────────────────────────────────────────────────── */}
      <div className={`${cardCls} grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100`}>
        {[
          { icon: Users, label: 'Scraped leads in DB', value: totalLeads, tone: 'text-indigo-500' },
          { icon: Target, label: 'Target accounts', value: targetCount, tone: 'text-violet-500' },
          { icon: PhoneCall, label: 'Phone contacts', value: hasPhoneCount, tone: 'text-emerald-500' },
          { icon: Globe, label: 'Active websites', value: hasWebsiteCount, tone: 'text-sky-500' },
        ].map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="p-5 flex items-center gap-3">
            <Icon className={`w-5 h-5 shrink-0 ${tone}`} />
            <div className="min-w-0">
              <p className="text-xl font-bold text-slate-900 tabular-nums leading-none">{value.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1.5 truncate">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
