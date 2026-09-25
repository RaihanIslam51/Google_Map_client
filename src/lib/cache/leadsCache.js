/**
 * Professional Browser IndexedDB & LocalStorage Cache Manager
 * Dedicated exclusively for Leads CRM and Target Leads data.
 */

const DB_NAME = 'LeadsCrmBrowserCacheDB';
const DB_VERSION = 1;
const STORE_NAME = 'leads_cache_store';

function openDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

export const leadsCache = {
  /**
   * Converts a QueryKey array into a deterministic string key.
   */
  serializeKey(queryKey) {
    if (!queryKey) return '';
    if (typeof queryKey === 'string') return queryKey;
    return queryKey.map(item => {
      if (item === null || item === undefined) return '';
      if (typeof item === 'object') return JSON.stringify(item);
      return String(item);
    }).join('::');
  },

  /**
   * Saves data into browser IndexedDB (with localStorage fallback).
   */
  async set(key, value, ttlMs = 1000 * 60 * 60 * 24 * 7) { // 7 Days default
    if (!key) return;
    const strKey = typeof key === 'string' ? key : this.serializeKey(key);
    const payload = {
      value,
      timestamp: Date.now(),
      ttl: ttlMs,
    };

    try {
      const db = await openDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(payload, strKey);
      } else if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`leads_crm_cache::${strKey}`, JSON.stringify(payload));
      }
    } catch (err) {
      console.warn('LeadsCache set error:', err);
    }
  },

  /**
   * Retrieves data from browser IndexedDB (or fallback).
   */
  async get(key) {
    if (!key) return null;
    const strKey = typeof key === 'string' ? key : this.serializeKey(key);

    try {
      const db = await openDB();
      let payload = null;

      if (db) {
        payload = await new Promise((resolve) => {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.get(strKey);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
      } else if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(`leads_crm_cache::${strKey}`);
        if (raw) payload = JSON.parse(raw);
      }

      if (!payload) return null;

      // Check TTL expiration
      if (payload.ttl && Date.now() - payload.timestamp > payload.ttl) {
        this.remove(strKey);
        return null;
      }

      return payload.value;
    } catch (err) {
      console.warn('LeadsCache get error:', err);
      return null;
    }
  },

  /**
   * Removes a single cache entry.
   */
  async remove(key) {
    if (!key) return;
    const strKey = typeof key === 'string' ? key : this.serializeKey(key);

    try {
      const db = await openDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(strKey);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(`leads_crm_cache::${strKey}`);
      }
    } catch (err) {
      console.warn('LeadsCache remove error:', err);
    }
  },

  /**
   * Clears all cache entries matching a prefix (e.g. 'crm-businesses', 'target-leads-list').
   */
  async clearMatching(prefix) {
    if (!prefix) return;

    try {
      const db = await openDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAllKeys();
        req.onsuccess = () => {
          const keys = req.result || [];
          keys.forEach(k => {
            if (typeof k === 'string' && k.includes(prefix)) {
              store.delete(k);
            }
          });
        };
      }

      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith('leads_crm_cache::') && k.includes(prefix)) {
            localStorage.removeItem(k);
          }
        });
      }
    } catch (err) {
      console.warn('LeadsCache clearMatching error:', err);
    }
  },

  /**
   * Clears all stored CRM and Target Leads browser cache.
   */
  async clearAll() {
    try {
      const db = await openDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage);
        keys.forEach(k => {
          if (k.startsWith('leads_crm_cache::')) {
            localStorage.removeItem(k);
          }
        });
      }
    } catch (err) {
      console.warn('LeadsCache clearAll error:', err);
    }
  }
};
