'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  MapPin, Globe, Search, Phone, Target, Trash2,
  ChevronLeft, ChevronRight, Loader2, ExternalLink,
  ArrowRight, X, Star, Crosshair, Zap, Check, ChevronDown,
} from 'lucide-react';
import { showSwal } from '../../../lib/swal';
import { businessesApi } from '../../../lib/api/businesses';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useLeadsCacheQuery } from '../../../hooks/useLeadsCacheQuery';
import { leadsCache } from '../../../lib/cache/leadsCache';

/* ── Keyword/Campaign helpers (same as Leads CRM) ─────────────── */
function parseKeyword(key = '') {
  if (!key || key === 'All') return { label: 'All Campaigns', location: '', full: 'All' };
  let label = key, location = '';
  if (key.includes(' in '))        { const p = key.split(' in ');   label = p[0].trim(); location = p.slice(1).join(' in ').trim(); }
  else if (key.includes(' near ')) { const p = key.split(' near '); label = p[0].trim(); location = p.slice(1).join(' near ').trim(); }
  else if (key.includes(','))      { const p = key.split(',');       label = p[0].trim(); location = p.slice(1).join(', ').trim(); }
  label    = label.charAt(0).toUpperCase() + label.slice(1);
  location = location ? location.charAt(0).toUpperCase() + location.slice(1) : '';
  return { label, location, full: key };
}

/* ── Category color/emoji for lead row badges ─────────────────── */
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
  construction:'🏗️', contractor:'🔨', interior:'🛋️', design:'🎨',
  architect:'🏛️', architecture:'🏛️',
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
  if (l.includes('hotel')||l.includes('resort'))                         return 'text-sky-700 bg-sky-50 border-sky-200';
  if (l.includes('hospital')||l.includes('clinic')||l.includes('dental')) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (l.includes('pharmacy'))                                             return 'text-teal-700 bg-teal-50 border-teal-200';
  if (l.includes('school')||l.includes('college')||l.includes('education')) return 'text-violet-700 bg-violet-50 border-violet-200';
  if (l.includes('software')||l.includes('tech')||l.includes(' it'))    return 'text-blue-700 bg-blue-50 border-blue-200';
  if (l.includes('mobile')||l.includes('electronics'))                   return 'text-amber-700 bg-amber-50 border-amber-200';
  if (l.includes('construction')||l.includes('interior')||l.includes('design')||l.includes('architect')) return 'text-lime-700 bg-lime-50 border-lime-200';
  return 'text-indigo-700 bg-indigo-50 border-indigo-200';
}

/* ── WhatsApp ──────────────────────────────────────────────────── */
function getWhatsAppUrl(phone = '') {
  if (!phone || typeof phone !== 'string' || phone === 'N/A') return null;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('01') && cleaned.length === 11) cleaned = '88' + cleaned;
  cleaned = cleaned.replace(/^\+/, '');
  return `https://wa.me/${cleaned}`;
}
function WhatsAppIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.474 1.333 4.988l-1.417 5.177 5.299-1.39a9.943 9.943 0 0 0 4.773 1.216h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0 0 12.012 2zm0 18.163h-.003a8.277 8.277 0 0 1-4.22-1.157l-.303-.18-3.137.822.836-3.057-.197-.314a8.272 8.272 0 0 1-1.267-4.46c0-4.568 3.718-8.286 8.288-8.286 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.425 5.86c0 4.569-3.717 8.288-8.28 8.288zm4.542-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.166.249-.643.81-.788.976-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.003-1.237-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.29.373-.435.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.076 0 1.225.892 2.408 1.016 2.574.125.166 1.756 2.682 4.254 3.761.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.183.208-.581.208-1.079.145-1.183-.063-.104-.229-.166-.478-.291z" />
    </svg>
  );
}

/* ── Lead Status Definitions & Dropdown Component ────────────── */
const STATUS_OPTIONS = [
  { label: 'Not Contacted',  dotColor: 'bg-slate-400', textColor: 'text-slate-700' },
  { label: 'Contacted',      dotColor: 'bg-blue-600',  textColor: 'text-blue-700' },
  { label: 'Follow Up',      dotColor: 'bg-amber-500', textColor: 'text-amber-700' },
  { label: 'In Discussion',  dotColor: 'bg-purple-600', textColor: 'text-purple-700' },
  { label: 'Interested / Won', dotColor: 'bg-emerald-500', textColor: 'text-emerald-700' },
  { label: 'Not Interested', dotColor: 'bg-rose-500',  textColor: 'text-rose-700' },
];

