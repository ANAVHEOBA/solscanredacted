import { LiquidityFlow, ILiquidityFlow, PoolState, IPoolState } from '../models/liquidity.model';
import { ActivityData } from '../interfaces/analytics.interface';
import { logger } from '../../../utils/logger';

interface TimeWindow {
    interval: string;
    duration: number;
}

const TIME_WINDOWS: TimeWindow[] = [
    { interval: '1m', duration: 60 * 1000 },
    { interval: '5m', duration: 5 * 60 * 1000 },
    { interval: '15m', duration: 15 * 60 * 1000 },
    { interval: '1h', duration: 60 * 60 * 1000 },
    { interval: '4h', duration: 4 * 60 * 60 * 1000 },
    { interval: '1d', duration: 24 * 60 * 60 * 1000 }
];

export class LiquidityStorageService {
    constructor() {}

    async storeLiquidityFlow(activity: ActivityData, impact: number): Promise<ILiquidityFlow> {
        try {
            const eventType = this.determineEventType(activity.activity_type);
            const amount1 = parseFloat(activity.amount_info.amount1);
            const amount2 = parseFloat(activity.amount_info.amount2);
            
            const liquidityFlow = new LiquidityFlow({
                poolAddress: activity.amount_info.routers[0].pool_address,
                timestamp: activity.block_time,
                eventType,
                token1: {
                    address: activity.amount_info.token1,
                    amount: amount1,
                    decimals: activity.amount_info.token1_decimals,
                    value: amount1 // You might want to calculate actual USD value
                },
                token2: {
                    address: activity.amount_info.token2,
                    amount: amount2,
                    decimals: activity.amount_info.token2_decimals,
                    value: amount2 // You might want to calculate actual USD value
                },
                transactionHash: activity.trans_id,
                blockNumber: activity.block_id,
                fromAddress: activity.from_address,
                impact
            });

            await liquidityFlow.save();
            await this.updatePoolState(activity);
            
            return liquidityFlow;
        } catch (error) {
            logger.error('Error storing liquidity flow:', error);
            throw error;
        }
    }

    private determineEventType(activityType: string): 'ADD' | 'REMOVE' | 'SWAP' {
        switch (activityType) {
            case 'ACTIVITY_TOKEN_ADD_LIQ':
                return 'ADD';
            case 'ACTIVITY_TOKEN_REMOVE_LIQ':
                return 'REMOVE';
            default:
                return 'SWAP';
        }
    }

    async updatePoolState(activity: ActivityData): Promise<IPoolState> {
        const poolAddress = activity.amount_info.routers[0].pool_address;
        const timestamp = activity.block_time;
        const amount1 = parseFloat(activity.amount_info.amount1);
        const amount2 = parseFloat(activity.amount_info.amount2);
        
        try {
            let poolState = await PoolState.findOne({ poolAddress });
            
            if (!poolState) {
                poolState = new PoolState({
                    poolAddress,
                    lastUpdated: timestamp,
                    totalLiquidity: 0,
                    token1: {
                        address: activity.amount_info.token1,
                        amount: 0,
                        decimals: activity.amount_info.token1_decimals,
                        value: 0
                    },
                    token2: {
                        address: activity.amount_info.token2,
                        amount: 0,
                        decimals: activity.amount_info.token2_decimals,
                        value: 0
                    },
                    volume24h: 0,
                    txCount24h: 0,
                    timeSeriesData: {
                        '1m': [],
                        '5m': [],
                        '15m': [],
                        '1h': [],
                        '4h': [],
                        '1d': []
                    }
                });
            }

            // Update pool metrics
            this.updatePoolMetrics(poolState, activity);

            // Update time series data for each window
            for (const window of TIME_WINDOWS) {
                await this.updateTimeSeriesData(
                    poolState,
                    window,
                    timestamp,
                    amount1,
                    amount2
                );
            }

            await poolState.save();
            return poolState;
        } catch (error) {
            logger.error('Error updating pool state:', error);
            throw error;
        }
    }

