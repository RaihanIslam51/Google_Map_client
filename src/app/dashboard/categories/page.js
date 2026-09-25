'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../../../lib/api/analytics';
import { businessesApi } from '../../../lib/api/businesses';
import { AlertTriangle, Tag } from 'lucide-react';

export default function CategoriesPage() {
  const { data: catData } = useQuery({
    queryKey: ['categories-distribution'],
    queryFn: () => analyticsApi.getCategoryDistribution(),
  });
  const { data: statsData } = useQuery({
    queryKey: ['business-stats'],
    queryFn: () => businessesApi.getStats(),
  });

  const categories = catData?.data ?? [];
  const total = categories.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-white">Categories</h1>
        <p className="text-sm text-slate-400 mt-0.5">Business distribution by category.</p>
      </div>

      {catData?._mock && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" /> Demo data shown
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-white">All Categories</h2>
          <p className="text-xs text-slate-500 mt-0.5">{total.toLocaleString()} total businesses</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800">
              {['Category', 'Businesses', 'Share', 'Distribution'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => {
              const pct = total > 0 ? ((cat.count / total) * 100).toFixed(1) : 0;
              const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500'];
              const color = colors[i % colors.length];
              return (
                <tr key={cat.category} className="border-b border-slate-800/60 table-row-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-xs font-medium text-slate-200">{cat.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-slate-200">{cat.count.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{pct}%</td>
                  <td className="px-4 py-3 w-48">
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