function LeadStatusDropdown({ status = 'Not Contacted', onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentStatus = status || 'Not Contacted';
  const currentConfig = STATUS_OPTIONS.find(s => s.label === currentStatus) || STATUS_OPTIONS[0];

  const updatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 250;
    const menuWidth = 208;
    const openUpward = rect.bottom + menuHeight > window.innerHeight && rect.top > menuHeight;

    let left = rect.left;
    if (left + menuWidth > window.innerWidth - 12) {
      left = window.innerWidth - menuWidth - 12;
    }
    if (left < 12) left = 12;

    setCoords({
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left,
    });
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
    } else {
      updatePosition();
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-800 transition-all cursor-pointer shadow-xs"
        title="Click to update lead status"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${currentConfig.dotColor}`} />
        <span className="text-[12px] font-semibold text-slate-800 whitespace-nowrap">
          {currentConfig.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
          }}
          className="w-52 bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 p-1.5 select-none animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-0.5">
            {STATUS_OPTIONS.map((item) => {
              const isSelected = item.label === currentStatus;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (!isSelected && onChange) onChange(item.label);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-100/70 text-slate-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dotColor}`} />
                    <span className="text-[12.5px] truncate">{item.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ── Stat Card ─────────────────────────────────────────────────── */
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

/* ── Cache clear helper ────────────────────────────────────────── */
async function clearAllCaches(lc) {
  await lc.clearMatching('target-leads-list');
  await lc.clearMatching('target-leads-base');
  await lc.clearMatching('crm-businesses');
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function TargetLeadsPage() {
  const qc = useQueryClient();

  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedKeyword, setSelectedKeyword]   = useState('All');  // 'All' or keyword string
  const [activeFilter, setActiveFilter]         = useState('all');
  const [statusFilter, setStatusFilter]         = useState('All');
  const [page, setPage]                         = useState(1);
  const [deleteId, setDeleteId]                 = useState(null);
  const [untargetKw, setUntargetKw]             = useState(null); // { key, label, count }

  const kwScrollRef = useRef(null);
  const scrollKw = (dir) => {
    if (kwScrollRef.current) kwScrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  /* ────────────────────────────────────────────────────────────────
     BASE QUERY — isTarget:true, limit:1
     Returns: total (all target count) + keywords (campaign tabs)
  ──────────────────────────────────────────────────────────────── */
  const { data: baseData } = useLeadsCacheQuery({
    queryKey: ['target-leads-base', 'v3'],
    queryFn: () => businessesApi.getAll({ page: 1, limit: 1, isTarget: true }),
    staleTime: 30000,
  });

  const totalTargetCount = baseData?.total ?? 0;
  // keywords = campaign groups (searchKeyword aggregation), same structure as Leads CRM
  const dbKeywords = Array.isArray(baseData?.keywords)
    ? baseData.keywords.filter(k => k._id && String(k._id).trim())
    : [];

  /* ────────────────────────────────────────────────────────────────
     LIST QUERY — paginated, keyword-filtered, search-filtered
  ──────────────────────────────────────────────────────────────── */
  const { data, isLoading } = useLeadsCacheQuery({
    queryKey: ['target-leads-list', 'v3', page, searchQuery, selectedKeyword],
    queryFn: () => businessesApi.getAll({
      page,
      limit: 50,
      search: searchQuery || '',
      keyword: selectedKeyword === 'All' ? '' : selectedKeyword,
      isTarget: true,
    }),
    staleTime: 30000,
  });

  /* ── Invalidate helper ─────────────────────────────────────────── */
  const invalidateAll = async () => {
    await clearAllCaches(leadsCache);
    qc.invalidateQueries({ queryKey: ['target-leads-list'] });
    qc.invalidateQueries({ queryKey: ['target-leads-base'] });
    qc.invalidateQueries({ queryKey: ['crm-businesses'] });
    qc.invalidateQueries({ queryKey: ['crm-businesses-stats'] });
  };

  /* ── Mutations ─────────────────────────────────────────────────── */
  const toggleTargetMutation = useMutation({
    mutationFn: ({ id, isTarget }) => businessesApi.toggleTarget(id, isTarget),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => businessesApi.deleteById(id),
    onSuccess: async () => { await invalidateAll(); setDeleteId(null); },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => businessesApi.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      const qk = ['target-leads-list', 'v3', page, searchQuery, selectedKeyword];
      await qc.cancelQueries({ queryKey: qk });
      const previousData = qc.getQueryData(qk);
      if (previousData?.data) {
        qc.setQueryData(qk, {
          ...previousData,
          data: previousData.data.map(lead => lead._id === id ? { ...lead, status } : lead),
        });
      }
      return { previousData, qk };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        qc.setQueryData(context.qk, context.previousData);
      }
      showSwal({
        title: 'Error',
        text: err?.message || 'Failed to update lead status',
        icon: 'error',
      });
    },
    onSettled: async () => {
      await invalidateAll();
    },
  });

  // Remove isTarget from ALL leads in a keyword/campaign
  const bulkUntargetMutation = useMutation({
    mutationFn: ({ keyword }) => businessesApi.bulkUntarget({ keyword }),
    onSuccess: async () => {
      await invalidateAll();
      if (untargetKw?.key === selectedKeyword) { setSelectedKeyword('All'); setPage(1); }
      setUntargetKw(null);
    },
  });

  const handleRemoveTarget = async (b) => {
    const res = await showSwal({
      title: 'Remove from Target Leads?',
      text: `"${b.title || b.name}" will be removed from your target list.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#E11D48',
      cancelButtonColor: '#64748B',
    });
    if (res?.isConfirmed) toggleTargetMutation.mutate({ id: b._id, isTarget: false });
  };

  /* ── Derived ───────────────────────────────────────────────────── */
  const rawLeads = Array.isArray(data?.data) ? data.data : [];
  const leads = rawLeads.filter(b => {
    if (!b || typeof b !== 'object') return false;
    if (activeFilter === 'phone')    return b.phone && b.phone !== 'N/A' && b.phone !== '';
    if (activeFilter === 'no_phone') return !b.phone || b.phone === 'N/A' || b.phone === '';
    if (activeFilter === 'website')  return b.website && b.website !== '';
    if (statusFilter !== 'All') {
      const s = b.status || 'Not Contacted';
      if (s !== statusFilter) return false;
    }
    return true;
  });

  const total       = data?.total ?? leads.length;
  const pages       = data?.pages ?? 1;
  const withPhone   = rawLeads.filter(b => b?.phone && b.phone !== 'N/A' && b.phone !== '').length;
  const withWebsite = rawLeads.filter(b => b?.website && b.website !== '').length;
  const noPhone     = rawLeads.length - withPhone;

  const filterBadges = [
    { id: 'all',      label: 'All',        count: rawLeads.length },
    { id: 'phone',    label: 'Has Phone',   count: withPhone },
    { id: 'no_phone', label: 'No Phone',    count: noPhone },
    { id: 'website',  label: 'Has Website', count: withWebsite },
  ];

  /* ── Pagination ────────────────────────────────────────────────── */
  const PrevBtn = () => (
    <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
      <ChevronLeft className="w-4 h-4 text-slate-500" />
    </button>
  );
  const NextBtn = () => (
    <button type="button" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer transition-colors">
      <ChevronRight className="w-4 h-4 text-slate-500" />
    </button>
  );

  /* ════════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-4 container mx-auto">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-indigo-600 flex items-center gap-2">
            <Crosshair className="w-5 h-5" />
            Target Leads
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Manually targeted leads for WhatsApp outreach</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
            📦 IndexedDB Cached
          </span>
          <Link href="/dashboard/businesses"
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
            Add More Targets <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Total Targeted" value={totalTargetCount || total} color="text-indigo-600" />
        <StatCard label="With Phone"     value={withPhone}                  color="text-emerald-600" />
        <StatCard label="With Website"   value={withWebsite}                color="text-sky-600" />
        <StatCard label="No Phone"       value={noPhone}                    color="text-amber-500" />
      </div>

      {/* ── CAMPAIGN KEYWORD TABS (same style as Leads CRM) ────────── */}
      {dbKeywords.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">Scrape Campaigns</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                {dbKeywords.length}
              </span>
            </div>
            {selectedKeyword !== 'All' && (
              <button type="button"
                onClick={() => { setSelectedKeyword('All'); setPage(1); }}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-red-500 cursor-pointer transition-colors">
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          <div className="p-3">
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

                {/* All Campaigns card */}
                <div
                  onClick={() => { setSelectedKeyword('All'); setPage(1); setActiveFilter('all'); }}
                  className={`flex-none w-36 sm:w-44 flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all select-none ${
                    selectedKeyword === 'All'
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}>
                  <span className="text-xl mb-1">🗂️</span>
                  <p className={`text-xs font-bold truncate ${selectedKeyword === 'All' ? 'text-white' : 'text-slate-800'}`}>
                    All Campaigns
                  </p>
                  <p className={`text-[10px] truncate ${selectedKeyword === 'All' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    All Locations
                  </p>
                  <p className={`text-lg font-black mt-1 ${selectedKeyword === 'All' ? 'text-white' : 'text-slate-900'}`}>
                    {(totalTargetCount || total).toLocaleString()}
                  </p>
                  <div className={`w-full h-1 rounded-full mt-2 ${selectedKeyword === 'All' ? 'bg-white/30' : 'bg-slate-100'}`}>
                    <div className={`h-full rounded-full w-full ${selectedKeyword === 'All' ? 'bg-white' : 'bg-indigo-500'}`} />
                  </div>
                </div>

                {/* Per-keyword cards */}
                {dbKeywords.map(kw => {
                  const key = kw._id || 'General';
                  const isSelected = selectedKeyword === key;
                  const { label, location } = parseKeyword(key);
                  const emoji = getCategoryEmoji(key);
                  const pct = totalTargetCount > 0
                    ? Math.round((kw.count / totalTargetCount) * 100)
                    : 0;

                  return (
                    <div
                      key={key}
                      className={`group flex-none w-36 sm:w-44 flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all select-none relative ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                      onClick={() => { setSelectedKeyword(key); setPage(1); setActiveFilter('all'); }}>

                      {/* Remove-all-targets button on hover */}
                      <button
                        type="button"
                        title="Remove all from targets"
                        onClick={e => {
                          e.stopPropagation();
                          setUntargetKw({ key, label: location ? `${label} (${location})` : label, count: kw.count || 0 });
                        }}
                        className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10 ${
                          isSelected
                            ? 'text-indigo-200 hover:text-white hover:bg-white/20'
                            : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                        }`}>
                        <Target className="w-3 h-3" />
                      </button>

                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xl">{emoji}</span>
                      </div>
                      <p className={`text-xs font-bold truncate pr-5 ${isSelected ? 'text-white' : 'text-slate-800'}`} title={label}>
                        {label}
                      </p>
                      {location ? (
                        <p className={`text-[10px] font-medium truncate flex items-center gap-0.5 ${isSelected ? 'text-indigo-200' : 'text-indigo-600'}`}>
                          <MapPin className="w-2.5 h-2.5 shrink-0" />{location}
                        </p>
                      ) : (
                        <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>General</p>
                      )}
                      <p className={`text-lg font-black mt-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {(kw.count || 0).toLocaleString()}
                      </p>
                      <div className={`w-full h-1 rounded-full mt-2 ${isSelected ? 'bg-white/30' : 'bg-slate-100'}`}>
                        <div
                          className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                      <p className={`text-[9px] mt-1 font-semibold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {pct}% of total
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SEARCH + FILTER CHIPS ──────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search leads by name, address, phone…"
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(''); setPage(1); }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {/* Active campaign pill */}
          {selectedKeyword !== 'All' && (
            <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-3 py-2 rounded-lg shrink-0">
              <span className="text-xs font-bold text-indigo-700">
                {getCategoryEmoji(selectedKeyword)} {parseKeyword(selectedKeyword).label}
              </span>
              <button
                onClick={() => { setSelectedKeyword('All'); setPage(1); }}
                className="text-indigo-400 hover:text-indigo-700 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Filter chips & Status selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap gap-2">
            {filterBadges.map(b => (
              <button key={b.id} type="button"
                onClick={() => { setActiveFilter(b.id); setPage(1); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === b.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {b.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  activeFilter === b.id ? 'bg-white/20 text-white' : 'bg-white text-slate-500'
                }`}>{b.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-400 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.label} value={opt.label}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          Showing <span className="text-slate-800 font-bold">{leads.length}</span> of{' '}
          <span className="text-slate-800 font-bold">{total.toLocaleString()}</span> target leads
          {selectedKeyword !== 'All' && (
            <span className="ml-1.5 font-bold text-indigo-600">
              — {parseKeyword(selectedKeyword).label}
            </span>
          )}
        </p>
        {pages > 1 && (
          <div className="flex items-center gap-1.5">
            <PrevBtn />
            <span className="text-xs font-medium text-slate-500 px-1">{page} / {pages}</span>
            <NextBtn />
          </div>
        )}
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl py-20 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading target leads…</p>
        </div>

      ) : leads.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl py-20 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Crosshair className="w-7 h-7 text-indigo-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-800">
              {selectedKeyword !== 'All'
                ? `No target leads in "${parseKeyword(selectedKeyword).label}"`
                : 'No target leads yet'}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {selectedKeyword !== 'All'
                ? 'Try a different campaign or clear the filter.'
                : 'Go to Leads CRM and click the Target button on any lead.'}
            </p>
          </div>
          {selectedKeyword !== 'All' ? (
            <button onClick={() => { setSelectedKeyword('All'); setPage(1); }}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5" /> Show All Campaigns
            </button>
          ) : (
            <Link href="/dashboard/businesses"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
              Open Leads CRM <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

      ) : (
        <>
          {/* ══ MOBILE CARDS ══════════════════════════════════════════ */}
          <div className="md:hidden space-y-2.5">
            {leads.map((b, idx) => {
              const title    = b.title || b.name || 'Unnamed';
              const waUrl    = getWhatsAppUrl(b.phone);
              const hasPhone = b.phone && b.phone !== 'N/A' && b.phone !== '';
              const rating   = parseFloat(b.rating || b.totalScore || 0);
              const hasAddr  = b.address && b.address !== 'N/A';
              const hasWeb   = b.website && b.website !== 'N/A';

              return (
                <div key={`${b._id || 'c'}_m_${idx}`}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-3.5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-1.5 flex-wrap">
                          <Link href={`/dashboard/businesses/${b._id}`}
                            className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-snug">
                            {title}
                          </Link>
                          {b.mapsUrl && (
                            <a href={b.mapsUrl} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded mt-0.5 shrink-0">
                              <ExternalLink className="w-2.5 h-2.5" /> Maps
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {b.category && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(b.category)}`}>
                              {getCategoryEmoji(b.category)} {b.category}
                            </span>
                          )}
                          {rating > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button type="button" onClick={() => handleRemoveTarget(b)}
                          disabled={toggleTargetMutation.isPending}
                          title="Remove from targets"
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all">
                          <Target className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setDeleteId(b._id)}
                          title="Delete permanently"
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 cursor-pointer transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {(hasAddr || hasWeb) && (
                      <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                        {hasAddr && (
                          <div className="flex items-start gap-2 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{b.address}</span>
                          </div>
                        )}
                        {hasWeb && (
                          <div className="flex items-center gap-2 text-xs">
                            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <a href={b.website.startsWith('http') ? b.website : `https://${b.website}`}
                              target="_blank" rel="noreferrer"
                              className="text-sky-600 hover:underline font-medium truncate">
                              {b.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5">
                      <span className="text-xs font-semibold text-slate-500">Lead Status</span>
                      <LeadStatusDropdown
                        status={b.status || 'Not Contacted'}
                        onChange={(newStatus) => updateStatusMutation.mutate({ id: b._id, status: newStatus })}
                        disabled={updateStatusMutation.isPending}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2.5">
                      {hasPhone ? (
                        <a href={`tel:${b.phone}`}
                          className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white text-xs font-semibold px-2 py-2 rounded-lg truncate">
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{b.phone}</span>
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 border border-slate-100 py-2 rounded-lg">
                          <Phone className="w-3.5 h-3.5" /> No phone
                        </div>
                      )}
                      {hasPhone && waUrl ? (
                        <a href={waUrl} target="_blank" rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-2 py-2 rounded-lg transition-colors">
                          <WhatsAppIcon size={14} /> Chat Now
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 border border-slate-100 py-2 rounded-lg">
                          <WhatsAppIcon size={12} /> N/A
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ══ DESKTOP TABLE ════════════════════════════════════════ */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left table-fixed" style={{ borderCollapse: 'collapse' }}>
              <colgroup>
                <col style={{ width: '25%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '5%' }} />
              </colgroup>
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Business & Category', 'Status', 'Address', 'Phone', 'WhatsApp', 'Website', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((b, idx) => {
                  const title    = b.title || b.name || 'Unnamed';
                  const waUrl    = getWhatsAppUrl(b.phone);
                  const hasPhone = b.phone && b.phone !== 'N/A' && b.phone !== '';
                  const rating   = parseFloat(b.rating || b.totalScore || 0);

                  return (
                    <tr key={`${b._id || 'r'}_tr_${idx}`}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">

                      {/* Business */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <Link href={`/dashboard/businesses/${b._id}`}
                              className="text-[12.5px] font-bold text-slate-900 hover:text-indigo-600 transition-colors leading-snug">
                              {title}
                            </Link>
                            {b.mapsUrl && (
                              <a href={b.mapsUrl} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[9px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded shrink-0">
                                <MapPin className="w-2 h-2" /> Maps
                              </a>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {b.category && (
                              <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(b.category)}`}>
                                {getCategoryEmoji(b.category)} {b.category}
                              </span>
                            )}
                            {b.searchKeyword && (
                              <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                                🏷️ {parseKeyword(b.searchKeyword).label}
                              </span>
                            )}
                            {rating > 0 && (
                              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 align-top">
                        <LeadStatusDropdown
                          status={b.status || 'Not Contacted'}
                          onChange={(newStatus) => updateStatusMutation.mutate({ id: b._id, status: newStatus })}
                          disabled={updateStatusMutation.isPending}
                        />
                      </td>

                      {/* Address */}
                      <td className="px-4 py-3 align-top">
                        {b.address && b.address !== 'N/A' ? (
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{b.address}</span>
                          </div>
                        ) : <span className="text-slate-200 text-lg">—</span>}
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3 align-top">
                        {hasPhone ? (
                          <a href={`tel:${b.phone}`}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors max-w-full">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span className="truncate">{b.phone}</span>
                          </a>
                        ) : <span className="text-[10.5px] text-slate-300 italic">No phone</span>}
                      </td>

                      {/* WhatsApp */}
                      <td className="px-4 py-3 align-top">
                        {hasPhone && waUrl ? (
                          <a href={waUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors">
                            <WhatsAppIcon size={13} /> Chat Now
                          </a>
                        ) : <span className="text-[10px] text-slate-300">N/A</span>}
                      </td>

                      {/* Website */}
                      <td className="px-4 py-3 align-top">
                        {b.website && b.website !== 'N/A' ? (
                          <a href={b.website.startsWith('http') ? b.website : `https://${b.website}`}
                            target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 text-[11px] font-medium hover:underline max-w-full">
                            <Globe className="w-3 h-3 shrink-0" />
                            <span className="truncate">{b.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 text-slate-300" />
                          </a>
                        ) : <span className="text-[10px] text-slate-300">No site</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3 align-top">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button type="button" onClick={() => handleRemoveTarget(b)}
                            disabled={toggleTargetMutation.isPending}
                            title="Remove from targets"
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer transition-all">
                            <Target className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => setDeleteId(b._id)}
                            title="Delete permanently"
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── BOTTOM PAGINATION ──────────────────────────────────────── */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <PrevBtn />
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(pg => (
            <button key={pg} type="button" onClick={() => setPage(pg)}
              className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                pg === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
              }`}>{pg}</button>
          ))}
          <NextBtn />
        </div>
      )}

      {/* ── CONFIRM DELETE (single lead) ───────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
        title="Delete this lead?"
        description="This lead will be permanently removed from your database."
        confirmLabel="Delete"
        confirmVariant="danger"
      />

      {/* ── CONFIRM BULK UNTARGET (campaign) ───────────────────────── */}
      <ConfirmDialog
        isOpen={!!untargetKw}
        onClose={() => setUntargetKw(null)}
        onConfirm={() => bulkUntargetMutation.mutate({ keyword: untargetKw?.key })}
        loading={bulkUntargetMutation.isPending}
        title={`Remove all "${untargetKw?.label}" targets?`}
        description={`This will un-target ${untargetKw?.count ?? ''} lead(s) from "${untargetKw?.label}". Leads will NOT be deleted — just removed from Target Leads.`}
        confirmLabel="Yes, Remove All"
        confirmVariant="danger"
      />
    </div>
  );
}
