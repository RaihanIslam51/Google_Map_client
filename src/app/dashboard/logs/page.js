'use client';

import { useState } from 'react';
import { FileText, RefreshCw, Info, AlertTriangle, XCircle } from 'lucide-react';

const MOCK_LOGS = [
  { id: 1, time: '10:42:31', level: 'INFO',  service: 'scraper',  message: 'Business saved: ABC Restaurant (pid1)' },
  { id: 2, time: '10:42:30', level: 'INFO',  service: 'scraper',  message: 'Duplicate detected: City Hotel — skipping' },
  { id: 3, time: '10:42:28', level: 'WARN',  service: 'browser',  message: 'Slow response from Google Maps (>5s)' },
  { id: 4, time: '10:42:20', level: 'INFO',  service: 'database', message: 'MongoDB connection established' },
  { id: 5, time: '10:42:15', level: 'ERROR', service: 'scraper',  message: 'Failed to extract phone for Unknown Business' },
  { id: 6, time: '10:41:55', level: 'INFO',  service: 'scraper',  message: 'Starting search: restaurant in Dinajpur' },
  { id: 7, time: '10:41:30', level: 'INFO',  service: 'scraper',  message: 'Browser launched successfully' },
  { id: 8, time: '10:41:00', level: 'WARN',  service: 'database', message: 'Slow query detected: businesses.find (1.2s)' },
  { id: 9, time: '10:40:45', level: 'ERROR', service: 'scraper',  message: 'Navigation timeout after 30s — retrying' },
  { id: 10, time: '10:40:30', level: 'INFO', service: 'api',      message: 'POST /api/search-jobs — 201 Created' },
];

const LEVEL_STYLES = {
  INFO:  { cls: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Info },
  WARN:  { cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: AlertTriangle },
  ERROR: { cls: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: XCircle },
};

export default function LogsPage() {
  const [levelFilter, setLevelFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  const filtered = MOCK_LOGS.filter(l => {
    if (levelFilter && l.level !== levelFilter) return false;
    if (serviceFilter && l.service !== serviceFilter) return false;
    return true;
  });

  return (
    <div className="space-y-5 max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Logs</h1>
          <p className="text-sm text-slate-400 mt-0.5">System and scraper activity logs.</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none">
          <option value="">All Levels</option>
          <option>INFO</option>
          <option>WARN</option>
          <option>ERROR</option>
        </select>
        <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-blue-500 focus:outline-none">
          <option value="">All Services</option>
          {['scraper', 'database', 'browser', 'api'].map(s => <option key={s}>{s}</option>)}
        </select>
        {(levelFilter || serviceFilter) && (
          <button onClick={() => { setLevelFilter(''); setServiceFilter(''); }}
            className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 border border-slate-700 rounded-lg">
            Clear Filters
          </button>
        )}
      </div>

      {/* Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="border-b border-slate-800">
                {['Time', 'Level', 'Service', 'Message'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold font-sans text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const style = LEVEL_STYLES[log.level] ?? LEVEL_STYLES.INFO;
                const Icon = style.icon;
                return (
                  <tr key={log.id} className="border-b border-slate-800/50 table-row-hover">
                    <td className="px-4 py-2.5 text-[11px] text-slate-600 whitespace-nowrap">{log.time}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${style.cls}`}>
                        <Icon className="w-2.5 h-2.5" />{log.level}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-500 whitespace-nowrap">{log.service}</td>
                    <td className="px-4 py-2.5 text-[11px] text-slate-300">{log.message}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-xs text-slate-500">No logs match your filters.</div>
        )}
      </div>

      <p className="text-xs text-slate-600 italic">Showing last 50 log entries. Connect backend /api/logs for live data.</p>
    </div>
  );
}
