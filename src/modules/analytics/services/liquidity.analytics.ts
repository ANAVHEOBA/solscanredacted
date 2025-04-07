import { MarketService } from '../../market/market.service';
import { TokenService } from '../../token/token.service';
import { DexService } from '../../dex/dex.service';
import { TransactionService } from '../../transaction/transaction.service';
import { LiquidityStrategy } from '../strategies/liquidity.strategy';
import { StreamProcessor } from '../processors/stream.processor';
import { AlertProcessor } from '../processors/alert.processor';
import { 
    LiquidityMetrics, 
    LiquidityChange, 
    LiquidityAlert,
    ActivityData
} from '../interfaces/analytics.interface';
import { TIME_WINDOWS, LIQUIDITY_THRESHOLDS } from '../constants/thresholds';
import { MarketInfo, MarketVolume } from '../../market/market.interface';
import { TokenMeta } from '../../token/token.interface';
import { BalanceChangeActivity } from '../../dex/dex.interface';
import { LiquidityStorageService } from './liquidity.storage';
import { logger } from '../../../utils/logger';

interface TokenFlow {
    token: string;
    amount: number;
    decimals: number;
    direction: 'in' | 'out';
    timestamp: number;
}

interface PoolFlow {
    poolAddress: string;
    tokenFlows: TokenFlow[];
    volume24h: number;
    swapCount: number;
    lastUpdate: number;
    priceImpact: number;
}

interface LiquidityAnalysis {
    poolAddress: string;
    timeframe: {
        start: number;
        end: number;
    };
    volumeAnalysis: {
        total: number;
        averagePerSwap: number;
        largestSwap: number;
        swapCount: number;
    };
    tokenAnalysis: {
        [token: string]: {
            netFlow: number;
            inflow: number;
            outflow: number;
            swapCount: number;
        };
    };
    priceImpact: {
        average: number;
        highest: number;
        lowest: number;
    };
    patterns: {
        largeSwaps: Array<{
            timestamp: number;
            amount: number;
            impact: number;
            txHash: string;
        }>;
        volumeSpikes: Array<{
            timestamp: number;
            volume: number;
            duration: number;
        }>;
    };
}

export class LiquidityAnalytics {
    private strategy: LiquidityStrategy;
    private streamProcessor: StreamProcessor;
    private activeMonitoring: Map<string, NodeJS.Timeout> = new Map();
    private lastMetrics: Map<string, LiquidityMetrics> = new Map();
    private poolFlows: Map<string, PoolFlow> = new Map();
    private readonly SIGNIFICANT_IMPACT_THRESHOLD = 0.01; // 1%
    private readonly LARGE_SWAP_THRESHOLD = 10000; // $10k equivalent

    constructor(
        private readonly marketService: MarketService,
        private readonly tokenService: TokenService,
        private readonly dexService: DexService,
        private readonly transactionService: TransactionService,
        private readonly alertProcessor: AlertProcessor,
        private readonly storage: LiquidityStorageService
    ) {
        this.strategy = new LiquidityStrategy();
        this.streamProcessor = new StreamProcessor();
        
        // Set up stream processor event handling
        this.streamProcessor.on('liquidityChange', async (data: {
            poolAddress: string;
            change: LiquidityChange;
            impactPercentage: number;
            timestamp: number;
        }) => {
            const currentMetrics = this.lastMetrics.get(data.poolAddress);
            if (currentMetrics) {
                const alerts = this.strategy.analyzeLiquidityChange(
                    data.poolAddress,
                    currentMetrics,
                    data.change
                );
                
                // Process alerts
                alerts.forEach(alert => this.alertProcessor.processAlert(alert));
            }
        });
    }

    public isMonitoring(poolAddress: string): boolean {
        return this.activeMonitoring.has(poolAddress);
    }

    public async startMonitoring(poolAddress: string): Promise<boolean> {
        if (this.activeMonitoring.has(poolAddress)) {
            return false;
        }

        try {
            // Initial analysis
            await this.analyzePool(poolAddress);

            // Start stream processing
            this.streamProcessor.startProcessing(poolAddress);

            // Set up continuous metric updates
            const timer = setInterval(
                () => this.updatePoolMetrics(poolAddress),
                TIME_WINDOWS.REAL_TIME * 60 * 1000
            );

            this.activeMonitoring.set(poolAddress, timer);

            // Start monitoring defi activities
            await this.startDefiActivityMonitoring(poolAddress);

            return true;
        } catch (error) {
            console.error(`Failed to start monitoring for pool ${poolAddress}:`, error);
            return false;
        }
    }

