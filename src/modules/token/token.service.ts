import { SolscanService } from '../../services/solscan.service';
import {
    TokenMeta,
    TokenMetaParams,
    TokenPrice,
    TokenPriceParams,
    TokenMarket,
    TokenMarketsParams,
    TokenHolder,
    TokenHoldersParams,
    TokenTransfer,
    TokenTransferParams,
    TokenDefiActivity,
    TokenDefiActivityParams
} from './token.interface';

export class TokenService {
    constructor(private solscanService: SolscanService) {}

    async getTokenMeta(params: TokenMetaParams): Promise<TokenMeta> {
        try {
            const response = await this.solscanService.getTokenMeta(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTokenPrice(params: TokenPriceParams): Promise<TokenPrice[]> {
        try {
            const response = await this.solscanService.getTokenPrice(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTokenMarkets(params: TokenMarketsParams): Promise<TokenMarket[]> {
        try {
            const response = await this.solscanService.getTokenMarkets(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTokenHolders(params: TokenHoldersParams): Promise<{ total: number; items: TokenHolder[] }> {
        try {
            const response = await this.solscanService.getTokenHolders(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTokenTransfers(params: TokenTransferParams): Promise<TokenTransfer[]> {
        try {
            const response = await this.solscanService.getTokenTransfers(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTokenDefiActivities(params: TokenDefiActivityParams): Promise<TokenDefiActivity[]> {
        try {
            const response = await this.solscanService.getTokenDefiActivities(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
} 