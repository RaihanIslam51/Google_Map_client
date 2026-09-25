'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Globe, 
  Settings, 
  Trash2, 
  Plus, 
  Calendar,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const MOCK_CONFIGURED_WEBSITES = [
  { _id: '1', name: 'Google Maps Business Directory', baseUrl: 'https://www.google.com/maps', isActive: true, engineMode: 'Playwright Chromium', lastScrapedAt: new Date().toISOString() },
  { _id: '2', name: 'YellowPages Local Directory', baseUrl: 'https://www.yellowpages.com', isActive: true, engineMode: 'Cheerio Fast Mode', lastScrapedAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: '3', name: 'Yelp Business Profiles', baseUrl: 'https://www.yelp.com', isActive: false, engineMode: 'Puppeteer Headless', lastScrapedAt: null },
];

export default function WebsitesPage() {
  const [websites, setWebsites] = useState(MOCK_CONFIGURED_WEBSITES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteUrl, setNewSiteUrl] = useState('');

  const handleToggleActive = (id) => {
    setWebsites(prev => prev.map(w => w._id === id ? { ...w, isActive: !w.isActive } : w));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this source configuration?')) {
      setWebsites(prev => prev.filter(w => w._id !== id));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newSiteName || !newSiteUrl) return;
    const newSite = {
      _id: `site_${Date.now()}`,
      name: newSiteName,
      baseUrl: newSiteUrl.startsWith('http') ? newSiteUrl : `https://${newSiteUrl}`,
      isActive: true,
      engineMode: 'Playwright Chromium',
      lastScrapedAt: null,
    };
    setWebsites(prev => [newSite, ...prev]);
    setNewSiteName('');
    setNewSiteUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-[#4F46E5]" /> Website & Directory Scanner
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure automated B2B directory scrapers and target business domains.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Target Source
        </button>
      </div>

      {/* Website Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((website) => (
          <div
            key={website._id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative"
          >
            {/* Header / Active Toggle */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl border ${
                  website.isActive ? 'bg-indigo-50 border-indigo-100 text-[#4F46E5]' : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}>
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {website.name}
                  </h3>
                  <a
                    href={website.baseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#4F46E5] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    {website.baseUrl.replace('https://', '')} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <button
                onClick={() => handleToggleActive(website._id)}
                className={`p-1 transition-colors cursor-pointer ${
                  website.isActive ? 'text-[#4F46E5]' : 'text-slate-400'
                }`}
              >
                {website.isActive ? (
                  <ToggleRight className="w-7 h-7" />
                ) : (
                  <ToggleLeft className="w-7 h-7" />
                )}
              </button>
            </div>

            {/* Config details */}
            <div className="my-5 space-y-2 bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200/80 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Scraper Engine:</span>
                <span className="text-slate-800 font-semibold">{website.engineMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className={`font-bold ${website.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {website.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Last run: {website.lastScrapedAt ? new Date(website.lastScrapedAt).toLocaleDateString() : 'Never'}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(website._id)}
                  className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 border border-transparent hover:border-rose-100 transition-colors cursor-pointer"
                  title="Remove Source"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Add Target Directory Source</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder="e.g. Local Business Directory"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Base URL</label>
                <input
                  type="text"
                  required
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  placeholder="https://directory.com"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-all shadow-sm"
                >
                  Add Source
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