    public stopMonitoring(poolAddress: string): void {
        const timer = this.activeMonitoring.get(poolAddress);
        if (timer) {
            clearTimeout(timer);
            this.activeMonitoring.delete(poolAddress);
            this.lastMetrics.delete(poolAddress);
            this.streamProcessor.stopProcessing(poolAddress);
        }
    }

    private async startDefiActivityMonitoring(poolAddress: string): Promise<void> {
        try {
            // Initial fetch of activities
            const activities = await this.dexService.getDefiActivities({
                address: poolAddress,
                page: 1,
                page_size: 100
            });

            // Process historical activities
            for (const activity of activities) {
                try {
                    // Validate activity structure
                    if (!this.isValidActivityData(activity)) {
                        logger.warn(`Skipping malformed historical activity for pool ${poolAddress}:`, activity);
                        continue;
                    }

                    const activityData: ActivityData = {
                        activity_type: activity.activity_type,
                        block_id: activity.block_id,
                        block_time: activity.block_time,
                        from_address: activity.from_address,
                        platform: activity.platform,
                        sources: activity.sources,
                        time: activity.time,
                        trans_id: activity.trans_id,
                        to_address: activity.to_address,
                        amount_info: activity.amount_info
                    };
                    await this.streamProcessor.processActivity(activityData);
                } catch (error) {
                    logger.error(`Error processing historical activity for pool ${poolAddress}:`, error);
                }
            }
        } catch (error) {
            logger.error(`Error fetching historical activities for pool ${poolAddress}:`, error);
        }
    }

    private isValidActivityData(activity: any): boolean {
        return (
            activity &&
            typeof activity.activity_type === 'string' &&
            typeof activity.block_id === 'number' &&
            typeof activity.block_time === 'number' &&
            typeof activity.from_address === 'string' &&
            typeof activity.platform === 'string' &&
            Array.isArray(activity.sources) &&
            typeof activity.time === 'string' &&
            typeof activity.trans_id === 'string' &&
            activity.amount_info &&
            typeof activity.amount_info.token1 === 'string' &&
            typeof activity.amount_info.token1_decimals === 'number' &&
            typeof activity.amount_info.amount1 === 'string' &&
            typeof activity.amount_info.token2 === 'string' &&
            typeof activity.amount_info.token2_decimals === 'number' &&
            typeof activity.amount_info.amount2 === 'string' &&
            Array.isArray(activity.amount_info.routers) &&
            activity.amount_info.routers.every(router => 
                router &&
                typeof router.token1 === 'string' &&
                typeof router.token1_decimals === 'number' &&
                typeof router.amount1 === 'string' &&
                typeof router.token2 === 'string' &&
                typeof router.token2_decimals === 'number' &&
                typeof router.amount2 === 'string'
            )
        );
    }

    private async updatePoolMetrics(poolAddress: string): Promise<void> {
        try {
            const [marketInfoResponse, marketVolumeResponse] = await Promise.all([
                this.marketService.getMarketInfo({ address: poolAddress }),
                this.marketService.getMarketVolume({ address: poolAddress })
            ]);

            if (!marketInfoResponse.success || !marketVolumeResponse.success) {
                throw new Error('Failed to fetch market data');
            }

            const marketInfo = marketInfoResponse.data;
            const marketVolume = marketVolumeResponse.data;

            // Get token details
            const [token1Info, token2Info] = await Promise.all([
                this.tokenService.getTokenMeta({ address: marketInfo.tokens_info[0].token }),
                this.tokenService.getTokenMeta({ address: marketInfo.tokens_info[1].token })
            ]);

            // Update metrics
            const currentMetrics: LiquidityMetrics = {
                poolAddress,
                timestamp: Date.now(),
                totalLiquidity: marketInfo.tokens_info.reduce((sum, token) => sum + (token.amount || 0), 0),
                token1: {
                    address: marketInfo.tokens_info[0].token,
                    symbol: token1Info.symbol,
                    amount: marketInfo.tokens_info[0].amount,
                    value: marketInfo.tokens_info[0].amount * (token1Info.price || 0)
                },
                token2: {
                    address: marketInfo.tokens_info[1].token,
                    symbol: token2Info.symbol,
                    amount: marketInfo.tokens_info[1].amount,
                    value: marketInfo.tokens_info[1].amount * (token2Info.price || 0)
                },
                holderCount: token1Info.holder || 0,
                volume24h: marketVolume.total_volume_24h
            };

            // Update metrics in both services
            this.lastMetrics.set(poolAddress, currentMetrics);
            this.streamProcessor.updateMetrics(poolAddress, currentMetrics);

        } catch (error) {
            console.error(`Error updating metrics for pool ${poolAddress}:`, error);
        }
    }

