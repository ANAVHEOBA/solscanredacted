import { DexService } from './dex.service';
import { DexAnalyticsService } from './services/dex-analytics.service';
import { 
    DefiActivityParams, 
    BalanceChangeParams, 
    TransactionParams, 
    PortfolioParams,
    TokenAccountParams,
    AccountDetailParams,
    AccountMetadataParams
} from './dex.interface';
import { logger } from '../../utils/logger';
import { BalanceChangeAnalyzer } from './analyzers/balance-change.analyzer';
import { TransactionAnalyzer } from './analyzers/transaction.analyzer';

export class DexController {
    private readonly balanceChangeAnalyzer: BalanceChangeAnalyzer;
    private readonly transactionAnalyzer: TransactionAnalyzer;

    constructor(
        private readonly dexService: DexService,
        private readonly dexAnalyticsService: DexAnalyticsService
    ) {
        this.balanceChangeAnalyzer = new BalanceChangeAnalyzer();
        this.transactionAnalyzer = new TransactionAnalyzer();
    }

    async getDefiActivities(params: DefiActivityParams) {
        try {
            const activities = await this.dexService.getDefiActivities(params);
            return { success: true, data: activities };
        } catch (error) {
            logger.error('Error in getDefiActivities:', error);
            return { success: false, error: 'Failed to fetch DeFi activities' };
        }
    }

    async getBalanceChanges(params: BalanceChangeParams) {
        try {
            const changes = await this.dexService.getBalanceChanges(params);
            const analysis = this.balanceChangeAnalyzer.analyzeChanges(changes);
            return { 
                success: true, 
                data: {
                    changes,
                    analysis
                }
            };
        } catch (error) {
            logger.error('Error in getBalanceChanges:', error);
            return { success: false, error: 'Failed to fetch balance changes' };
        }
    }

    async getTransactions(params: TransactionParams) {
        try {
            const transactions = await this.dexService.getTransactions(params);
            logger.info('Received transactions from service:', {
                transactionsReceived: !!transactions,
                isArray: Array.isArray(transactions),
                length: transactions?.length,
                sample: transactions?.[0]
            });

            if (!Array.isArray(transactions)) {
                logger.error('Invalid transactions data:', transactions);
                return { success: false, error: 'Invalid transactions data format' };
            }

            const analysis = this.transactionAnalyzer.analyzeTransactions(transactions);
            return { 
                success: true, 
                data: {
                    transactions,
                    analysis
                }
            };
        } catch (error) {
            logger.error('Error in getTransactions:', error);
            return { success: false, error: 'Failed to fetch transactions' };
        }
    }

    async getPortfolio(params: PortfolioParams) {
        try {
            const portfolio = await this.dexService.getPortfolio(params);
            return { success: true, data: portfolio };
        } catch (error) {
            logger.error('Error in getPortfolio:', error);
            return { success: false, error: 'Failed to fetch portfolio' };
        }
    }

    async getTokenAccounts(params: TokenAccountParams) {
        try {
            const accounts = await this.dexService.getTokenAccounts(params);
            return { success: true, data: accounts };
        } catch (error) {
            logger.error('Error in getTokenAccounts:', error);
            return { success: false, error: 'Failed to fetch token accounts' };
        }
    }

    async getAccountDetail(params: AccountDetailParams) {
        try {
            const detail = await this.dexService.getAccountDetail(params);
            return { success: true, data: detail };
        } catch (error) {
            logger.error('Error in getAccountDetail:', error);
            return { success: false, error: 'Failed to fetch account detail' };
        }
    }

    async getAccountMetadata(params: AccountMetadataParams) {
        try {
            const metadata = await this.dexService.getAccountMetadata(params);
            return { success: true, data: metadata };
        } catch (error) {
            logger.error('Error in getAccountMetadata:', error);
            return { success: false, error: 'Failed to fetch account metadata' };
        }
    }

    async getLiquidityFlows(params: { poolAddress: string; startTime?: number; endTime?: number }) {
        try {
            const flows = await this.dexAnalyticsService.getLiquidityFlows(
                params.poolAddress,
                params.startTime,
                params.endTime
            );
            return { success: true, data: flows };
        } catch (error) {
            logger.error('Error in getLiquidityFlows:', error);
            return { success: false, error: 'Failed to analyze liquidity flows' };
        }
    }

    async getPoolState(poolAddress: string) {
        try {
            const state = await this.dexAnalyticsService.getPoolState(poolAddress);
            return { success: true, data: state };
        } catch (error) {
            logger.error('Error in getPoolState:', error);
            return { success: false, error: 'Failed to get pool state' };
        }
    }

    async getBalanceAnalytics(address: string) {
        try {
            return await this.dexAnalyticsService.getBalanceAnalytics(address);
        } catch (error) {
            logger.error('Error in getBalanceAnalytics:', error);
            return { success: false, error: 'Failed to analyze balance changes' };
        }
    }
}