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

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowLogTerminal(false);
      }}
      className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div className="bg-[#090D16] border border-slate-800 rounded-2xl sm:rounded-3xl w-full max-w-5xl h-[90vh] sm:h-[85vh] flex flex-col shadow-2xl overflow-hidden font-sans text-slate-100">
        {/* Modal Header Bar */}
        <div className="bg-[#0D1322] border-b border-slate-800/80 px-3.5 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2 tracking-tight truncate">
                <span>Live Logs</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold border shrink-0 ${
                  isScraping
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {isScraping ? '🟢 SCRAPER ACTIVE' : '⚪ IDLE'}
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate hidden sm:block">
                Real-time backend scraping activities
              </p>
            </div>
          </div>

          {/* Action Buttons in Terminal Header */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsLogPaused(!isLogPaused)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all border cursor-pointer ${
                isLogPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title={isLogPaused ? 'Resume live log stream' : 'Pause log auto-scroll'}
            >
              {isLogPaused ? <Play className="w-3.5 h-3.5 fill-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isLogPaused ? 'Resume Stream' : 'Pause Stream'}</span>
            </button>

            <button
              type="button"
              onClick={() => setClearedLogIds(new Set(rawLogs.map(l => l?.id).filter(Boolean)))}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
              title="Clear console output"
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              type="button"
              onClick={onCopyLogs}
              className="flex items-center gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer"
              title="Copy logs to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogTerminal(false)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors border border-slate-700 cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Controls Bar (Filter Tabs & Search) */}
        <div className="bg-[#090D16] border-b border-slate-800/60 px-3.5 sm:px-6 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 whitespace-nowrap">
            {[
              { id: 'all', label: 'All Logs', count: logsList.length },
              { id: 'nav', label: 'Nav & Scroll', count: logsList.filter(l => l?.type === 'nav' || l?.type === 'scroll').length },
              { id: 'saved', label: 'Saved Leads', count: logsList.filter(l => l?.type === 'saved' || l?.type === 'dup').length },
              { id: 'skip', label: 'Skipped', count: logsList.filter(l => l?.type === 'skip').length },
              { id: 'error', label: 'Errors', count: logsList.filter(l => l?.type === 'error' || l?.type === 'warn' || l?.type === 'stopped').length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLogFilterTab(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer shrink-0 ${
                  logFilterTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Log Search Filter Box */}
          <div className="flex items-center gap-2 bg-[#0D1322] border border-slate-800 rounded-xl px-2.5 py-1.5 sm:py-1">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="Filter logs by text..."
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
            />
            {logSearchQuery && (
              <button type="button" onClick={() => setLogSearchQuery('')} className="text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Terminal Main Window Body */}
        <div
          ref={logContainerRef}
          className="flex-1 bg-[#060911] p-3 sm:p-5 overflow-y-auto font-mono text-[11px] sm:text-xs leading-relaxed space-y-1.5 select-text divide-y divide-slate-900/60"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 py-12 px-4 text-center">
              <Terminal className="w-8 h-8 text-slate-700" />
              <p className="text-xs font-semibold">No backend log events recorded yet.</p>
              <p className="text-[11px] text-slate-600 max-w-xs">
                Click &quot;Extract&quot; on the Discovery page to launch Google Maps scraping and stream live terminal logs.
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              let badgeStyle = 'bg-slate-800 text-slate-300';
              let icon = 'ℹ️';

              if (log.type === 'nav') {
                badgeStyle = 'bg-sky-950/80 text-sky-400 border border-sky-800/60';
                icon = '🌐';
              } else if (log.type === 'scroll') {
                badgeStyle = 'bg-purple-950/80 text-purple-400 border border-purple-800/60';
                icon = '📜';
              } else if (log.type === 'saved') {
                badgeStyle = 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold';
                icon = '🟢';
              } else if (log.type === 'dup') {
                badgeStyle = 'bg-amber-950/80 text-amber-400 border border-amber-800/60';
                icon = '🟡';
              } else if (log.type === 'skip') {
                badgeStyle = 'bg-slate-900 text-slate-400 border border-slate-800';
                icon = '📍';
              } else if (log.type === 'stopped') {
                badgeStyle = 'bg-rose-950/80 text-rose-400 border border-rose-800/60 font-bold';
                icon = '🛑';
              } else if (log.type === 'success') {
                badgeStyle = 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-bold';
                icon = '🎉';
              } else if (log.type === 'error' || log.type === 'warn') {
                badgeStyle = 'bg-rose-950/80 text-rose-400 border border-rose-800/60';
                icon = '⚠️';
              }

              return (
                <div key={log.id} className="pt-2 flex items-start gap-2 sm:gap-3 hover:bg-slate-900/30 px-1.5 py-1 rounded transition-colors">
                  <span className="text-slate-500 shrink-0 text-[10px] sm:text-[11px] font-medium pt-0.5">
                    [{log.time}]
                  </span>
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase shrink-0 ${badgeStyle}`}>
                    {icon} {log.type}
                  </span>
                  <span className="text-slate-200 break-all font-mono whitespace-pre-wrap leading-normal">
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Terminal Footer Status Bar */}
        <div className="bg-[#0D1322] border-t border-slate-800/80 px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <span className="flex items-center gap-1 font-bold text-slate-300 truncate">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Refresh: 600ms</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Total: {logsList.length} Lines</span>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsLogPaused(!isLogPaused)}
              className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer truncate"
            >
              {isLogPaused ? 'Paused' : 'Auto-scroll On'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
