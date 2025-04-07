// src/app.ts
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { setupDexRoutes } from './modules/dex/dex.routes';
import { setupTokenRoutes } from './modules/token/token.routes';
import { setupTransactionRoutes } from './modules/transaction/transaction.routes';
import { setupBlockRoutes } from './modules/block/block.routes';
import { setupMarketRoutes } from './modules/market/market.routes';
import { setupAnalyticsRoutes } from './modules/analytics/analytics.routes';

import { DexService } from './modules/dex/dex.service';
import { DexController } from './modules/dex/dex.controller';
import { TokenService } from './modules/token/token.service';
import { TransactionService } from './modules/transaction/transaction.service';
import { BlockService } from './modules/block/block.service';
import { MarketService } from './modules/market/market.service';
import { WebSocketService } from './services/websocket.service';
import { SolscanService } from './services/solscan.service';
import { ActivityService } from './modules/analytics/services/activity.service';
import { LiquidityAnalytics } from './modules/analytics/services/liquidity.analytics';
import { VolumeAnalytics } from './modules/analytics/services/volume.analytics';
import { PriceAnalytics } from './modules/analytics/services/price.analytics';
import { ArbitrageAnalytics } from './modules/analytics/services/arbitrage.analytics';
import { SwapAnalytics } from './modules/analytics/services/swap.analytics';
import { AlertProcessor } from './modules/analytics/processors/alert.processor';
import { LiquidityStorageService } from './modules/analytics/services/liquidity.storage';
import { apiConfig } from './config/api.config';
import { logger } from './utils/logger';

interface ErrorWithStatus extends Error {
    status?: number;
}

export const createApp = (server: HttpServer): { app: Express, webSocketService: WebSocketService } => {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Initialize base services
    const solscanService = new SolscanService(apiConfig.solscanApiKey || '');
    const tokenService = new TokenService(solscanService);
    const transactionService = new TransactionService(solscanService);
    const blockService = new BlockService(solscanService);
    const marketService = new MarketService(solscanService);
    const liquidityStorage = new LiquidityStorageService();
    const alertProcessor = new AlertProcessor();

    // Initialize DexService with null liquidityAnalytics first
    const dexService = new DexService(solscanService, null);

    // Initialize analytics services
    const liquidityAnalytics = new LiquidityAnalytics(
        marketService,
        tokenService,
        dexService,
        transactionService,
        alertProcessor,
        liquidityStorage
    );

    // Set liquidityAnalytics on DexService
    dexService.setLiquidityAnalytics(liquidityAnalytics);

    // Initialize WebSocketService after DexService is fully initialized
    const webSocketService = new WebSocketService(server, dexService);

    // Initialize remaining analytics services
    const volumeAnalytics = new VolumeAnalytics(marketService, dexService);
    const priceAnalytics = new PriceAnalytics(marketService, tokenService, alertProcessor);
    const arbitrageAnalytics = new ArbitrageAnalytics(marketService, dexService, alertProcessor);
    const swapAnalytics = new SwapAnalytics(alertProcessor);

    // Initialize activity service
    const activityService = new ActivityService(webSocketService);

    // Initialize controllers
    const dexController = new DexController(dexService);

    // Setup routes
    app.use('/api/dex', setupDexRoutes(dexController));
    app.use('/api/token', setupTokenRoutes(tokenService));
    app.use('/api/transaction', setupTransactionRoutes(transactionService));
    app.use('/api/block', setupBlockRoutes(blockService));
    app.use('/api/market', setupMarketRoutes(marketService));
    app.use('/api/analytics', setupAnalyticsRoutes(
        liquidityAnalytics,
        volumeAnalytics,
        priceAnalytics,
        arbitrageAnalytics,
        swapAnalytics,
        alertProcessor
    ));

    // Health check route
    app.get('/health', (req: Request, res: Response) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    });

    // Error handling middleware
    app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
        logger.error('Error:', err);
        res.status(err.status || 500).json({
            error: err.message || 'Internal server error',
            timestamp: new Date().toISOString()
        });
    });

    return { app, webSocketService };
};

export default createApp;