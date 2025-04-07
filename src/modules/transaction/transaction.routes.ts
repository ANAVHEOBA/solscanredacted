import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

export function setupTransactionRoutes(transactionService: TransactionService): Router {
    const router = Router();
    const controller = new TransactionController(transactionService);

    router.get('/last', controller.getLastTransactions.bind(controller));
    router.get('/detail', controller.getTransactionDetail.bind(controller));
    router.get('/actions', controller.getTransactionActions.bind(controller));

    return router;
}

