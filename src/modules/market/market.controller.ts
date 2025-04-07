import { Request, Response } from 'express';
import { MarketService } from './market.service';
import {
    MarketListParams,
    MarketInfoParams,
    MarketVolumeParams
} from './market.interface';

export class MarketController {
    constructor(private readonly marketService: MarketService) {}

    async getMarketList(req: Request, res: Response): Promise<void> {
        try {
            const pageSize = req.query.page_size ? Number(req.query.page_size) : undefined;
            if (pageSize !== undefined && ![10, 20, 30, 40, 60, 100].includes(pageSize)) {
                res.status(400).json({ error: 'Invalid page_size. Allowed values are: 10, 20, 30, 40, 60, 100' });
                return;
            }

            const params: MarketListParams = {
                page: req.query.page ? Number(req.query.page) : undefined,
                page_size: pageSize as 10 | 20 | 30 | 40 | 60 | 100 | undefined,
                program: req.query.program as string | undefined
            };

            const result = await this.marketService.getMarketList(params);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMarketInfo(req: Request, res: Response): Promise<void> {
        try {
            const address = req.query.address as string;
            if (!address) {
                res.status(400).json({ error: 'Address parameter is required' });
                return;
            }

            const params: MarketInfoParams = { address };
            const result = await this.marketService.getMarketInfo(params);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMarketVolume(req: Request, res: Response): Promise<void> {
        try {
            const address = req.query.address as string;
            if (!address) {
                res.status(400).json({ error: 'Address parameter is required' });
                return;
            }

            const time = req.query.time ? 
                (Array.isArray(req.query.time) ? req.query.time : [req.query.time]) as string[] 
                : undefined;

            const params: MarketVolumeParams = { address, time };
            const result = await this.marketService.getMarketVolume(params);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
