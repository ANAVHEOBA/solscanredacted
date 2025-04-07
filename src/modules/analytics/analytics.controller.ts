import { Request, Response } from 'express';
import { LiquidityAnalytics } from './services/liquidity.analytics';
import { VolumeAnalytics } from './services/volume.analytics';
import { PriceAnalytics } from './services/price.analytics';
import { ArbitrageAnalytics } from './services/arbitrage.analytics';
import { SwapAnalytics } from './services/swap.analytics';
import { AlertProcessor } from './processors/alert.processor';
import { 
    Alert, 
    AlertCategory,
    LiquidityAlert,
    VolumeAlert,
    PriceAlert,
    ArbitrageAlert,
    ActivityData 
} from './interfaces/analytics.interface';
import { logger } from '../../utils/logger';

export class AnalyticsController {
    private alertHistory: Map<string, Alert[]> = new Map();
    
    constructor(
        private liquidityAnalytics: LiquidityAnalytics,
        private volumeAnalytics: VolumeAnalytics,
        private priceAnalytics: PriceAnalytics,
        private arbitrageAnalytics: ArbitrageAnalytics,
        private swapAnalytics: SwapAnalytics,
        private alertProcessor: AlertProcessor
    ) {
        // Register alert handler to store alerts in history
        this.alertProcessor.registerAlertHandler(async (alert: Alert) => {
            const key = this.getAlertKey(alert);
            const alerts = this.alertHistory.get(key) || [];
            alerts.push(alert);
            // Keep last 100 alerts per pool/token
            if (alerts.length > 100) {
                alerts.shift();
            }
            this.alertHistory.set(key, alerts);
        });
    }

    private isLiquidityAlert(alert: Alert): alert is LiquidityAlert {
        return alert.category === 'LIQUIDITY';
    }

    private isVolumeAlert(alert: Alert): alert is VolumeAlert {
        return alert.category === 'VOLUME';
    }

    private isPriceAlert(alert: Alert): alert is PriceAlert {
        return alert.category === 'PRICE';
    }

    private isArbitrageAlert(alert: Alert): alert is ArbitrageAlert {
        return alert.category === 'ARBITRAGE';
    }

    private getAlertKey(alert: Alert): string {
        if ('poolAddress' in alert) {
            return `${alert.category}:${alert.poolAddress}`;
        }
        if ('tokenAddress' in alert) {
            return `${alert.category}:${alert.tokenAddress}`;
        }
        throw new Error(`Invalid alert format: missing address identifier`);
    }

    // Liquidity Monitoring
    public async startLiquidityMonitoring(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        const success = await this.liquidityAnalytics.startMonitoring(poolAddress);
        res.json({ success });
    }

    public async stopLiquidityMonitoring(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        this.liquidityAnalytics.stopMonitoring(poolAddress);
        res.json({ success: true });
    }

    public getLiquidityStatus(req: Request, res: Response): void {
        const { poolAddress } = req.params;
        const isMonitoring = this.liquidityAnalytics.isMonitoring(poolAddress);
        res.json({ 
            poolAddress,
            isMonitoring,
            alertCount: this.alertProcessor.getAlertCount('LIQUIDITY', poolAddress)
        });
    }

    public getLiquidityAlerts(req: Request, res: Response): void {
        const { poolAddress } = req.params;
        const alerts = this.alertProcessor.getAlerts('LIQUIDITY', poolAddress);
        res.json({ alerts });
    }

    // Volume Monitoring
    public async startVolumeMonitoring(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        const success = await this.volumeAnalytics.startMonitoring(poolAddress);
        res.json({ success });
    }

    public async stopVolumeMonitoring(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        this.volumeAnalytics.stopMonitoring(poolAddress);
        res.json({ success: true });
    }

    public getVolumeStatus(req: Request, res: Response): void {
        const { poolAddress } = req.params;
        const isMonitoring = this.volumeAnalytics.isMonitoring(poolAddress);
        res.json({ 
            poolAddress,
            isMonitoring,
            alertCount: this.alertProcessor.getAlertCount('VOLUME', poolAddress)
        });
    }

    public getVolumeAlerts(req: Request, res: Response): void {
        const { poolAddress } = req.params;
        const alerts = this.alertProcessor.getAlerts('VOLUME', poolAddress);
        res.json({ alerts });
    }

