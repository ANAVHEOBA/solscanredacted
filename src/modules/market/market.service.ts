import { SolscanService } from '../../services/solscan.service';
import {
    MarketListParams,
    MarketListResponse,
    MarketInfoParams,
    MarketInfoResponse,
    MarketVolumeParams,
    MarketVolumeResponse
} from './market.interface';

export class MarketService {
    constructor(private readonly solscanService: SolscanService) {}

    async getMarketList(params: MarketListParams): Promise<MarketListResponse> {
        try {
            return await this.solscanService.getMarketList(params);
        } catch (error: any) {
            throw new Error(`Failed to fetch market list: ${error.message}`);
        }
    }

    async getMarketInfo(params: MarketInfoParams): Promise<MarketInfoResponse> {
        try {
            return await this.solscanService.getMarketInfo(params);
        } catch (error: any) {
            throw new Error(`Failed to fetch market info: ${error.message}`);
        }
    }

    async getMarketVolume(params: MarketVolumeParams): Promise<MarketVolumeResponse> {
        try {
            return await this.solscanService.getMarketVolume(params);
        } catch (error: any) {
            throw new Error(`Failed to fetch market volume: ${error.message}`);
        }
    }
}
