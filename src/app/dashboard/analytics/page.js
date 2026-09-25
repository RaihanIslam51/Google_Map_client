'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../../lib/api/analytics';
import { BarChart3, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-white font-semibold">{p.name}: {p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);

  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['activity', days],
    queryFn: () => analyticsApi.getActivity({ days }),
  });

  const { data: catData } = useQuery({
    queryKey: ['categories-distribution'],
    queryFn: () => analyticsApi.getCategoryDistribution(),
  });

  const { data: statsData } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => analyticsApi.getDashboardStats(),
  });

  const activity = activityData?.data ?? [];
  const categories = catData?.data ?? [];
  const stats = statsData?.data;

  const PIE_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'];

  const kpis = stats ? [
    { label: 'Total Businesses', value: stats.totalBusinesses?.toLocaleString() },
    { label: 'Success Rate', value: stats.totalSearches ? `${Math.round((stats.successfulRuns / stats.totalSearches) * 100)}%` : '—' },
    { label: 'Duplicate Rate', value: stats.totalBusinesses ? `${((stats.duplicates / (stats.totalBusinesses + stats.duplicates)) * 100).toFixed(1)}%` : '—' },
    { label: 'Failure Rate', value: stats.failedRecords && stats.totalBusinesses ? `${((stats.failedRecords / (stats.totalBusinesses + stats.failedRecords)) * 100).toFixed(1)}%` : '—' },
  ] : [];

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">Data collection performance and insights.</p>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
          {[7, 30, 90].map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${days === d ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-xs text-slate-500 mb-2">{kpi.label}</p>
            <p className="text-2xl font-bold text-white">{kpi.value ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Area Chart — Businesses over time */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Businesses Collected</h2>
          <p className="text-xs text-slate-500 mb-5">Cumulative over selected period</p>
          {activityLoading ? (
            <div className="h-48 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={activity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="businesses" name="Businesses" stroke="#3b82f6" strokeWidth={2} fill="url(#grad1)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart — Searches per day */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Search Jobs per Day</h2>
          <p className="text-xs text-slate-500 mb-5">Daily search activity</p>
          {activityLoading ? (
            <div className="h-48 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-slate-600 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={activity.slice(-14)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="searches" name="Searches" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart — Category Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Category Distribution</h2>
          <p className="text-xs text-slate-500 mb-5">Businesses by category</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categories} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {categories.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category horizontal bars */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-1">Top Categories</h2>
          <p className="text-xs text-slate-500 mb-5">By number of businesses</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart layout="vertical" data={categories} margin={{ top: 0, right: 10, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="count" name="Businesses" fill="#3b82f6" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
