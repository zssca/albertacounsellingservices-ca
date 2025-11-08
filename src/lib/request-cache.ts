import { cache } from 'react';

/**
 * Advanced request caching with stale-while-revalidate pattern
 */

type CacheOptions = {
  ttl?: number; // Time to live in ms
  swr?: number; // Stale while revalidate window in ms
  key?: string; // Custom cache key
  tags?: string[]; // Cache tags for invalidation
};

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
  swr: number;
  tags: string[];
};

class RequestCache {
  private static instance: RequestCache;
  private cache = new Map<string, CacheEntry<unknown>>();
  private tags = new Map<string, Set<string>>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  private constructor() {
    // Cleanup expired entries every minute
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), 60000);
    }
  }

  static getInstance(): RequestCache {
    if (!RequestCache.instance) {
      RequestCache.instance = new RequestCache();
    }
    return RequestCache.instance;
  }

  async fetch<T>(
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const {
      ttl = 300000, // 5 minutes default
      swr = 3600000, // 1 hour default
      key = this.generateKey(fetcher),
      tags = [],
    } = options;

    // Check if request is already pending
    const pendingKey = `pending:${key}`;
    if (this.pendingRequests.has(pendingKey)) {
      return this.pendingRequests.get(pendingKey) as Promise<T>;
    }

    // Check cache
    const cached = this.cache.get(key) as CacheEntry<T> | undefined;
    const now = Date.now();

    if (cached) {
      const age = now - cached.timestamp;
      const isStale = age > cached.ttl;
      const isExpired = age > cached.ttl + cached.swr;

      if (!isExpired) {
        // Return cached data
        if (isStale) {
          // Trigger background revalidation
          this.revalidate(key, fetcher, { ttl, swr, tags });
        }
        return cached.data;
      }
    }

    // Fetch new data
    const requestPromise = this.performFetch(key, fetcher, { ttl, swr, tags });
    this.pendingRequests.set(pendingKey, requestPromise);

    try {
      const result = await requestPromise;
      return result as T;
    } finally {
      this.pendingRequests.delete(pendingKey);
    }
  }

  private async performFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: Required<Pick<CacheOptions, 'ttl' | 'swr' | 'tags'>>
  ): Promise<T> {
    try {
      const data = await fetcher();
      this.set(key, data, options);
      return data;
    } catch (error) {
      // If we have stale data, return it on error
      const cached = this.cache.get(key) as CacheEntry<T> | undefined;
      if (cached) {
        console.warn('Request failed, returning stale data:', error);
        return cached.data;
      }
      throw error;
    }
  }

  private async revalidate<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: Required<Pick<CacheOptions, 'ttl' | 'swr' | 'tags'>>
  ): Promise<void> {
    try {
      const data = await fetcher();
      this.set(key, data, options);
    } catch (error) {
      console.error('Background revalidation failed:', error);
    }
  }

  set<T>(
    key: string,
    data: T,
    options: Required<Pick<CacheOptions, 'ttl' | 'swr' | 'tags'>>
  ): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: options.ttl,
      swr: options.swr,
      tags: options.tags,
    };

    this.cache.set(key, entry);

    // Update tag mappings
    options.tags.forEach(tag => {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set());
      }
      this.tags.get(tag)!.add(key);
    });
  }

  invalidate(keyOrTag: string): void {
    // Check if it's a tag
    if (this.tags.has(keyOrTag)) {
      const keys = this.tags.get(keyOrTag)!;
      keys.forEach(key => this.cache.delete(key));
      this.tags.delete(keyOrTag);
    } else {
      // It's a key
      this.cache.delete(keyOrTag);
    }
  }

  invalidateAll(): void {
    this.cache.clear();
    this.tags.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      const age = now - entry.timestamp;
      if (age > entry.ttl + entry.swr) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      const entry = this.cache.get(key) as CacheEntry<unknown>;
      this.cache.delete(key);
      
      // Clean up tag mappings
      entry.tags.forEach(tag => {
        const tagKeys = this.tags.get(tag);
        if (tagKeys) {
          tagKeys.delete(key);
          if (tagKeys.size === 0) {
            this.tags.delete(tag);
          }
        }
      });
    });
  }

  private generateKey(fetcher: () => unknown): string {
    return `cache:${fetcher.toString().substring(0, 100)}:${Date.now()}`;
  }

  // Get cache statistics
  getStats() {
    const stats = {
      size: this.cache.size,
      tags: this.tags.size,
      pendingRequests: this.pendingRequests.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        tags: entry.tags,
      })),
    };
    return stats;
  }
}

// Export singleton
export const requestCache = RequestCache.getInstance();

// React cache wrapper with request deduplication
export const cachedFetch = cache(async function <T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  return requestCache.fetch(
    async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    {
      key: `fetch:${url}:${JSON.stringify(options)}`,
      tags: [new URL(url).hostname],
    }
  );
});

// Prefetch helper
export function prefetch(url: string, options?: RequestInit): void {
  cachedFetch(url, options).catch(() => {
    // Silently fail prefetch
  });
}