import { Request, Response } from 'express';
import { DexService } from './dex.service';
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

export class DexController {
    constructor(private readonly dexService: DexService) {}

    async getDefiActivities(req: Request, res: Response) {
        try {
            const params: DefiActivityParams = req.query as any;
            const activities = await this.dexService.getDefiActivities(params);
            res.json(activities);
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getBalanceChanges(req: Request, res: Response) {
        try {
            const params: BalanceChangeParams = req.query as any;
            const activities = await this.dexService.getBalanceChanges(params);
            res.json(activities);
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTransactions(req: Request, res: Response) {
        try {
            const params: TransactionParams = req.query as any;
            const transactions = await this.dexService.getTransactions(params);
            res.json({ success: true, data: transactions });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getPortfolio(req: Request, res: Response) {
        try {
            const params: PortfolioParams = req.query as any;
            const portfolio = await this.dexService.getPortfolio(params);
            res.json({ success: true, data: portfolio });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTokenAccounts(req: Request, res: Response) {
        try {
            const params: TokenAccountParams = req.query as any;
            const accounts = await this.dexService.getTokenAccounts(params);
            res.json({ success: true, data: accounts });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getAccountDetail(req: Request, res: Response) {
        try {
            const params: AccountDetailParams = req.query as any;
            const detail = await this.dexService.getAccountDetail(params);
            res.json({ success: true, data: detail });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    async getAccountMetadata(req: Request, res: Response) {
        try {
            const params: AccountMetadataParams = req.query as any;
            const metadata = await this.dexService.getAccountMetadata(params);
            res.json({ success: true, data: metadata });
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ 
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
        }
    }

    public async getLiquidityFlows(req: Request, res: Response): Promise<void> {
        try {
            const { poolAddress, startTime, endTime } = req.query;

            if (!poolAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Pool address is required'
                });
                return;
            }

            const result = await this.dexService.getLiquidityFlows({
                poolAddress: poolAddress as string,
                startTime: startTime ? parseInt(startTime as string) : undefined,
                endTime: endTime ? parseInt(endTime as string) : undefined
            });

            if (!result.success) {
                res.status(404).json(result);
                return;
            }

            res.json(result);
        } catch (error) {
            logger.error('Error in getLiquidityFlows:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    public async getPoolState(req: Request, res: Response): Promise<void> {
        try {
            const { poolAddress } = req.query;

            if (!poolAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Pool address is required'
                });
                return;
            }

            const result = await this.dexService.getPoolState(poolAddress as string);

            if (!result.success) {
                res.status(404).json(result);
                return;
            }

            res.json(result);
        } catch (error) {
            logger.error('Error in getPoolState:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    public async getTopPools(req: Request, res: Response): Promise<void> {
        try {
            const { limit } = req.query;
            const parsedLimit = limit ? parseInt(limit as string) : undefined;

            const result = await this.dexService.getTopPools(parsedLimit);

            if (!result.success) {
                res.status(500).json(result);
                return;
            }

            res.json(result);
        } catch (error) {
            logger.error('Error in getTopPools:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}