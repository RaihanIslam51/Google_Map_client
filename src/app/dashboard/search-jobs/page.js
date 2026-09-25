'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Search, Plus, Trash2, Eye, AlertTriangle, X, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { searchJobsApi } from '../../../lib/api/search-jobs';
import StatusBadge from '../../../components/common/StatusBadge';
import EmptyState from '../../../components/common/EmptyState';
import ErrorState from '../../../components/common/ErrorState';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { SkeletonTable } from '../../../components/common/LoadingSkeleton';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const jobSchema = z.object({
  keyword: z.string().min(1, 'Keyword is required'),
  location: z.string().min(1, 'Location is required'),
  maxResults: z.coerce.number().int().min(1).max(500),
  scrollLimit: z.coerce.number().int().min(5).max(100),
});

const SCRAPE_FIELDS = [
  'Business Name', 'Category', 'Address', 'Phone', 'Website',
  'Rating', 'Review Count', 'Opening Hours', 'Coordinates',
];

// ─── Create Job Modal ─────────────────────────────────────────────────────────
function CreateJobModal({ isOpen, onClose, onCreate }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: { keyword: '', location: 'Dhaka', maxResults: 100, scrollLimit: 30 },
  });

  const onSubmit = async (values) => {
    await onCreate(values);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in duration-150 text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">New Search Job</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Search Keyword *</label>
            <input {...register('keyword')} placeholder="e.g. Restaurants" className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500" />
            {errors.keyword && <p className="text-xs text-rose-500 mt-1">{errors.keyword.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
            <input {...register('location')} placeholder="Dhaka" className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500" />
            {errors.location && <p className="text-xs text-rose-500 mt-1">{errors.location.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Results</label>
              <input type="number" {...register('maxResults')} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500" />
              {errors.maxResults && <p className="text-xs text-rose-500 mt-1">{errors.maxResults.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scroll Limit</label>
              <input type="number" {...register('scrollLimit')} className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500" />
              {errors.scrollLimit && <p className="text-xs text-rose-500 mt-1">{errors.scrollLimit.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Scrape Fields</label>
            <div className="grid grid-cols-2 gap-1.5">
              {SCRAPE_FIELDS.map(f => (
                <label key={f} className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer" />
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl transition-colors disabled:opacity-50 cursor-pointer">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SearchJobsPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  function timeAgo(iso) {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(iso).toLocaleDateString();
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['search-jobs', statusFilter, searchInput],
    queryFn: () => searchJobsApi.getAll({ status: statusFilter, search: searchInput }),
  });

  const createMutation = useMutation({
    mutationFn: (payload) => searchJobsApi.create({ ...payload, keyword: `${payload.keyword} in ${payload.location}` }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['search-jobs'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => searchJobsApi.deleteById(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['search-jobs'] }); setDeleteId(null); },
  });

  const jobs = data?.data ?? [];

  return (
    <div className="space-y-5 max-w-7xl mx-auto py-2 text-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Search Jobs</h1>
          <p className="text-xs text-slate-500 mt-0.5">Create and manage Google Maps search jobs.</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer">
          <Plus className="w-4 h-4" /> New Search Job
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search jobs..."
            className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none shadow-2xs" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200/80 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none shadow-2xs cursor-pointer">
          <option value="">All Status</option>
          {['pending', 'running', 'completed', 'failed'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {data?._mock && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-700 font-medium">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Demo data shown
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-4"><SkeletonTable rows={5} cols={6} /></div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : jobs.length === 0 ? (
          <EmptyState icon={Search} title="No search jobs yet"
            description="Create your first Google Maps search job."
            action={{ label: 'Create Search Job', onClick: () => setModalOpen(true) }} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                  {['Keyword', 'Max Results', 'Collected', 'Status', 'Created', ''].map(h => (
                    <th key={h} className="px-4 py-3.5 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {jobs.map(job => (
                  <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-4 font-bold text-slate-900">
                      {job.keyword}
                    </td>
                    <td className="px-4 py-4 text-slate-500 font-medium">{job.maxResults}</td>
                    <td className="px-4 py-4 text-emerald-600 font-bold">{job.collected}</td>
                    <td className="px-4 py-4"><StatusBadge status={job.status} /></td>
                    <td className="px-4 py-4 text-slate-500 font-medium">{timeAgo(job.createdAt)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/dashboard/search-jobs/${job._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => setDeleteId(job._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateJobModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreate={(v) => createMutation.mutateAsync(v)} />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="Delete search job?"
        description="This job and its configuration will be permanently removed."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
