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

  const metricCards = [
    {
      key: 'completed',
      label: 'Completed',
      icon: isScraping
        ? <Loader2 className="w-4 h-4 animate-spin" />
        : <CheckCircle2 className="w-4 h-4" />,
      tone: 'bg-indigo-50 text-indigo-600',
      value: (
        <>
          <span className="text-2xl font-bold text-slate-900 tabular-nums">{displayCompleted}</span>
          <span className="text-xs text-slate-400 font-medium ml-1">/ {limit}</span>
        </>
      ),
    },
    {
      key: 'new',
      label: 'New leads',
      icon: <Sparkles className="w-4 h-4" />,
      tone: 'bg-emerald-50 text-emerald-600',
      value: <span className="text-2xl font-bold text-emerald-600 tabular-nums">+{displayNew}</span>,
    },
    {
      key: 'dup',
      label: 'Duplicates',
      icon: <Target className="w-4 h-4" />,
      tone: 'bg-amber-50 text-amber-600',
      value: <span className="text-2xl font-bold text-slate-900 tabular-nums">{displayDuplicates}</span>,
    },
    {
      key: 'rem',
      label: isScraping ? 'Remaining' : 'Failed / skipped',
      icon: isScraping ? <Building2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />,
      tone: 'bg-slate-100 text-slate-500',
      value: (
        <span className="text-2xl font-bold text-slate-900 tabular-nums">
          {isScraping ? displayRemaining : displayFailed}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">

      {/* ── Live Extraction Banner ───────────────────────── */}
      {isScraping && (
        <div className="bg-white border border-indigo-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">

          {/* Top row: title + action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 shrink-0">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-indigo-600">Scraping in progress</p>
                <p className="text-sm font-semibold text-slate-800 truncate max-w-[240px] sm:max-w-md">
                  &ldquo;{searchQuery || liveKeyword}&rdquo; &mdash; {displayCompleted}/{limit} leads
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Speed chip */}
              {leadsPerMin > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 h-8 rounded-lg border border-emerald-100">
                  <Zap className="w-3 h-3" />
                  {leadsPerMin}/min
                </span>
              )}

              <button
                type="button"
                onClick={() => setShowLogTerminal(true)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3 h-8 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live logs
              </button>

              <button
                type="button"
                onClick={onStop}
                disabled={stopPending}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold px-3 h-8 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Square className="w-2.5 h-2.5 fill-white text-white" />
                Stop
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
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
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
              <span className="font-bold text-indigo-600">{displayPercent}%</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {fmt(elapsed)} elapsed
              </span>
              {etaSecs !== null && (
                <span className="flex items-center gap-1 text-amber-600">
                  <TrendingUp className="w-3 h-3" />
                  ETA ~{fmt(etaSecs)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 4 Metric Stat Cards ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metricCards.map((m) => (
          <div key={m.key} className="bg-white border border-slate-200 rounded-xl p-4 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 truncate">{m.label}</p>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.tone}`}>
                {m.icon}
              </span>
            </div>
            <div className="mt-2 flex items-baseline">{m.value}</div>
          </div>
        ))}
      </div>

      {/* ── Completion Banner ────────────────────────────── */}
      {!isScraping && extractSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">Extraction complete</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              {displayNew} new leads saved &bull; {displayDuplicates} duplicates merged &bull; {displayFailed} failed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
