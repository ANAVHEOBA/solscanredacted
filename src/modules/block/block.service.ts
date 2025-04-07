import { SolscanService } from '../../services/solscan.service';
import {
    Block,
    LastBlockParams,
    BlockTransactionsData,
    BlockTransactionsParams,
    BlockDetail,
    BlockDetailParams
} from './block.interface';

export class BlockService {
    constructor(private solscanService: SolscanService) {}

    async getLastBlocks(params: LastBlockParams): Promise<Block[]> {
        try {
            const response = await this.solscanService.getLastBlocks(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getBlockTransactions(params: BlockTransactionsParams): Promise<BlockTransactionsData> {
        try {
            const response = await this.solscanService.getBlockTransactions(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getBlockDetail(params: BlockDetailParams): Promise<BlockDetail> {
        try {
            const response = await this.solscanService.getBlockDetail(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
