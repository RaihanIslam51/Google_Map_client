'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ControlPanelPage() {
  const [proxyEnabled, setProxyEnabled] = useState(true);
  const [headfulMode, setHeadfulMode] = useState(false);
  const [concurrencyLimit, setConcurrencyLimit] = useState(10);

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-slate-800">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-indigo-600" /> Control Panel
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Scraper system parameters, browser concurrency control, and proxy manager.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Browser Proxy Rotation</h3>
            <p className="text-xs text-slate-500 mt-0.5">Automatically rotate residential IPs during Google Maps extraction</p>
          </div>
          <button
            onClick={() => setProxyEnabled(!proxyEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative border cursor-pointer ${proxyEnabled ? 'bg-[#4F46E5] border-indigo-400' : 'bg-slate-200 border-slate-300'}`}
          >
            <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${proxyEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Headless Browser Rendering</h3>
            <p className="text-xs text-slate-500 mt-0.5">Run Chromium in invisible background mode vs GUI mode</p>
          </div>
          <button
            onClick={() => setHeadfulMode(!headfulMode)}
            className={`w-12 h-6 rounded-full transition-colors relative border cursor-pointer ${!headfulMode ? 'bg-[#4F46E5] border-indigo-400' : 'bg-slate-200 border-slate-300'}`}
          >
            <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${!headfulMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Max Concurrency Limit</h3>
            <p className="text-xs text-slate-500 mt-0.5">Maximum active worker browser tabs allowed simultaneously</p>
          </div>
          <select
            value={concurrencyLimit}
            onChange={(e) => setConcurrencyLimit(Number(e.target.value))}
            className="bg-[#F8FAFC] border border-slate-200/80 text-xs font-bold text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none cursor-pointer"
          >
            <option value={5}>5 Workers</option>
            <option value={10}>10 Workers</option>
            <option value={20}>20 Workers</option>
            <option value={50}>50 Workers</option>
          </select>
        </div>
      </div>
    </div>
  );
}
