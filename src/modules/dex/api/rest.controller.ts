import { Controller, Get, Query, Param } from '@nestjs/common';
import { ActivityDatabase } from '../storage/activity.database';
import { PoolStateDatabase } from '../storage/pool.state.database';
import { CacheLayer } from '../storage/cache.layer';
import { logger } from '../../../utils/logger';

@Controller('dex')
export class DexRestController {
    constructor(
        private readonly activityDatabase: ActivityDatabase,
        private readonly poolStateDatabase: PoolStateDatabase,
        private readonly cacheLayer: CacheLayer
    ) {}

    @Get('activities/:id')
    async getActivity(@Param('id') id: string) {
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

    @Get('activities')
    async getActivitiesByPool(
        @Query('pool') poolAddress: string,
        @Query('startTime') startTime?: number,
        @Query('endTime') endTime?: number
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

    @Get('pools/:address')
    async getPoolState(@Param('address') address: string) {
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

    @Get('pools/:address/metrics')
    async getPoolMetrics(@Param('address') address: string) {
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

    @Get('pools/top/volume')
    async getTopPoolsByVolume(@Query('limit') limit: number = 10) {
        try {
            return await this.poolStateDatabase.getTopPoolsByVolume(limit);
        } catch (error) {
            logger.error('Error getting top pools by volume:', error);
            throw error;
        }
    }

    @Get('pools/top/liquidity')
    async getTopPoolsByLiquidity(@Query('limit') limit: number = 10) {
        try {
            return await this.poolStateDatabase.getTopPoolsByLiquidity(limit);
        } catch (error) {
            logger.error('Error getting top pools by liquidity:', error);
            throw error;
        }
    }

    @Get('pools/:address/history')
    async getPoolHistory(
        @Param('address') address: string,
        @Query('startTime') startTime?: number,
        @Query('endTime') endTime?: number
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
} 