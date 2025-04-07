import { DexActivityCollector } from './dex-activity-collector.service';
import { DexActivityCollectorConfig } from '../interfaces/dex-collector.interface';
import { SolscanService } from '../../../services/solscan.service';
import { apiConfig } from '../../../config/api.config';

export class DexCollectorFactory {
    private static defaultConfig: DexActivityCollectorConfig = {
        maxRetries: 3,
        retryDelay: 1000,
        batchSize: 20,
        rateLimit: {
            requestsPerMinute: 60,
            burstSize: 10
        }
    };

    public static createCollector(
        customConfig?: Partial<DexActivityCollectorConfig>
    ): DexActivityCollector {
        const config: DexActivityCollectorConfig = {
            ...this.defaultConfig,
            ...customConfig
        };

        const solscanService = new SolscanService(apiConfig.solscanApiKey || '');
        return new DexActivityCollector(solscanService, config);
    }
} 