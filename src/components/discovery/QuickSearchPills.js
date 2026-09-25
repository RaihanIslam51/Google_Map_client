'use client';

import { Sparkles } from 'lucide-react';

export default function QuickSearchPills({ setSearchQuery, setShowSuggestions }) {
  const quickTags = ['Hotels', 'Mobile Shop', 'Restaurants', 'Software Companies', 'Dentists', 'Gym', 'Real Estate'];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-0.5 px-0.5 whitespace-nowrap">
      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-amber-500" /> QUICK:
      </span>
      {quickTags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => {
            setSearchQuery(tag);
            setShowSuggestions(false);
          }}
          className="bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200/80 hover:border-purple-200 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
