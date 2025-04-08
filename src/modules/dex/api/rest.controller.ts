import { Request, Response } from 'express';
import { DexController } from '../dex.controller';
import { logger } from '../../../utils/logger';
import { 
    DefiActivityParams,
    BalanceChangeParams,
    TransactionParams,
    PortfolioParams,
    TokenAccountParams,
    AccountDetailParams,
    AccountMetadataParams
} from '../dex.interface';

export class DexRestController {
    constructor(private readonly dexController: DexController) {}

    async getDefiActivities(req: Request, res: Response) {
        const startTime = Date.now();
        logger.info('[DexRestController] getDefiActivities started', { 
            query: req.query,
            timestamp: new Date().toISOString()
        });

        try {
            const params: DefiActivityParams = req.query as any;
            const result = await this.dexController.getDefiActivities(params);
            
            logger.info('[DexRestController] Successfully got activities', {
                success: result.success,
                duration: Date.now() - startTime
            });
            
            if (!result.success) {
                res.status(500).json(result);
                return;
            }
            
            res.json(result);
        } catch (error) {
            logger.error('[DexRestController] Error in getDefiActivities', {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                duration: Date.now() - startTime
            });
            
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }

    async getBalanceChanges(req: Request, res: Response) {
        try {
            const params: BalanceChangeParams = req.query as any;
            const result = await this.dexController.getBalanceChanges(params);
            
            if (!result.success) {
                res.status(500).json(result);
                return;
            }
            
            res.json(result);
        } catch (error) {
            logger.error('Error in getBalanceChanges:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTransactions(req: Request, res: Response) {
        try {
            const params: TransactionParams = req.query as any;
            const result = await this.dexController.getTransactions(params);
            
            if (!result.success) {
                res.status(500).json(result);
                return;
            }
            
            res.json(result);
        } catch (error) {
            logger.error('Error in getTransactions:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }

    async getPortfolio(req: Request, res: Response) {
        try {
            const params: PortfolioParams = req.query as any;
            const result = await this.dexController.getPortfolio(params);
            
            if (!result.success) {
                res.status(500).json(result);
                return;
            }

            res.json(result);
        } catch (error) {
            logger.error('Error in getPortfolio:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }

    async getTokenAccounts(req: Request, res: Response) {
        try {
            const params: TokenAccountParams = req.query as any;
            const result = await this.dexController.getTokenAccounts(params);
            
            if (!result.success) {
                res.status(500).json(result);
                return;
            }
            
            res.json(result);
        } catch (error) {
            logger.error('Error in getTokenAccounts:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }

    async getAccountDetail(req: Request, res: Response) {
        try {
            const params: AccountDetailParams = req.query as any;
            const result = await this.dexController.getAccountDetail(params);
            
            if (!result.success) {
                res.status(500).json(result);
                return;
            }
            
            res.json(result);
        } catch (error) {
            logger.error('Error in getAccountDetail:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }

    async getAccountMetadata(req: Request, res: Response) {
        try {
            const params: AccountMetadataParams = req.query as any;
            const result = await this.dexController.getAccountMetadata(params);
            
            if (!result.success) {
                res.status(500).json(result);
                return;
            }
            
            res.json(result);
        } catch (error) {
            logger.error('Error in getAccountMetadata:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }

    async getLiquidityFlows(req: Request, res: Response) {
        const startTime = Date.now();
        logger.info('[DexRestController] getLiquidityFlows started', { 
            query: req.query,
            timestamp: new Date().toISOString()
        });

        try {
            const { poolAddress, startTime: startTimeParam, endTime: endTimeParam } = req.query;

            if (!poolAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Pool address is required'
                });
                return;
            }

            const poolAddressStr = poolAddress.toString().trim();
            const result = await this.dexController.getLiquidityFlows({
                poolAddress: poolAddressStr,
                startTime: startTimeParam ? parseInt(startTimeParam as string) : undefined,
                endTime: endTimeParam ? parseInt(endTimeParam as string) : undefined
            });

            logger.info('[DexRestController] getLiquidityFlows completed', {
                success: result.success,
                duration: Date.now() - startTime,
                timestamp: new Date().toISOString()
            });

            if (!result.success) {
                res.status(500).json(result);
                return;
            }

            res.json(result);
        } catch (error) {
            logger.error('[DexRestController] Error in getLiquidityFlows:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }

    async getPoolState(req: Request, res: Response) {
        try {
            const { poolAddress } = req.query;

            if (!poolAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Pool address is required'
                });
                return;
            }

            const result = await this.dexController.getPoolState(poolAddress as string);

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

    async getBalanceAnalytics(req: Request, res: Response) {
        try {
            const { address } = req.query;
            
            if (!address) {
                res.status(400).json({
                    success: false,
                    error: 'Address is required'
                });
                return;
            }

            const result = await this.dexController.getBalanceAnalytics(address.toString());
            
            if (!result.success) {
                res.status(500).json(result);
                return;
            }
            
            res.json(result);
        } catch (error) {
            logger.error('Error in getBalanceAnalytics:', error);
            res.status(500).json({ 
                success: false,
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            });
        }
    }
} 