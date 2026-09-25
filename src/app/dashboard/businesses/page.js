'use client';

import { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  MapPin, Globe, Search, Phone, Target, Trash2,
  ChevronLeft, ChevronRight, Loader2,
  Star, ExternalLink, Download, X,
  Database, CheckSquare, Filter, SortAsc,
  TrendingUp, Users, PhoneCall, Globe2,
  LayoutGrid, List, Tag, Zap, Building2,
  ChevronDown, RefreshCw, ShieldCheck,
} from 'lucide-react';
import { businessesApi } from '../../../lib/api/businesses';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useLeadsCacheQuery } from '../../../hooks/useLeadsCacheQuery';
import { leadsCache } from '../../../lib/cache/leadsCache';

// ── Category emoji map ────────────────────────────────────────
const CATEGORY_EMOJI = {
  default:      '🏢',
  restaurant:   '🍽️', food: '🍽️', cafe: '☕', bakery: '🥐',
  hotel:        '🏨', resort: '🏖️', motel: '🛏️',
  hospital:     '🏥', clinic: '🏥', doctor: '👨‍⚕️', dental: '🦷', dentist: '🦷', pharmacy: '💊',
  school:       '🎓', college: '🎓', university: '🏫', education: '📚',
  software:     '💻', tech: '💻', it: '💻',
  mobile:       '📱', phone: '📱', electronics: '⚡',
  jewelry:      '💍', jewellery: '💍', gold: '✨', diamond: '💎',
  realestate:   '🏡', real: '🏡', property: '🏡',
  bank:         '🏦', finance: '💰', insurance: '🛡️',
  gym:          '💪', fitness: '💪', salon: '💇', spa: '🧖',
  shop:         '🛍️', store: '🛒', market: '🛒', supermarket: '🛒',
  lawyer:       '⚖️', legal: '⚖️',
  travel:       '✈️', tour: '🗺️',
  auto:         '🚗', car: '🚗', garage: '🔧',
  construction: '🏗️', contractor: '🔨',
};

function getCategoryEmoji(cat = '') {
  const lower = cat.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return CATEGORY_EMOJI.default;
}

