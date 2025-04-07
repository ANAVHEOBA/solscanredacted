import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ActivityDatabase } from '../storage/activity.database';
import { PoolStateDatabase } from '../storage/pool.state.database';
import { CacheLayer } from '../storage/cache.layer';
import { logger } from '../../../utils/logger';

@Resolver('DexActivity')
export class DexActivityResolver {
    constructor(
        private readonly activityDatabase: ActivityDatabase,
        private readonly cacheLayer: CacheLayer
    ) {}

    @Query()
    async activity(@Args('id') id: string) {
        try {
            // Try cache first
            const cached = await this.cacheLayer.getActivity(id);
            if (cached) {
                return cached;
            }

            // If not in cache, get from database
            const activity = await this.activityDatabase.getActivity(id);
            if (activity) {
                // Cache the result
                await this.cacheLayer.setActivity(id, activity);
            }
            return activity;
        } catch (error) {
            logger.error('Error getting activity:', error);
            throw error;
        }
    }

    @Query()
    async activitiesByPool(
        @Args('poolAddress') poolAddress: string,
        @Args('startTime') startTime?: number,
        @Args('endTime') endTime?: number
    ) {
        try {
            return await this.activityDatabase.getActivitiesByPool(
                poolAddress,
                startTime,
                endTime
            );
        } catch (error) {
            logger.error('Error getting activities by pool:', error);
            throw error;
        }
    }

    @ResolveField()
    async flowAnalysis(@Parent() activity: any) {
        return activity.flowAnalysis;
    }

    @ResolveField()
    async patternAnalysis(@Parent() activity: any) {
        return activity.patternAnalysis;
    }

    @ResolveField()
    async impactAnalysis(@Parent() activity: any) {
        return activity.impactAnalysis;
    }
}

@Resolver('DexPool')
export class DexPoolResolver {
    constructor(
        private readonly poolStateDatabase: PoolStateDatabase,
        private readonly cacheLayer: CacheLayer
    ) {}

    @Query()
    async pool(@Args('address') address: string) {
        try {
            // Try cache first
            const cached = await this.cacheLayer.getPoolState(address);
            if (cached) {
                return cached;
            }

            // If not in cache, get from database
            const state = await this.poolStateDatabase.getPoolState(address);
            if (state) {
                // Cache the result
                await this.cacheLayer.setPoolState(address, state);
            }
            return state;
        } catch (error) {
            logger.error('Error getting pool state:', error);
            throw error;
        }
    }

    @Query()
    async poolMetrics(@Args('address') address: string) {
        try {
            // Try cache first
            const cached = await this.cacheLayer.getPoolMetrics(address);
            if (cached) {
                return cached;
            }

            // If not in cache, get from database
            const metrics = await this.poolStateDatabase.getPoolMetrics(address);
            if (metrics) {
                // Cache the result
                await this.cacheLayer.setPoolMetrics(address, metrics);
            }
            return metrics;
        } catch (error) {
            logger.error('Error getting pool metrics:', error);
            throw error;
        }
    }

    @Query()
    async topPoolsByVolume(@Args('limit') limit: number = 10) {
        try {
            return await this.poolStateDatabase.getTopPoolsByVolume(limit);
        } catch (error) {
            logger.error('Error getting top pools by volume:', error);
            throw error;
        }
    }

    @Query()
    async topPoolsByLiquidity(@Args('limit') limit: number = 10) {
        try {
            return await this.poolStateDatabase.getTopPoolsByLiquidity(limit);
        } catch (error) {
            logger.error('Error getting top pools by liquidity:', error);
            throw error;
        }
    }

    @Query()
    async poolHistory(
        @Args('address') address: string,
        @Args('startTime') startTime?: number,
        @Args('endTime') endTime?: number
    ) {
        try {
            return await this.poolStateDatabase.getPoolHistory(
                address,
                startTime,
                endTime
            );
        } catch (error) {
            logger.error('Error getting pool history:', error);
            throw error;
        }
    }

    @ResolveField()
    async token1(@Parent() pool: any) {
        return pool.token1;
    }

    @ResolveField()
    async token2(@Parent() pool: any) {
        return pool.token2;
    }

    @ResolveField()
    async metrics(@Parent() pool: any) {
        return this.poolMetrics(pool.address);
    }
} 