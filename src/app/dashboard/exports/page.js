'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Download, Plus, FileText, FileJson, Loader2, AlertTriangle, Clock } from 'lucide-react';
import { exportsApi } from '../../../lib/api/exports';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';

function timeAgo(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ExportsPage() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [format, setFormat] = useState('csv');

  const { data, isLoading } = useQuery({
    queryKey: ['exports'],
    queryFn: () => exportsApi.getAll(),
    refetchInterval: 15000,
  });

  const createMutation = useMutation({
    mutationFn: () => exportsApi.create({ format }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['exports'] }); setCreating(false); },
  });

  const exports_ = data?.data ?? [];

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Exports</h1>
          <p className="text-sm text-slate-400 mt-0.5">Export collected business data to CSV or JSON.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={format} onChange={e => setFormat(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none">
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
          <button onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Export All
          </button>
        </div>
      </div>

      {data?._mock && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" /> Demo data shown
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center"><Loader2 className="w-5 h-5 text-slate-600 animate-spin mx-auto" /></div>
        ) : exports_.length === 0 ? (
          <EmptyState icon={Download} title="No exports yet" description="Create your first export above." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {['Name', 'Format', 'Records', 'Status', 'Created', 'Download'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exports_.map(exp => (
                <tr key={exp._id} className="border-b border-slate-800/60 table-row-hover">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {exp.format === 'csv'
                        ? <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        : <FileJson className="w-3.5 h-3.5 text-blue-400" />}
                      <span className="text-xs text-slate-200 font-medium">{exp.name}</span>
                    </div>
                    {exp.keyword && <p className="text-[10px] text-slate-600 mt-0.5 pl-5">{exp.keyword}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold uppercase text-slate-400">{exp.format}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300 font-medium">{exp.records?.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={exp.status} /></td>
                  <td className="px-4 py-3 text-xs text-slate-500">{timeAgo(exp.createdAt)}</td>
                  <td className="px-4 py-3">
                    {exp.status === 'ready' && exp.downloadUrl ? (
                      <a href={exp.downloadUrl}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors">
                        <Download className="w-3 h-3" /> Download
                      </a>
                    ) : exp.status === 'processing' ? (
                      <span className="flex items-center gap-1.5 text-xs text-blue-400">
                        <Loader2 className="w-3 h-3 animate-spin" /> Processing
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