    private async analyzePool(poolAddress: string): Promise<LiquidityAlert[]> {
        try {
            await this.updatePoolMetrics(poolAddress);
            const currentMetrics = this.lastMetrics.get(poolAddress);
            
            if (!currentMetrics) {
                return [];
            }

            // Get recent changes
            const recentChanges = await this.dexService.getBalanceChanges({
                address: poolAddress,
                page_size: 100
            });

            if (!recentChanges.length) {
                return [];
            }

            // Analyze recent changes
            const alerts: LiquidityAlert[] = [];
            for (const change of recentChanges) {
                if (this.isSignificantChange(change, currentMetrics)) {
                    const liquidityChange = this.createLiquidityChange(change, currentMetrics);
                    const changeAlerts = this.strategy.analyzeLiquidityChange(
                        poolAddress,
                        currentMetrics,
                        liquidityChange
                    );
                    alerts.push(...changeAlerts);
                }
            }

            return alerts;

        } catch (error) {
            console.error(`Error analyzing pool ${poolAddress}:`, error);
            return [];
        }
    }

    private isSignificantChange(change: BalanceChangeActivity, metrics: LiquidityMetrics): boolean {
        const impactScore = this.calculateImpactScore(change, metrics);
        return impactScore >= LIQUIDITY_THRESHOLDS.LOW_CHANGE_PERCENTAGE;
    }

    private calculateImpactScore(change: BalanceChangeActivity, metrics: LiquidityMetrics): number {
        if (!change || metrics.totalLiquidity === 0) return 0;
        const changeAmount = Math.abs(change.amount || 0);
        return (changeAmount / metrics.totalLiquidity) * 100;
    }

    private createLiquidityChange(change: BalanceChangeActivity, metrics: LiquidityMetrics): LiquidityChange {
        return {
            poolAddress: metrics.poolAddress,
            timestamp: Date.now(),
            changeType: change.change_type === 'inc' ? 'ADD' : 'REMOVE',
            token1Change: {
                amount: change.amount || 0,
                value: (change.amount || 0) * (metrics.token1.value / metrics.token1.amount)
            },
            token2Change: {
                amount: 0,
                value: 0
            },
            impactScore: this.calculateImpactScore(change, metrics),
            transactionHash: change.trans_id
        };
    }

    public async analyzePoolActivity(
        poolAddress: string,
        startTime?: number,
        endTime?: number
    ): Promise<LiquidityAnalysis> {
        try {
            // Get historical flows from storage
            const flows = await this.storage.getLiquidityFlows(
                poolAddress,
                startTime,
                endTime
            );

            // Initialize analysis structure
            const analysis: LiquidityAnalysis = {
                poolAddress,
                timeframe: {
                    start: startTime || 0,
                    end: endTime || Date.now(),
                },
                volumeAnalysis: {
                    total: 0,
                    averagePerSwap: 0,
                    largestSwap: 0,
                    swapCount: 0,
                },
                tokenAnalysis: {},
                priceImpact: {
                    average: 0,
                    highest: 0,
                    lowest: 0,
                },
                patterns: {
                    largeSwaps: [],
                    volumeSpikes: []
                }
            };

            // Process each flow
            let totalImpact = 0;
            flows.forEach(flow => {
                // Update volume metrics
                analysis.volumeAnalysis.total += flow.impact;
                analysis.volumeAnalysis.swapCount++;
                analysis.volumeAnalysis.largestSwap = Math.max(
                    analysis.volumeAnalysis.largestSwap,
                    flow.impact
                );

                // Track token flows
                this.updateTokenAnalysis(analysis, flow);

                // Track price impact
                totalImpact += flow.impact;
                analysis.priceImpact.highest = Math.max(
                    analysis.priceImpact.highest,
                    flow.impact
                );
                analysis.priceImpact.lowest = Math.min(
                    analysis.priceImpact.lowest,
                    flow.impact
                );

                // Detect significant events
                if (flow.impact >= this.LARGE_SWAP_THRESHOLD) {
                    analysis.patterns.largeSwaps.push({
                        timestamp: flow.timestamp,
                        amount: flow.impact,
                        impact: flow.impact,
                        txHash: flow.transactionHash
                    });
                }
            });

            // Calculate averages
            if (analysis.volumeAnalysis.swapCount > 0) {
                analysis.volumeAnalysis.averagePerSwap = 
                    analysis.volumeAnalysis.total / analysis.volumeAnalysis.swapCount;
                analysis.priceImpact.average = 
                    totalImpact / analysis.volumeAnalysis.swapCount;
            }

            // Detect volume spikes
            this.detectVolumeSpikes(analysis, flows);

            return analysis;
        } catch (error) {
            logger.error(`Error analyzing pool ${poolAddress}:`, error);
            throw error;
        }
    }

