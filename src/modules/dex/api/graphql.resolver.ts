import { Resolver, Query, Args, ResolveField, Parent, ID, ObjectType, Field } from '@nestjs/graphql';
import { ActivityDatabase, StoredActivity as DbStoredActivity } from '../storage/activity.database';
import { PoolStateDatabase, PoolState as DbPoolState, PoolMetrics as DbPoolMetrics } from '../storage/pool.state.database';
import { CacheLayer } from '../storage/cache.layer';
import { logger } from '../../../utils/logger';
import { StoredActivity, FlowAnalysis, PatternAnalysis, ImpactAnalysis, PoolState, PoolMetrics } from '../interfaces/dex-collector.interface';

@ObjectType()
class ActivityResponse {
    @Field(type => ID)
    id!: string;

    @Field(type => String)
    poolAddress!: string;

    @Field(type => String)
    type!: string;

    @Field(type => Number)
    timestamp!: number;

    @Field(type => FlowAnalysis)
    flowAnalysis!: FlowAnalysis;

    @Field(type => PatternAnalysis)
    patternAnalysis!: PatternAnalysis;

    @Field(type => ImpactAnalysis)
    impactAnalysis!: ImpactAnalysis;
}

@ObjectType()
class PoolResponse implements Partial<PoolState> {
    @Field(type => ID)
    address!: string;

    @Field(type => String)
    token1!: string;

    @Field(type => String)
    token2!: string;

    @Field(type => Number)
    lastUpdate!: number;

    @Field(type => PoolMetrics)
    metrics!: PoolMetrics;
}

@Resolver(() => ActivityResponse)
export class DexActivityResolver {
    constructor(
        private readonly activityDatabase: ActivityDatabase,
        private readonly cacheLayer: CacheLayer
    ) {}

    @Query(() => ActivityResponse, { 
        name: 'activity', 
        nullable: true,
        description: 'Get a single activity by ID'
    })
    async getActivity(
        @Args('id', { type: () => ID, description: 'Activity ID' }) id: string
    ): Promise<ActivityResponse | undefined> {
        try {
            const cached = await this.cacheLayer.getActivity(id);
            if (cached) {
                return this.mapToGraphQLActivity(cached);
            }

            const activity = await this.activityDatabase.getActivity(id);
            if (activity) {
                await this.cacheLayer.setActivity(id, activity);
                return this.mapToGraphQLActivity(activity);
            }
            return undefined;
        } catch (error) {
            logger.error('Error getting activity:', error);
            throw error;
        }
    }

    @Query(() => [ActivityResponse], { 
        name: 'activitiesByPool',
        description: 'Get activities for a specific pool'
    })
    async getActivitiesByPool(
        @Args('poolAddress', { type: () => String, description: 'Pool address' }) poolAddress: string,
        @Args('startTime', { type: () => Number, nullable: true, description: 'Start timestamp' }) startTime?: number,
        @Args('endTime', { type: () => Number, nullable: true, description: 'End timestamp' }) endTime?: number
    ): Promise<ActivityResponse[]> {
        try {
            const activities = await this.activityDatabase.getActivitiesByPool(
                poolAddress,
                startTime,
                endTime
            );
            return activities.map(activity => this.mapToGraphQLActivity(activity));
        } catch (error) {
            logger.error('Error getting activities by pool:', error);
            throw error;
        }
    }

    @ResolveField('flowAnalysis', () => FlowAnalysis, {
        description: 'Get flow analysis for this activity'
    })
    async getFlowAnalysis(@Parent() activity: ActivityResponse): Promise<FlowAnalysis> {
        return activity.flowAnalysis;
    }

    @ResolveField('patternAnalysis', () => PatternAnalysis, {
        description: 'Get pattern analysis for this activity'
    })
    async getPatternAnalysis(@Parent() activity: ActivityResponse): Promise<PatternAnalysis> {
        return activity.patternAnalysis;
    }

    @ResolveField('impactAnalysis', () => ImpactAnalysis, {
        description: 'Get impact analysis for this activity'
    })
    async getImpactAnalysis(@Parent() activity: ActivityResponse): Promise<ImpactAnalysis> {
        return activity.impactAnalysis;
    }

