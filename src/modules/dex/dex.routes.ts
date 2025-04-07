import { Router, RequestHandler } from 'express';
import { DexController } from './dex.controller';

export function setupDexRoutes(controller: DexController): Router {
    const router = Router();

    router.get('/defi-activities', controller.getDefiActivities.bind(controller) as RequestHandler);
    router.get('/liquidity-flows', controller.getLiquidityFlows.bind(controller) as RequestHandler);
    router.get('/pool-state', controller.getPoolState.bind(controller) as RequestHandler);
    router.get('/top-pools', controller.getTopPools.bind(controller) as RequestHandler);

    router.get('/balance-changes', controller.getBalanceChanges.bind(controller) as RequestHandler);
    router.get('/transactions', controller.getTransactions.bind(controller) as RequestHandler);
    router.get('/portfolio', controller.getPortfolio.bind(controller) as RequestHandler);
    router.get('/token-accounts', controller.getTokenAccounts.bind(controller) as RequestHandler);
    router.get('/account-detail', controller.getAccountDetail.bind(controller) as RequestHandler);
    router.get('/account-metadata', controller.getAccountMetadata.bind(controller) as RequestHandler);

    return router;
}