import { SolscanService } from '../../../services/solscan.service';
import { DefiActivityParams, DefiActivityResponse } from '../dex.interface';
import { logger } from '../../../utils/logger';

export class DexApiClient {
    constructor(
        private readonly solscanService: SolscanService,
        private readonly maxRetries: number = 3,
        private readonly retryDelay: number = 1000
    ) {}

    public async getDefiActivities(params: DefiActivityParams): Promise<DefiActivityResponse> {
        let attempts = 0;
        let lastError: Error | null = null;

        while (attempts < this.maxRetries) {
            try {
                const response = await this.solscanService.getDefiActivities(params);
                return response;
            } catch (error) {
                lastError = error as Error;
                attempts++;
                logger.warn(`Attempt ${attempts}/${this.maxRetries} failed: ${error.message}`);
                
                if (attempts < this.maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempts));
                }
            }
        }

        throw lastError || new Error('Failed to fetch DEX activities after retries');
    }
} 