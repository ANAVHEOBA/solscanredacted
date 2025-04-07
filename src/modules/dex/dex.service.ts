import { SolscanService } from '../../services/solscan.service';
import { LiquidityStorageService } from '../analytics/services/liquidity.storage';
import { LiquidityAnalytics } from '../analytics/services/liquidity.analytics';
import { 
    DefiActivity, 
    DefiActivityResponse,
    DefiActivityParams,
    BalanceChangeActivity,
    BalanceChangeResponse,
    BalanceChangeParams,
    Transaction,
    TransactionResponse,
    TransactionParams,
    Portfolio,
    PortfolioResponse,
    PortfolioParams,
    TokenAccount,
    TokenAccountResponse,
    TokenAccountParams,
    AccountDetail,
    AccountDetailResponse,
    AccountDetailParams,
    AccountMetadata,
    AccountMetadataResponse,
    AccountMetadataParams
} from './dex.interface';
import { ILiquidityFlow, IPoolState } from '../analytics/models/liquidity.model';
import { logger } from '../../utils/logger';

export interface LiquidityFlowParams {
    poolAddress: string;
    startTime?: number;
    endTime?: number;
    eventType?: 'ADD' | 'REMOVE' | 'SWAP';
}

export class DexService {
    private liquidityStorage: LiquidityStorageService;

    constructor(
        private solscanService: SolscanService,
        private liquidityAnalytics: LiquidityAnalytics | null
    ) {
        this.liquidityStorage = new LiquidityStorageService();
    }

    public setLiquidityAnalytics(analytics: LiquidityAnalytics): void {
        this.liquidityAnalytics = analytics;
    }

    async getDefiActivities(params: DefiActivityParams): Promise<DefiActivity[]> {
        try {
            const response = await this.solscanService.getDefiActivities(params);
            return response.data;
        } catch (error) {
            // Handle error appropriately
            throw error;
        }
    }

    async monitorDexActivity() {
        // Implement monitoring logic here
        // This could include websocket connections or polling
    }


    async getBalanceChanges(params: BalanceChangeParams): Promise<BalanceChangeActivity[]> {
        try {
            const response = await this.solscanService.getBalanceChanges(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTransactions(params: TransactionParams): Promise<Transaction[]> {
        try {
            const response = await this.solscanService.getTransactions(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getPortfolio(params: PortfolioParams): Promise<Portfolio> {
        try {
            const response = await this.solscanService.getPortfolio(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTokenAccounts(params: TokenAccountParams): Promise<TokenAccount[]> {
        try {
            const response = await this.solscanService.getTokenAccounts(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAccountDetail(params: AccountDetailParams): Promise<AccountDetail> {
        try {
            const response = await this.solscanService.getAccountDetail(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAccountMetadata(params: AccountMetadataParams): Promise<AccountMetadata> {
        try {
            const response = await this.solscanService.getAccountMetadata(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getLiquidityFlows(params: {
        poolAddress: string;
        startTime?: number;
        endTime?: number;
    }): Promise<any> {
        try {
            if (!this.liquidityAnalytics) {
                throw new Error('LiquidityAnalytics not initialized');
            }

            const analysis = await this.liquidityAnalytics.analyzePoolActivity(
                params.poolAddress,
                params.startTime,
                params.endTime
            );
            return {
                success: true,
                data: analysis
            };
        } catch (error) {
            logger.error('Error getting liquidity flows:', error);
            return {
                success: false,
                error: 'Failed to analyze liquidity flows'
            };
        }
    }

    public async getPoolState(poolAddress: string): Promise<any> {
        try {
            if (!this.liquidityAnalytics) {
                throw new Error('LiquidityAnalytics not initialized');
            }

            const analysis = await this.liquidityAnalytics.analyzePoolActivity(
                poolAddress,
                Date.now() - 86400000 // Last 24 hours
            );
            
            return {
                success: true,
                data: {
                    poolAddress,
                    lastUpdate: Date.now(),
                    volume24h: analysis.volumeAnalysis.total,
                    swapCount24h: analysis.volumeAnalysis.swapCount,
                    priceImpact: analysis.priceImpact,
                    tokenAnalysis: analysis.tokenAnalysis,
                    recentPatterns: {
                        largeSwaps: analysis.patterns.largeSwaps,
                        volumeSpikes: analysis.patterns.volumeSpikes
                    }
                }
            };
        } catch (error) {
            logger.error('Error getting pool state:', error);
            return {
                success: false,
                error: 'Pool not found or analysis failed'
            };
        }
    }

    public async getTopPools(limit: number = 10): Promise<any> {
        try {
            if (!this.liquidityAnalytics) {
                throw new Error('LiquidityAnalytics not initialized');
            }

            const topPools = await this.liquidityAnalytics.getTopPools(limit);
            return {
                success: true,
                data: topPools
            };
        } catch (error) {
            logger.error('Error getting top pools:', error);
            return {
                success: false,
                error: 'Failed to retrieve top pools'
            };
        }
    }
}