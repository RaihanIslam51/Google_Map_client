'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  MapPin, Globe, Search, Phone, Target, Trash2,
  ChevronLeft, ChevronRight, Loader2, ExternalLink,
  ArrowRight, X, Star
} from 'lucide-react';
import { showSwal } from '../../../lib/swal';
import { businessesApi } from '../../../lib/api/businesses';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useLeadsCacheQuery } from '../../../hooks/useLeadsCacheQuery';
import { leadsCache } from '../../../lib/cache/leadsCache';

// WhatsApp number formatter (Bangladesh-aware)
function getWhatsAppUrl(phone = '') {
  if (!phone || typeof phone !== 'string' || phone === 'N/A') return null;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('01') && cleaned.length === 11) cleaned = '88' + cleaned;
  cleaned = cleaned.replace(/^\+/, '');
  return `https://wa.me/${cleaned}`;
}

// WhatsApp SVG icon
function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.474 1.333 4.988l-1.417 5.177 5.299-1.39a9.943 9.943 0 0 0 4.773 1.216h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0 0 12.012 2zm0 18.163h-.003a8.277 8.277 0 0 1-4.22-1.157l-.303-.18-3.137.822.836-3.057-.197-.314a8.272 8.272 0 0 1-1.267-4.46c0-4.568 3.718-8.286 8.288-8.286 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.425 5.86c0 4.569-3.717 8.288-8.28 8.288zm4.542-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.166.249-.643.81-.788.976-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.003-1.237-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.29.373-.435.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.076 0 1.225.892 2.408 1.016 2.574.125.166 1.756 2.682 4.254 3.761.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.183.208-.581.208-1.079.145-1.183-.063-.104-.229-.166-.478-.291z" />
    </svg>
  );
}

const CATEGORIES = [
  'All Categories', 'Restaurants', 'Hotels', 'Hospitals', 'Software Companies',
  'Pharmacies', 'Schools', 'Mobile Shop', 'Dentists',
];

