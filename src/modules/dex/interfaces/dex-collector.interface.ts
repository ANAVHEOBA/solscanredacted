import { ActivityType } from '../dex.interface';

export interface DexActivityCollectorConfig {
    maxRetries: number;
    retryDelay: number;
    batchSize: 10 | 20 | 30 | 40 | 60 | 100;
    rateLimit: {
        requestsPerMinute: number;
        burstSize: number;
    };
}

export interface DexActivityCollectorStats {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    lastRequestTime: number;
}

export interface DexActivityCollectorOptions {
    address?: string;
    activityTypes?: ActivityType[];
    platforms?: string[];
    sources?: string[];
    tokens?: string[];
    timeRange?: {
        from: number;
        to: number;
    };
    pageSize?: 10 | 20 | 30 | 40 | 60 | 100;
    sortBy?: 'block_time';
    sortOrder?: 'asc' | 'desc';
}

export interface DexActivityCollectorResult {
    activities: any[];
    stats: DexActivityCollectorStats;
    metadata: {
        totalPages: number;
        currentPage: number;
        hasMore: boolean;
    };
} 