function getCategoryColor(cat = '') {
  const lower = cat.toLowerCase();
  if (lower.includes('restaurant') || lower.includes('food') || lower.includes('cafe')) return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-400' };
  if (lower.includes('hotel') || lower.includes('resort')) return { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700', dot: 'bg-sky-400' };
  if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('doctor') || lower.includes('dental')) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400' };
  if (lower.includes('pharmacy') || lower.includes('drug')) return { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', dot: 'bg-teal-400' };
  if (lower.includes('school') || lower.includes('college') || lower.includes('education')) return { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-400' };
  if (lower.includes('software') || lower.includes('tech') || lower.includes('it')) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-400' };
  if (lower.includes('mobile') || lower.includes('electronics') || lower.includes('phone')) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' };
  if (lower.includes('jewelry') || lower.includes('jewellery') || lower.includes('gold') || lower.includes('diamond')) return { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', dot: 'bg-rose-400' };
  if (lower.includes('real') || lower.includes('property')) return { bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-700', dot: 'bg-lime-400' };
  return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-400' };
}

function getWhatsAppUrl(phone = '') {
  if (!phone || typeof phone !== 'string' || phone === 'N/A') return null;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('01') && cleaned.length === 11) cleaned = '88' + cleaned;
  cleaned = cleaned.replace(/^\+/, '');
  return `https://wa.me/${cleaned}`;
}

// ── Keyword label extractor ───────────────────────────────────
function kwLabel(key = '') {
  const base = key.split(' in ')[0].split(' near ')[0];
  return base.charAt(0).toUpperCase() + base.slice(1);
}

// ─────────────────────────────────────────────────────────────
export default function LeadsCrmPage() {
  const qc = useQueryClient();
  const scrollRef = useRef(null);

  const [viewMode, setViewMode]             = useState('table'); // 'table' | 'card'
  const [selectedKeyword, setSelectedKeyword] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort]     = useState('default');
  const [searchQuery, setSearchQuery]       = useState('');
  const [activeFilter, setActiveFilter]     = useState('all');
  const [page, setPage]                     = useState(1);
  const [selectedIds, setSelectedIds]       = useState(new Set());
  const [deleteId, setDeleteId]             = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [deleteGroupTarget, setDeleteGroupTarget]     = useState(null);

  // ── Data fetching ─────────────────────────────────────────
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

  // ── Mutations ─────────────────────────────────────────────
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

  // ── Derived data ──────────────────────────────────────────
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

  const realTotal        = dbStats?.totalLeads ?? total;
  const realTargetCount  = dbStats?.targetCount ?? 0;
  const realPhoneCount   = dbStats?.hasPhoneCount ?? 0;
  const realWebsiteCount = dbStats?.hasWebsiteCount ?? 0;
  const realNoWebsiteCount = dbStats?.noWebsiteCount ?? 0;

  // Dynamic category groups & keywords from DB
  const dbCategories  = Array.isArray(dbStats?.categoryStats) ? dbStats.categoryStats : (Array.isArray(dbStats?.byCategory) ? dbStats.byCategory : []);
  const dbKeywords    = Array.isArray(data?.keywords) && data.keywords.length > 0 ? data.keywords : (Array.isArray(dbStats?.topKeywords) ? dbStats.topKeywords : []);

  // ── Bulk helpers ──────────────────────────────────────────
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
    const hdrs = ['Business Name', 'Category', 'Phone', 'Address', 'Rating', 'Reviews', 'Website', 'Maps URL', 'Search Keyword', 'Scraped At'];
    const rows = [hdrs.join(','), ...list.map(l => [
      `"${String(l?.title || l?.name || '').replace(/"/g, '""')}"`,
      `"${String(l?.category || '').replace(/"/g, '""')}"`,
      `"${String(l?.phone || '').replace(/"/g, '""')}"`,
      `"${String(l?.address || '').replace(/"/g, '""')}"`,
      `"${String(l?.rating || '')}"`,
      `"${String(l?.reviewCount || '')}"`,
      `"${String(l?.website || '').replace(/"/g, '""')}"`,
      `"${String(l?.mapsUrl || '').replace(/"/g, '""')}"`,
      `"${String(l?.searchKeyword || '').replace(/"/g, '""')}"`,
      `"${l?.scrapedAt ? new Date(l.scrapedAt).toLocaleString() : ''}"`,
    ].join(','))];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' }));
    a.download = `leads_crm_${Date.now()}.csv`;
    a.click();
  };

  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  // ── Quick filters ─────────────────────────────────────────
  const filterBadges = [
    { id: 'all',        label: 'All Leads',    icon: Users,     count: realTotal,          color: 'indigo' },
    { id: 'target',     label: 'Targeted',     icon: Target,    count: realTargetCount,    color: 'violet' },
    { id: 'phone',      label: 'Has Phone',    icon: PhoneCall, count: realPhoneCount,     color: 'emerald' },
    { id: 'no_website', label: 'No Website',   icon: Globe2,    count: realNoWebsiteCount, color: 'rose' },
    { id: 'website',    label: 'Has Website',  icon: Globe,     count: realWebsiteCount,   color: 'sky' },
  ];

  const colorMap = {
    indigo:  { active: 'bg-indigo-600 text-white border-indigo-600', count: 'bg-white/20 text-white' },
    violet:  { active: 'bg-violet-600 text-white border-violet-600', count: 'bg-white/20 text-white' },
    emerald: { active: 'bg-emerald-600 text-white border-emerald-600', count: 'bg-white/20 text-white' },
    rose:    { active: 'bg-rose-500 text-white border-rose-500', count: 'bg-white/20 text-white' },
    sky:     { active: 'bg-sky-500 text-white border-sky-500', count: 'bg-white/20 text-white' },
  };

  return (
    <div className="space-y-4 sm:space-y-5 max-w-[1400px] mx-auto px-2 sm:px-4 py-2 sm:py-3 text-slate-800">

      {/* ═══ PAGE HEADER ══════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <Database className="w-4 h-4 text-white" />
            </span>
            Leads CRM
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5 ml-10">
            Real-time business intelligence — {realTotal.toLocaleString()} leads in database
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={handleRefresh}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 bg-white border border-slate-200 hover:border-indigo-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer">
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-indigo-600' : ''}`} />
            Refresh
          </button>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            IndexedDB Cached
          </span>
        </div>
      </div>

      {/* ═══ STATS SUMMARY CARDS ══════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {[
          { label: 'Total Leads',    value: realTotal,          icon: Building2,  color: 'indigo', sub: 'All scraped leads' },
          { label: 'Targeted',       value: realTargetCount,    icon: ShieldCheck, color: 'violet', sub: `${realTotal > 0 ? Math.round((realTargetCount/realTotal)*100) : 0}% targeted` },
          { label: 'With Phone',     value: realPhoneCount,     icon: PhoneCall,  color: 'emerald', sub: `${realTotal > 0 ? Math.round((realPhoneCount/realTotal)*100) : 0}% have phone` },
          { label: 'No Website',     value: realNoWebsiteCount, icon: Globe2,     color: 'rose',    sub: 'Cold outreach opportunities' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-white border border-slate-100 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${
              color === 'indigo' ? 'from-indigo-50/40' :
              color === 'violet' ? 'from-violet-50/40' :
              color === 'emerald' ? 'from-emerald-50/40' : 'from-rose-50/40'
            } to-transparent pointer-events-none`} />
            <div className="flex items-start justify-between gap-2 relative">
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className={`text-xl sm:text-2xl font-extrabold mt-1 tabular-nums ${
                  color === 'indigo' ? 'text-indigo-600' :
                  color === 'violet' ? 'text-violet-600' :
                  color === 'emerald' ? 'text-emerald-600' : 'text-rose-500'
                }`}>{value.toLocaleString()}</p>
                <p className="text-[9px] text-slate-400 mt-0.5 font-medium">{sub}</p>
              </div>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
                color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                color === 'violet' ? 'bg-violet-100 text-violet-600' :
                color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'
              }`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ CATEGORY TABS ════════════════════════════════════════ */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700">Category Breakdown</span>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              {dbCategories.length} categories
            </span>
          </div>
          {selectedCategory && (
            <button type="button" onClick={() => { setSelectedCategory(''); setPage(1); }}
              className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-rose-500 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <div ref={scrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {/* All button */}
            <button type="button"
              onClick={() => { setSelectedCategory(''); setPage(1); }}
              className={`flex-none flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                !selectedCategory
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200/50'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}>
              <LayoutGrid className="w-3.5 h-3.5" />
              All Categories
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${!selectedCategory ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {realTotal.toLocaleString()}
              </span>
            </button>

            {/* Dynamic category chips from DB */}
            {dbCategories.map(cat => {
              const key = cat._id || cat.name || 'Unknown';
              const count = cat.count || 0;
              const isActive = selectedCategory === key;
              const col = getCategoryColor(key);
              const emoji = getCategoryEmoji(key);
              const pct = realTotal > 0 ? Math.round((count / realTotal) * 100) : 0;

              return (
                <button key={key} type="button"
                  onClick={() => { setSelectedCategory(isActive ? '' : key); setPage(1); }}
                  className={`flex-none flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap group ${
                    isActive
                      ? `${col.bg} ${col.border} ${col.text} shadow-md`
                      : `bg-white border-slate-200 text-slate-600 hover:${col.border} hover:${col.text}`
                  }`}>
                  <span>{emoji}</span>
                  <span className="max-w-[100px] truncate">{key}</span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    isActive ? `${col.bg} ${col.text}` : 'bg-slate-100 text-slate-500'
                  }`}>{count.toLocaleString()}</span>
                  {pct > 0 && (
                    <span className={`hidden sm:inline text-[9px] font-bold ${isActive ? col.text : 'text-slate-400'}`}>{pct}%</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ CAMPAIGN KEYWORD TABS ════════════════════════════════ */}
      {dbKeywords.length > 0 && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">Scrape Campaigns</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                {dbKeywords.length} campaigns
              </span>
            </div>
            {selectedKeyword !== 'All' && (
              <button type="button" onClick={() => { setSelectedKeyword('All'); setPage(1); }}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-rose-500 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="p-3 sm:p-4">
            <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {/* All campaigns card */}
              <div onClick={() => { setSelectedKeyword('All'); setPage(1); }}
                className={`flex-none w-[140px] sm:w-[165px] flex flex-col gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedKeyword === 'All'
                    ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200/40'
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${selectedKeyword === 'All' ? 'bg-white/20' : 'bg-indigo-50'}`}>
                  🗂️
                </div>
                <div>
                  <p className={`text-[10px] font-semibold ${selectedKeyword === 'All' ? 'text-indigo-100' : 'text-slate-400'}`}>All Campaigns</p>
                  <p className={`text-lg font-extrabold ${selectedKeyword === 'All' ? 'text-white' : 'text-slate-800'}`}>{realTotal.toLocaleString()}</p>
                </div>
              </div>

              {dbKeywords.map(kw => {
                const key = kw._id || 'General';
                const isSelected = selectedKeyword === key;
                const label = kwLabel(key);
                const pct = realTotal > 0 ? Math.round((kw.count / realTotal) * 100) : 0;
                const emoji = getCategoryEmoji(key);

                return (
                  <div key={key}
                    onClick={() => { setSelectedKeyword(key); setPage(1); }}
                    className={`group relative flex-none w-[140px] sm:w-[165px] flex flex-col gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200/40'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${isSelected ? 'bg-white/20' : 'bg-slate-50'}`}>
                        {emoji}
                      </div>
                      <button type="button"
                        onClick={e => { e.stopPropagation(); setDeleteGroupTarget({ type: 'keyword', name: label, key, count: kw.count || 0 }); }}
                        className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer ${
                          isSelected ? 'text-indigo-200 hover:text-white hover:bg-white/20' : 'text-slate-300 hover:text-rose-600 hover:bg-rose-50'
                        }`}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <p className={`text-[10px] font-semibold line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>{label}</p>
                      <p className={`text-lg font-extrabold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{(kw.count || 0).toLocaleString()}</p>
                    </div>
                    <div className={`w-full h-1 rounded-full ${isSelected ? 'bg-white/30' : 'bg-slate-100'}`}>
                      <div className={`h-full rounded-full transition-all ${isSelected ? 'bg-white/70' : 'bg-indigo-400'}`}
                        style={{ width: `${Math.max(4, pct)}%` }} />
                    </div>
                    <p className={`text-[9px] font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>{pct}% of total</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ SEARCH, FILTER, SORT BAR ════════════════════════════ */}
      <div className="bg-white border border-slate-100 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search */}
          <div className="sm:col-span-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-indigo-400 focus-within:bg-white transition-all">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search name, phone, address…"
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none" />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative flex items-center">
            <SortAsc className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select value={selectedSort} onChange={e => setSelectedSort(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl pl-8 pr-8 py-2.5 focus:outline-none cursor-pointer appearance-none">
              <option value="default">Default Order</option>
              <option value="name">Name A–Z</option>
              <option value="rating">Highest Rating</option>
              <option value="date">Newest First</option>
            </select>
            <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* View mode + export */}
          <div className="flex items-center gap-2 justify-end">
            {selectedIds.size > 0 && (
              <button type="button" onClick={handleExportCSV}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm">
                <Download className="w-3.5 h-3.5" />
                Export {selectedIds.size}
              </button>
            )}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5">
              <button type="button" onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <List className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => setViewMode('card')}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === 'card' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick filter badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {filterBadges.map(({ id, label, icon: Icon, count, color }) => {
            const isActive = activeFilter === id;
            const cm = colorMap[color];
            return (
              <button key={id} type="button"
                onClick={() => { setActiveFilter(id); setPage(1); }}
                className={`flex-none flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer border ${
                  isActive ? `${cm.active} shadow-sm` : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                }`}>
                <Icon className="w-3 h-3" />
                {label}
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${isActive ? cm.count : 'bg-slate-200 text-slate-500'}`}>
                  {count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ BULK ACTION BAR ══════════════════════════════════════ */}
      {selectedIds.size > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{selectedIds.size} lead{selectedIds.size > 1 ? 's' : ''} selected</p>
              <p className="text-[10px] text-slate-500">Choose an action</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleExportCSV}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer">
              <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
            </button>
            <button type="button" onClick={() => setShowBulkDeleteModal(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-rose-900/30">
              <Trash2 className="w-3.5 h-3.5" /> Delete {selectedIds.size}
            </button>
            <button type="button" onClick={() => setSelectedIds(new Set())}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══ RESULTS BAR + PAGINATION ═════════════════════════════ */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
            Showing <span className="text-slate-700 font-bold">{businesses.length}</span> of{' '}
            <span className="text-slate-700 font-bold">{total.toLocaleString()}</span> leads
          </p>
          {selectedKeyword !== 'All' && (
            <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-full">
              {kwLabel(selectedKeyword)}
            </span>
          )}
          {selectedCategory && (
            <span className="text-[10px] bg-violet-50 border border-violet-100 text-violet-600 font-bold px-2 py-0.5 rounded-full">
              {selectedCategory}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <span className="text-[11px] sm:text-xs text-slate-500 font-bold px-2">
            {page} / {pages}
          </span>
          <button type="button" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* ═══ MAIN LEADS TABLE / CARD GRID ════════════════════════ */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Loading leads from database…</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Database className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-500">No leads found</p>
            <p className="text-xs text-slate-400">Try adjusting filters or run a new extraction</p>
          </div>
        ) : viewMode === 'card' ? (
          /* ── CARD GRID VIEW ──────────────────────────────────── */
          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
              const col        = getCategoryColor(category);
              const emoji      = getCategoryEmoji(category);

              return (
                <div key={`${b._id}_card_${idx}`}
                  className={`relative border rounded-2xl p-3.5 flex flex-col gap-2.5 transition-all hover:shadow-md ${
                    isSelected ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}>
                  {/* Checkbox */}
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(b._id)}
                    className="absolute top-3 left-3 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5" />

                  {/* Target + Category */}
                  <div className="flex items-center justify-between pl-6">
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${col.bg} ${col.border} ${col.text}`}>
                      {emoji} {category || 'Business'}
                    </span>
                    <button type="button"
                      onClick={() => toggleTargetMutation.mutate({ id: b._id, isTarget: !isTarget })}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${isTarget ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                      <Target className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title */}
                  <div>
                    <Link href={`/dashboard/businesses/${b._id}`}
                      className="font-bold text-slate-900 text-[13px] hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                      {title}
                    </Link>
                    {b.mapsUrl && (
                      <a href={b.mapsUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-indigo-500 mt-1">
                        <ExternalLink className="w-3 h-3" /> Maps
                      </a>
                    )}
                  </div>

                  {/* Rating */}
                  {rating > 0 && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-lg w-fit">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rating}
                    </span>
                  )}

                  {/* Address */}
                  {b.address && b.address !== 'N/A' && (
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                      <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
                      <span className="line-clamp-2 leading-relaxed">{b.address}</span>
                    </div>
                  )}

                  {/* Phone + WhatsApp */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-50 mt-auto">
                    {phone && phone !== 'N/A' ? (
                      <a href={`tel:${phone}`}
                        className="flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 py-1.5 px-2 rounded-xl text-[11px] font-bold hover:bg-emerald-100 transition-colors">
                        <Phone className="w-3 h-3 text-emerald-600" /> {phone}
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-300 py-1.5 px-2 rounded-xl text-[11px]">
                        <Phone className="w-3 h-3" /> No phone
                      </div>
                    )}
                    {waUrl ? (
                      <a href={waUrl} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white py-1.5 px-2 rounded-xl text-[11px] font-bold transition-colors">
                        <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.474 1.333 4.988l-1.417 5.177 5.299-1.39a9.943 9.943 0 0 0 4.773 1.216h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062a9.923 9.923 0 0 0-7.059-2.93zm0 18.163h-.003a8.277 8.277 0 0 1-4.22-1.157l-.303-.18-3.137.822.836-3.057-.197-.314a8.272 8.272 0 0 1-1.267-4.46c0-4.568 3.718-8.286 8.288-8.286 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.425 5.86c0 4.569-3.717 8.288-8.28 8.288zm4.542-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.166.249-.643.81-.788.976-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.003-1.237-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.29.373-.435.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.076 0 1.225.892 2.408 1.016 2.574.125.166 1.756 2.682 4.254 3.761.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.183.208-.581.208-1.079.145-1.183-.063-.104-.229-.166-.478-.291z"/></svg>
                        Chat
                      </a>
                    ) : (
                      <div className="flex items-center justify-center text-[11px] text-slate-300 bg-slate-50 border border-slate-100 py-1.5 px-2 rounded-xl">No WA</div>
                    )}
                  </div>

                  {/* Website */}
                  {website && website !== 'N/A' && (
                    <a href={website.startsWith('http') ? website : `https://${website}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 hover:underline text-[11px] font-medium truncate">
                      <Globe className="w-3 h-3 shrink-0" />
                      {website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
                    </a>
                  )}

                  {/* Delete */}
                  <button type="button" onClick={() => setDeleteId(b._id)}
                    className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── TABLE VIEW ──────────────────────────────────────── */
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-50 p-3 space-y-2.5">
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
                const col        = getCategoryColor(category);
                const emoji      = getCategoryEmoji(category);

                return (
                  <div key={`${b._id}_mob_${idx}`}
                    className={`border rounded-2xl p-3.5 space-y-2.5 transition-colors ${isSelected ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-100'}`}>
                    <div className="flex items-start gap-2.5">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(b._id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer w-4 h-4 mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <Link href={`/dashboard/businesses/${b._id}`}
                            className="font-bold text-slate-900 text-[13px] hover:text-indigo-600 transition-colors line-clamp-1">
                            {title}
                          </Link>
                          {b.mapsUrl && (
                            <a href={b.mapsUrl} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-indigo-500">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border ${col.bg} ${col.border} ${col.text}`}>
                            {emoji} {category || 'Business'}
                          </span>
                          {rating > 0 && (
                            <span className="inline-flex items-center gap-0.5 bg-amber-50 border border-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {rating}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button"
                          onClick={() => toggleTargetMutation.mutate({ id: b._id, isTarget: !isTarget })}
                          className={`p-1.5 rounded-lg cursor-pointer ${isTarget ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                          <Target className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setDeleteId(b._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {b.address && b.address !== 'N/A' && (
                      <div className="flex items-start gap-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 p-2 rounded-xl">
                        <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-rose-400" />
                        <span>{b.address}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {phone && phone !== 'N/A' ? (
                        <a href={`tel:${phone}`} className="flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 py-2 px-2.5 rounded-xl text-[11px] font-bold">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" /> {phone}
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 bg-slate-50 border border-slate-100 py-2 px-2.5 rounded-xl">
                          <Phone className="w-3.5 h-3.5" /> No phone
                        </div>
                      )}
                      {waUrl ? (
                        <a href={waUrl} target="_blank" rel="noreferrer"
                          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2 px-2.5 rounded-xl text-[11px] font-bold transition-colors">
                          <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.474 1.333 4.988l-1.417 5.177 5.299-1.39a9.943 9.943 0 0 0 4.773 1.216h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062a9.923 9.923 0 0 0-7.059-2.93zm0 18.163h-.003a8.277 8.277 0 0 1-4.22-1.157l-.303-.18-3.137.822.836-3.057-.197-.314a8.272 8.272 0 0 1-1.267-4.46c0-4.568 3.718-8.286 8.288-8.286 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.425 5.86c0 4.569-3.717 8.288-8.28 8.288zm4.542-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.166.249-.643.81-.788.976-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.003-1.237-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.29.373-.435.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.076 0 1.225.892 2.408 1.016 2.574.125.166 1.756 2.682 4.254 3.761.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.183.208-.581.208-1.079.145-1.183-.063-.104-.229-.166-.478-.291z"/></svg>
                          Chat Now
                        </a>
                      ) : (
                        <div className="flex items-center justify-center text-[11px] text-slate-300 bg-slate-50 border border-slate-100 py-2 px-2.5 rounded-xl">WhatsApp N/A</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                        checked={selectedIds.size === businesses.length && businesses.length > 0}
                        onChange={toggleSelectAll} />
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Business</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Address</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-500">📞 Contact</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-sky-500">Website</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-amber-500 text-center">Rating</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-indigo-500 text-center">🎯 Target</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((b, idx) => {
                    const isSelected = selectedIds.has(b._id);
                    const isTarget   = Boolean(b.isTarget);
                    const title      = b.title || b.name || 'Unnamed';
                    const category   = String(b.category || '');
                    const rating     = parseFloat(b.rating || 0);
                    const waUrl      = getWhatsAppUrl(String(b.phone || ''));
                    const col        = getCategoryColor(category);
                    const emoji      = getCategoryEmoji(category);

                    return (
                      <tr key={`${b._id}_tr_${idx}`}
                        className={`border-b border-slate-50 transition-colors text-xs ${isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/60'}`}>

                        <td className="px-4 py-3.5">
                          <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer w-3.5 h-3.5"
                            checked={isSelected} onChange={() => toggleSelectOne(b._id)} />
                        </td>

                        {/* Business */}
                        <td className="px-4 py-3.5 max-w-[200px]">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Link href={`/dashboard/businesses/${b._id}`}
                              className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1 text-[12.5px]">
                              {title}
                            </Link>
                            {b.mapsUrl && (
                              <a href={b.mapsUrl} target="_blank" rel="noreferrer"
                                className="text-slate-300 hover:text-indigo-400 shrink-0 transition-colors">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          {b.searchKeyword && (
                            <span className="inline-block bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md text-[10px] font-medium">
                              {kwLabel(b.searchKeyword)}
                            </span>
                          )}
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5">
                          <button type="button"
                            onClick={() => { setSelectedCategory(category === selectedCategory ? '' : category); setPage(1); }}
                            className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer transition-all hover:opacity-80 ${col.bg} ${col.border} ${col.text}`}>
                            <span>{emoji}</span>
                            <span className="max-w-[100px] truncate">{category || 'Business'}</span>
                          </button>
                        </td>

                        {/* Address */}
                        <td className="px-4 py-3.5 max-w-[220px]">
                          {b.address && b.address !== 'N/A' ? (
                            <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                              <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
                              <span className="line-clamp-2 leading-relaxed">{b.address}</span>
                            </div>
                          ) : <span className="text-slate-300">—</span>}
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3.5">
                          {b.phone && b.phone !== 'N/A' ? (
                            <div className="flex items-center gap-2">
                              <a href={`tel:${b.phone}`}
                                className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1.5 rounded-xl font-bold text-[11.5px] shadow-xs hover:bg-emerald-100 transition-colors whitespace-nowrap">
                                <Phone className="w-3 h-3 text-emerald-500 shrink-0" /> {b.phone}
                              </a>
                              {waUrl && (
                                <a href={waUrl} target="_blank" rel="noreferrer"
                                  title="Open WhatsApp"
                                  className="w-7 h-7 flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] rounded-lg transition-colors shrink-0">
                                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.474 1.333 4.988l-1.417 5.177 5.299-1.39a9.943 9.943 0 0 0 4.773 1.216h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062a9.923 9.923 0 0 0-7.059-2.93zm0 18.163h-.003a8.277 8.277 0 0 1-4.22-1.157l-.303-.18-3.137.822.836-3.057-.197-.314a8.272 8.272 0 0 1-1.267-4.46c0-4.568 3.718-8.286 8.288-8.286 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.425 5.86c0 4.569-3.717 8.288-8.28 8.288zm4.542-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.166.249-.643.81-.788.976-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.003-1.237-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.29.373-.435.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.076 0 1.225.892 2.408 1.016 2.574.125.166 1.756 2.682 4.254 3.761.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.183.208-.581.208-1.079.145-1.183-.063-.104-.229-.166-.478-.291z"/></svg>
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                              <Phone className="w-3 h-3" /> No phone
                            </span>
                          )}
                        </td>

                        {/* Website */}
                        <td className="px-4 py-3.5 max-w-[180px]">
                          {b.website && b.website !== 'N/A' ? (
                            <a href={b.website.startsWith('http') ? b.website : `https://${b.website}`}
                              target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 hover:underline text-[11.5px] font-medium line-clamp-1">
                              <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                              {b.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg font-medium">
                              <Globe className="w-3 h-3" /> No site
                            </span>
                          )}
                        </td>

                        {/* Rating */}
                        <td className="px-4 py-3.5 text-center">
                          {rating > 0 ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold px-2 py-1 rounded-lg">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {rating}
                            </span>
                          ) : <span className="text-slate-300">—</span>}
                        </td>

                        {/* Target */}
                        <td className="px-4 py-3.5 text-center">
                          <button type="button"
                            onClick={() => toggleTargetMutation.mutate({ id: b._id, isTarget: !isTarget })}
                            disabled={toggleTargetMutation.isPending}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer border transition-all shadow-xs ${
                              isTarget
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}>
                            <Target className={`w-3.5 h-3.5 shrink-0 ${isTarget ? 'text-white' : 'text-slate-400'}`} />
                            {isTarget ? 'Targeted' : 'Target'}
                          </button>
                        </td>

                        {/* Delete */}
                        <td className="px-4 py-3.5 text-right">
                          <button type="button" onClick={() => setDeleteId(b._id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">
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

      {/* ═══ BOTTOM PAGINATION ════════════════════════════════════ */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button type="button" onClick={() => setPage(1)} disabled={page === 1}
            className="px-3 py-1.5 text-[11px] font-semibold bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 rounded-xl disabled:opacity-30 cursor-pointer transition-all">
            First
          </button>
          <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
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
                  className={`w-8 h-8 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                    pg === page ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                  }`}>
                  {pg}
                </button>
              );
            })}
          </div>
          <button type="button" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <button type="button" onClick={() => setPage(pages)} disabled={page === pages}
            className="px-3 py-1.5 text-[11px] font-semibold bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 rounded-xl disabled:opacity-30 cursor-pointer transition-all">
            Last
          </button>
        </div>
      )}

      {/* ═══ DIALOGS ══════════════════════════════════════════════ */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        isLoading={deleteMutation.isPending}
        title="Delete Lead"
        description="This lead will be permanently removed from your CRM. This action cannot be undone."
        confirmLabel="Delete"
        confirmClassName="bg-rose-600 hover:bg-rose-700 text-white"
      />
      <ConfirmDialog
        isOpen={showBulkDeleteModal}
        onCancel={() => setShowBulkDeleteModal(false)}
        onConfirm={() => bulkDeleteMutation.mutate(Array.from(selectedIds))}
        isLoading={bulkDeleteMutation.isPending}
        title={`Delete ${selectedIds.size} Leads`}
        description={`${selectedIds.size} selected leads will be permanently removed. This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.size}`}
        confirmClassName="bg-rose-600 hover:bg-rose-700 text-white"
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
          confirmClassName="bg-rose-600 hover:bg-rose-700 text-white"
        />
      )}
    </div>
  );
}
