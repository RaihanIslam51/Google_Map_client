'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Square, RefreshCw, CheckCircle2, XCircle, Copy, Activity } from 'lucide-react';
import { scrapingRunsApi } from '../../../../lib/api/scraping-runs';
import StatusBadge from '../../../../components/common/StatusBadge';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';
import { useState } from 'react';

// Mock activity log for running jobs
const MOCK_ACTIVITY = [
  { time: '10:42:31', type: 'saved', msg: 'Business saved: Green Pharmacy' },
  { time: '10:42:28', type: 'duplicate', msg: 'Duplicate detected: City Hotel' },
  { time: '10:42:21', type: 'processed', msg: 'Business processed: Dinajpur Hospital' },
  { time: '10:42:17', type: 'opened', msg: 'Opening business profile...' },
  { time: '10:42:10', type: 'saved', msg: 'Business saved: ABC Restaurant' },
  { time: '10:42:05', type: 'error', msg: 'Failed to extract phone for: Unknown' },
];

const LOG_COLORS = {
  saved: 'text-emerald-400', duplicate: 'text-amber-400',
  error: 'text-rose-400', opened: 'text-blue-400', processed: 'text-slate-400',
};

function StatBox({ label, value, color = 'text-white' }) {
  return (
    <div className="bg-slate-800 rounded-lg p-3 text-center">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value ?? 0}</p>
    </div>
  );
}

export default function ScrapingRunDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const [stopOpen, setStopOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['scraping-run', id],
    queryFn: () => scrapingRunsApi.getById(id),
    refetchInterval: (d) => d?.data?.status === 'running' ? 5000 : false,
  });

  const stopMutation = useMutation({
    mutationFn: () => scrapingRunsApi.stop(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['scraping-run', id] }); setStopOpen(false); },
  });

  const run = data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-slate-600 animate-spin" /></div>;
  if (!run) return <div className="py-20 text-center text-slate-400 text-sm">Run not found. <Link href="/dashboard/scraping-runs" className="text-blue-400">← Back</Link></div>;

  const progress = run.processed && run.discovered ? Math.round((run.processed / run.discovered) * 100) : 0;
  const isRunning = run.status === 'running';

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Scraping Runs
      </button>

      {/* Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-base font-bold text-white">{run.keyword}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Run ID: {run._id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={run.status} />
            {isRunning && (
              <button onClick={() => setStopOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/15 hover:bg-rose-600/25 text-rose-400 text-xs font-medium rounded-lg border border-rose-600/20 transition-colors">
                <Square className="w-3 h-3" /> Stop
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {run.discovered > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400">{run.processed} / {run.discovered} businesses processed</span>
              <span className="text-xs font-bold text-slate-200">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isRunning ? 'bg-blue-500 progress-animated' : run.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-3">
          <StatBox label="Discovered" value={run.discovered} />
          <StatBox label="Processed" value={run.processed} />
          <StatBox label="Saved" value={run.saved} color="text-emerald-400" />
          <StatBox label="Dupes" value={run.duplicates} color="text-amber-400" />
          <StatBox label="Failed" value={run.failed} color="text-rose-400" />
        </div>
      </div>

      {/* Live Activity Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">Activity Log</h2>
            {isRunning && <span className="live-indicator w-2 h-2 rounded-full bg-blue-400" />}
          </div>
          {isRunning && (
            <span className="text-xs text-blue-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Live
            </span>
          )}
        </div>
        <div className="p-4 font-mono text-[11px] space-y-1.5 max-h-64 overflow-y-auto">
          {MOCK_ACTIVITY.map((log, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-slate-600 shrink-0">{log.time}</span>
              <span className={LOG_COLORS[log.type] ?? 'text-slate-400'}>{log.msg}</span>
            </div>
          ))}
          {!isRunning && (
            <p className="text-slate-600 italic pt-1">Run has ended.</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={stopOpen}
        onClose={() => setStopOpen(false)}
        onConfirm={() => stopMutation.mutate()}
        loading={stopMutation.isPending}
        title="Stop this scraping run?"
        description="Current progress will be saved. The run will be marked as stopped."
        confirmLabel="Stop Run"
        confirmVariant="danger"
      />
    </div>
  );
}