    private mapToGraphQLActivity(dbActivity: DbStoredActivity): ActivityResponse {
        return {
            id: dbActivity.id,
            poolAddress: dbActivity.metadata.poolAddress,
            type: dbActivity.activity.parsed.activityType,
            timestamp: dbActivity.timestamp,
            flowAnalysis: {
                inputToken: dbActivity.flowAnalysis.tokenFlow.inputToken,
                outputToken: dbActivity.flowAnalysis.tokenFlow.outputToken,
                inputAmount: dbActivity.flowAnalysis.tokenFlow.inputAmount,
                outputAmount: dbActivity.flowAnalysis.tokenFlow.outputAmount,
                path: dbActivity.flowAnalysis.tokenFlow.path
            },
            patternAnalysis: {
                type: dbActivity.patternAnalysis.tradingPattern.type,
                confidence: dbActivity.patternAnalysis.tradingPattern.confidence,
                description: dbActivity.patternAnalysis.anomaly.details
            },
            impactAnalysis: {
                priceImpact: dbActivity.impactAnalysis.marketImpact.priceImpact,
                volumeImpact: dbActivity.impactAnalysis.liquidityImpact.depth,
                severity: dbActivity.patternAnalysis.anomaly.severity > 0.66 ? 'high' :
                         dbActivity.patternAnalysis.anomaly.severity > 0.33 ? 'medium' : 'low'
            }
        };
    }
}

@Resolver(() => PoolResponse)
export class DexPoolResolver {
    constructor(
        private readonly poolStateDatabase: PoolStateDatabase,
        private readonly cacheLayer: CacheLayer
    ) {}

    @Query(() => PoolResponse, { 
        name: 'pool', 
        nullable: true,
        description: 'Get pool information by address'
    })
    async getPool(
        @Args('address', { type: () => String, description: 'Pool address' }) address: string
    ): Promise<PoolResponse | undefined> {
        try {
            const cached = await this.cacheLayer.getPoolState(address);
            if (cached) {
                return this.mapToGraphQLPool(cached);
            }

            const state = await this.poolStateDatabase.getPoolState(address);
            if (state) {
                await this.cacheLayer.setPoolState(address, state);
                return this.mapToGraphQLPool(state);
            }
            return undefined;
        } catch (error) {
            logger.error('Error getting pool state:', error);
            throw error;
        }
    }

    @Query(() => PoolMetrics, { 
        name: 'poolMetrics', 
        nullable: true,
        description: 'Get metrics for a pool'
    })
    async getPoolMetrics(
        @Args('address', { type: () => String, description: 'Pool address' }) address: string
    ): Promise<PoolMetrics | undefined> {
        try {
            const cached = await this.cacheLayer.getPoolMetrics(address);
            if (cached) {
                return this.mapToGraphQLMetrics(cached);
            }

            const metrics = await this.poolStateDatabase.getPoolMetrics(address);
            if (metrics) {
                await this.cacheLayer.setPoolMetrics(address, metrics);
                return this.mapToGraphQLMetrics(metrics);
            }
            return undefined;
        } catch (error) {
            logger.error('Error getting pool metrics:', error);
            throw error;
        }
    }

    private mapToGraphQLPool(dbPool: DbPoolState): PoolResponse {
        return {
            address: dbPool.address,
            token1: dbPool.token1.address,
            token2: dbPool.token2.address,
            lastUpdate: dbPool.timestamp,
            metrics: this.mapToGraphQLMetrics(dbPool)
        };
    }

    private mapToGraphQLMetrics(dbMetrics: DbPoolMetrics | DbPoolState): PoolMetrics {
        if ('metrics' in dbMetrics) {
            // It's a PoolMetrics object
            return {
                volume24h: dbMetrics.metrics.volume,
                tvl: dbMetrics.metrics.liquidity,
                apy: 0, // Calculate APY if available
                swapCount: 0 // Add swap count if available
            };
        } else {
            // It's a PoolState object
            return {
                volume24h: dbMetrics.volume24h,
                tvl: dbMetrics.liquidity,
                apy: 0, // Calculate APY if available
                swapCount: 0 // Add swap count if available
            };
        }
    }
} 