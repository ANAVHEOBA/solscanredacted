// src/modules/transaction/transaction.controller.ts
import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import { 
    LastTransactionParams,
    TransactionDetailParams,
    TransactionActionsParams
} from './transaction.interface';
import { logger } from '../../utils/logger';

export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    async getLastTransactions(req: Request, res: Response): Promise<void> {
        try {
            const limit = Number(req.query.limit);
            const validLimits = [10, 20, 30, 40, 60, 100];
            
            const params: LastTransactionParams = {
                limit: validLimits.includes(limit) ? limit as 10 | 20 | 30 | 40 | 60 | 100 : 10,
                filter: (req.query.filter === 'exceptVote' || req.query.filter === 'all') 
                    ? req.query.filter 
                    : 'all'
            };

            const transactions = await this.transactionService.getLastTransactions(params);
            res.json({
                success: true,
                data: transactions
            });
        } catch (error) {
            logger.error('Error fetching last transactions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch last transactions'
            });
        }
    }

    async getTransactionDetail(req: Request, res: Response): Promise<void> {
        try {
            const params: TransactionDetailParams = {
                tx: req.query.tx as string
            };

            if (!params.tx) {
                res.status(400).json({
                    success: false,
                    error: 'Transaction hash is required'
                });
                return;
            }

            const detail = await this.transactionService.getTransactionDetail(params);
            res.json({
                success: true,
                data: detail
            });
        } catch (error) {
            logger.error('Error fetching transaction detail:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch transaction detail'
            });
        }
    }

    async getTransactionActions(req: Request, res: Response): Promise<void> {
        try {
            const params: TransactionActionsParams = {
                tx: req.query.tx as string
            };

            if (!params.tx) {
                res.status(400).json({
                    success: false,
                    error: 'Transaction hash is required'
                });
                return;
            }

            const actions = await this.transactionService.getTransactionActions(params);
            res.json({
                success: true,
                data: actions
            });
        } catch (error) {
            logger.error('Error fetching transaction actions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch transaction actions'
            });
        }
    }
}