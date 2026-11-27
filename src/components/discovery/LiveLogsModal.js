'use client';

import { Terminal, Play, Pause, Trash2, Copy, X, Search, Zap } from 'lucide-react';

export default function LiveLogsModal({
  showLogTerminal,
  setShowLogTerminal,
  isScraping,
  isLogPaused,
  setIsLogPaused,
  rawLogs,
  logsList,
  logFilterTab,
  setLogFilterTab,
  logSearchQuery,
  setLogSearchQuery,
  setClearedLogIds,
  logContainerRef,
  onCopyLogs,
}) {
  if (!showLogTerminal) return null;

  const filteredLogs = logsList.filter(log => {
    if (!log || typeof log !== 'object') return false;
    const msg = String(log.message || '').toLowerCase();
    const time = String(log.time || '').toLowerCase();
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      if (!msg.includes(q) && !time.includes(q)) return false;
    }
    if (logFilterTab === 'nav') return log.type === 'nav' || log.type === 'scroll';
    if (logFilterTab === 'saved') return log.type === 'saved' || log.type === 'dup';
    if (logFilterTab === 'skip') return log.type === 'skip';
    if (logFilterTab === 'error') return log.type === 'error' || log.type === 'warn' || log.type === 'stopped';
    return true;
  });

  const btnCls =
    'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer';

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowLogTerminal(false);
      }}
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden font-sans text-slate-100">
        {/* Modal Header Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 h-14 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white tracking-tight">Live scraper terminal</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                  isScraping
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isScraping ? 'Active' : 'Idle'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal truncate hidden sm:block">
                Real-time backend scraping activity and process logs
              </p>
            </div>
          </div>

          {/* Action Buttons in Terminal Header */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsLogPaused(!isLogPaused)}
              className={btnCls}
              title={isLogPaused ? 'Resume live log stream' : 'Pause log auto-scroll'}
            >
              {isLogPaused ? <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isLogPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              type="button"
              onClick={() => setClearedLogIds(new Set(rawLogs.map(l => l?.id).filter(Boolean)))}
              className={btnCls}
              title="Clear console output"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              type="button"
              onClick={onCopyLogs}
              className={btnCls}
              title="Copy logs to clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Copy</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogTerminal(false)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Controls Bar (Filter Tabs & Search) */}
        <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 whitespace-nowrap">
            {[
              { id: 'all', label: 'All logs', count: logsList.length },
              { id: 'nav', label: 'Navigation', count: logsList.filter(l => l?.type === 'nav' || l?.type === 'scroll').length },
              { id: 'saved', label: 'Saved leads', count: logsList.filter(l => l?.type === 'saved' || l?.type === 'dup').length },
              { id: 'skip', label: 'Skipped', count: logsList.filter(l => l?.type === 'skip').length },
              { id: 'error', label: 'Errors', count: logsList.filter(l => l?.type === 'error' || l?.type === 'warn' || l?.type === 'stopped').length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLogFilterTab(tab.id)}
                className={`px-2.5 py-1 rounded-md font-medium text-xs transition-colors cursor-pointer shrink-0 ${
                  logFilterTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Log Search Filter Box */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 h-8">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="Filter logs by keyword…"
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
            />
            {logSearchQuery && (
              <button type="button" onClick={() => setLogSearchQuery('')} className="text-slate-400 hover:text-white" aria-label="Clear filter">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Terminal Main Window Body */}
        <div
          ref={logContainerRef}
          className="flex-1 bg-slate-950 p-4 sm:p-5 overflow-y-auto font-mono text-xs leading-relaxed space-y-1.5 select-text"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-16 px-4 text-center">
              <Terminal className="w-8 h-8 text-slate-700" />
              <p className="text-xs font-medium text-slate-400">No log entries to display.</p>
              <p className="text-[11px] text-slate-600 max-w-xs">
                Click &quot;Extract leads&quot; on the Discovery page to launch Google Maps scraping and stream backend logs.
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              let badgeStyle = 'bg-slate-800 text-slate-300';

              if (log.type === 'nav') {
                badgeStyle = 'bg-sky-950 text-sky-400 border border-sky-800/60';
              } else if (log.type === 'scroll') {
                badgeStyle = 'bg-purple-950 text-purple-400 border border-purple-800/60';
              } else if (log.type === 'saved') {
                badgeStyle = 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold';
              } else if (log.type === 'dup') {
                badgeStyle = 'bg-amber-950 text-amber-400 border border-amber-800/60';
              } else if (log.type === 'skip') {
                badgeStyle = 'bg-slate-900 text-slate-400 border border-slate-800';
              } else if (log.type === 'stopped') {
                badgeStyle = 'bg-rose-950 text-rose-400 border border-rose-800/60 font-semibold';
              } else if (log.type === 'success') {
                badgeStyle = 'bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-semibold';
              } else if (log.type === 'error' || log.type === 'warn') {
                badgeStyle = 'bg-rose-950 text-rose-400 border border-rose-800/60';
              }

              return (
                <div key={log.id} className="flex items-start gap-2.5 hover:bg-slate-900/50 px-2 py-1 rounded transition-colors">
                  <span className="text-slate-600 shrink-0 text-[11px] pt-0.5">
                    [{log.time}]
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${badgeStyle}`}>
                    {log.type}
                  </span>
                  <span className="text-slate-300 break-all font-mono whitespace-pre-wrap">
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Terminal Footer Status Bar */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 sm:px-6 h-10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-3 truncate">
            <span className="flex items-center gap-1.5 font-medium text-slate-300 truncate">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Poll interval: 600ms</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline font-medium">{logsList.length} total entries</span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsLogPaused(!isLogPaused)}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
            >
              {isLogPaused ? 'Stream paused' : 'Auto-scroll active'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
