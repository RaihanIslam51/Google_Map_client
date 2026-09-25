'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import { leadsCache } from '../lib/cache/leadsCache';

/**
 * Custom React Query Hook with Professional Browser IndexedDB Persistence.
 * Designed exclusively for Leads CRM and Target Leads components.
 */
export function useLeadsCacheQuery({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 1000 * 60 * 10, // 10 mins default stale time
  gcTime = 1000 * 60 * 60 * 24, // 24 hours in-memory GC time
  ...options
}) {
  const serializedKey = leadsCache.serializeKey(queryKey);
  const [cachedData, setCachedData] = useState(undefined);
  const [isCacheLoaded, setIsCacheLoaded] = useState(false);
  const keyRef = useRef(serializedKey);

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
    });

    return () => {
      isMounted = false;
    };
  }, [serializedKey]);

  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await queryFn();
      if (res !== undefined && res !== null) {
        // Asynchronously update browser IndexedDB cache
        leadsCache.set(serializedKey, res);
      }
      return res;
    },
    // Use cached data as placeholder / initial data so UI renders instantly (0ms delay)
    placeholderData: (previousData) => previousData || cachedData,
    initialData: cachedData,
    staleTime,
    gcTime,
    enabled,
    ...options,
  });

  const isFromCache = !queryResult.isFetching && !!queryResult.data && isCacheLoaded;

  return {
    ...queryResult,
    isFromCache,
    isCacheLoaded,
  };
}
