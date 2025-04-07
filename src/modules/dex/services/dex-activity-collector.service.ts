import { SolscanService } from '../../../services/solscan.service';
import { logger } from '../../../utils/logger';
import { 
    DexActivityCollectorConfig, 
    DexActivityCollectorOptions, 
    DexActivityCollectorResult,
    DexActivityCollectorStats 
} from '../interfaces/dex-collector.interface';
import { DefiActivityParams } from '../dex.interface';

export class DexActivityCollector {
    private stats: DexActivityCollectorStats = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        lastRequestTime: 0
    };

    constructor(
        private readonly solscanService: SolscanService,
        private readonly config: DexActivityCollectorConfig
    ) {}

    public async collectActivities(options: DexActivityCollectorOptions): Promise<DexActivityCollectorResult> {
        const activities: any[] = [];
        let currentPage = 1;
        let hasMore = true;

        while (hasMore) {
            try {
                const params: DefiActivityParams = this.buildRequestParams(options, currentPage);
                const startTime = Date.now();

                const response = await this.solscanService.getDefiActivities(params);
                const endTime = Date.now();
                const responseTime = endTime - startTime;

                this.updateStats(true, responseTime);

                if (response.success && response.data.length > 0) {
                    activities.push(...response.data);
                    hasMore = response.data.length === options.pageSize;
                    currentPage++;
                } else {
                    hasMore = false;
                }

                // Rate limiting
                await this.handleRateLimit();
            } catch (error) {
                this.updateStats(false);
                logger.error('Error collecting DEX activities:', error);
                throw error;
            }
        }

        return {
            activities,
            stats: this.stats,
            metadata: {
                totalPages: currentPage - 1,
                currentPage: currentPage - 1,
                hasMore: false
            }
        };
    }

    private buildRequestParams(options: DexActivityCollectorOptions, page: number): DefiActivityParams {
        return {
            address: options.address,
            activity_type: options.activityTypes,
            platform: options.platforms,
            source: options.sources,
            token: options.tokens?.[0],
            from_time: options.timeRange?.from,
            to_time: options.timeRange?.to,
            page,
            page_size: options.pageSize || this.config.batchSize,
            sort_by: options.sortBy,
            sort_order: options.sortOrder
        };
    }

    private updateStats(success: boolean, responseTime?: number): void {
        this.stats.totalRequests++;
        
        if (success) {
            this.stats.successfulRequests++;
            if (responseTime) {
                this.stats.averageResponseTime = 
                    (this.stats.averageResponseTime * (this.stats.successfulRequests - 1) + responseTime) / 
                    this.stats.successfulRequests;
            }
        } else {
            this.stats.failedRequests++;
        }
        
        this.stats.lastRequestTime = Date.now();
    }

    private async handleRateLimit(): Promise<void> {
        const timeSinceLastRequest = Date.now() - this.stats.lastRequestTime;
        const minDelay = (60 * 1000) / this.config.rateLimit.requestsPerMinute;
        
        if (timeSinceLastRequest < minDelay) {
            await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
        }
    }

    public getStats(): DexActivityCollectorStats {
        return { ...this.stats };
    }

    public resetStats(): void {
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            lastRequestTime: 0
        };
    }
} 