import { Injectable } from '@nestjs/common';
import { logger } from '../../../utils/logger';
import { FlowAnalyzer, FlowAnalysis } from '../analyzers/flow.analyzer';
import { ImpactCalculator, ImpactAnalysis } from '../analyzers/impact.calculator';
import { PatternDetector, PatternAnalysis } from '../analyzers/pattern.detector';
import { BalanceAnalyzer, BalanceAnalysis } from '../analyzers/balance.analyzer';
import { ProcessedActivity } from '../processors/activity.pipeline';
import { ActivityDatabase } from '../storage/activity.database';
import { DataValidatorService } from './data-validator.service';
import { DexService } from '../dex.service';

type TimeInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

interface TimeRange {
    start: number;
    end: number;
}

interface LiquidityFlow {
    tokenFlow: {
        inflow: number;
        outflow: number;
        netFlow: number;
        path: string[];
    };
    impact: {
        priceImpact: number;
        slippage: number;
        poolReserves: number;
        depth: number;
    };
    efficiency: {
        gasUsed: number;
        optimalPath: boolean;
    };
}

interface OHLCV {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    count: number;
}

interface PoolState {
    tradingPatterns: {
        type: string;
        confidence: number;
        indicators: string[];
    }[];
    anomalies: {
        detected: boolean;
        type?: string;
        severity: number;
        details: string;
    }[];
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    timeSeriesData?: {
        [interval: string]: OHLCV[];
    };
}

@Injectable()
export class DexAnalyticsService {
    private readonly flowAnalyzer: FlowAnalyzer;
    private readonly impactCalculator: ImpactCalculator;
    private readonly patternDetector: PatternDetector;
    private readonly balanceAnalyzer: BalanceAnalyzer;

    constructor(
        private readonly activityDatabase: ActivityDatabase,
        private readonly dataValidator: DataValidatorService,
        private readonly dexService: DexService
    ) {
        this.flowAnalyzer = new FlowAnalyzer();
        this.impactCalculator = new ImpactCalculator();
        this.patternDetector = new PatternDetector();
        this.balanceAnalyzer = new BalanceAnalyzer();
    }

    async getLiquidityFlows(
        poolAddress: string,
        startTime?: number,
        endTime?: number,
        interval: TimeInterval = '1h'
    ): Promise<{ success: boolean; data: OHLCV[] }> {
        if (!this.dataValidator.validatePoolAddress(poolAddress)) {
            throw new Error('Invalid pool address');
        }

        const timeRange: TimeRange = {
            start: startTime || Date.now() - 86400000, // Default to last 24 hours
            end: endTime || Date.now()
        };

        if (!this.dataValidator.validateTimeRange(timeRange.start, timeRange.end)) {
            throw new Error('Invalid time range');
        }

        try {
            const activities = await this.activityDatabase.getActivitiesByPool(
                poolAddress,
                timeRange.start,
                timeRange.end
            );

            if (!activities || activities.length === 0) {
                return { success: true, data: [] };
            }

            // Get time series data from activities
            const timeSeriesData = this.generateTimeSeriesData(activities, interval);
            return { success: true, data: timeSeriesData };
        } catch (error) {
            logger.error('Error in getLiquidityFlows:', error);
            throw new Error('Failed to analyze liquidity flows');
        }
    }

    private generateTimeSeriesData(activities: any[], interval: TimeInterval): OHLCV[] {
        const intervalMs = this.getIntervalDuration(interval);
        const candleMap = new Map<number, OHLCV>();

        activities.forEach(storedActivity => {
            const timestamp = Math.floor(storedActivity.timestamp / intervalMs) * intervalMs;
            const activity = storedActivity.activity;
            
            if (!activity.normalizedPath?.path?.[0]) {
                logger.warn(`Missing normalized path data for activity ${storedActivity.id}`);
                return;
            }

            const price = activity.normalizedPath.path[0].amount2.normalized / 
                         activity.normalizedPath.path[0].amount1.normalized;
            const volume = activity.normalizedPath.path[0].amount1.normalized;

            let candle = candleMap.get(timestamp);
            if (!candle) {
                candle = {
                    timestamp,
                    open: price,
                    high: price,
                    low: price,
                    close: price,
                    volume,
                    count: 1
                };
                candleMap.set(timestamp, candle);
            } else {
                candle.high = Math.max(candle.high, price);
                candle.low = Math.min(candle.low, price);
                candle.close = price;
                candle.volume += volume;
                candle.count += 1;
            }
        });

        return Array.from(candleMap.values()).sort((a, b) => a.timestamp - b.timestamp);
    }

