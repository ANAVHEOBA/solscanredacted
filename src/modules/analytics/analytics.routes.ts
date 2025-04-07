import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { LiquidityAnalytics } from './services/liquidity.analytics';
import { VolumeAnalytics } from './services/volume.analytics';
import { PriceAnalytics } from './services/price.analytics';
import { ArbitrageAnalytics } from './services/arbitrage.analytics';
import { SwapAnalytics } from './services/swap.analytics';
import { AlertProcessor } from './processors/alert.processor';

export function setupAnalyticsRoutes(
    liquidityAnalytics: LiquidityAnalytics,
    volumeAnalytics: VolumeAnalytics,
    priceAnalytics: PriceAnalytics,
    arbitrageAnalytics: ArbitrageAnalytics,
    swapAnalytics: SwapAnalytics,
    alertProcessor: AlertProcessor
): Router {
    const router = Router();
    const controller = new AnalyticsController(
        liquidityAnalytics, 
        volumeAnalytics, 
        priceAnalytics,
        arbitrageAnalytics,
        swapAnalytics,
        alertProcessor
    );

    // Liquidity monitoring endpoints
    router.post('/liquidity/:poolAddress/start', controller.startLiquidityMonitoring.bind(controller));
    router.post('/liquidity/:poolAddress/stop', controller.stopLiquidityMonitoring.bind(controller));
    router.get('/liquidity/:poolAddress/status', controller.getLiquidityStatus.bind(controller));
    router.get('/liquidity/:poolAddress/alerts', controller.getLiquidityAlerts.bind(controller));

    // Volume monitoring endpoints
    router.post('/volume/:poolAddress/start', controller.startVolumeMonitoring.bind(controller));
    router.post('/volume/:poolAddress/stop', controller.stopVolumeMonitoring.bind(controller));
    router.get('/volume/:poolAddress/status', controller.getVolumeStatus.bind(controller));
    router.get('/volume/:poolAddress/alerts', controller.getVolumeAlerts.bind(controller));

    // Price monitoring endpoints
    router.post('/price/:tokenAddress/start', controller.startPriceMonitoring.bind(controller));
    router.post('/price/:tokenAddress/stop', controller.stopPriceMonitoring.bind(controller));
    router.get('/price/:tokenAddress/status', controller.getPriceStatus.bind(controller));
    router.get('/price/:tokenAddress/alerts', controller.getPriceAlerts.bind(controller));

    // Arbitrage monitoring endpoints
    router.post('/arbitrage/:tokenAddress/start', controller.startArbitrageMonitoring.bind(controller));
    router.post('/arbitrage/:tokenAddress/stop', controller.stopArbitrageMonitoring.bind(controller));
    router.get('/arbitrage/:tokenAddress/status', controller.getArbitrageStatus.bind(controller));
    router.get('/arbitrage/:tokenAddress/alerts', controller.getArbitrageAlerts.bind(controller));

    // Swap monitoring endpoints
    router.post('/swaps/:poolAddress/start', controller.startSwapMonitoring.bind(controller));
    router.post('/swaps/:poolAddress/stop', controller.stopSwapMonitoring.bind(controller));
    router.get('/swaps/:poolAddress/status', controller.getSwapStatus.bind(controller));
    router.get('/swaps/:poolAddress/alerts', controller.getSwapAlerts.bind(controller));
    router.get('/swaps/:poolAddress/metrics', controller.getSwapMetrics.bind(controller));

    // Historical data endpoints
    router.get('/alerts/history', controller.getAlertHistory.bind(controller));
    router.get('/monitoring/status', controller.getMonitoringStatus.bind(controller));

    // Start monitoring a pool
    router.post('/analytics/liquidity/:poolAddress/start', controller.startMonitoring.bind(controller));

    // Stop monitoring a pool
    router.post('/analytics/liquidity/:poolAddress/stop', controller.stopMonitoring.bind(controller));

    return router;
} 