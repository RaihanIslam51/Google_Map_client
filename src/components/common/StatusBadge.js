'use client';

// components/common/StatusBadge.js
export default function StatusBadge({ status }) {
  const variants = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    running:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
    failed:    'bg-rose-500/10 text-rose-400 border-rose-500/20',
    stopped:   'bg-slate-500/10 text-slate-400 border-slate-500/20',
    ready:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    processing:'bg-blue-500/10 text-blue-400 border-blue-500/20',
    active:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    inactive:  'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const dots = {
    running:    'bg-blue-400 animate-pulse',
    processing: 'bg-blue-400 animate-pulse',
    active:     'bg-emerald-400 animate-pulse',
  };

  const label = status?.charAt(0).toUpperCase() + status?.slice(1);
  const cls = variants[status?.toLowerCase()] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  const dot = dots[status?.toLowerCase()];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
    </span>
  );
}
