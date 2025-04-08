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
import { apiConfig } from './config/api.config';
import { logger } from './utils/logger';
import { SolscanService } from './services/solscan.service';

import { DexService } from './modules/dex/dex.service';
import { DexAnalyticsService } from './modules/dex/services/dex-analytics.service';
import { DexController } from './modules/dex/dex.controller';
import { TokenService } from './modules/token/token.service';
import { TransactionService } from './modules/transaction/transaction.service';
import { BlockService } from './modules/block/block.service';
import { MarketService } from './modules/market/market.service';
import { WebSocketService } from './services/websocket.service';
import { ActivityService } from './modules/analytics/services/activity.service';
import { LiquidityAnalytics } from './modules/analytics/services/liquidity.analytics';
import { VolumeAnalytics } from './modules/analytics/services/volume.analytics';
import { PriceAnalytics } from './modules/analytics/services/price.analytics';
import { ArbitrageAnalytics } from './modules/analytics/services/arbitrage.analytics';
import { SwapAnalytics } from './modules/analytics/services/swap.analytics';
import { AlertProcessor } from './modules/analytics/processors/alert.processor';
import { LiquidityStorageService } from './modules/analytics/services/liquidity.storage';
import { ActivityDatabase } from './modules/dex/storage/activity.database';
import { DataValidatorService } from './modules/dex/services/data-validator.service';
import { DexActivityCollectorService } from './modules/dex/services/dex-activity-collector.service';
import helmet from 'helmet';
import compression from 'compression';

interface ErrorWithStatus extends Error {
    status?: number;
}

export const createApp = async (server: HttpServer): Promise<{ app: Express, webSocketService: WebSocketService }> => {
    const app = express();
    const router = express.Router();

    // Middleware
    app.use(cors());
    app.use(helmet());
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
        logger.info(`[Request Started] ${req.method} ${req.url}`, {
            query: req.query,
            body: req.body,
            timestamp: new Date().toISOString()
        });

        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info(`[Request Completed] ${req.method} ${req.url}`, {
                duration,
                status: res.statusCode
            });
        });

        next();
    });

    // Initialize services with proper error handling
    let solscanService: SolscanService;
    try {
        if (!apiConfig.solscanApiKey) {
            throw new Error('Solscan API key is not configured');
        }
        solscanService = new SolscanService(apiConfig.solscanApiKey);
    } catch (error) {
        logger.error('Failed to initialize SolscanService:', error);
        throw error;
    }

    // Initialize remaining services
    const tokenService = new TokenService(solscanService);
    const transactionService = new TransactionService(solscanService);
    const blockService = new BlockService(solscanService);
    const marketService = new MarketService(solscanService);
    const liquidityStorage = new LiquidityStorageService();
    const alertProcessor = new AlertProcessor();
    
    // Initialize DEX services with new architecture
    const dexService = new DexService(solscanService);
    const activityDatabase = new ActivityDatabase();
    const dataValidator = new DataValidatorService();
    const dexAnalyticsService = new DexAnalyticsService(activityDatabase, dataValidator);
    const dexActivityCollector = new DexActivityCollectorService(activityDatabase);
    const dexController = new DexController(dexService, dexAnalyticsService);

    // Initialize WebSocket service
    const webSocketService = new WebSocketService(server, dexService);

    // Initialize analytics services
    const liquidityAnalytics = new LiquidityAnalytics(
        marketService,
        tokenService,
        dexService,
        transactionService,
        alertProcessor,
        liquidityStorage
    );

    const volumeAnalytics = new VolumeAnalytics(marketService, dexService);
    const priceAnalytics = new PriceAnalytics(marketService, tokenService, alertProcessor);
    const arbitrageAnalytics = new ArbitrageAnalytics(marketService, dexService, alertProcessor);
    const swapAnalytics = new SwapAnalytics(alertProcessor);
    const activityService = new ActivityService(webSocketService);

    // Add some mock data for testing
    const testPoolAddress = '8erNF5u3CHrqZJXtkfY8CjSxFYF1yqHmN8uDbAhk6tWM';
    await dexActivityCollector.addMockActivity(testPoolAddress);
    logger.info(`Added mock activity for pool ${testPoolAddress}`);

    // Setup routes
    const apiRouter = express.Router();
    app.use('/api', apiRouter);

    // DEX Module Routes
    const dexRouter = express.Router();
    setupDexRoutes(dexRouter, solscanService);
    apiRouter.use('/dex', dexRouter);

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

    // 404 handler
    app.use((req: Request, res: Response) => {
        res.status(404).json({
            error: 'Not Found',
            path: req.path,
            timestamp: new Date().toISOString()
        });
    });

    // Error handling middleware
    app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
        const status = err.status || 500;
        const message = status === 500 ? 'Internal Server Error' : err.message;

        logger.error('Error handling request:', {
            error: err.message,
            stack: err.stack,
            status,
            path: req.path,
            method: req.method
        });

        res.status(status).json({
            error: message,
            timestamp: new Date().toISOString()
        });
    });

    return { app, webSocketService };
};

export default createApp;