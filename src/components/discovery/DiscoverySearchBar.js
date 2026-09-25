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

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-visible">

      {/* ── Main Search Row ───────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-0 md:gap-0 p-1.5 sm:p-2">

        {/* Search Input */}
        <div ref={searchContainerRef} className="flex-1 relative">
          <div className={`flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl transition-all ${isScraping ? 'bg-indigo-50/60' : 'bg-slate-50/60 hover:bg-slate-100/60'} md:bg-transparent md:hover:bg-transparent`}>
            {isScraping ? (
              <div className="flex items-center justify-center w-5 h-5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping absolute" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 relative" />
              </div>
            ) : (
              <Search className="w-4 h-4 text-violet-500 shrink-0" />
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
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
              readOnly={isScraping}
            />
            {searchQuery && !isScraping && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {showSuggestions && !isScraping && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-50">
              <div className="px-3.5 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {filteredSuggestions.length} Category Suggestions
                </span>
                <span className="text-[9px] text-violet-600 font-semibold">Click to select</span>
              </div>

              {filteredSuggestions.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => { setSearchQuery(item.query); setShowSuggestions(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-violet-50/60 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="text-base leading-none shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-violet-700 transition-colors truncate">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        &quot;<span className="font-semibold text-slate-600">{item.query}</span>&quot;
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 group-hover:bg-violet-100 text-slate-600 group-hover:text-violet-700 font-bold px-2 py-0.5 rounded-md transition-colors shrink-0">
                    {item.category}
                  </span>
                </button>
              ))}

              {filteredSuggestions.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  Press <kbd className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-200">Enter</kbd> to search for &quot;<span className="font-bold text-slate-700">{searchQuery}</span>&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden md:block h-8 border-r border-slate-200/80 mx-1" />

        {/* Options: Limit + Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-t md:border-none border-slate-100 pt-1.5 md:pt-0 px-2 md:px-1">

          {/* Limit Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:block">Limit</span>
            <div className="relative flex items-center">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                disabled={isScraping}
                className="appearance-none bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-4 disabled:opacity-60"
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
            <span className="text-[9px] text-slate-500 font-medium hidden sm:block">leads</span>
          </div>

          {/* Tabs Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
            <Zap className="w-3 h-3 text-amber-500 shrink-0" />
            <div className="relative flex items-center">
              <select
                value={tabsCount}
                onChange={(e) => setTabsCount(Number(e.target.value))}
                disabled={isScraping}
                className="appearance-none bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-4 disabled:opacity-60"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="absolute right-0 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
            <span className="text-[9px] text-slate-500 font-medium hidden sm:block">tabs</span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block h-8 border-r border-slate-200/80 mx-1" />

        {/* Action Button */}
        <div className="pt-1.5 md:pt-0 px-1">
          {isScraping ? (
            <button
              type="button"
              onClick={onStop}
              disabled={stopPending}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-rose-200/60 transition-all cursor-pointer border border-rose-500/40"
              title="Stop scraping immediately"
            >
              {stopPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Stopping…</span></>
              ) : (
                <><Square className="w-3.5 h-3.5 fill-white" /><span>STOP</span></>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setShowSuggestions(false); onExtract(); }}
              disabled={!searchQuery.trim()}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-violet-200/60 transition-all cursor-pointer border border-violet-500/30"
            >
              <Play className="w-3.5 h-3.5 fill-white text-white" />
              <span>Extract Leads</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Scraping status bar at bottom ─────────────────── */}
      {isScraping && (
        <div className="border-t border-indigo-100 px-4 py-2 flex items-center gap-2 bg-indigo-50/50 rounded-b-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <p className="text-[10px] font-semibold text-indigo-600 truncate flex-1">
            Scraping Google Maps for &ldquo;{searchQuery}&rdquo; — do not close this tab
          </p>
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">LIVE</span>
        </div>
      )}
    </div>
  );
}
