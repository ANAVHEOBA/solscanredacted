import { SolscanService } from '../../services/solscan.service';
import { 
    DefiActivity, 
    DefiActivityParams,
    BalanceChangeActivity,
    BalanceChangeParams,
    Transaction,
    TransactionParams,
    Portfolio,
    PortfolioParams,
    TokenAccount,
    TokenAccountParams,
    AccountDetail,
    AccountDetailParams,
    AccountMetadata,
    AccountMetadataParams
} from './dex.interface';
import { logger } from '../../utils/logger';

export class DexService {
    constructor(
        private readonly solscanService: SolscanService
    ) {}

    async getDefiActivities(params: DefiActivityParams): Promise<DefiActivity[]> {
        const startTime = Date.now();
        logger.info('[DexService] getDefiActivities started', { 
            params,
            timestamp: new Date().toISOString()
        });

        try {
            logger.info('[DexService] Calling solscanService.getDefiActivities');
            const response = await this.solscanService.getDefiActivities(params);
            
            logger.info('[DexService] Successfully got response from Solscan', {
                dataLength: response.data?.length,
                duration: Date.now() - startTime
            });
            
            return response.data;
        } catch (error) {
            logger.error('[DexService] Error in getDefiActivities', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                duration: Date.now() - startTime
            });
            throw error;
        }
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
        const startTime = Date.now();
        logger.info('[DexService] getTransactions started', { 
            params,
            timestamp: new Date().toISOString()
        });

        try {
            logger.info('[DexService] Calling solscanService.getTransactions');
            const response = await this.solscanService.getTransactions(params);
            
            logger.info('[DexService] Successfully got response from Solscan', {
                success: response.success,
                dataLength: response.data?.length,
                sampleData: response.data?.[0],
                duration: Date.now() - startTime
            });

            if (!response.success || !response.data) {
                throw new Error('Invalid response from Solscan service');
            }

            const validTransactions = response.data.filter(tx => {
                return tx && 
                    typeof tx.slot === 'number' &&
                    typeof tx.fee === 'number' &&
                    typeof tx.status === 'string' &&
                    Array.isArray(tx.signer) &&
                    typeof tx.block_time === 'number' &&
                    typeof tx.tx_hash === 'string' &&
                    Array.isArray(tx.parsed_instructions) &&
                    Array.isArray(tx.program_ids);
            });

            if (validTransactions.length === 0) {
                logger.warn('[DexService] No valid transactions found in response', {
                    totalTransactions: response.data.length,
                    sampleInvalidTransaction: response.data[0]
                });
            }

            return validTransactions;
        } catch (error) {
            logger.error('[DexService] Error in getTransactions', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                duration: Date.now() - startTime
            });
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
}