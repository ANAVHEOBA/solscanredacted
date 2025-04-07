// src/services/solscan.service.ts

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
import { logger } from '../utils/logger';

export class SolscanService {
    private readonly baseUrl = 'https://pro-api.solscan.io/v2.0';
    private readonly maxRetries = 3;
    private readonly retryDelay = 1000; // 1 second

    constructor(private readonly apiKey: string) {}

    private async fetchWithRetry(endpoint: string, params: Record<string, any> = {}, retries = 0): Promise<any> {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.baseUrl}${endpoint}${queryString ? '?' + queryString : ''}`;

            logger.debug(`Making request to: ${url}`);

            const response = await fetch(url, {
                headers: {
                    'token': this.apiKey,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (retries < this.maxRetries) {
                logger.warn(`Retrying Solscan API call (attempt ${retries + 1}/${this.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retries + 1)));
                return this.fetchWithRetry(endpoint, params, retries + 1);
            }
            
            logger.error('Solscan API call failed after retries:', error);
            throw error;
        }
    }

    async getDefiActivities(params: DefiActivityParams): Promise<DefiActivityResponse> {
        try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value)) {
                        value.forEach(v => queryParams.append(key, v.toString()));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });

            const response = await this.fetchWithRetry('/account/defi/activities', queryParams);
            return {
                success: true,
                data: response.data || []
            };
        } catch (error) {
            logger.error(`Failed to fetch defi activities for ${params.address}:`, error);
            return {
                success: false,
                data: []
            };
        }
    }

    async getBalanceChanges(params: BalanceChangeParams): Promise<BalanceChangeResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                if (Array.isArray(value)) {
                    value.forEach(v => queryParams.append(key, v.toString()));
                } else {
                    queryParams.append(key, value.toString());
                }
            }
        });
    
        return await this.fetchWithRetry('/v2/account/balance_change', queryParams);
    }

    async getTransactions(params: TransactionParams): Promise<TransactionResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value.toString());
            }
        });

        return await this.fetchWithRetry('/v2/account/transactions', queryParams);
    }

    async getPortfolio(params: PortfolioParams): Promise<PortfolioResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('address', params.address);

        return await this.fetchWithRetry('/v2/account/portfolio', queryParams);
    }

    async getTokenAccounts(params: TokenAccountParams): Promise<TokenAccountResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        return await this.fetchWithRetry('/v2/account/token-accounts', queryParams);
    }

    async getAccountDetail(params: AccountDetailParams): Promise<AccountDetailResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('address', params.address);

        return await this.fetchWithRetry('/v2/account/detail', queryParams);
    }

    async getAccountMetadata(params: AccountMetadataParams): Promise<AccountMetadataResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('address', params.address);

        return await this.fetchWithRetry('/v2/account/metadata', queryParams);
    }

    async getTokenMeta(params: TokenMetaParams): Promise<TokenMetaResponse> {
        const queryParams = new URLSearchParams();
        queryParams.append('address', params.address);

        return await this.fetchWithRetry('/v2/token/meta', queryParams);
    }

    async getTokenPrice(params: TokenPriceParams): Promise<TokenPriceResponse> {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queryParams.append(key, value.toString());
            }
        });

        return await this.fetchWithRetry('/v2/token/price', queryParams);
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