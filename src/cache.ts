import { lru } from "tiny-lru";
import type { ICacheOptions } from "./types";

/**
 * Cache manager interface
 */
export interface CacheManager {
  get(url: string): Promise<unknown | null>;

  set(url: string, value: unknown, customTtl?: number): Promise<void>;

  delete(url: string): Promise<void>;

  clear(): Promise<void>;

  has(url: string): Promise<boolean>;

  getStats(): { hits: number; misses: number; size: number } | null;
}

/**
 * Default key generator - creates cache key from URL
 */
function defaultKeyGenerator(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.hash = "";
    const params = new URLSearchParams(urlObj.search);
    const sortedParams = new URLSearchParams([...params.entries()].sort());
    urlObj.search = sortedParams.toString();
    return `og:${urlObj.toString()}`;
  } catch {
    return `og:${url}`;
  }
}

/**
 * Create a cache manager with specified options
 */
function createCacheManager(options?: ICacheOptions): CacheManager {
  const enabled = options?.enabled ?? false;
  const keyGenerator = options?.keyGenerator ?? defaultKeyGenerator;

  if (!enabled) {
    return {
      get: async () => null,
      set: async () => {},
      delete: async () => {},
      clear: async () => {},
      has: async () => false,
      getStats: () => null,
    };
  }

  if (options?.customStorage) {
    return {
      async get(url: string): Promise<unknown | null> {
        const key = keyGenerator(url);
        return await options.customStorage?.get(key);
      },
      async set(url: string, value: unknown, customTtl?: number): Promise<void> {
        const key = keyGenerator(url);
        await options.customStorage?.set(key, value, customTtl);
      },
      async delete(url: string): Promise<void> {
        const key = keyGenerator(url);
        await options.customStorage?.delete(key);
      },
      async clear(): Promise<void> {
        await options.customStorage?.clear();
      },
      async has(url: string): Promise<boolean> {
        const key = keyGenerator(url);
        return await options.customStorage?.has(key);
      },
      getStats: () => null,
    };
  }

  const ttl = (options?.ttl ?? 3600) * 1000;
  const maxSize = options?.maxSize ?? 1000;
  const cache = lru(maxSize, ttl);

  return {
    async get(url: string): Promise<unknown | null> {
      const key = keyGenerator(url);
      return cache.get(key) || null;
    },

    async set(url: string, value: unknown, _customTtl?: number): Promise<void> {
      const key = keyGenerator(url);
      cache.set(key, value);
    },

    async delete(url: string): Promise<void> {
      const key = keyGenerator(url);
      cache.delete(key);
    },

    async clear(): Promise<void> {
      cache.clear();
    },

    async has(url: string): Promise<boolean> {
      const key = keyGenerator(url);
      return cache.has(key);
    },

    getStats: () => null,
  };
}

/**
 * Create a cache manager with default settings
 */
export function createCache(options?: ICacheOptions): CacheManager {
  return createCacheManager(options);
}
