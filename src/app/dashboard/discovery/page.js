'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SlidersHorizontal, ChevronUp, ChevronDown } from 'lucide-react';

import { searchJobsApi } from '../../../lib/api/search-jobs';
import { businessesApi } from '../../../lib/api/businesses';

import { BANGLADESH_LOCATIONS_MAP, isProfessionalWebsite } from '../../../components/discovery/constants';
import DiscoverySearchBar from '../../../components/discovery/DiscoverySearchBar';
import QuickSearchPills from '../../../components/discovery/QuickSearchPills';
import LiveMetricsPanel from '../../../components/discovery/LiveMetricsPanel';
import AdvancedFiltersBox from '../../../components/discovery/AdvancedFiltersBox';
import ExtractedLeadsTable from '../../../components/discovery/ExtractedLeadsTable';
import LiveLogsModal from '../../../components/discovery/LiveLogsModal';

export default function DiscoveryPage() {
  const qc = useQueryClient();
  const logContainerRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Core Form State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [limit, setLimit] = useState(50);
  const [tabsCount, setTabsCount] = useState(20);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [headful, setHeadful] = useState(false);

  // Live Terminal Modal State
  const [showLogTerminal, setShowLogTerminal] = useState(false);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logFilterTab, setLogFilterTab] = useState('all');
  const [isLogPaused, setIsLogPaused] = useState(false);
  const [clearedLogIds, setClearedLogIds] = useState(new Set());

  // Filter States
  const [noWebsite, setNoWebsite] = useState(false);
  const [mustHavePhone, setMustHavePhone] = useState(false);
  const [location, setLocation] = useState('Dhaka');
  const [radius, setRadius] = useState('Any distance');
  const [minRating, setMinRating] = useState('Any Rating');
  const [minReviews, setMinReviews] = useState('');
  const [negativeKeywords, setNegativeKeywords] = useState('');

  // Target Leads Selection Tracking
  const [targetAddedSet, setTargetAddedSet] = useState(new Set());
  const [extractedLeadsList, setExtractedLeadsList] = useState([]);

  // Ref to track live scraping state inside event listeners (avoids stale closure)
  const isScrapingRef = useRef(false);

  // Outside click listener for search autocomplete
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Query Real Scraped Businesses
  const { data: businessesData, isLoading: leadsLoading, refetch } = useQuery({
    queryKey: ['discovery-real-leads'],
    queryFn: () => businessesApi.getAll({ limit: Number(limit) }),
  });

  // REAL Google Maps Scraper Mutation
  const extractMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await searchJobsApi.create(payload);
      return response;
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['discovery-real-leads'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses'] });
      qc.invalidateQueries({ queryKey: ['search-jobs'] });

      if (res?.data?.results && Array.isArray(res.data.results)) {
        setExtractedLeadsList(res.data.results);
      } else {
        refetch();
      }
    },
  });

  // STOP Scraper Mutation
  const stopMutation = useMutation({
    mutationFn: async () => {
      const res = await searchJobsApi.stop();
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['discovery-real-leads'] });
      qc.invalidateQueries({ queryKey: ['crm-businesses'] });
      qc.invalidateQueries({ queryKey: ['search-job-live-status'] });
      refetch();
    },
  });

  // Query Real-Time RUNTIME Scraper Progress — poll at 600ms when active, 3s when idle
  const { data: liveStatusData } = useQuery({
    queryKey: ['search-job-live-status'],
    queryFn: () => searchJobsApi.getLiveStatus(),
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      if (extractMutation.isPending || status === 'running' || status === 'stopping') return 600;
      return 3000; // light poll when idle to detect server-side status changes
    },
  });

  // Query Real-Time Backend Execution LOGS
  const { data: logsData } = useQuery({
    queryKey: ['search-job-live-logs'],
    queryFn: () => searchJobsApi.getLiveLogs(),
    refetchInterval: (extractMutation.isPending || liveStatusData?.data?.status === 'running' || showLogTerminal) && !isLogPaused ? 600 : false,
  });

  const live = liveStatusData?.data;
  const isScraping = Boolean(extractMutation.isPending || live?.status === 'running' || live?.status === 'stopping');

  // 🔴 Live DB poll — fetch latest saved leads from MongoDB every 2.5s while scraping
  const { data: liveLeadsData } = useQuery({
    queryKey: ['discovery-live-leads'],
    queryFn: () => businessesApi.getAll({ limit: Number(limit), page: 1 }),
    enabled: isScraping,
    refetchInterval: isScraping ? 2500 : false,
    staleTime: 0,
  });

  // Keep ref in sync so event handlers can read the latest value without stale closures
  isScrapingRef.current = isScraping;

  const rawLogs = Array.isArray(logsData?.logs) ? logsData.logs : [];
  const logsList = rawLogs.filter(l => l && typeof l === 'object' && l.id && !clearedLogIds.has(l.id));

  // Auto scroll logs console to bottom safely
  useEffect(() => {
    if (showLogTerminal && !isLogPaused && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logsList, showLogTerminal, isLogPaused]);

  // ✅ Auto-stop scraper when page closes / hard-reloads
  useEffect(() => {
    const handleUnload = () => {
      if (!isScrapingRef.current) return;
      // Use sendBeacon for guaranteed delivery on page unload
      const savedUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('custom_api_url') : null;
      const API_BASE = (savedUrl && savedUrl.trim()) ? savedUrl.trim().replace(/\/api$/, '') : (process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000');
      try {
        navigator.sendBeacon(`${API_BASE}/api/search-jobs/stop`, JSON.stringify({}));
      } catch {
        // fallback: synchronous XHR
        try {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${API_BASE}/api/search-jobs/stop`, false);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({}));
        } catch {}
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Metric Computations (always prefer live values if present, then stats, then 0)
  const stats = extractMutation.data?.data?.stats;

  const displayCompleted = live?.completed !== undefined ? Number(live.completed) : (stats?.completed !== undefined ? Number(stats.completed) : 0);
  const displayNew = live?.newLeads !== undefined ? Number(live.newLeads) : (stats?.newLeads !== undefined ? Number(stats.newLeads) : 0);
  const displayDuplicates = live?.duplicates !== undefined ? Number(live.duplicates) : (stats?.duplicates !== undefined ? Number(stats.duplicates) : 0);
  const displayFailed = live?.failed !== undefined ? Number(live.failed) : (stats?.failed !== undefined ? Number(stats.failed) : 0);
  const displayRemaining = live?.remaining !== undefined ? Number(live.remaining) : (isScraping ? Math.max(0, Number(limit) - displayCompleted) : 0);
  const displayPercent = live?.percent !== undefined ? Number(live.percent) : (stats?.successRate !== undefined ? Number(stats.successRate) : 0);

  const handleExtract = () => {
    if (!searchQuery.trim()) return;

    setExtractedLeadsList([]);
    setClearedLogIds(new Set());
    extractMutation.reset();

    qc.setQueryData(['search-job-live-status'], {
      success: true,
      data: {
        keyword: searchQuery,
        totalTarget: Number(limit),
        completed: 0,
        newLeads: 0,
        duplicates: 0,
        failed: 0,
        remaining: Number(limit),
        percent: 0,
        currentLeadTitle: 'Launching Chromium Scraper...',
        status: 'running',
      },
    });

    const fullKeyword = location.trim() ? `${searchQuery.trim()} in ${location.trim()}` : searchQuery.trim();

    extractMutation.mutate({
      keyword: fullKeyword,
      location: location || 'Dhaka',
      maxResults: Number(limit),
      scrollLimit: Number(tabsCount),
      tabsCount: Number(tabsCount),
      concurrency: Number(tabsCount),
      headful: Boolean(headful),
      noWebsite: Boolean(noWebsite),
      mustHavePhone: Boolean(mustHavePhone),
    });
  };

  const handleStop = () => {
    extractMutation.reset();
    qc.setQueryData(['search-job-live-status'], {
      success: true,
      data: {
        status: 'stopped',
        currentLeadTitle: 'Scraping stopped by user',
        completed: live?.completed || 0,
        percent: live?.percent || 0,
      },
    });
    stopMutation.mutate();
    qc.invalidateQueries({ queryKey: ['discovery-real-leads'] });
    qc.invalidateQueries({ queryKey: ['discovery-live-leads'] });
    qc.invalidateQueries({ queryKey: ['crm-businesses'] });
    refetch();
  };

  // Merge: during scraping use live DB data (real-time), after done use final result
  const rawLeads = (() => {
    // 1. If scraping is active and we have live DB results, use them
    if (isScraping && Array.isArray(liveLeadsData?.data) && liveLeadsData.data.length > 0) {
      return liveLeadsData.data;
    }
    // 2. Mutation returned results
    if (Array.isArray(extractedLeadsList) && extractedLeadsList.length > 0) {
      return extractedLeadsList;
    }
    // 3. Default DB fetch
    return Array.isArray(businessesData?.data) ? businessesData.data : [];
  })();

  // Filter Leads
  const leads = rawLeads.filter((item) => {
    if (!item || typeof item !== 'object') return false;

    const itemAddress = String(item.address || '').toLowerCase();
    const itemTitle = String(item.title || item.name || '').toLowerCase();
    const itemCategory = String(item.category || '').toLowerCase();

    // 1. Location Filtering
    if (location && location.trim() && location.toLowerCase() !== 'any' && location.toLowerCase() !== 'all') {
      const locTarget = location.trim().toLowerCase();
      const fullText = `${itemTitle} ${itemAddress}`;
      let matches = fullText.includes(locTarget);

      if (!matches) {
        for (const [key, synonyms] of Object.entries(BANGLADESH_LOCATIONS_MAP)) {
          if (locTarget.includes(key) || synonyms.some((s) => locTarget.includes(s.toLowerCase()))) {
            if (synonyms.some((syn) => fullText.includes(syn.toLowerCase()))) {
              matches = true;
              break;
            }
          }
        }
      }

      if (!matches) {
        const tokens = locTarget.split(/[\s,]+/).filter((t) => t.length > 2);
        if (tokens.some((token) => fullText.includes(token))) {
          matches = true;
        }
      }

      const majorCities = ['dhaka', 'chittagong', 'chattogram', 'sylhet', 'rajshahi', 'khulna', 'barishal', 'rangpur', 'comilla', 'cumilla', 'dinajpur', 'gazipur', 'narayanganj'];
      const targetCity = majorCities.find((c) => locTarget.includes(c));
      if (!matches && targetCity) {
        const conflictingCity = majorCities.find((c) => c !== targetCity && itemAddress.includes(c));
        if (conflictingCity) return false;
      }
    }

    if (mustHavePhone && !item.phone) return false;
    if (noWebsite && isProfessionalWebsite(item.website)) return false;

    if (minRating && minRating !== 'Any Rating') {
      const targetRating = parseFloat(minRating);
      const itemRating = parseFloat(item.rating || item.totalScore || 0);
      if (itemRating < targetRating) return false;
    }

    if (minReviews && !isNaN(Number(minReviews)) && Number(minReviews) > 0) {
      const targetReviews = Number(minReviews);
      const itemReviews = Number(item.reviewCount || 0);
      if (itemReviews < targetReviews) return false;
    }

    if (negativeKeywords && negativeKeywords.trim()) {
      const negList = negativeKeywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean);
      for (const neg of negList) {
        if (itemTitle.includes(neg) || itemCategory.includes(neg) || itemAddress.includes(neg)) {
          return false;
        }
      }
    }

    return true;
  });

  const handleTargetToggle = (id) => {
    const next = new Set(targetAddedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setTargetAddedSet(next);
  };

  const handleExportCSV = () => {
    try {
      if (!Array.isArray(leads) || leads.length === 0) return;
      const headers = ['Business Name', 'Category', 'Email', 'Phone', 'WhatsApp', 'Address', 'Rating', 'Website', 'Maps URL'];
      const csvRows = [
        headers.join(','),
        ...leads.map((l) =>
          [
            `"${String(l?.title || l?.name || '').replace(/"/g, '""')}"`,
            `"${String(l?.category || '').replace(/"/g, '""')}"`,
            `"${String(l?.email || '').replace(/"/g, '""')}"`,
            `"${String(l?.phone || '').replace(/"/g, '""')}"`,
            `"${String(l?.whatsapp || '').replace(/"/g, '""')}"`,
            `"${String(l?.address || '').replace(/"/g, '""')}"`,
            `"${String(l?.rating || l?.totalScore || '').replace(/"/g, '""')}"`,
            `"${String(l?.website || '').replace(/"/g, '""')}"`,
            `"${String(l?.mapsUrl || '').replace(/"/g, '""')}"`,
          ].join(',')
        ),
      ];
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `google_maps_leads_${Date.now()}.csv`;
      a.click();
    } catch (err) {
      console.error('CSV Export Error:', err);
    }
  };

  const copyAllLogsText = () => {
    try {
      const text = logsList.map(l => `[${l.time}] [${String(l.type || 'info').toUpperCase()}] ${l.message}`).join('\n');
      navigator.clipboard.writeText(text);
      alert('Backend logs copied to clipboard!');
    } catch {}
  };

  return (
    <div className="space-y-5 container mx-auto text-slate-800">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Discovery Engine</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search Google Maps by category and location, then collect verified business leads.
        </p>
      </div>

      {/* 1. Search Bar */}
      <DiscoverySearchBar
        searchContainerRef={searchContainerRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        limit={limit}
        setLimit={setLimit}
        tabsCount={tabsCount}
        setTabsCount={setTabsCount}
        isScraping={isScraping}
        stopPending={stopMutation.isPending}
        onExtract={handleExtract}
        onStop={handleStop}
      />

      {/* 2. Popular Search Pills */}
      <QuickSearchPills
        setSearchQuery={setSearchQuery}
        setShowSuggestions={setShowSuggestions}
      />

      {/* 3. Controls Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
          className={`inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-lg text-[13px] font-medium transition-colors border cursor-pointer ${
            showAdvanced
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Advanced filters</span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Status Badge & Live Button */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 min-w-0">
            <span className="relative flex w-2 h-2 shrink-0">
              {isScraping && <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />}
              <span className={`relative inline-flex w-2 h-2 rounded-full ${isScraping ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            </span>
            <span className="truncate">
              {isScraping
                ? `Scraper active: ${displayCompleted}/${limit} (${displayPercent}%)`
                : 'Keep this tab open while scraping'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowLogTerminal(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium transition-colors cursor-pointer shrink-0"
            title="Open Live Logs Modal"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live logs</span>
          </button>
        </div>
      </div>

      {/* 4. Real Extraction Live Progress Metrics Panel */}
      <LiveMetricsPanel
        isScraping={isScraping}
        extractSuccess={extractMutation.isSuccess}
        searchQuery={searchQuery}
        liveKeyword={live?.keyword}
        displayCompleted={displayCompleted}
        displayNew={displayNew}
        displayDuplicates={displayDuplicates}
        displayFailed={displayFailed}
        displayRemaining={displayRemaining}
        displayPercent={displayPercent}
        limit={limit}
        setShowLogTerminal={setShowLogTerminal}
        onStop={handleStop}
        stopPending={stopMutation.isPending}
      />

      {/* 5. Advanced Filters Drawer */}
      {showAdvanced && (
        <AdvancedFiltersBox
          noWebsite={noWebsite}
          setNoWebsite={setNoWebsite}
          mustHavePhone={mustHavePhone}
          setMustHavePhone={setMustHavePhone}
          headful={headful}
          setHeadful={setHeadful}
          location={location}
          setLocation={setLocation}
          radius={radius}
          setRadius={setRadius}
          minRating={minRating}
          setMinRating={setMinRating}
          minReviews={minReviews}
          setMinReviews={setMinReviews}
          negativeKeywords={negativeKeywords}
          setNegativeKeywords={setNegativeKeywords}
        />
      )}

      {/* 6. Extracted Real Leads Table */}
      <ExtractedLeadsTable
        leads={leads}
        leadsLoading={leadsLoading}
        extractSuccess={extractMutation.isSuccess}
        extractPending={extractMutation.isPending}
        targetAddedSet={targetAddedSet}
        onTargetToggle={handleTargetToggle}
        onExportCSV={handleExportCSV}
      />

      {/* 7. Live Logs Modal */}
      <LiveLogsModal
        showLogTerminal={showLogTerminal}
        setShowLogTerminal={setShowLogTerminal}
        isScraping={isScraping}
        isLogPaused={isLogPaused}
        setIsLogPaused={setIsLogPaused}
        rawLogs={rawLogs}
        logsList={logsList}
        logFilterTab={logFilterTab}
        setLogFilterTab={setLogFilterTab}
        logSearchQuery={logSearchQuery}
        setLogSearchQuery={setLogSearchQuery}
        setClearedLogIds={setClearedLogIds}
        logContainerRef={logContainerRef}
        onCopyLogs={copyAllLogsText}
      />
    </div>
  );
}