    private async updateTimeSeriesData(
        poolState: IPoolState,
        window: TimeWindow,
        timestamp: number,
        amount1: number,
        amount2: number
    ): Promise<void> {
        const volume = amount1 + amount2;
        const price = amount2 / amount1;
        const timeWindow = poolState.timeSeriesData[window.interval];
        
        // Find or create the current candle
        const candleTimestamp = Math.floor(timestamp / window.duration) * window.duration;
        let currentCandle = timeWindow.find(c => c.timestamp === candleTimestamp);

        if (!currentCandle) {
            currentCandle = {
                timestamp: candleTimestamp,
                open: price,
                high: price,
                low: price,
                close: price,
                volume: volume,
                count: 1
            };
            timeWindow.push(currentCandle);
        } else {
            currentCandle.high = Math.max(currentCandle.high, price);
            currentCandle.low = Math.min(currentCandle.low, price);
            currentCandle.close = price;
            currentCandle.volume += volume;
            currentCandle.count += 1;
        }

        // Sort and limit the number of candles
        timeWindow.sort((a, b) => b.timestamp - a.timestamp);
        const maxCandles = {
            '1m': 1440,  // 1 day
            '5m': 1440,  // 5 days
            '15m': 1440, // 15 days
            '1h': 720,   // 30 days
            '4h': 720,   // 120 days
            '1d': 365    // 1 year
        };

        if (timeWindow.length > maxCandles[window.interval]) {
            timeWindow.length = maxCandles[window.interval];
        }
    }

    private updatePoolMetrics(poolState: IPoolState, activity: ActivityData): void {
        poolState.lastUpdated = activity.block_time;
        
        // Parse amounts as numbers
        const amount1 = parseFloat(activity.amount_info.amount1);
        const amount2 = parseFloat(activity.amount_info.amount2);
        
        // Update token amounts based on activity type
        if (activity.activity_type === 'ACTIVITY_TOKEN_ADD_LIQ') {
            poolState.token1.amount += amount1;
            poolState.token2.amount += amount2;
        } else if (activity.activity_type === 'ACTIVITY_TOKEN_REMOVE_LIQ') {
            poolState.token1.amount -= amount1;
            poolState.token2.amount -= amount2;
        }

        // Update volume and transaction count
        // For swaps, we only count the actual traded amount
        if (activity.activity_type.includes('SWAP')) {
            poolState.volume24h += amount1;
        } else {
            // For liquidity changes, we count both tokens
            poolState.volume24h += amount1 + amount2;
        }
        poolState.txCount24h += 1;

        // Calculate total liquidity considering decimals
        const token1Value = poolState.token1.amount * Math.pow(10, -activity.amount_info.token1_decimals);
        const token2Value = poolState.token2.amount * Math.pow(10, -activity.amount_info.token2_decimals);
        poolState.totalLiquidity = token1Value + token2Value;
    }

    async getLiquidityFlows(
        poolAddress: string,
        startTime?: number,
        endTime?: number,
        interval: string = '1h'
    ): Promise<any[]> {
        const poolState = await PoolState.findOne({ poolAddress });
        if (!poolState || !poolState.timeSeriesData[interval]) {
            return [];
        }

        let timeSeriesData = poolState.timeSeriesData[interval];
        
        if (startTime) {
            timeSeriesData = timeSeriesData.filter(d => d.timestamp >= startTime);
        }
        if (endTime) {
            timeSeriesData = timeSeriesData.filter(d => d.timestamp <= endTime);
        }

        return timeSeriesData.sort((a, b) => a.timestamp - b.timestamp);
    }

    async getPoolState(poolAddress: string): Promise<IPoolState | null> {
        return PoolState.findOne({ poolAddress });
    }

    async getTopPools(limit: number = 10): Promise<IPoolState[]> {
        return PoolState.find()
            .sort({ totalLiquidity: -1 })
            .limit(limit);
    }
} 