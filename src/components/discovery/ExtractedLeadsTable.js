'use client';

import { useState } from 'react';
import {
  Sparkles, Download, CheckCircle2, Loader2, Building2,
  Phone, Star, ExternalLink, MapPin, Target, Globe, Mail, Copy, Check
} from 'lucide-react';

// ── Copy-to-clipboard mini hook ──────────────────────────────
function CopyEmailButton({ email }) {
  const [copied, setCopied] = useState(false);
  if (!email) return null;
  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy email'}
      className={`ml-1 p-0.5 rounded transition-all cursor-pointer shrink-0 ${
        copied
          ? 'text-emerald-500'
          : 'text-violet-400 hover:text-violet-600'
      }`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function getWhatsAppUrl(phone = '') {
  if (!phone || typeof phone !== 'string' || phone === 'N/A') return null;
  let cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('01') && cleaned.length === 11) {
    cleaned = '88' + cleaned;
  }
  cleaned = cleaned.replace(/^\+/, '');
  return `https://wa.me/${cleaned}`;
}

export default function ExtractedLeadsTable({
  leads,
  leadsLoading,
  extractSuccess,
  extractPending,
  targetAddedSet,
  onTargetToggle,
  onExportCSV,
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          <h2 className="text-sm font-bold text-slate-900">Extracted Real Leads</h2>
          <span className="bg-indigo-50 text-[#4F46E5] border border-indigo-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            {leads.length} Records
          </span>
        </div>

        <div className="flex items-center gap-2">
          {leads.length > 0 && (
            <button
              type="button"
              onClick={onExportCSV}
              className="flex items-center gap-1.5 bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#4F46E5]" /> Export CSV
            </button>
          )}

          {extractSuccess && !extractPending && (
            <span className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Google Maps extraction complete!
            </span>
          )}
        </div>
      </div>

      {leadsLoading && leads.length === 0 ? (
        <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 text-[#8B5CF6] animate-spin" />
          <span className="text-xs font-medium">Loading extracted leads...</span>
        </div>
      ) : leads.length === 0 ? (
        <div className="p-10 sm:p-14 text-center space-y-3">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-[#8B5CF6]">
            <Building2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">No leads extracted yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Type a search keyword like &quot;Software Companies&quot; above and click Extract. The backend browser will launch Chromium and scrape real Google Maps data.
          </p>
        </div>
      ) : (
        <>
          {/* ── Mobile Card List (< md) ────────────────────────────── */}
          <div className="md:hidden divide-y divide-slate-100 p-3 space-y-3">
            {leads.map((b, idx) => {
              if (!b || typeof b !== 'object') return null;
              const itemTitle = String(b.title || b.name || 'Untitled Business');
              const itemCategory = String(b.category || 'Business');
              const itemPhone = String(b.phone || '');
              const itemAddress = String(b.address || 'N/A');
              const itemScore = b.totalScore || b.rating || '';
              const itemWebsite = String(b.website || '');
              const itemEmail = String(b.email || '');
              const itemId = b._id || `lead_${idx}`;
              const waUrl = getWhatsAppUrl(itemPhone);
              const isTarget = targetAddedSet.has(itemId);
              const cardKey = `${itemId}_mob_${idx}`;

              return (
                <div key={cardKey} className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs space-y-2.5">
                  {/* Top Bar: Title & Category + Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-slate-900 text-[13.5px] leading-snug break-words">{itemTitle}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {itemCategory && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-md font-semibold">
                            {itemCategory}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={b.mapsUrl || `https://www.google.com/maps/search/${encodeURIComponent(itemTitle + ' ' + itemAddress)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-slate-200 transition-colors"
                        title="Google Maps Profile"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => onTargetToggle(itemId)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isTarget
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                        title={isTarget ? 'Targeted' : 'Target'}
                      >
                        <Target className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* MAIN FOCUS 1: Address */}
                  {itemAddress && itemAddress !== 'N/A' && (
                    <div className="flex items-start gap-1.5 text-[11px] text-slate-600 bg-slate-50/80 border border-slate-100 p-2 rounded-xl">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed whitespace-pre-wrap break-words">{itemAddress}</span>
                    </div>
                  )}

                  {/* Email */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email:</span>
                    {itemEmail ? (
                      <div className="inline-flex items-center gap-1 bg-violet-50 border border-violet-100 px-2 py-1 rounded-lg max-w-[200px] overflow-hidden">
                        <Mail className="w-3 h-3 text-violet-400 shrink-0" />
                        <a
                          href={`mailto:${itemEmail}`}
                          className="text-violet-700 hover:underline text-[11px] font-semibold truncate"
                          title={itemEmail}
                        >
                          {itemEmail}
                        </a>
                        <CopyEmailButton email={itemEmail} />
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-300 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md font-medium">
                        <Mail className="w-3 h-3" /> No email
                      </span>
                    )}
                  </div>

                  {/* MAIN FOCUS 2: Website */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Website:</span>
                    {itemWebsite && itemWebsite !== 'N/A' ? (
                      <a
                        href={itemWebsite.startsWith('http') ? itemWebsite : `https://${itemWebsite}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sky-600 hover:underline text-[11.5px] font-bold bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-lg line-clamp-1"
                      >
                        <Globe className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        {itemWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md font-medium">
                        <Globe className="w-3 h-3" /> No site
                      </span>
                    )}
                  </div>

                  {/* MAIN FOCUS 3: Phone Number & WhatsApp Button */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {itemPhone && itemPhone !== 'N/A' ? (
                      <div className="flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 py-2 px-3 rounded-xl font-bold text-xs shadow-xs">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <a href={`tel:${itemPhone}`} className="hover:underline">{itemPhone}</a>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 bg-slate-50 border border-slate-100 py-2 px-3 rounded-xl">
                        <Phone className="w-3.5 h-3.5" /> No phone
                      </div>
                    )}

                    {itemPhone && waUrl ? (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1faa4e] text-white py-2 px-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-400/20 transition-all cursor-pointer"
                      >
                        <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.474 1.333 4.988l-1.417 5.177 5.299-1.39a9.943 9.943 0 0 0 4.773 1.216h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062a9.923 9.923 0 0 0-7.059-2.93zm0 18.163h-.003a8.277 8.277 0 0 1-4.22-1.157l-.303-.18-3.137.822.836-3.057-.197-.314a8.272 8.272 0 0 1-1.267-4.46c0-4.568 3.718-8.286 8.288-8.286 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.425 5.86c0 4.569-3.717 8.288-8.28 8.288zm4.542-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.166.249-.643.81-.788.976-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.003-1.237-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.29.373-.435.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.076 0 1.225.892 2.408 1.016 2.574.125.166 1.756 2.682 4.254 3.761.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.183.208-.581.208-1.079.145-1.183-.063-.104-.229-.166-.478-.291z"/>
                        </svg>
                        <span>Chat Now</span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300 bg-slate-50 border border-slate-100 py-2 px-3 rounded-xl">
                        WhatsApp N/A
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop Table (≥ md) ────────────────────────────── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest bg-slate-50/80">
                  <th className="px-5 py-3.5 text-slate-400">Business</th>
                  <th className="px-4 py-3.5 text-violet-600">📧 Business Email</th>
                  <th className="px-5 py-3.5 text-emerald-600">📞 Phone</th>
                  <th className="px-5 py-3.5 text-[#25D366]">💬 WhatsApp</th>
                  <th className="px-5 py-3.5 text-slate-400">📍 Address</th>
                  <th className="px-5 py-3.5 text-sky-600">🌐 Website</th>
                  <th className="px-5 py-3.5 text-right w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leads.map((b, idx) => {
                  if (!b || typeof b !== 'object') return null;
                  const itemTitle = String(b.title || b.name || 'Untitled Business');
                  const itemCategory = String(b.category || 'Business');
                  const itemPhone = String(b.phone || '');
                  const itemAddress = String(b.address || 'N/A');
                  const itemScore = b.totalScore || b.rating || '';
                  const itemWebsite = String(b.website || '');
                  const itemEmail = String(b.email || '');
                  const itemId = b._id || `lead_${idx}`;
                  const waUrl = getWhatsAppUrl(itemPhone);
                  const isTarget = targetAddedSet.has(itemId);

                  return (
                    <tr key={`${itemId}_tr_${idx}`} className="hover:bg-slate-50/80 transition-colors animate-in fade-in">
                      {/* Business */}
                      <td className="px-5 py-4 min-w-[240px]">
                        <p className="font-extrabold text-slate-900 text-[13.5px] leading-snug break-words whitespace-normal">{itemTitle}</p>
                        {itemCategory && (
                          <span className="inline-block mt-0.5 text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-md font-bold">
                            {itemCategory}
                          </span>
                        )}
                      </td>

                      {/* Email — MAIN FOCUS */}
                      <td className="px-4 py-4 max-w-[200px]">
                        {itemEmail ? (
                          <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-800 px-2.5 py-1.5 rounded-xl font-semibold text-[11px] shadow-xs max-w-full">
                            <Mail className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                            <a
                              href={`mailto:${itemEmail}`}
                              className="hover:underline truncate block max-w-[140px]"
                              title={itemEmail}
                            >
                              {itemEmail}
                            </a>
                            <CopyEmailButton email={itemEmail} />
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                            <Mail className="w-3 h-3" /> No email
                          </span>
                        )}
                      </td>

                      {/* Phone — MAIN FOCUS */}
                      <td className="px-5 py-4">
                        {itemPhone && itemPhone !== 'N/A' ? (
                          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl font-bold text-[12px] shadow-xs">
                            <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {itemPhone}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                            <Phone className="w-3 h-3" /> No phone
                          </span>
                        )}
                      </td>

                      {/* WhatsApp — MAIN FOCUS */}
                      <td className="px-5 py-4">
                        {itemPhone && waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-3 py-1.5 rounded-xl font-bold text-[11.5px] shadow-md shadow-emerald-400/20 cursor-pointer transition-all"
                          >
                            <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
                              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.76.459 3.474 1.333 4.988l-1.417 5.177 5.299-1.39a9.943 9.943 0 0 0 4.773 1.216h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.038-5.176-2.925-7.062a9.923 9.923 0 0 0-7.059-2.93zm0 18.163h-.003a8.277 8.277 0 0 1-4.22-1.157l-.303-.18-3.137.822.836-3.057-.197-.314a8.272 8.272 0 0 1-1.267-4.46c0-4.568 3.718-8.286 8.288-8.286 2.213 0 4.293.862 5.858 2.428a8.23 8.23 0 0 1 2.425 5.86c0 4.569-3.717 8.288-8.28 8.288zm4.542-6.208c-.249-.125-1.472-.727-1.7-.81-.228-.083-.394-.125-.56.125-.166.249-.643.81-.788.976-.145.166-.29.187-.539.062-.249-.125-1.052-.388-2.003-1.237-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.109-.508.112-.112.249-.29.373-.435.125-.145.166-.249.249-.415.083-.166.042-.311-.021-.435-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.435.062-.663.311-.228.249-.871.851-.871 2.076 0 1.225.892 2.408 1.016 2.574.125.166 1.756 2.682 4.254 3.761.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.183.208-.581.208-1.079.145-1.183-.063-.104-.229-.166-.478-.291z"/>
                            </svg>
                            Chat Now
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">
                            N/A
                          </span>
                        )}
                      </td>

                      {/* Address — MAIN FOCUS */}
                      <td className="px-5 py-4 max-w-[240px]">
                        {itemAddress && itemAddress !== 'N/A' ? (
                          <div className="flex items-start gap-1.5 text-[11px] text-slate-600">
                            <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-slate-400" />
                            <span className="leading-relaxed whitespace-pre-wrap break-words">{itemAddress}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Website — MAIN FOCUS */}
                      <td className="px-5 py-4 max-w-[160px]">
                        {itemWebsite && itemWebsite !== 'N/A' ? (
                          <a
                            href={itemWebsite.startsWith('http') ? itemWebsite : `https://${itemWebsite}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sky-600 hover:underline text-[11px] font-medium line-clamp-1"
                          >
                            <Globe className="w-3 h-3 text-sky-400 shrink-0" />
                            {itemWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0]}
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg font-medium">
                            <Globe className="w-3 h-3" /> No site
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={b.mapsUrl || `https://www.google.com/maps/search/${encodeURIComponent(itemTitle + ' ' + itemAddress)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-400 hover:bg-slate-100 transition-colors"
                            title="Open Google Maps Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => onTargetToggle(itemId)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isTarget
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-50 border border-slate-200 text-slate-400 hover:border-indigo-400 hover:text-indigo-600'
                            }`}
                            title={isTarget ? 'Targeted' : 'Target'}
                          >
                            <Target className="w-3.5 h-3.5" />
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
    </div>
  );
}