    private getIntervalDuration(interval: TimeInterval): number {
        const durations = {
            '1m': 60 * 1000,
            '5m': 5 * 60 * 1000,
            '15m': 15 * 60 * 1000,
            '1h': 60 * 60 * 1000,
            '4h': 4 * 60 * 60 * 1000,
            '1d': 24 * 60 * 60 * 1000
        } as const;
        return durations[interval];
    }

    async getPoolState(poolAddress: string): Promise<{ success: boolean; data: PoolState }> {
        if (!this.dataValidator.validatePoolAddress(poolAddress)) {
            throw new Error('Invalid pool address');
        }

        const activities = await this.activityDatabase.getActivitiesByPool(
            poolAddress,
            Date.now() - 86400000,
            Date.now()
        );

        if (!activities || activities.length === 0) {
            return {
                success: true,
                data: {
                    tradingPatterns: [],
                    anomalies: [],
                    riskLevel: 'low',
                    riskFactors: [],
                    timeSeriesData: {
                        '1h': []
                    }
                }
            };
        }

        const patterns: PatternAnalysis[] = [];
        const flowAnalyses: FlowAnalysis[] = [];

        activities.forEach(storedActivity => {
            const activity = storedActivity.activity;
            const flowAnalysis = this.flowAnalyzer.analyzeFlow(activity);
            flowAnalyses.push(flowAnalysis);
            patterns.push(this.patternDetector.detectPatterns(activity, flowAnalysis));
        });

        // Generate time series data for different intervals
        const timeSeriesData = {
            '1h': this.generateTimeSeriesData(activities, '1h'),
            '4h': this.generateTimeSeriesData(activities, '4h'),
            '1d': this.generateTimeSeriesData(activities, '1d')
        };

        return {
            success: true,
            data: {
                tradingPatterns: patterns.map(p => p.tradingPattern),
                anomalies: patterns.map(p => p.anomaly),
                riskLevel: this.aggregateRiskLevel(patterns),
                riskFactors: this.aggregateRiskFactors(patterns),
                timeSeriesData
            }
        };
    }

    private aggregateRiskLevel(patterns: PatternAnalysis[]): 'low' | 'medium' | 'high' {
        const riskLevels = patterns.map(p => p.risk.level);
        if (riskLevels.includes('high')) return 'high';
        if (riskLevels.includes('medium')) return 'medium';
        return 'low';
    }

    private aggregateRiskFactors(patterns: PatternAnalysis[]): string[] {
        const factors = new Set<string>();
        patterns.forEach(p => p.risk.factors.forEach(f => factors.add(f)));
        return Array.from(factors);
    }

    async getBalanceAnalytics(address: string): Promise<{ success: boolean; data: BalanceAnalysis }> {
        if (!this.dataValidator.validateAddress(address)) {
            throw new Error('Invalid address');
        }

        try {
            // Get balance changes from service
            const changes = await this.dexService.getBalanceChanges({ address });
            
            if (!changes || changes.length === 0) {
                return {
                    success: true,
                    data: {
                        flowMetrics: {
                            totalInflow: 0,
                            totalOutflow: 0,
                            netFlow: 0,
                            flowCount: { inflow: 0, outflow: 0 }
                        },
                        tokenMetrics: {
                            uniqueTokens: [],
                            mostActive: { token: '', volume: 0 },
                            volumeByToken: {}
                        },
                        timeMetrics: {
                            firstActivity: 0,
                            lastActivity: 0,
                            averageInterval: 0,
                            peakVolume: { time: 0, volume: 0 }
                        },
                        riskMetrics: {
                            largeTransfers: {
                                count: 0,
                                threshold: 1000,
                                transactions: []
                            },
                            volatility: 0,
                            unusualPatterns: []
                        }
                    }
                };
            }

            // Analyze balance changes
            const analysis = this.balanceAnalyzer.analyzeBalanceChanges(changes);
            return { success: true, data: analysis };
        } catch (error) {
            logger.error('Error in getBalanceAnalytics:', error);
            throw new Error('Failed to analyze balance changes');
        }
    }
}