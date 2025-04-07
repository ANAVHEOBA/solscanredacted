import { StoredActivity } from './activity.database';
import { PoolState, PoolMetrics } from './pool.state.database';
import { logger } from '../../../utils/logger';

export interface CacheConfig {
    ttl: number;
    maxSize: number;
    cleanupInterval: number;
}

export class CacheLayer {
    private activityCache: Map<string, { data: StoredActivity; timestamp: number }> = new Map();
    private poolStateCache: Map<string, { data: PoolState; timestamp: number }> = new Map();
    private poolMetricsCache: Map<string, { data: PoolMetrics; timestamp: number }> = new Map();
    private config: CacheConfig;

    constructor(config: CacheConfig) {
        this.config = config;
        this.startCleanupInterval();
    }

    public async getActivity(id: string): Promise<StoredActivity | undefined> {
        const cached = this.activityCache.get(id);
        if (cached && !this.isExpired(cached.timestamp)) {
            return cached.data;
        }
        return undefined;
    }

    public async setActivity(id: string, activity: StoredActivity): Promise<void> {
        this.activityCache.set(id, {
            data: activity,
            timestamp: Date.now()
        });
        this.ensureCacheSize();
    }

    public async getPoolState(address: string): Promise<PoolState | undefined> {
        const cached = this.poolStateCache.get(address);
        if (cached && !this.isExpired(cached.timestamp)) {
            return cached.data;
        }
        return undefined;
    }

    public async setPoolState(address: string, state: PoolState): Promise<void> {
        this.poolStateCache.set(address, {
            data: state,
            timestamp: Date.now()
        });
        this.ensureCacheSize();
    }

    public async getPoolMetrics(address: string): Promise<PoolMetrics | undefined> {
        const cached = this.poolMetricsCache.get(address);
        if (cached && !this.isExpired(cached.timestamp)) {
            return cached.data;
        }
        return undefined;
    }

    public async setPoolMetrics(address: string, metrics: PoolMetrics): Promise<void> {
        this.poolMetricsCache.set(address, {
            data: metrics,
            timestamp: Date.now()
        });
        this.ensureCacheSize();
    }

    public async clearCache(): Promise<void> {
        this.activityCache.clear();
        this.poolStateCache.clear();
        this.poolMetricsCache.clear();
    }

    private isExpired(timestamp: number): boolean {
        return Date.now() - timestamp > this.config.ttl;
    }

    private ensureCacheSize(): void {
        this.cleanupCache(this.activityCache);
        this.cleanupCache(this.poolStateCache);
        this.cleanupCache(this.poolMetricsCache);
    }

    private cleanupCache<T>(cache: Map<string, { data: T; timestamp: number }>): void {
        if (cache.size > this.config.maxSize) {
            // Remove oldest entries
            const entries = Array.from(cache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            const toRemove = entries.slice(0, entries.length - this.config.maxSize);
            toRemove.forEach(([key]) => cache.delete(key));
        }
    }

    private startCleanupInterval(): void {
        setInterval(() => {
            this.cleanupExpiredEntries();
        }, this.config.cleanupInterval);
    }

    private cleanupExpiredEntries(): void {
        const now = Date.now();
        
        // Cleanup activity cache
        for (const [key, value] of this.activityCache) {
            if (now - value.timestamp > this.config.ttl) {
                this.activityCache.delete(key);
            }
        }

        // Cleanup pool state cache
        for (const [key, value] of this.poolStateCache) {
            if (now - value.timestamp > this.config.ttl) {
                this.poolStateCache.delete(key);
            }
        }

        // Cleanup pool metrics cache
        for (const [key, value] of this.poolMetricsCache) {
            if (now - value.timestamp > this.config.ttl) {
                this.poolMetricsCache.delete(key);
            }
        }
    }

    public getCacheStats(): {
        activityCacheSize: number;
        poolStateCacheSize: number;
        poolMetricsCacheSize: number;
    } {
        return {
            activityCacheSize: this.activityCache.size,
            poolStateCacheSize: this.poolStateCache.size,
            poolMetricsCacheSize: this.poolMetricsCache.size
        };
    }
} 