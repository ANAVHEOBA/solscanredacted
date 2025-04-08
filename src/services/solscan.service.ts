// src/services/solscan.service.ts

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from '../utils/logger';
import { apiConfig } from '../config/api.config';
import { 
    DefiActivityParams, 
    DefiActivityResponse, 
    BalanceChangeParams,
    BalanceChangeResponse,
    TransactionParams,
    TransactionResponse,
    PortfolioParams,
    PortfolioResponse,
    TokenAccountParams,
    TokenAccountResponse,
    AccountDetailParams,
    AccountDetailResponse,
    AccountMetadataParams,
    AccountMetadataResponse
} from '../modules/dex/dex.interface';
import {
    TokenMetaParams,
    TokenMetaResponse,
    TokenPriceParams,
    TokenPriceResponse,
    TokenMarketsParams,
    TokenMarketsResponse,
    TokenHoldersParams,
    TokenHoldersResponse,
    TokenTransferParams,
    TokenTransferResponse,
    TokenDefiActivityParams,
    TokenDefiActivityResponse
} from '../modules/token/token.interface';
import {
    LastTransactionParams,
    LastTransactionResponse,
    TransactionDetailParams,
    TransactionDetailResponse,
    TransactionActionsParams,
    TransactionActionsResponse
} from '../modules/transaction/transaction.interface';
import {
    LastBlockParams,
    LastBlockResponse,
    BlockTransactionsParams,
    BlockTransactionsResponse,
    BlockDetailParams,
    BlockDetailResponse
} from '../modules/block/block.interface';
import {
    MarketListParams,
    MarketListResponse,
    MarketInfoParams,
    MarketInfoResponse,
    MarketVolumeParams,
    MarketVolumeResponse,
    MarketInfo,
    MarketVolume
} from '../modules/market/market.interface';

interface SolscanResponse<T> {
    success: boolean;
    data: T;
}

export class SolscanService {
    private readonly client: AxiosInstance;
    private readonly maxRetries = 3;
    private readonly baseRetryDelay = 1000; // 1 second
    private readonly maxRetryDelay = 10000; // 10 seconds

    constructor(apiKey: string) {
        this.client = axios.create({
            baseURL: apiConfig.solscanBaseUrl,
            timeout: 10000, // Reduced timeout to 10 seconds
            headers: {
                'token': apiKey,
                'Content-Type': 'application/json'
            }
        });

        // Add response interceptor for logging
        this.client.interceptors.response.use(
            (response) => {
                logger.debug('[SolscanService] API Response:', {
                    url: response.config.url,
                    status: response.status,
                    data: response.data
                });
                return response;
            },
            (error) => {
                logger.error('[SolscanService] API Error:', {
                    url: error.config?.url,
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message,
                    code: error.code
                });
                return Promise.reject(error);
            }
        );
    }

    private async fetchWithRetry<T>(endpoint: string, params: any, retries = this.maxRetries): Promise<T> {
        const startTime = Date.now();
        logger.info('[SolscanService] Request started', {
            endpoint,
            params,
            retries,
            timestamp: new Date().toISOString()
        });

        try {
            const response = await this.client.get<SolscanResponse<T>>(endpoint, { params });
            
            logger.info('[SolscanService] Request successful', {
                endpoint,
                duration: Date.now() - startTime
            });

            if (!response.data.success) {
                throw new Error(`API returned success: false - ${JSON.stringify(response.data)}`);
            }

            return response.data.data;
        } catch (error: any) {
            const duration = Date.now() - startTime;
            
            // Handle specific error cases
            if ((error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.response?.status === 429) && retries > 0) {
                const retryDelay = Math.min(
                    this.baseRetryDelay * Math.pow(2, this.maxRetries - retries),
                    this.maxRetryDelay
                );

                logger.warn('[SolscanService] Request failed, retrying...', {
                    retries,
                    retryDelay,
                    errorCode: error.code,
                    status: error.response?.status
                });

                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return this.fetchWithRetry(endpoint, params, retries - 1);
            }

            logger.error('[SolscanService] Request failed', {
                endpoint,
                error: error.message,
                code: error.code,
                status: error.response?.status,
                duration
            });

            throw error;
        }
    }

