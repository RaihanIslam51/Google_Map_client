'use client';

import { Loader2, CheckCircle2, Sparkles, Target, Building2, Square, Zap, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function LiveMetricsPanel({
  isScraping,
  extractSuccess,
  searchQuery,
  liveKeyword,
  displayCompleted,
  displayNew,
  displayDuplicates,
  displayFailed,
  displayRemaining,
  displayPercent,
  limit,
  setShowLogTerminal,
  onStop,
  stopPending,
}) {
  const [leadsPerMin, setLeadsPerMin] = useState(0);
  const [elapsed, setElapsed]         = useState(0);
  const startTimeRef  = useRef(null);
  const prevCountRef  = useRef(0);
  const intervalRef   = useRef(null);
  const tickRef       = useRef(null);

  // ── Start/stop timer & calculate speed ───────────────────
  useEffect(() => {
    if (isScraping) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
        prevCountRef.current = displayCompleted;
      }

      // Tick elapsed every second
      tickRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      // Recalculate leads/min every 10 seconds
      intervalRef.current = setInterval(() => {
        const mins = (Date.now() - startTimeRef.current) / 60000;
        if (mins > 0) setLeadsPerMin(Math.round(displayCompleted / mins));
      }, 5000);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(tickRef.current);
      startTimeRef.current = null;
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(tickRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScraping]);

  // Update lpm on count change
  useEffect(() => {
    if (isScraping && startTimeRef.current) {
      const mins = (Date.now() - startTimeRef.current) / 60000;
      if (mins > 0.05) setLeadsPerMin(Math.round(displayCompleted / mins));
    }
  }, [displayCompleted, isScraping]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  const etaSecs = leadsPerMin > 0 ? Math.max(0, Math.round((displayRemaining / leadsPerMin) * 60)) : null;

  if (!isScraping && !extractSuccess) return null;

  return (
    <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300">

      {/* ── Live Extraction Banner ───────────────────────── */}
      {isScraping && (
        <div className="bg-gradient-to-br from-[#EEF0FA] to-[#F5F3FF] border border-indigo-200/80 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">

          {/* Top row: title + action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 shadow-sm shrink-0">
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider">Scraping Active</p>
                <p className="text-xs font-semibold text-slate-700 truncate max-w-[240px] sm:max-w-xs">
                  &ldquo;{searchQuery || liveKeyword}&rdquo; &mdash; {displayCompleted}/{limit} leads
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Speed chip */}
              {leadsPerMin > 0 && (
                <span className="hidden sm:flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-lg border border-emerald-200">
                  <Zap className="w-3 h-3" />
                  {leadsPerMin}/min
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowLogTerminal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live Logs
              </button>

              <button
                type="button"
                onClick={onStop}
                disabled={stopPending}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
              >
                <Square className="w-2.5 h-2.5 fill-white text-white" />
                Stop
              </button>
            </div>
          </div>

          {/* Progress bar — animated stripe */}
          <div className="w-full h-3 bg-indigo-100 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{
                width: `${Math.max(4, displayPercent)}%`,
                background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.8s infinite linear',
              }}
            />
            <style>{`
              @keyframes shimmer {
                0%   { background-position: 200% 0; }
                100% { background-position: -200% 0; }
              }
            `}</style>
          </div>

          {/* Sub-row: percent + elapsed + ETA */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] sm:text-xs text-slate-500 font-medium">
            <span className="font-extrabold text-indigo-700">{displayPercent}%</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {fmt(elapsed)} elapsed
            </span>
            {etaSecs !== null && (
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <TrendingUp className="w-3 h-3" />
                ETA ~{fmt(etaSecs)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── 4 Metric Stat Cards ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">

        {/* Completed */}
        <div className="bg-white border border-indigo-100 rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 shadow-xs min-w-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent pointer-events-none" />
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            {isScraping
              ? <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              : <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            }
          </div>
          <div className="min-w-0 relative">
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Completed</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg sm:text-2xl font-extrabold text-slate-900 tabular-nums transition-all">{displayCompleted}</span>
              <span className="text-[10px] text-slate-400 font-medium">/ {limit}</span>
            </div>
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-white border border-emerald-200/80 rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 shadow-xs min-w-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/40 to-transparent pointer-events-none" />
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="min-w-0 relative">
            <p className="text-[9px] sm:text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">New Leads</p>
            <p className="text-lg sm:text-2xl font-extrabold text-emerald-700 mt-0.5 tabular-nums transition-all">+{displayNew}</p>
          </div>
        </div>

        {/* Duplicates */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 shadow-xs min-w-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 to-transparent pointer-events-none" />
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 text-amber-600" />
          </div>
          <div className="min-w-0 relative">
            <p className="text-[9px] sm:text-[10px] font-bold text-amber-600 uppercase tracking-wider truncate">Duplicates</p>
            <p className="text-lg sm:text-2xl font-extrabold text-amber-700 mt-0.5 tabular-nums transition-all">{displayDuplicates}</p>
          </div>
        </div>

        {/* Remaining / Failed */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3.5 shadow-xs min-w-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/60 to-transparent pointer-events-none" />
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            {isScraping
              ? <Building2 className="w-4 h-4 text-slate-600" />
              : <AlertCircle className="w-4 h-4 text-slate-500" />
            }
          </div>
          <div className="min-w-0 relative">
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
              {isScraping ? 'Remaining' : 'Failed / Skipped'}
            </p>
            <p className="text-lg sm:text-2xl font-extrabold text-slate-800 mt-0.5 tabular-nums transition-all">
              {isScraping ? displayRemaining : displayFailed}
            </p>
          </div>
        </div>
      </div>

      {/* ── Completion Banner ────────────────────────────── */}
      {!isScraping && extractSuccess && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-emerald-800">✅ Extraction Complete</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              {displayNew} new leads saved &bull; {displayDuplicates} duplicates merged &bull; {displayFailed} failed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
