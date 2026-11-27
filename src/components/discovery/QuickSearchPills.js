'use client';

import { Sparkles } from 'lucide-react';

export default function QuickSearchPills({ setSearchQuery, setShowSuggestions }) {
  const quickTags = ['Hotels', 'Mobile Shop', 'Restaurants', 'Software Companies', 'Dentists', 'Gym', 'Real Estate'];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 whitespace-nowrap">
      <span className="text-xs font-medium text-slate-400 shrink-0 flex items-center gap-1.5 mr-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick search
      </span>
      {quickTags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => {
            setSearchQuery(tag);
            setShowSuggestions(false);
          }}
          className="bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-medium px-3 py-1.5 rounded-full transition-colors shrink-0 cursor-pointer"
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
