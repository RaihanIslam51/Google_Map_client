'use client';

import { useState, useRef, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  MapPin, Globe, Search, Phone, Target, Trash2,
  ChevronLeft, ChevronRight, Loader2,
  Star, ExternalLink, Download, X,
  Database, CheckSquare, SortAsc,
  Users, PhoneCall, Globe2,
  LayoutGrid, List, Zap,
  ChevronDown, RefreshCw,
} from 'lucide-react';
import { businessesApi } from '../../../lib/api/businesses';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useLeadsCacheQuery } from '../../../hooks/useLeadsCacheQuery';
import { leadsCache } from '../../../lib/cache/leadsCache';

/* ── Helpers ────────────────────────────────────────────────── */
const CATEGORY_EMOJI = {
  default:'🏢', restaurant:'🍽️', food:'🍽️', cafe:'☕', bakery:'🥐',
  hotel:'🏨', resort:'🏖️', motel:'🛏️',
  hospital:'🏥', clinic:'🏥', doctor:'👨‍⚕️', dental:'🦷', dentist:'🦷', pharmacy:'💊',
  school:'🎓', college:'🎓', university:'🏫', education:'📚',
  software:'💻', tech:'💻', it:'💻',
  mobile:'📱', phone:'📱', electronics:'⚡',
  jewelry:'💍', jewellery:'💍', gold:'✨', diamond:'💎',
  realestate:'🏡', real:'🏡', property:'🏡',
  bank:'🏦', finance:'💰', insurance:'🛡️',
  gym:'💪', fitness:'💪', salon:'💇', spa:'🧖',
  shop:'🛍️', store:'🛒', market:'🛒', supermarket:'🛒',
  lawyer:'⚖️', legal:'⚖️', travel:'✈️', tour:'🗺️',
  auto:'🚗', car:'🚗', garage:'🔧',
  construction:'🏗️', contractor:'🔨',
};

function getCategoryEmoji(cat = '') {
  const lower = cat.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return CATEGORY_EMOJI.default;
}

function getCategoryColor(cat = '') {
  const l = cat.toLowerCase();
  if (l.includes('restaurant')||l.includes('food')||l.includes('cafe')) return 'text-orange-700 bg-orange-50 border-orange-200';
  if (l.includes('hotel')||l.includes('resort')) return 'text-sky-700 bg-sky-50 border-sky-200';
  if (l.includes('hospital')||l.includes('clinic')||l.includes('dental')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (l.includes('pharmacy')) return 'text-teal-700 bg-teal-50 border-teal-200';
  if (l.includes('school')||l.includes('college')||l.includes('education')) return 'text-violet-700 bg-violet-50 border-violet-200';
  if (l.includes('software')||l.includes('tech')||l.includes(' it')) return 'text-blue-700 bg-blue-50 border-blue-200';
  if (l.includes('mobile')||l.includes('electronics')) return 'text-amber-700 bg-amber-50 border-amber-200';
  if (l.includes('jewelry')||l.includes('gold')) return 'text-rose-700 bg-rose-50 border-rose-200';
  if (l.includes('real')||l.includes('property')) return 'text-lime-700 bg-lime-50 border-lime-200';
  return 'text-indigo-700 bg-indigo-50 border-indigo-200';
}

function getWhatsAppUrl(phone = '') {
  if (!phone || typeof phone !== 'string' || phone === 'N/A') return null;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('01') && cleaned.length === 11) cleaned = '88' + cleaned;
  cleaned = cleaned.replace(/^\+/, '');
  return `https://wa.me/${cleaned}`;
}

function parseKeyword(key = '') {
  if (!key || key === 'All') return { label: 'All Campaigns', location: '', full: 'All' };
  let label = key, location = '';
  if (key.includes(' in '))        { const p = key.split(' in ');  label = p[0].trim(); location = p.slice(1).join(' in ').trim(); }
  else if (key.includes(' near ')) { const p = key.split(' near '); label = p[0].trim(); location = p.slice(1).join(' near ').trim(); }
  else if (key.includes(','))      { const p = key.split(',');      label = p[0].trim(); location = p.slice(1).join(', ').trim(); }
  label    = label.charAt(0).toUpperCase() + label.slice(1);
  location = location ? location.charAt(0).toUpperCase() + location.slice(1) : '';
  return { label, location, full: key };
}
function kwLabel(key = '') { return parseKeyword(key).label; }

function WaIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.474 1.333 4.988l-1.417 5.177 5.299-1.39a9.943 9.943 0 0 0 4.773 1.216h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0 0 12.012 2zm0 18.163h-.003a8.277 8.277 0 0 1-4.22-1.157l-.303-.18-3.137.822.836-3.057-.197-.314a8.272 8.272 0 0 1-1.267-4.46c0-4.568 3.718-8.286 8.288-8.286 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.425 5.86c0 4.569-3.717 8.288-8.28 8.288zm4.542-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.166.249-.643.81-.788.976-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.003-1.237-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.29.373-.435.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.076 0 1.225.892 2.408 1.016 2.574.125.166 1.756 2.682 4.254 3.761.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.183.208-.581.208-1.079.145-1.183-.063-.104-.229-.166-.478-.291z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function LeadsCrmPage() {
  const qc = useQueryClient();

  const [viewMode, setViewMode]                   = useState('table');
  const [selectedKeyword, setSelectedKeyword]     = useState('All');
  const [selectedCategory, setSelectedCategory]   = useState('');
  const [selectedSort, setSelectedSort]           = useState('default');
  const [searchQuery, setSearchQuery]             = useState('');
  const [activeFilter, setActiveFilter]           = useState('all');
  const [page, setPage]                           = useState(1);
  const [selectedIds, setSelectedIds]             = useState(new Set());
  const [deleteId, setDeleteId]                   = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [deleteGroupTarget, setDeleteGroupTarget] = useState(null);

  const kwScrollRef = useRef(null);
  const scrollKw = (dir) => {
    if (kwScrollRef.current) kwScrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  /* ── Data ─────────────────────────────────────────────────── */
  const { data, isLoading, refetch, isFetching } = useLeadsCacheQuery({
    queryKey: ['crm-businesses', page, searchQuery, selectedCategory, selectedKeyword, activeFilter],
    queryFn: () => businessesApi.getAll({
      page, limit: 50,
      search: searchQuery,
      category: selectedCategory,
      keyword: selectedKeyword === 'All' ? '' : selectedKeyword,
      isTarget: activeFilter === 'target' ? true : undefined,
    }),
    staleTime: 60000,
  });

  const { data: statsRes, refetch: refetchStats } = useLeadsCacheQuery({
    queryKey: ['crm-businesses-stats'],
    queryFn: () => businessesApi.getStats(),
    staleTime: 60000,
  });
  const dbStats = statsRes?.data;

  /* ── Mutations ────────────────────────────────────────────── */
  const deleteMutation = useMutation({
    mutationFn: (id) => businessesApi.deleteById(id),
    onSuccess: async () => {
      await leadsCache.clearMatching('crm-businesses');
      await leadsCache.clearMatching('target-leads-list');
      qc.invalidateQueries({ queryKey: ['crm-businesses'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses-stats'] });
      qc.invalidateQueries({ queryKey: ['target-leads-list'] });
      setDeleteId(null);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids) => businessesApi.deleteBulk({ ids }),
    onSuccess: async () => {
      await leadsCache.clearMatching('crm-businesses');
      await leadsCache.clearMatching('target-leads-list');
      qc.invalidateQueries({ queryKey: ['crm-businesses'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses-stats'] });
      qc.invalidateQueries({ queryKey: ['target-leads-list'] });
      setSelectedIds(new Set());
      setShowBulkDeleteModal(false);
    },
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (t) => businessesApi.deleteBulk(
      t.type === 'category' ? { category: t.key } : { keyword: t.key }
    ),
    onSuccess: async () => {
      await leadsCache.clearMatching('crm-businesses');
      await leadsCache.clearMatching('target-leads-list');
      qc.invalidateQueries({ queryKey: ['crm-businesses'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses-stats'] });
      qc.invalidateQueries({ queryKey: ['target-leads-list'] });
      if (deleteGroupTarget?.key === selectedKeyword) setSelectedKeyword('All');
      if (deleteGroupTarget?.key === selectedCategory) setSelectedCategory('');
      setDeleteGroupTarget(null);
    },
  });

  const toggleTargetMutation = useMutation({
    mutationFn: ({ id, isTarget }) => businessesApi.toggleTarget(id, isTarget),
    onSuccess: async () => {
      await leadsCache.clearMatching('crm-businesses');
      await leadsCache.clearMatching('target-leads-list');
      qc.invalidateQueries({ queryKey: ['crm-businesses'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses-stats'] });
      qc.invalidateQueries({ queryKey: ['target-leads-list'] });
    },
  });

  /* ── Derived ──────────────────────────────────────────────── */
  const rawBusinesses = useMemo(() => Array.isArray(data?.data) ? data.data : [], [data]);

  let businesses = rawBusinesses.filter(b => {
    if (!b || typeof b !== 'object') return false;
    if (activeFilter === 'phone')      return b.phone && b.phone !== 'N/A' && b.phone !== '';
    if (activeFilter === 'no_website') return !b.website || b.website === '';
    if (activeFilter === 'website')    return b.website && b.website !== '';
    if (activeFilter === 'target')     return Boolean(b.isTarget);
    return true;
  });

  if (selectedSort === 'name')   businesses = [...businesses].sort((a, b) => String(a.title || a.name || '').localeCompare(String(b.title || b.name || '')));
  if (selectedSort === 'rating') businesses = [...businesses].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  if (selectedSort === 'date')   businesses = [...businesses].sort((a, b) => new Date(b.scrapedAt || 0) - new Date(a.scrapedAt || 0));

  const total = data?.total ?? businesses.length;
  const pages = data?.pages ?? 1;

  const realTotal          = dbStats?.totalLeads ?? total;
  const realTargetCount    = dbStats?.targetCount ?? 0;
  const realPhoneCount     = dbStats?.hasPhoneCount ?? 0;
  const realWebsiteCount   = dbStats?.hasWebsiteCount ?? 0;
  const realNoWebsiteCount = dbStats?.noWebsiteCount ?? 0;

  const dbKeywords = Array.isArray(data?.keywords) && data.keywords.length > 0
    ? data.keywords
    : (Array.isArray(dbStats?.topKeywords) ? dbStats.topKeywords : []);

  /* ── Bulk helpers ─────────────────────────────────────────── */
  const toggleSelectAll = () => {
    if (selectedIds.size === businesses.length && businesses.length > 0) setSelectedIds(new Set());
    else setSelectedIds(new Set(businesses.filter(b => b?._id).map(b => b._id)));
  };
  const toggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleExportCSV = () => {
    const list = businesses.filter(b => selectedIds.has(b._id));
    if (!list.length) return;
    const hdrs = ['Business Name','Category','Email','Phone','WhatsApp','Address','Rating','Reviews','Website','Maps URL','Search Keyword','Scraped At'];
    const rows = [hdrs.join(','), ...list.map(l => [
      `"${String(l?.title || l?.name || '').replace(/"/g,'""')}"`,
      `"${String(l?.category || '').replace(/"/g,'""')}"`,
      `"${String(l?.email || '').replace(/"/g,'""')}"`,
      `"${String(l?.phone || '').replace(/"/g,'""')}"`,
      `"${String(l?.whatsapp || '').replace(/"/g,'""')}"`,
      `"${String(l?.address || '').replace(/"/g,'""')}"`,
      `"${String(l?.rating || '')}"`,
      `"${String(l?.reviewCount || '')}"`,
      `"${String(l?.website || '').replace(/"/g,'""')}"`,
      `"${String(l?.mapsUrl || '').replace(/"/g,'""')}"`,
      `"${String(l?.searchKeyword || '').replace(/"/g,'""')}"`,
      `"${l?.scrapedAt ? new Date(l.scrapedAt).toLocaleString() : ''}"`,
    ].join(','))];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' }));
    a.download = `leads_crm_${Date.now()}.csv`;
    a.click();
  };

  const handleRefresh = () => { refetch(); refetchStats(); };

  /* ── Filter badges ────────────────────────────────────────── */
  const filterBadges = [
    { id: 'all',        label: 'All',          count: realTotal,          icon: Users },
    { id: 'target',     label: 'Targeted',     count: realTargetCount,    icon: Target },
    { id: 'phone',      label: 'Has Phone',    count: realPhoneCount,     icon: PhoneCall },
    { id: 'no_website', label: 'No Website',   count: realNoWebsiteCount, icon: Globe2 },
    { id: 'website',    label: 'Has Website',  count: realWebsiteCount,   icon: Globe },
  ];

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-4 container mx-auto text-slate-800">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-indigo-600 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Leads CRM
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {realTotal.toLocaleString()} total leads in database
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-indigo-600' : ''}`} />
            Refresh
          </button>
          <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
            📦 IndexedDB Cached
          </span>
        </div>
      </div>

      {/* ── CAMPAIGN KEYWORD TABS ──────────────────────────────── */}
      {dbKeywords.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">Scrape Campaigns</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                {dbKeywords.length}
              </span>
            </div>
            {selectedKeyword !== 'All' && (
              <button type="button" onClick={() => { setSelectedKeyword('All'); setPage(1); }}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="p-3">
            {/* Scroll wrapper with arrow buttons */}
            <div className="relative">
              {/* Left arrow */}
              <button type="button" onClick={() => scrollKw(-1)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 text-slate-400 transition-all cursor-pointer -ml-2.5">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {/* Right arrow */}
              <button type="button" onClick={() => scrollKw(1)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-sm hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 text-slate-400 transition-all cursor-pointer -mr-2.5">
                <ChevronRight className="w-4 h-4" />
              </button>

            <div ref={kwScrollRef} className="flex items-stretch gap-2 overflow-x-auto no-scrollbar pb-1 px-4">
              {/* All card */}
              <div onClick={() => { setSelectedKeyword('All'); setPage(1); }}
                className={`flex-none w-36 sm:w-44 flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedKeyword === 'All'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                }`}>
                <span className="text-xl mb-1">🗂️</span>
                <p className={`text-xs font-bold truncate ${selectedKeyword === 'All' ? 'text-white' : 'text-slate-800'}`}>All Campaigns</p>
                <p className={`text-[10px] truncate ${selectedKeyword === 'All' ? 'text-indigo-200' : 'text-slate-400'}`}>All Locations</p>
                <p className={`text-lg font-black mt-1 ${selectedKeyword === 'All' ? 'text-white' : 'text-slate-900'}`}>{realTotal.toLocaleString()}</p>
                <div className={`w-full h-1 rounded-full mt-2 ${selectedKeyword === 'All' ? 'bg-white/30' : 'bg-slate-100'}`}>
                  <div className={`h-full rounded-full w-full ${selectedKeyword === 'All' ? 'bg-white' : 'bg-indigo-500'}`} />
                </div>
              </div>

              {dbKeywords.map(kw => {
                const key = kw._id || 'General';
                const isSelected = selectedKeyword === key;
                const { label, location } = parseKeyword(key);
                const pct = realTotal > 0 ? Math.round((kw.count / realTotal) * 100) : 0;
                const emoji = getCategoryEmoji(key);
                return (
                  <div key={key} onClick={() => { setSelectedKeyword(key); setPage(1); }}
                    className={`group flex-none w-36 sm:w-44 flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all relative ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800'
                    }`}>
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xl">{emoji}</span>
                      <button type="button"
                        onClick={e => { e.stopPropagation(); setDeleteGroupTarget({ type: 'keyword', name: location ? `${label} (${location})` : label, key, count: kw.count || 0 }); }}
                        className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer ${
                          isSelected ? 'text-indigo-200 hover:text-white' : 'text-slate-400 hover:text-red-500'
                        }`}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-800'}`} title={label}>{label}</p>
                    {location ? (
                      <p className={`text-[10px] font-medium truncate flex items-center gap-0.5 ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`}>
                        <MapPin className="w-2.5 h-2.5 shrink-0" />{location}
                      </p>
                    ) : (
                      <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>General</p>
                    )}
                    <p className={`text-lg font-black mt-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>{(kw.count || 0).toLocaleString()}</p>
                    <div className={`w-full h-1 rounded-full mt-2 ${isSelected ? 'bg-white/30' : 'bg-slate-100'}`}>
                      <div className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} style={{ width: `${Math.max(4, pct)}%` }} />
                    </div>
                    <p className={`text-[9px] mt-1 font-semibold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>{pct}% of total</p>
                  </div>
                );
              })}
            </div>
            </div>{/* end relative wrapper */}
          </div>
        </div>
      )}

      {/* ── SEARCH / SORT / VIEW BAR ───────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input type="text" value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search name, phone, address…"
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select value={selectedSort} onChange={e => setSelectedSort(e.target.value)}
              className="border border-slate-200 rounded-lg bg-slate-50 text-slate-700 text-sm font-medium pl-8 pr-8 py-2 outline-none cursor-pointer appearance-none focus:border-indigo-400 transition-colors w-full sm:w-auto">
              <option value="default">Default Order</option>
              <option value="name">Name A–Z</option>
              <option value="rating">Highest Rating</option>
              <option value="date">Newest First</option>
            </select>
          </div>

          {/* View + Export */}
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button type="button" onClick={handleExportCSV}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                <Download className="w-3.5 h-3.5" /> Export {selectedIds.size}
              </button>
            )}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 ml-auto sm:ml-0">
              <button type="button" onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <List className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${viewMode === 'card' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {filterBadges.map(({ id, label, icon: Icon, count }) => (
            <button key={id} type="button"
              onClick={() => { setActiveFilter(id); setPage(1); }}
              className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                activeFilter === id ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
              }`}>{count.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── BULK ACTION BAR ───────────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-3 right-3 z-50 sm:relative sm:bottom-auto sm:left-auto sm:right-auto bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
            <p className="text-xs font-bold text-white">{selectedIds.size} lead{selectedIds.size > 1 ? 's' : ''} selected</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleExportCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button type="button" onClick={() => setShowBulkDeleteModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" /> Delete {selectedIds.size}
            </button>
            <button type="button" onClick={() => setSelectedIds(new Set())}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── RESULTS BAR ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs text-slate-400">
            Showing <span className="text-slate-800 font-bold">{businesses.length}</span> of{' '}
            <span className="text-slate-800 font-bold">{total.toLocaleString()}</span> leads
          </p>
          {selectedKeyword !== 'All' && (
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              {kwLabel(selectedKeyword)}
            </span>
          )}
          {selectedCategory && (
            <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
              {selectedCategory}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <span className="text-xs text-slate-500 font-medium px-1">{page} / {pages}</span>
          <button type="button" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Loading leads…</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center">
              <Database className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-500">No leads found</p>
            <p className="text-xs text-slate-400">Try adjusting filters or run a new scrape</p>
          </div>
        ) : viewMode === 'card' ? (

          /* ════ CARD GRID ════════════════════════════════════════ */
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {businesses.map((b, idx) => {
              if (!b || typeof b !== 'object') return null;
              const isSelected = selectedIds.has(b._id);
              const isTarget   = Boolean(b.isTarget);
              const title      = String(b.title || b.name || 'Unnamed');
              const category   = String(b.category || '');
              const phone      = String(b.phone || '');
              const website    = String(b.website || '');
              const rating     = parseFloat(b.rating || 0);
              const waUrl      = getWhatsAppUrl(phone);
              const catColor   = getCategoryColor(category);
              const emoji      = getCategoryEmoji(category);
              const hasPhone   = phone && phone !== 'N/A';

              return (
                <div key={`${b._id}_card_${idx}`}
                  className={`relative border rounded-xl p-3.5 flex flex-col gap-2.5 transition-all hover:shadow-md ${
                    isSelected ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200 bg-white'
                  }`}>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(b._id)}
                    className="absolute top-3 left-3 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5" />
                  <button type="button" onClick={() => setDeleteId(b._id)}
                    className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <div className="flex items-center justify-between pl-6 pr-6">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${catColor}`}>{emoji} {category || 'Business'}</span>
                    <button type="button" onClick={() => toggleTargetMutation.mutate({ id: b._id, isTarget: !isTarget })}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${isTarget ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                      <Target className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <Link href={`/dashboard/businesses/${b._id}`}
                      className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors leading-snug break-words block">{title}</Link>
                    {b.mapsUrl && (
                      <a href={b.mapsUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-500 mt-0.5">
                        <ExternalLink className="w-3 h-3" /> Maps
                      </a>
                    )}
                  </div>

                  {b.address && b.address !== 'N/A' && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
                      <span className="leading-relaxed line-clamp-2">{b.address}</span>
                    </div>
                  )}

                  {rating > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-700">{rating.toFixed(1)}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 mt-auto">
                    {hasPhone ? (
                      <a href={`tel:${phone}`}
                        className="flex items-center justify-center gap-1 bg-emerald-600 text-white py-1.5 px-2 rounded-lg text-[11px] font-semibold truncate">
                        <Phone className="w-3 h-3 shrink-0" /><span className="truncate">{phone}</span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-1 bg-slate-50 border border-slate-100 text-slate-300 py-1.5 px-2 rounded-lg text-[11px]">
                        <Phone className="w-3 h-3" /> No phone
                      </div>
                    )}
                    {waUrl ? (
                      <a href={waUrl} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-1.5 px-2 rounded-lg text-[11px] font-bold transition-colors">
                        <WaIcon size={13} /> Chat
                      </a>
                    ) : (
                      <div className="flex items-center justify-center text-[11px] text-slate-300 bg-slate-50 border border-slate-100 py-1.5 px-2 rounded-lg">N/A</div>
                    )}
                  </div>

                  {website && website !== 'N/A' && (
                    <a href={website.startsWith('http') ? website : `https://${website}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-sky-600 hover:underline text-xs font-medium truncate">
                      <Globe className="w-3 h-3 shrink-0" />
                      {website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

        ) : (
          /* ════ TABLE VIEW ═══════════════════════════════════════ */
          <>
            {/* Mobile cards (< md) */}
            <div className="md:hidden p-2.5 space-y-2.5">
              {businesses.map((b, idx) => {
                if (!b || typeof b !== 'object') return null;
                const isSelected = selectedIds.has(b._id);
                const isTarget   = Boolean(b.isTarget);
                const title      = String(b.title || b.name || 'Unnamed');
                const category   = String(b.category || '');
                const phone      = String(b.phone || '');
                const website    = String(b.website || '');
                const waUrl      = getWhatsAppUrl(phone);
                const catColor   = getCategoryColor(category);
                const emoji      = getCategoryEmoji(category);
                const hasPhone   = phone && phone !== 'N/A' && phone !== '';
                const hasWebsite = website && website !== 'N/A' && website !== '';
                const rating     = parseFloat(b.rating || 0);

                return (
                  <div key={`${b._id}_mob_${idx}`}
                    className={`border rounded-xl p-3.5 space-y-3 transition-all ${
                      isSelected ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200 bg-white'
                    }`}>

                    {/* Top row: checkbox + category + actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(b._id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer w-4 h-4 shrink-0" />
                        <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-lg border truncate ${catColor}`}>{emoji} {category || 'Uncategorized'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button type="button"
                          onClick={() => toggleTargetMutation.mutate({ id: b._id, isTarget: !isTarget })}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-all ${
                            isTarget ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}>
                          <Target className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setDeleteId(b._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Business name */}
                    <div>
                      <div className="flex items-start gap-2 flex-wrap">
                        <Link href={`/dashboard/businesses/${b._id}`}
                          className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors leading-snug flex-1">
                          {title}
                        </Link>
                        {b.mapsUrl && (
                          <a href={b.mapsUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded shrink-0">
                            <ExternalLink className="w-2.5 h-2.5" /> Maps
                          </a>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {b.searchKeyword && (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                            🏷️ {kwLabel(b.searchKeyword)}
                          </span>
                        )}
                        {rating > 0 && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Address */}
                    {b.address && b.address !== 'N/A' && (
                      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-100 p-2 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                        <span className="leading-relaxed">{b.address}</span>
                      </div>
                    )}

                    {/* Website */}
                    {hasWebsite ? (
                      <a href={website.startsWith('http') ? website : `https://${website}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center justify-between gap-1.5 bg-sky-50 border border-sky-200 text-sky-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold w-full">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Globe className="w-3.5 h-3.5 shrink-0 text-sky-500" />
                          <span className="truncate">{website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 shrink-0 text-sky-400" />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded-lg">
                        <Globe className="w-3 h-3" /> No Website
                      </span>
                    )}

                    {/* Phone + WhatsApp */}
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
                      {hasPhone ? (
                        <a href={`tel:${phone}`}
                          className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white py-2 px-2.5 rounded-lg text-xs font-semibold">
                          <Phone className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{phone}</span>
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 bg-slate-50 border border-slate-100 py-2 px-2.5 rounded-lg">
                          <Phone className="w-3.5 h-3.5" /> No phone
                        </div>
                      )}
                      {waUrl ? (
                        <a href={waUrl} target="_blank" rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-2.5 rounded-lg text-xs font-bold transition-colors">
                          <WaIcon size={14} /> WhatsApp
                        </a>
                      ) : (
                        <div className="flex items-center justify-center text-xs text-slate-300 bg-slate-50 border border-slate-100 py-2 px-2.5 rounded-lg">N/A</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table (≥ md) */}
            <div className="hidden md:block">
              <table className="w-full text-left table-fixed" style={{ borderCollapse: 'collapse' }}>
                <colgroup>
                  <col style={{ width: '36px' }} />
                  <col style={{ width: '26%' }} />
                  <col style={{ width: '18%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '72px' }} />
                  <col style={{ width: '72px' }} />
                  <col style={{ width: '36px' }} />
                </colgroup>
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="pl-4 pr-2 py-3">
                      <input type="checkbox"
                        checked={selectedIds.size === businesses.length && businesses.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5" />
                    </th>
                    {['Business & Category','Address','Contact','Website','Rating','Target',''].map(h => (
                      <th key={h} className="px-3 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((b, idx) => {
                    const isSelected = selectedIds.has(b._id);
                    const isTarget   = Boolean(b.isTarget);
                    const title      = b.title || b.name || 'Unnamed';
                    const category   = String(b.category || '');
                    const phone      = String(b.phone || '');
                    const hasPhone   = phone && phone !== 'N/A' && phone !== '';
                    const waUrl      = getWhatsAppUrl(phone);
                    const website    = String(b.website || '');
                    const hasWebsite = website && website !== 'N/A' && website !== '';
                    const rating     = parseFloat(b.rating || 0);
                    const reviewCount = b.reviewCount || b.reviews || 0;
                    const catColor   = getCategoryColor(category);
                    const emoji      = getCategoryEmoji(category);

                    return (
                      <tr key={`${b._id}_tr_${idx}`}
                        className="group border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        style={{ background: isSelected ? '#eef2ff' : undefined }}>

                        <td className="pl-4 pr-2 py-3 align-top">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(b._id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5" />
                        </td>

                        {/* Business */}
                        <td className="px-3 py-3 align-top">
                          <div className="flex items-start gap-1.5 mb-1.5 flex-wrap">
                            <Link href={`/dashboard/businesses/${b._id}`}
                              className="text-[12.5px] font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-snug">
                              {title}
                            </Link>
                            {b.mapsUrl && (
                              <a href={b.mapsUrl} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded shrink-0">
                                <MapPin className="w-2 h-2" /> Maps
                              </a>
                            )}
                          </div>
                          <button type="button"
                            onClick={() => { setSelectedCategory(category === selectedCategory ? '' : category); setPage(1); }}
                            className={`inline-flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${catColor}`}>
                            <span>{emoji}</span>
                            <span className="truncate max-w-[110px]">{category || 'Uncategorized'}</span>
                          </button>
                        </td>

                        {/* Address */}
                        <td className="px-3 py-3 align-top">
                          {b.address && b.address !== 'N/A' ? (
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <span className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{b.address}</span>
                            </div>
                          ) : <span className="text-slate-200 text-base">—</span>}
                        </td>

                        {/* Contact */}
                        <td className="px-3 py-3 align-top">
                          <div className="flex flex-col gap-1.5">
                            {hasPhone ? (
                              <a href={`tel:${phone}`}
                                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-lg text-[10.5px] font-semibold transition-colors w-fit max-w-full">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span className="truncate">{phone}</span>
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-300 italic">No phone</span>
                            )}
                            {waUrl && (
                              <a href={waUrl} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-2 py-1 rounded-lg text-[10px] font-bold transition-colors w-fit">
                                <WaIcon size={11} /> WhatsApp
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Website */}
                        <td className="px-3 py-3 align-top">
                          {hasWebsite ? (
                            <a href={website.startsWith('http') ? website : `https://${website}`}
                              target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 hover:underline text-[10.5px] font-medium max-w-full">
                              <Globe className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[80px]">{website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0 text-slate-300" />
                            </a>
                          ) : (
                            <span className="text-[9.5px] font-semibold text-red-400 bg-red-50 border border-dashed border-red-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Globe className="w-2.5 h-2.5" /> No Site
                            </span>
                          )}
                        </td>

                        {/* Rating */}
                        <td className="px-2 py-3 align-top text-center">
                          {rating > 0 ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{rating.toFixed(1)}
                              </span>
                              {reviewCount > 0 && <span className="text-[8px] text-slate-400">{Number(reviewCount).toLocaleString()}</span>}
                            </div>
                          ) : <span className="text-slate-200">—</span>}
                        </td>

                        {/* Target */}
                        <td className="px-2 py-3 align-top text-center">
                          <button type="button"
                            onClick={() => toggleTargetMutation.mutate({ id: b._id, isTarget: !isTarget })}
                            disabled={toggleTargetMutation.isPending}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9.5px] font-bold cursor-pointer border transition-all ${
                              isTarget
                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}>
                            <Target className="w-3 h-3 shrink-0" />
                            {isTarget ? 'On' : 'Set'}
                          </button>
                        </td>

                        {/* Delete */}
                        <td className="px-2 py-3 align-top">
                          <button type="button" onClick={() => setDeleteId(b._id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-200 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100 ml-auto">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── BOTTOM PAGINATION ─────────────────────────────────────── */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          <button type="button" onClick={() => setPage(1)} disabled={page === 1}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 rounded-lg disabled:opacity-30 cursor-pointer transition-all">
            First
          </button>
          <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
              let pg = i + 1;
              if (pages > 7) {
                if (page <= 4) pg = i + 1;
                else if (page >= pages - 3) pg = pages - 6 + i;
                else pg = page - 3 + i;
              }
              return (
                <button key={pg} type="button" onClick={() => setPage(pg)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    pg === page ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                  }`}>{pg}</button>
              );
            })}
          </div>
          <button type="button" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
          <button type="button" onClick={() => setPage(pages)} disabled={page === pages}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 rounded-lg disabled:opacity-30 cursor-pointer transition-all">
            Last
          </button>
        </div>
      )}

      {/* ── DIALOGS ───────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
        title="Delete Lead"
        description="This lead will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        confirmClassName="bg-red-600 hover:bg-red-700 text-white"
      />
      <ConfirmDialog
        isOpen={showBulkDeleteModal}
        onCancel={() => setShowBulkDeleteModal(false)}
        onConfirm={() => bulkDeleteMutation.mutate(Array.from(selectedIds))}
        isLoading={bulkDeleteMutation.isPending}
        title={`Delete ${selectedIds.size} Leads`}
        description={`${selectedIds.size} selected leads will be permanently removed.`}
        confirmLabel={`Delete ${selectedIds.size}`}
        confirmClassName="bg-red-600 hover:bg-red-700 text-white"
      />
      {deleteGroupTarget && (
        <ConfirmDialog
          isOpen={Boolean(deleteGroupTarget)}
          onCancel={() => setDeleteGroupTarget(null)}
          onConfirm={() => deleteGroupMutation.mutate(deleteGroupTarget)}
          isLoading={deleteGroupMutation.isPending}
          title={`Delete "${deleteGroupTarget.name}"`}
          description={`All ${deleteGroupTarget.count} leads in "${deleteGroupTarget.name}" will be permanently removed.`}
          confirmLabel="Delete All"
          confirmClassName="bg-red-600 hover:bg-red-700 text-white"
        />
      )}
    </div>
  );
}
