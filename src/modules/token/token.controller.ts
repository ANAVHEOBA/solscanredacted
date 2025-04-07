import { Request, Response } from 'express';
import { TokenService } from './token.service';
import { 
    TokenMetaParams, 
    TokenPriceParams, 
    TokenMarketsParams,
    TokenHoldersParams,
    TokenTransferParams,
    TokenDefiActivityParams
} from './token.interface';

export class TokenController {
    constructor(private tokenService: TokenService) {}

    async getTokenMeta(req: Request, res: Response) {
        try {
            const params: TokenMetaParams = req.query as any;
            const meta = await this.tokenService.getTokenMeta(params);
            res.json({ success: true, data: meta });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTokenPrice(req: Request, res: Response) {
        try {
            const params: TokenPriceParams = req.query as any;
            const prices = await this.tokenService.getTokenPrice(params);
            res.json({ success: true, data: prices });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTokenMarkets(req: Request, res: Response) {
        try {
            const params: TokenMarketsParams = req.query as any;
            const markets = await this.tokenService.getTokenMarkets(params);
            res.json({ success: true, data: markets });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTokenHolders(req: Request, res: Response) {
        try {
            const params: TokenHoldersParams = req.query as any;
            const holders = await this.tokenService.getTokenHolders(params);
            res.json({ success: true, data: holders });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTokenTransfers(req: Request, res: Response) {
        try {
            const params: TokenTransferParams = req.query as any;
            const transfers = await this.tokenService.getTokenTransfers(params);
            res.json({ success: true, data: transfers });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTokenDefiActivities(req: Request, res: Response) {
        try {
            const params: TokenDefiActivityParams = req.query as any;
            const activities = await this.tokenService.getTokenDefiActivities(params);
            res.json({ success: true, data: activities });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }
}
