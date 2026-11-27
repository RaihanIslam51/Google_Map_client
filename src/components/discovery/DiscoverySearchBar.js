'use client';

import { Search, Play, Square, Loader2, X, Zap, ChevronDown } from 'lucide-react';
import { POPULAR_SUGGESTIONS } from './constants';

export default function DiscoverySearchBar({
  searchContainerRef,
  searchQuery,
  setSearchQuery,
  showSuggestions,
  setShowSuggestions,
  limit,
  setLimit,
  tabsCount,
  setTabsCount,
  isScraping,
  stopPending,
  onExtract,
  onStop,
}) {
  const filteredSuggestions = POPULAR_SUGGESTIONS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.query.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const selectWrap =
    'flex items-center gap-2 h-10 bg-white border border-slate-200 hover:border-slate-300 rounded-lg px-3 transition-colors';
  const selectCls =
    'appearance-none bg-transparent text-slate-800 text-[13px] font-semibold focus:outline-none cursor-pointer pr-4 disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible">
      {/* ── Main Search Row ───────────────────────────────── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 p-3">
        {/* Search Input */}
        <div ref={searchContainerRef} className="flex-1 relative">
          <div
            className={`flex items-center gap-2.5 h-10 px-3.5 rounded-lg border transition-colors ${
              isScraping
                ? 'bg-indigo-50/60 border-indigo-200'
                : 'bg-slate-50 border-slate-200 focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10'
            }`}
          >
            {isScraping ? (
              <span className="relative flex w-2 h-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-indigo-600" />
              </span>
            ) : (
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setShowSuggestions(false);
                  onExtract();
                }
              }}
              placeholder='Search e.g., "Software Companies" or "Hotels in Dhaka"'
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              readOnly={isScraping}
            />
            {searchQuery && !isScraping && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {showSuggestions && !isScraping && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-900/10 z-50 overflow-hidden max-h-72 overflow-y-auto">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between sticky top-0">
                <span className="text-[11px] font-semibold text-slate-500">
                  {filteredSuggestions.length} category suggestions
                </span>
                <span className="text-[11px] text-slate-400">Click to select</span>
              </div>

              <div className="divide-y divide-slate-50">
                {filteredSuggestions.map((item) => (
                  <button
                    key={item.query}
                    type="button"
                    onClick={() => { setSearchQuery(item.query); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-white border border-slate-100 flex items-center justify-center text-base leading-none shrink-0">
                        {item.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">{item.label}</p>
                        <p className="text-[11px] text-slate-400 truncate">
                          &quot;<span className="text-slate-500">{item.query}</span>&quot;
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] bg-slate-100 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-700 font-medium px-2 py-0.5 rounded-md transition-colors shrink-0">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>

              {filteredSuggestions.length === 0 && (
                <div className="p-5 text-center text-xs text-slate-400">
                  Press <kbd className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-200">Enter</kbd> to search for &quot;<span className="font-semibold text-slate-700">{searchQuery}</span>&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Options: Limit + Tabs */}
        <div className="flex items-center gap-2">
          {/* Limit Select */}
          <div className={selectWrap}>
            <span className="text-[11px] font-medium text-slate-400 hidden sm:block">Limit</span>
            <div className="relative flex items-center">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                disabled={isScraping}
                className={selectCls}
                aria-label="Lead limit"
              >
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={1000}>1,000</option>
                <option value={2000}>2,000</option>
                <option value={5000}>5,000</option>
              </select>
              <ChevronDown className="absolute right-0 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">leads</span>
          </div>

          {/* Tabs Select */}
          <div className={selectWrap}>
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div className="relative flex items-center">
              <select
                value={tabsCount}
                onChange={(e) => setTabsCount(Number(e.target.value))}
                disabled={isScraping}
                className={selectCls}
                aria-label="Parallel tabs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="absolute right-0 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:block">tabs</span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isScraping ? (
            <button
              type="button"
              onClick={onStop}
              disabled={stopPending}
              className="w-full lg:w-auto flex items-center justify-center gap-2 h-10 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 text-white font-semibold text-[13px] px-5 rounded-lg shadow-sm shadow-rose-600/20 transition-all cursor-pointer"
              title="Stop scraping immediately"
            >
              {stopPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Stopping…</span></>
              ) : (
                <><Square className="w-3.5 h-3.5 fill-white" /><span>Stop</span></>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setShowSuggestions(false); onExtract(); }}
              disabled={!searchQuery.trim()}
              className="w-full lg:w-auto flex items-center justify-center gap-2 h-10 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-[13px] px-5 rounded-lg shadow-sm shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Extract leads</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Scraping status bar at bottom ─────────────────── */}
      {isScraping && (
        <div className="border-t border-indigo-100 px-4 py-2.5 flex items-center gap-2.5 bg-indigo-50/50 rounded-b-xl">
          <span className="relative flex w-1.5 h-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-indigo-600" />
          </span>
          <p className="text-xs font-medium text-indigo-700 truncate flex-1">
            Scraping Google Maps for &ldquo;{searchQuery}&rdquo; — please keep this tab open
          </p>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0 tracking-wide">LIVE</span>
        </div>
      )}
    </div>
  );
}