    private updateTokenAnalysis(analysis: LiquidityAnalysis, flow: any): void {
        // Process token1
        if (!analysis.tokenAnalysis[flow.token1.address]) {
            analysis.tokenAnalysis[flow.token1.address] = {
                netFlow: 0,
                inflow: 0,
                outflow: 0,
                swapCount: 0
            };
        }
        
        const token1Analysis = analysis.tokenAnalysis[flow.token1.address];
        token1Analysis.swapCount++;
        
        if (flow.eventType === 'ADD') {
            token1Analysis.inflow += flow.token1.amount;
            token1Analysis.netFlow += flow.token1.amount;
        } else if (flow.eventType === 'REMOVE') {
            token1Analysis.outflow += flow.token1.amount;
            token1Analysis.netFlow -= flow.token1.amount;
        }

        // Process token2 similarly
        if (!analysis.tokenAnalysis[flow.token2.address]) {
            analysis.tokenAnalysis[flow.token2.address] = {
                netFlow: 0,
                inflow: 0,
                outflow: 0,
                swapCount: 0
            };
        }

        const token2Analysis = analysis.tokenAnalysis[flow.token2.address];
        token2Analysis.swapCount++;
        
        if (flow.eventType === 'ADD') {
            token2Analysis.inflow += flow.token2.amount;
            token2Analysis.netFlow += flow.token2.amount;
        } else if (flow.eventType === 'REMOVE') {
            token2Analysis.outflow += flow.token2.amount;
            token2Analysis.netFlow -= flow.token2.amount;
        }
    }

    private detectVolumeSpikes(analysis: LiquidityAnalysis, flows: any[]): void {
        const WINDOW_SIZE = 3600000; // 1 hour in milliseconds
        const SPIKE_THRESHOLD = 2; // 2x average volume

        // Group flows by hour
        const hourlyVolumes = new Map<number, number>();
        
        flows.forEach(flow => {
            const hourKey = Math.floor(flow.timestamp / WINDOW_SIZE);
            const currentVolume = hourlyVolumes.get(hourKey) || 0;
            hourlyVolumes.set(hourKey, currentVolume + flow.impact);
        });

        // Calculate average hourly volume
        const volumes = Array.from(hourlyVolumes.values());
        const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;

        // Detect spikes
        hourlyVolumes.forEach((volume, hour) => {
            if (volume > avgVolume * SPIKE_THRESHOLD) {
                analysis.patterns.volumeSpikes.push({
                    timestamp: hour * WINDOW_SIZE,
                    volume: volume,
                    duration: WINDOW_SIZE
                });
            }
        });
    }

    public async getTopPools(limit: number = 10): Promise<any[]> {
        try {
            const pools = await this.storage.getTopPools(limit);
            
            // Enhance pool data with analytics
            const enhancedPools = await Promise.all(
                pools.map(async pool => {
                    const analysis = await this.analyzePoolActivity(
                        pool.poolAddress,
                        Date.now() - 86400000 // Last 24 hours
                    );
                    
                    return {
                        ...pool,
                        analysis: {
                            volume24h: analysis.volumeAnalysis.total,
                            swapCount24h: analysis.volumeAnalysis.swapCount,
                            averageImpact: analysis.priceImpact.average,
                            largeSwaps24h: analysis.patterns.largeSwaps.length
                        }
                    };
                })
            );

            return enhancedPools;
        } catch (error) {
            logger.error('Error getting top pools:', error);
            throw error;
        }
    }
}
