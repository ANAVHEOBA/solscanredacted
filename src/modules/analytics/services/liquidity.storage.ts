import { LiquidityFlow, ILiquidityFlow, PoolState, IPoolState } from '../models/liquidity.model';
import { ActivityData } from '../interfaces/analytics.interface';
import { logger } from '../../../utils/logger';

export class LiquidityStorageService {
    constructor() {}

    async storeLiquidityFlow(activity: ActivityData, impact: number): Promise<ILiquidityFlow> {
        try {
            const eventType = this.determineEventType(activity.activity_type);
            
            const liquidityFlow = new LiquidityFlow({
                poolAddress: activity.amount_info.routers[0].pool_address,
                timestamp: activity.block_time,
                eventType,
                token1: {
                    address: activity.amount_info.token1,
                    amount: activity.amount_info.amount1,
                    decimals: activity.amount_info.token1_decimals,
                    value: activity.amount_info.amount1, // You might want to calculate actual USD value
                },
                token2: {
                    address: activity.amount_info.token2,
                    amount: activity.amount_info.amount2,
                    decimals: activity.amount_info.token2_decimals,
                    value: activity.amount_info.amount2, // You might want to calculate actual USD value
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
        
        try {
            let poolState = await PoolState.findOne({ poolAddress });
            
            if (!poolState) {
                poolState = new PoolState({
                    poolAddress,
                    lastUpdated: activity.block_time,
                    totalLiquidity: 0, // Initial value, should be calculated
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
                    txCount24h: 0
                });
            }

            // Update pool state based on activity type
            this.updatePoolMetrics(poolState, activity);
            await poolState.save();

            return poolState;
        } catch (error) {
            logger.error('Error updating pool state:', error);
            throw error;
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
        eventType?: 'ADD' | 'REMOVE' | 'SWAP'
    ): Promise<ILiquidityFlow[]> {
        const query: any = { poolAddress };
        
        if (startTime || endTime) {
            query.timestamp = {};
            if (startTime) query.timestamp.$gte = startTime;
            if (endTime) query.timestamp.$lte = endTime;
        }
        
        if (eventType) {
            query.eventType = eventType;
        }

        return LiquidityFlow.find(query)
            .sort({ timestamp: -1 })
            .limit(100);
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