export default function TargetLeadsPage() {
  const qc = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [activeFilter, setActiveFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useLeadsCacheQuery({
    queryKey: ['target-leads-list', page, searchQuery, selectedCategory],
    queryFn: () => businessesApi.getAll({
      page, limit: 50,
      search: searchQuery,
      category: selectedCategory === 'All Categories' ? '' : selectedCategory,
      isTarget: true,
    }),
    staleTime: 60000,
  });

  const toggleTargetMutation = useMutation({
    mutationFn: ({ id, isTarget }) => businessesApi.toggleTarget(id, isTarget),
    onSuccess: async () => {
      await leadsCache.clearMatching('target-leads-list');
      await leadsCache.clearMatching('crm-businesses');
      qc.invalidateQueries({ queryKey: ['target-leads-list'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => businessesApi.deleteById(id),
    onSuccess: async () => {
      await leadsCache.clearMatching('target-leads-list');
      await leadsCache.clearMatching('crm-businesses');
      qc.invalidateQueries({ queryKey: ['target-leads-list'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses-stats'] });
      setDeleteId(null);
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
      customClass: {
        popup: 'rounded-3xl p-6 shadow-2xl font-sans',
        confirmButton: 'rounded-xl text-xs font-extrabold px-6 py-2.5',
        cancelButton: 'rounded-xl text-xs font-extrabold px-6 py-2.5',
      },
    });
    if (res?.isConfirmed) toggleTargetMutation.mutate({ id: b._id, isTarget: false });
  };

  const rawLeads = Array.isArray(data?.data) ? data.data : [];

  let leads = rawLeads.filter(b => {
    if (!b || typeof b !== 'object') return false;
    if (activeFilter === 'phone') return b.phone && b.phone !== 'N/A' && b.phone !== '';
    if (activeFilter === 'no_phone') return !b.phone || b.phone === 'N/A' || b.phone === '';
    if (activeFilter === 'website') return b.website && b.website !== '';
    return true;
  });

  const total = data?.total ?? leads.length;
  const pages = data?.pages ?? 1;

  const withPhone = rawLeads.filter(b => b?.phone && b.phone !== 'N/A' && b.phone !== '').length;
  const withWebsite = rawLeads.filter(b => b?.website && b.website !== '').length;
  const noPhone = rawLeads.length - withPhone;

  const filterBadges = [
    { id: 'all',      label: 'All',        count: rawLeads.length },
    { id: 'phone',    label: '📞 Has Phone', count: withPhone },
    { id: 'no_phone', label: 'No Phone',   count: noPhone },
    { id: 'website',  label: '🌐 Website',  count: withWebsite },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 container mx-auto px-3 sm:px-4 py-2 text-slate-800">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            🎯 Target Leads
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Manually targeted leads for WhatsApp outreach</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            IndexedDB Cached
          </span>
          <Link href="/dashboard/businesses"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-200 cursor-pointer transition-all">
            Add More Targets
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── KPI Strip ───────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-2.5 sm:p-4 shadow-xs">
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mb-1 sm:mb-2">Total Targeted</p>
          <p className="text-xl sm:text-3xl font-black text-indigo-600">{total.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-2.5 sm:p-4 shadow-xs">
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mb-1 sm:mb-2">📞 With Phone</p>
          <p className="text-xl sm:text-3xl font-black text-emerald-600">{withPhone.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-2.5 sm:p-4 shadow-xs">
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mb-1 sm:mb-2">🌐 With Website</p>
          <p className="text-xl sm:text-3xl font-black text-sky-600">{withWebsite.toLocaleString()}</p>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-3 sm:p-4 shadow-xs space-y-2.5 sm:space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none" />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 p-0.5">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {/* Category */}
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 focus:outline-none cursor-pointer">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Quick filter chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {filterBadges.map(b => (
            <button key={b.id} type="button" onClick={() => setActiveFilter(b.id)}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold cursor-pointer transition-all ${
                activeFilter === b.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
              }`}>
              {b.label} · {b.count}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Header / Status ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <p className="text-xs text-slate-400 font-medium">
          Showing <span className="text-slate-800 font-bold">{leads.length}</span> of{' '}
          <span className="text-slate-800 font-bold">{total}</span> target leads
        </p>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <span className="text-xs text-slate-500 font-medium px-1">{page} / {pages}</span>
          <button type="button" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* ── Content Area (Mobile Cards + Desktop Table) ────────────────── */}
      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-2xl py-16 flex flex-col items-center gap-3 text-slate-400 shadow-xs">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          <span className="text-xs">Loading target leads...</span>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl py-16 flex flex-col items-center gap-3 px-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Target className="w-7 h-7 text-indigo-400" />
          </div>
          <p className="text-sm font-bold text-slate-700">No target leads yet</p>
          <p className="text-xs text-slate-400 max-w-xs text-center">
            Go to the Leads CRM and click the Target button on any lead to add them here.
          </p>
          <Link href="/dashboard/businesses"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl mt-1 cursor-pointer hover:bg-indigo-700 transition-all">
            Open Leads CRM <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <>
          {/* ── Mobile View: Fast Card List (< md) ────────────────────────────── */}
          <div className="md:hidden space-y-3">
            {leads.map((b, idx) => {
              const title = b.title || b.name || 'Unnamed';
              const waUrl = getWhatsAppUrl(b.phone);
              const hasPhone = b.phone && b.phone !== 'N/A' && b.phone !== '';
              const rating = parseFloat(b.rating || b.totalScore || 0);

              return (
                <div key={`${b._id || 'card'}_mob_${idx}`} className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs space-y-2.5">
                  {/* Title & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/dashboard/businesses/${b._id}`}
                          className="font-bold text-slate-800 text-[13px] hover:text-indigo-600 transition-colors line-clamp-1">
                          {title}
                        </Link>
                        {b.mapsUrl && (
                          <a href={b.mapsUrl} target="_blank" rel="noreferrer"
                            className="text-slate-300 hover:text-indigo-500 shrink-0">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {b.category && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-500 border border-indigo-100 px-1.5 py-0.5 rounded-md font-semibold">
                            {b.category}
                          </span>
                        )}
                        {rating > 0 && (
                          <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            {rating}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button type="button" onClick={() => handleRemoveTarget(b)}
                        disabled={toggleTargetMutation.isPending}
                        title="Remove from targets"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                        <Target className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setDeleteId(b._id)}
                        title="Delete permanently"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Address & Website */}
                  {(b.address && b.address !== 'N/A' || b.website && b.website !== 'N/A') && (
                    <div className="space-y-1 pt-0.5">
                      {b.address && b.address !== 'N/A' && (
                        <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
                          <span className="leading-relaxed whitespace-pre-wrap break-words">{b.address}</span>
                        </div>
                      )}
                      {b.website && b.website !== 'N/A' && (
                        <div className="text-[11px]">
                          <a href={b.website.startsWith('http') ? b.website : `https://${b.website}`}
                            target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sky-600 font-medium hover:underline line-clamp-1">
                            <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                            {b.website.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MAIN FOCUS: Phone & WhatsApp Actions */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {hasPhone ? (
                      <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 py-2 px-3 rounded-xl font-bold text-xs shadow-xs">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <a href={`tel:${b.phone}`} className="hover:underline">{b.phone}</a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 bg-slate-50 border border-slate-100 py-2 px-3 rounded-xl">
                        <Phone className="w-3.5 h-3.5" /> No phone
                      </div>
                    )}

                    {hasPhone && waUrl ? (
                      <a href={waUrl} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1faa4e] text-white py-2 px-4 rounded-xl font-bold text-xs shadow-md shadow-emerald-400/20 active:scale-[0.98] transition-all cursor-pointer">
                        <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                        Chat Now
                      </a>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5 text-xs text-slate-300 bg-slate-50 border border-slate-100 py-2 px-3 rounded-xl">
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-slate-300" /> WhatsApp N/A
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop View: Clean Table (≥ md) ────────────────────────────── */}
          <div className="hidden md:block bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Business</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Address</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-emerald-500">📞 Phone</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#25D366]">💬 WhatsApp</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Website</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Rating</th>
                    <th className="px-4 py-3 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((b, idx) => {
                    const title = b.title || b.name || 'Unnamed';
                    const waUrl = getWhatsAppUrl(b.phone);
                    const hasPhone = b.phone && b.phone !== 'N/A' && b.phone !== '';
                    const rating = parseFloat(b.rating || b.totalScore || 0);

                    return (
                      <tr key={`${b._id || 'row'}_tr_${idx}`} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors text-xs">

                        {/* Business */}
                        <td className="px-4 py-4 max-w-[200px]">
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
                          {b.category && (
                            <span className="text-[10px] bg-indigo-50 text-indigo-500 border border-indigo-100 px-1.5 py-0.5 rounded-md font-semibold">
                              {b.category}
                            </span>
                          )}
                        </td>

                        {/* Address */}
                        <td className="px-4 py-4 max-w-[240px]">
                          {b.address && b.address !== 'N/A' ? (
                            <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
                              <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
                              <span className="leading-relaxed whitespace-pre-wrap break-words">{b.address}</span>
                            </div>
                          ) : (
                            <span className="text-slate-300 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Phone — MAIN FOCUS */}
                        <td className="px-4 py-4">
                          {hasPhone ? (
                            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl font-bold text-[12px] shadow-xs">
                              <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {b.phone}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                              <Phone className="w-3 h-3" /> No phone
                            </span>
                          )}
                        </td>

                        {/* WhatsApp — MAIN FOCUS */}
                        <td className="px-4 py-4">
                          {hasPhone && waUrl ? (
                            <a href={waUrl} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-1.5 rounded-xl font-bold text-[11.5px] shadow-md shadow-emerald-400/30 cursor-pointer transition-all">
                              <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                              Chat Now
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                              <WhatsAppIcon className="w-3 h-3 fill-slate-300" /> N/A
                            </span>
                          )}
                        </td>

                        {/* Website */}
                        <td className="px-4 py-4 max-w-[160px]">
                          {b.website && b.website !== 'N/A' ? (
                            <a href={b.website.startsWith('http') ? b.website : `https://${b.website}`}
                              target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-sky-600 hover:underline text-[11px] font-medium line-clamp-1">
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
                        <td className="px-4 py-4 text-center">
                          {rating > 0 ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-[11px] font-bold px-2 py-1 rounded-lg">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {rating}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button type="button" onClick={() => handleRemoveTarget(b)}
                              disabled={toggleTargetMutation.isPending}
                              title="Remove from targets"
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                              <Target className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => setDeleteId(b._id)}
                              title="Delete permanently"
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer">
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
          </div>
        </>
      )}

      {/* ── Bottom Pagination ─────────────────────────────────────── */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1">
          <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(pg => (
            <button key={pg} type="button" onClick={() => setPage(pg)}
              className={`w-8 h-8 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                pg === page
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
              }`}>{pg}</button>
          ))}
          <button type="button" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 cursor-pointer">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      )}

      {/* ── Confirm Delete ────────────────────────────────────────── */}
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
    </div>
  );
}
