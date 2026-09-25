'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Clock, Hash, CheckCircle, AlertTriangle, Loader2, Play } from 'lucide-react';
import { searchJobsApi } from '../../../../lib/api/search-jobs';
import StatusBadge from '../../../../components/common/StatusBadge';

export default function SearchJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['search-job', id],
    queryFn: () => searchJobsApi.getById(id),
  });

  const job = data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-slate-600 animate-spin" /></div>;
  if (!job) return <div className="py-20 text-center text-slate-400 text-sm">Job not found. <Link href="/dashboard/search-jobs" className="text-blue-400">← Back</Link></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-4 h-4" /> Back to Search Jobs
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-600/15 border border-blue-600/20 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">{job.keyword}</h1>
              <p className="text-xs text-slate-500 mt-0.5">Job ID: {job._id}</p>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Max Results', value: job.maxResults },
            { label: 'Collected', value: job.collected ?? 0 },
            { label: 'Created', value: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—' },
          ].map(item => (
            <div key={item.label} className="bg-slate-800 rounded-lg p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-slate-200">{item.value}</p>
            </div>
          ))}
        </div>

        {job.status === 'pending' && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-amber-400">This job is pending. It will start when the scraper is available.</p>
          </div>
        )}
      </div>

      <Link href="/dashboard/scraping-runs" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
        View related scraping runs →
      </Link>
    </div>
  );
}
