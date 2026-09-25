'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Activity, Eye, Square, AlertTriangle, Loader2 } from 'lucide-react';
import { scrapingRunsApi } from '../../../lib/api/scraping-runs';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { SkeletonTable } from '../../../components/common/LoadingSkeleton';
import { useState } from 'react';

function formatDuration(ms) {
  if (!ms) return '—';
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function timeAgo(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ScrapingRunsPage() {
  const qc = useQueryClient();
  const [stopId, setStopId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['scraping-runs', statusFilter],
    queryFn: () => scrapingRunsApi.getAll({ status: statusFilter }),
    refetchInterval: 10000,
  });

  const stopMutation = useMutation({
    mutationFn: (id) => scrapingRunsApi.stop(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['scraping-runs'] }); setStopId(null); },
  });

  const runs = data?.data ?? [];

  return (
    <div className="space-y-5 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Scraping Runs</h1>
          <p className="text-sm text-slate-400 mt-0.5">Monitor all scraping executions.</p>
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none">
          <option value="">All Status</option>
          {['running', 'completed', 'failed', 'stopped'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {data?._mock && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" /> Demo data shown
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4"><SkeletonTable rows={5} cols={8} /></div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : runs.length === 0 ? (
          <EmptyState icon={Activity} title="No scraping runs yet"
            description="Create a search job to start collecting data." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Keyword', 'Saved', 'Dupes', 'Failed', 'Duration', 'Status', 'Started', ''].map(h => (
                    <th key={h} className="px-3 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr key={run._id} className="border-b border-slate-800/60 table-row-hover">
                    <td className="px-3 py-3 max-w-[200px]">
                      <Link href={`/dashboard/scraping-runs/${run._id}`} className="text-xs text-slate-200 hover:text-blue-400 font-medium truncate block transition-colors">
                        {run.keyword}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-xs text-emerald-400 font-medium">{run.saved}</td>
                    <td className="px-3 py-3 text-xs text-amber-400">{run.duplicates}</td>
                    <td className="px-3 py-3 text-xs text-rose-400">{run.failed}</td>
                    <td className="px-3 py-3 text-xs text-slate-400">{formatDuration(run.durationMs)}</td>
                    <td className="px-3 py-3"><StatusBadge status={run.status} /></td>
                    <td className="px-3 py-3 text-xs text-slate-500">{timeAgo(run.startedAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/dashboard/scraping-runs/${run._id}`}
                          className="p-1.5 rounded-md text-slate-500 hover:text-blue-400 hover:bg-slate-800 transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        {run.status === 'running' && (
                          <button onClick={() => setStopId(run._id)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors" title="Stop">
                            <Square className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!stopId}
        onClose={() => setStopId(null)}
        onConfirm={() => stopMutation.mutate(stopId)}
        loading={stopMutation.isPending}
        title="Stop this scraping run?"
        description="Current progress will be saved. The run will be marked as stopped."
        confirmLabel="Stop Run"
        confirmVariant="danger"
      />
    </div>
  );
}