    // Price Monitoring
    public async startPriceMonitoring(req: Request, res: Response): Promise<void> {
        const { tokenAddress } = req.params;
        
        try {
            const success = await this.priceAnalytics.startMonitoring(tokenAddress);
            if (success) {
                res.status(200).json({
                    success: true,
                    message: `Started price monitoring for token ${tokenAddress}`
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: `Price monitoring already active for token ${tokenAddress}`
                });
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to start price monitoring: ${errorMessage}`
            });
        }
    }

    public async stopPriceMonitoring(req: Request, res: Response): Promise<void> {
        const { tokenAddress } = req.params;
        
        try {
            this.priceAnalytics.stopMonitoring(tokenAddress);
            res.status(200).json({
                success: true,
                message: `Stopped price monitoring for token ${tokenAddress}`
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to stop price monitoring: ${errorMessage}`
            });
        }
    }

    public async getPriceStatus(req: Request, res: Response): Promise<void> {
        const { tokenAddress } = req.params;
        
        try {
            const isMonitoring = this.priceAnalytics.isMonitoring(tokenAddress);
            res.status(200).json({
                success: true,
                data: {
                    isMonitoring,
                    tokenAddress,
                    alertCount: this.alertProcessor.getAlertCount('PRICE', tokenAddress)
                }
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to get price monitoring status: ${errorMessage}`
            });
        }
    }

    public async getPriceAlerts(req: Request, res: Response): Promise<void> {
        const { tokenAddress } = req.params;
        
        try {
            const alerts = this.alertProcessor.getAlerts('PRICE', tokenAddress);
            res.status(200).json({
                success: true,
                data: alerts
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to get price alerts: ${errorMessage}`
            });
        }
    }

    // Arbitrage Monitoring
    public async startArbitrageMonitoring(req: Request, res: Response): Promise<void> {
        const { tokenAddress } = req.params;
        
        try {
            const success = await this.arbitrageAnalytics.startMonitoring(tokenAddress);
            if (success) {
                res.status(200).json({
                    success: true,
                    message: `Started arbitrage monitoring for token ${tokenAddress}`
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: `Arbitrage monitoring already active for token ${tokenAddress}`
                });
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to start arbitrage monitoring: ${errorMessage}`
            });
        }
    }

    public async stopArbitrageMonitoring(req: Request, res: Response): Promise<void> {
        const { tokenAddress } = req.params;
        
        try {
            this.arbitrageAnalytics.stopMonitoring(tokenAddress);
            res.status(200).json({
                success: true,
                message: `Stopped arbitrage monitoring for token ${tokenAddress}`
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to stop arbitrage monitoring: ${errorMessage}`
            });
        }
    }

    public async getArbitrageStatus(req: Request, res: Response): Promise<void> {
        const { tokenAddress } = req.params;
        
        try {
            const isMonitoring = this.arbitrageAnalytics.isMonitoring(tokenAddress);
            res.status(200).json({
                success: true,
                data: {
                    isMonitoring,
                    tokenAddress,
                    alertCount: this.alertProcessor.getAlertCount('ARBITRAGE', tokenAddress)
                }
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to get arbitrage monitoring status: ${errorMessage}`
            });
        }
    }

    public async getArbitrageAlerts(req: Request, res: Response): Promise<void> {
        const { tokenAddress } = req.params;
        
        try {
            const alerts = this.alertProcessor.getAlerts('ARBITRAGE', tokenAddress);
            res.status(200).json({
                success: true,
                data: alerts
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to get arbitrage alerts: ${errorMessage}`
            });
        }
    }

    // Swap Monitoring
    public async startSwapMonitoring(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        
        try {
            const success = this.swapAnalytics.startMonitoring(poolAddress);
            if (success) {
                res.status(200).json({
                    success: true,
                    message: `Started swap monitoring for pool ${poolAddress}`
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: `Swap monitoring already active for pool ${poolAddress}`
                });
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to start swap monitoring: ${errorMessage}`
            });
        }
    }

    public async stopSwapMonitoring(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        
        try {
            this.swapAnalytics.stopMonitoring(poolAddress);
            res.status(200).json({
                success: true,
                message: `Stopped swap monitoring for pool ${poolAddress}`
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to stop swap monitoring: ${errorMessage}`
            });
        }
    }

    public async getSwapStatus(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        
        try {
            const isMonitoring = this.swapAnalytics.isMonitoring(poolAddress);
            res.status(200).json({
                success: true,
                data: {
                    isMonitoring,
                    poolAddress,
                    alertCount: this.alertProcessor.getAlertCount('VOLUME', poolAddress)
                }
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to get swap monitoring status: ${errorMessage}`
            });
        }
    }

    public async getSwapAlerts(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        
        try {
            const alerts = this.alertProcessor.getAlerts('VOLUME', poolAddress);
            res.status(200).json({
                success: true,
                data: alerts
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to get swap alerts: ${errorMessage}`
            });
        }
    }

    public async getSwapMetrics(req: Request, res: Response): Promise<void> {
        const { poolAddress } = req.params;
        const { timeframe = '3600' } = req.query; // Default 1 hour in seconds
        
        try {
            const swaps = await this.swapAnalytics.getSwapHistory(poolAddress, parseInt(timeframe as string));
            const metrics = this.calculateSwapMetrics(swaps);
            
            res.status(200).json({
                success: true,
                data: {
                    poolAddress,
                    timeframe: parseInt(timeframe as string),
                    metrics
                }
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({
                success: false,
                message: `Failed to get swap metrics: ${errorMessage}`
            });
        }
    }

    private calculateSwapMetrics(swaps: ActivityData[]) {
        if (!swaps.length) {
            return {
                swapCount: 0,
                totalVolume: 0,
                averageSize: 0,
                uniqueAddresses: 0,
                priceVolatility: 0
            };
        }

        const uniqueAddresses = new Set(swaps.map(swap => swap.from_address));
        const totalVolume = swaps.reduce((sum, swap) => sum + swap.value, 0);
        const prices = swaps.map(swap => swap.routers.amount2 / swap.routers.amount1);
        
        // Calculate price volatility
        const mean = prices.reduce((a, b) => a + b) / prices.length;
        const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
        const volatility = Math.sqrt(variance);

        return {
            swapCount: swaps.length,
            totalVolume,
            averageSize: totalVolume / swaps.length,
            uniqueAddresses: uniqueAddresses.size,
            priceVolatility: volatility
        };
    }

    async getMonitoringStatus(req: Request, res: Response): Promise<void> {
        try {
            const { address } = req.query;

            if (!address || typeof address !== 'string') {
                res.status(400).json({ error: 'Address is required' });
                return;
            }

            const liquidityMonitoring = this.liquidityAnalytics.isMonitoring(address);
            const volumeMonitoring = this.volumeAnalytics.isMonitoring(address);
            const priceMonitoring = this.priceAnalytics.isMonitoring(address);
            const arbitrageMonitoring = this.arbitrageAnalytics.isMonitoring(address);
            
            const liquidityAlerts = this.alertProcessor.getAlerts('LIQUIDITY', address);
            const volumeAlerts = this.alertProcessor.getAlerts('VOLUME', address);
            const priceAlerts = this.alertProcessor.getAlerts('PRICE', address);
            const arbitrageAlerts = this.alertProcessor.getAlerts('ARBITRAGE', address);

            res.json({
                address,
                monitoring: {
                    liquidity: liquidityMonitoring,
                    volume: volumeMonitoring,
                    price: priceMonitoring,
                    arbitrage: arbitrageMonitoring
                },
                alertCounts: {
                    liquidity: liquidityAlerts.length,
                    volume: volumeAlerts.length,
                    price: priceAlerts.length,
                    arbitrage: arbitrageAlerts.length
                },
                lastAlerts: {
                    liquidity: liquidityAlerts[liquidityAlerts.length - 1],
                    volume: volumeAlerts[volumeAlerts.length - 1],
                    price: priceAlerts[priceAlerts.length - 1],
                    arbitrage: arbitrageAlerts[arbitrageAlerts.length - 1]
                }
            });
        } catch (error: any) {
            res.status(500).json({
                error: 'Failed to get monitoring status',
                message: error.message
            });
        }
    }

    async getAlertHistory(req: Request, res: Response): Promise<void> {
        try {
            const { address, category, limit = '50', offset = '0' } = req.query;

            if (!address || typeof address !== 'string') {
                res.status(400).json({ error: 'Address is required' });
                return;
            }

            if (!category || typeof category !== 'string' || !['LIQUIDITY', 'VOLUME', 'PRICE'].includes(category)) {
                res.status(400).json({ error: 'Valid category (LIQUIDITY, VOLUME, PRICE) is required' });
                return;
            }

            const numLimit = Math.min(Number(limit), 100);
            const numOffset = Number(offset);
            
            const alerts = this.alertProcessor.getAlerts(category as AlertCategory, address);
            const paginatedAlerts = alerts
                .slice(numOffset, numOffset + numLimit)
                .sort((a, b) => b.timestamp - a.timestamp);

            res.json({
                address,
                category,
                total: alerts.length,
                offset: numOffset,
                limit: numLimit,
                alerts: paginatedAlerts
            });
        } catch (error: any) {
            res.status(500).json({
                error: 'Failed to get alert history',
                message: error.message
            });
        }
    }

    async startMonitoring(req: Request, res: Response): Promise<void> {
        try {
            const { poolAddress } = req.params;

            if (!poolAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Pool address is required'
                });
                return;
            }

            await this.liquidityAnalytics.startMonitoring(poolAddress);

            res.json({
                success: true,
                message: `Started monitoring pool: ${poolAddress}`
            });
        } catch (error) {
            logger.error('Error starting pool monitoring:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to start pool monitoring'
            });
        }
    }

    async stopMonitoring(req: Request, res: Response): Promise<void> {
        try {
            const { poolAddress } = req.params;

            if (!poolAddress) {
                res.status(400).json({
                    success: false,
                    error: 'Pool address is required'
                });
                return;
            }

            await this.liquidityAnalytics.stopMonitoring(poolAddress);

            res.json({
                success: true,
                message: `Stopped monitoring pool: ${poolAddress}`
            });
        } catch (error) {
            logger.error('Error stopping pool monitoring:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to stop pool monitoring'
            });
        }
    }
} 