'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { leadsCache } from '../lib/cache/leadsCache';

/**
 * Custom React Query Hook with Browser IndexedDB Persistence.
 * - Always fetches fresh data from API (staleTime: 0)
 * - Shows cached data instantly while fresh fetch runs (placeholderData)
 * - Does NOT block API fetch waiting for IndexedDB (enabled: true always)
 * - Retries failed requests with delay
 */
export function useLeadsCacheQuery({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 0,        // Always refetch — never serve stale cache as final
  gcTime = 1000 * 60 * 60 * 24, // 24 hours in-memory GC time
  ...options
}) {
  const serializedKey = leadsCache.serializeKey(queryKey);
  const [cachedData, setCachedData] = useState(undefined);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);
  const keyRef = useRef(serializedKey);

  // Load IndexedDB cache in background — does NOT block the API fetch
  useEffect(() => {
    keyRef.current = serializedKey;
    let isMounted = true;

    leadsCache.get(serializedKey).then((data) => {
      if (isMounted && keyRef.current === serializedKey) {
        if (data !== null && data !== undefined) {
          setCachedData(data);
        }
        setIsCacheLoaded(true);
      }
    }).catch(() => {
      // IndexedDB might not be available (private browsing on some browsers)
      if (isMounted) setIsCacheLoaded(true);
    });

    return () => { isMounted = false; };
  }, [serializedKey]);

  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await queryFn();
      if (res !== undefined && res !== null) {
        // Asynchronously persist to IndexedDB — don't await (non-blocking)
        leadsCache.set(serializedKey, res).catch(() => {
          // Silently ignore IndexedDB write failures (private mode etc.)
        });
      }
      return res;
    },
    // placeholderData shows cached data while real fetch is in progress
    // Real API data ALWAYS replaces placeholder when it arrives
    placeholderData: cachedData,
    staleTime,   // 0 = always fetch fresh from API
    gcTime,
    enabled,     // Always enabled — don't block on IndexedDB load
    retry: 3,    // Retry 3 times on failure
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000), // Exponential: 2s, 4s, 8s
    ...options,
  });

  const isFromCache = !queryResult.isFetching && !!queryResult.data && isCacheLoaded;

  return {
    ...queryResult,
    isFromCache,
    isCacheLoaded,
  };
}
