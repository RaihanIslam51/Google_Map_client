'use client';

// components/common/ErrorState.js
import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong', description = "We couldn't load the data.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-rose-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-5">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