    async getDefiActivities(params: DefiActivityParams): Promise<DefiActivityResponse> {
        try {
            const data = await this.fetchWithRetry<DefiActivityResponse['data']>(
                '/account/defi/activities',
                params
            );
            return { success: true, data };
        } catch (error) {
            logger.error('[SolscanService] getDefiActivities failed', {
                params,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async getBalanceChanges(params: BalanceChangeParams): Promise<BalanceChangeResponse> {
        try {
            const data = await this.fetchWithRetry<BalanceChangeResponse['data']>(
                '/account/balance_change',
                params
            );
            return { success: true, data };
        } catch (error) {
            logger.error('[SolscanService] getBalanceChanges failed', {
                params,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }

    async getTransactions(params: TransactionParams): Promise<TransactionResponse> {
        try {
            const data = await this.fetchWithRetry<TransactionResponse['data']>(
                '/account/transactions',
                params
            );
            return { success: true, data };
        } catch (error) {
            logger.error('[SolscanService] getTransactions failed', {
                params,
                error: error instanceof Error ? error.message : 'Unknown error',
                code: (error as any)?.code
            });
            throw error;
        }
    }

    async getPortfolio(params: PortfolioParams): Promise<PortfolioResponse> {
        return this.fetchWithRetry<PortfolioResponse>('/account/portfolio', params);
    }

    async getTokenAccounts(params: TokenAccountParams): Promise<TokenAccountResponse> {
        return this.fetchWithRetry<TokenAccountResponse>('/account/token-accounts', params);
    }

    async getAccountDetail(params: AccountDetailParams): Promise<AccountDetailResponse> {
        return this.fetchWithRetry<AccountDetailResponse>('/account/detail', params);
    }

    async getAccountMetadata(params: AccountMetadataParams): Promise<AccountMetadataResponse> {
        return this.fetchWithRetry<AccountMetadataResponse>('/account/metadata', params);
    }

    async getTokenMeta(params: TokenMetaParams): Promise<TokenMetaResponse> {
        return this.fetchWithRetry<TokenMetaResponse>('/token/meta', params);
    }

    async getTokenPrice(params: TokenPriceParams): Promise<TokenPriceResponse> {
        return this.fetchWithRetry<TokenPriceResponse>('/token/price', params);
    }

    async getTokenMarkets(params: TokenMarketsParams): Promise<TokenMarketsResponse> {
        const queryParams = new URLSearchParams();
        if (Array.isArray(params.token)) {
            params.token.forEach(token => queryParams.append('token', token));
        }
        if (params.sort_by) queryParams.append('sort_by', params.sort_by);
        if (Array.isArray(params.program)) {
            params.program.forEach(prog => queryParams.append('program', prog));
        }
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.page_size) queryParams.append('page_size', params.page_size.toString());

        return await this.fetchWithRetry('/v2/token/markets', queryParams);
    }

    async getTokenHolders(params: TokenHoldersParams): Promise<TokenHoldersResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        return await this.fetchWithRetry('/v2/token/holders', queryParams);
    }

    async getTokenTransfers(params: TokenTransferParams): Promise<TokenTransferResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v.toString()));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

        return await this.fetchWithRetry('/v2/token/transfer', queryParams);
    }

    async getTokenDefiActivities(params: TokenDefiActivityParams): Promise<TokenDefiActivityResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v.toString()));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

        return await this.fetchWithRetry('/v2/token/defi/activities', queryParams);
    }

    async getLastTransactions(params: LastTransactionParams): Promise<LastTransactionResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        return await this.fetchWithRetry('/v2/transaction/last', queryParams);
    }

    async getTransactionDetail(params: TransactionDetailParams): Promise<TransactionDetailResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('tx', params.tx);

        return await this.fetchWithRetry('/v2/transaction/detail', queryParams);
    }

    async getTransactionActions(params: TransactionActionsParams): Promise<TransactionActionsResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('tx', params.tx);

        return await this.fetchWithRetry('/v2/transaction/actions', queryParams);
    }

    async getLastBlocks(params: LastBlockParams): Promise<LastBlockResponse> {
        const queryParams = new URLSearchParams();
        if (params.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        return await this.fetchWithRetry('/v2/block/last', queryParams);
    }

    async getBlockTransactions(params: BlockTransactionsParams): Promise<BlockTransactionsResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        return await this.fetchWithRetry('/v2/block/transactions', queryParams);
    }

    async getBlockDetail(params: BlockDetailParams): Promise<BlockDetailResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('block', params.block.toString());

        return await this.fetchWithRetry('/v2/block/detail', queryParams);
    }

    async getMarketList(params: MarketListParams): Promise<MarketListResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        return await this.fetchWithRetry('/v2/market/list', queryParams);
    }

    async getMarketInfo(params: MarketInfoParams): Promise<MarketInfoResponse> {
        try {
            const response = await this.fetchWithRetry('/market/info', params);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            logger.error(`Failed to fetch market info for ${params.address}:`, error);
            const emptyMarketInfo: MarketInfo = {
                pool_address: params.address,
                program_id: '',
                tokens_info: [],
                create_tx_hash: '',
                create_block_time: 0,
                creator: '',
                lp_token: ''
            };
            return {
                success: false,
                data: emptyMarketInfo
            };
        }
    }

    async getMarketVolume(params: MarketVolumeParams): Promise<MarketVolumeResponse> {
        try {
            const response = await this.fetchWithRetry('/market/volume', params);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            logger.error(`Failed to fetch market volume for ${params.address}:`, error);
            const emptyMarketVolume: MarketVolume = {
                pool_address: params.address,
                program_id: '',
                total_volume_24h: 0,
                total_volume_change_24h: 0,
                total_trades_24h: 0,
                total_trades_change_24h: 0,
                days: []
            };
            return {
                success: false,
                data: emptyMarketVolume
            };
        }
    }
}