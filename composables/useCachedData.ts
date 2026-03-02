/**
 * useCachedData.ts - Type-safe data caching composable
 * Provides TTL-based caching for frequently accessed data
 */
import { ref, readonly, shallowRef } from 'vue';

interface CacheOptions {
  /** Time to live in milliseconds (default: 60000 = 1 minute) */
  ttl?: number;
  /** Unique cache key for debugging */
  cacheKey?: string;
  /** Enable caching flag */
  enabled?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Create a cached data composable
 * Automatically handles cache invalidation based on TTL
 */
export function useCachedData<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const {
    ttl = 60000,
    cacheKey = 'default',
    enabled = true
  } = options;

  // Reactive state
  const data = shallowRef<T | null>(null);
  const isLoading = shallowRef(false);
  const error = ref<Error | null>(null);
  const lastFetched = ref<number>(0);
  const cacheHits = ref(0);

  // Internal cache (not reactive to avoid overhead)
  const cache = new Map<string, CacheEntry<T>>();

  /**
   * Check if cached data is still valid
   */
  const isCacheValid = (): boolean => {
    if (!enabled || data.value === null) return false;
    const now = Date.now();
    return (now - lastFetched.value) < ttl;
  };

  /**
   * Get data (from cache or fetch)
   * @param force - Force refresh even if cached
   */
  const getData = async (force = false): Promise<T | null> => {
    // Return cached data if valid and not forcing refresh
    if (!force && isCacheValid()) {
      cacheHits.value++;
      console.log(`[Cache:${cacheKey}] Cache hit (${cacheHits.value} total)`);
      return data.value;
    }

    // Fetch fresh data
    isLoading.value = true;
    error.value = null;

    try {
      const result = await fetcher();
      data.value = result;
      lastFetched.value = Date.now();
      
      console.log(`[Cache:${cacheKey}] Data fetched and cached`);
      return result;
    } catch (e) {
      const err = e as Error;
      error.value = err;
      console.error(`[Cache:${cacheKey}] Fetch error:`, err.message);
      
      // Return stale cache data if available on error
      if (data.value !== null) {
        console.log(`[Cache:${cacheKey}] Returning stale cache due to error`);
        return data.value;
      }
      
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Invalidate cache and optionally refetch
   */
  const invalidate = (refetch = false): void => {
    data.value = null;
    lastFetched.value = 0;
    cache.clear();
    console.log(`[Cache:${cacheKey}] Cache invalidated`);

    if (refetch) {
      getData(true);
    }
  };

  /**
   * Preload data into cache
   */
  const preload = async (): Promise<void> => {
    if (!isCacheValid()) {
      await getData();
    }
  };

  /**
   * Get cache statistics
   */
  const getStats = () => ({
    isCached: isCacheValid(),
    lastFetched: lastFetched.value,
    cacheAge: Date.now() - lastFetched.value,
    cacheHits: cacheHits.value,
    ttl,
    isLoading: isLoading.value,
    hasError: error.value !== null
  });

  return {
    // Reactive state
    data: readonly(data),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Methods
    getData,
    invalidate,
    preload,
    getStats,
    
    // Convenience getter
    refresh: () => getData(true)
  };
}

/**
 * Create a cached version of any async function
 */
export function withCache<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  ttl = 60000
): T {
  const cache = new Map<string, { data: unknown; timestamp: number }>();

  return ((...args: unknown[]) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return Promise.resolve(cached.data) as ReturnType<T>;
    }

    return fn(...args).then(result => {
      cache.set(key, { data: result, timestamp: Date.now() });
      return result;
    }) as ReturnType<T>;
  }) as T;
}

/**
 * Predefined cache configurations
 */
export const CACHE_CONFIGS = {
  QUICK: 10000,      // 10 seconds - for very frequent updates
  SHORT: 30000,      // 30 seconds - for frequent updates
  DEFAULT: 60000,     // 1 minute - standard
  MEDIUM: 300000,    // 5 minutes - for moderately frequent data
  LONG: 600000,      // 10 minutes - for infrequent updates
  STATIC: Infinity   // Never expire - for static data
} as const;

export default useCachedData;
