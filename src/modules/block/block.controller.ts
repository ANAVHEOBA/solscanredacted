import { Request, Response } from 'express';
import { BlockService } from './block.service';
import { 
    LastBlockParams,
    BlockTransactionsParams,
    BlockDetailParams
} from './block.interface';

export class BlockController {
    constructor(private blockService: BlockService) {}

    async getLastBlocks(req: Request, res: Response) {
        try {
            const params: LastBlockParams = req.query as any;
            const blocks = await this.blockService.getLastBlocks(params);
            res.json({ success: true, data: blocks });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getBlockTransactions(req: Request, res: Response) {
        try {
            const params: BlockTransactionsParams = req.query as any;
            if (!params.block) {
                throw new Error('Block parameter is required');
            }
            const transactions = await this.blockService.getBlockTransactions(params);
            res.json({ success: true, data: transactions });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getBlockDetail(req: Request, res: Response) {
        try {
            const params: BlockDetailParams = req.query as any;
            if (!params.block) {
                throw new Error('Block parameter is required');
            }
            const detail = await this.blockService.getBlockDetail(params);
            res.json({ success: true, data: detail });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }
}
