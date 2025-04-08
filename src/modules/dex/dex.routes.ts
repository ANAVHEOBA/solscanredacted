import { Router } from 'express';
import { DexRestController } from './api/rest.controller';
import { DexController } from './dex.controller';
import { DexService } from './dex.service';
import { DexAnalyticsService } from './services/dex-analytics.service';
import { SolscanService } from '../../services/solscan.service';
import { ActivityDatabase } from './storage/activity.database';
import { DataValidatorService } from './services/data-validator.service';

export function setupDexRoutes(router: Router, solscanService: SolscanService): Router {
    const dexService = new DexService(solscanService);
    const activityDatabase = new ActivityDatabase();
    const dataValidator = new DataValidatorService();
    const dexAnalyticsService = new DexAnalyticsService(activityDatabase, dataValidator, dexService);
    const dexController = new DexController(dexService, dexAnalyticsService);
    const dexRestController = new DexRestController(dexController);

    // Solscan API endpoints
    router.get('/defi-activities', dexRestController.getDefiActivities.bind(dexRestController));
    router.get('/balance-changes', dexRestController.getBalanceChanges.bind(dexRestController));
    router.get('/transactions', dexRestController.getTransactions.bind(dexRestController));
    router.get('/portfolio', dexRestController.getPortfolio.bind(dexRestController));
    router.get('/token-accounts', dexRestController.getTokenAccounts.bind(dexRestController));
    router.get('/account-detail', dexRestController.getAccountDetail.bind(dexRestController));
    router.get('/account-metadata', dexRestController.getAccountMetadata.bind(dexRestController));

    // Analytics endpoints
    router.get('/liquidity-flows', dexRestController.getLiquidityFlows.bind(dexRestController));
    router.get('/pool-state', dexRestController.getPoolState.bind(dexRestController));
    router.get('/balance-analytics', dexRestController.getBalanceAnalytics.bind(dexRestController));

    return router;
}