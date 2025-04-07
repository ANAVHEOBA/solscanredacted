import { EventEmitter } from 'events';
import { 
    ActivityData,
    LiquidityMetrics,
    LiquidityChange,
    TimeFrames,
    RouterInfo as ActivityRouterInfo,
    RoutersContainer,
    DirectRouterInfo
} from '../interfaces/analytics.interface';
import { LIQUIDITY_THRESHOLDS } from '../constants/thresholds';
import { LiquidityStorageService } from '../services/liquidity.storage';
import { logger } from '../../../utils/logger';

interface RouterInfo {
    pool_address: string;
    amount1: string;
    amount2: string;
    token1: string;
    token2: string;
    token1_decimals: number;
    token2_decimals: number;
}

export class StreamProcessor extends EventEmitter {
    private activityBuffer: Map<string, ActivityData[]> = new Map();
    private metricsCache: Map<string, LiquidityMetrics> = new Map();
    private processingIntervals: Map<string, NodeJS.Timeout> = new Map();
    private liquidityStorage: LiquidityStorageService;
    private minSignificantValue: number;

    constructor() {
        super();
        this.liquidityStorage = new LiquidityStorageService();
        this.minSignificantValue = LIQUIDITY_THRESHOLDS.MIN_SIGNIFICANT_VALUE;
    }

    public startProcessing(poolAddress: string): void {
        if (this.processingIntervals.has(poolAddress)) {
            return;
        }

        // Initialize buffer for this pool
        this.activityBuffer.set(poolAddress, []);

        // Set up interval to process buffered activities
        const interval = setInterval(() => {
            this.processPoolActivities(poolAddress);
        }, TimeFrames.SHORT_TERM);

        this.processingIntervals.set(poolAddress, interval);

        // Load initial pool state
        this.loadPoolState(poolAddress);
    }

    private async loadPoolState(poolAddress: string): Promise<void> {
        try {
            const poolState = await this.liquidityStorage.getPoolState(poolAddress);
            if (poolState) {
                this.metricsCache.set(poolAddress, {
                    poolAddress: poolState.poolAddress,
                    timestamp: poolState.lastUpdated,
                    totalLiquidity: poolState.totalLiquidity,
                    token1: poolState.token1,
                    token2: poolState.token2,
                    holderCount: 0,
                    volume24h: poolState.volume24h
                });
            }
        } catch (error) {
            logger.error(`Error loading pool state for ${poolAddress}:`, error);
        }
    }

    public stopProcessing(poolAddress: string): void {
        const interval = this.processingIntervals.get(poolAddress);
        if (interval) {
            clearInterval(interval);
            this.processingIntervals.delete(poolAddress);
            this.activityBuffer.delete(poolAddress);
            this.metricsCache.delete(poolAddress);
        }
    }

    public async processActivity(activity: ActivityData): Promise<void> {
        try {
            // Validate activity structure
            if (!this.isValidActivity(activity)) {
                logger.warn(`Invalid activity structure: ${JSON.stringify(activity)}`);
                return;
            }

            // For direct swaps, wrap the router in an array
            let routers: RouterInfo[] = [];
            if (Array.isArray(activity.amount_info.routers)) {
                routers = activity.amount_info.routers.map(r => ({
                    ...r,
                    amount1: r.amount1.toString(),
                    amount2: r.amount2.toString()
                }));
            } else if (activity.amount_info.routers.child_routers?.length > 0) {
                // For aggregated swaps, use child_routers
                routers = activity.amount_info.routers.child_routers.map(r => ({
                    ...r,
                    amount1: r.amount1.toString(),
                    amount2: r.amount2.toString()
                }));
            } else {
                // For direct swaps with no child_routers
                const router = activity.amount_info.routers;
                routers = [{
                    pool_address: router.pool_address,
                    amount1: router.amount1.toString(),
                    amount2: router.amount2.toString(),
                    token1: router.token1,
                    token2: router.token2,
                    token1_decimals: router.token1_decimals,
                    token2_decimals: router.token2_decimals,
                }];
            }

            // Process each router
            for (const router of routers) {
                const poolAddress = router.pool_address;
                if (!this.processingIntervals.has(poolAddress)) {
                    continue;
                }

                try {
                    // Create activity with router-specific data
                    const routerActivity: ActivityData = {
                        ...activity,
                        amount_info: {
                            ...activity.amount_info,
                            amount1: router.amount1,
                            amount2: router.amount2,
                            token1: router.token1,
                            token2: router.token2,
                            token1_decimals: router.token1_decimals,
                            token2_decimals: router.token2_decimals,
                            routers: [router]
                        }
                    };

                    // Calculate impact
                    const impact = this.calculateImpact(routerActivity, poolAddress);
                    
                    // Store in database
                    await this.liquidityStorage.storeLiquidityFlow(routerActivity, impact);

                    // Add to buffer for real-time processing
                    const buffer = this.activityBuffer.get(poolAddress) || [];
                    buffer.push(routerActivity);
                    this.activityBuffer.set(poolAddress, buffer);

                    // Emit event for significant changes
                    if (impact >= LIQUIDITY_THRESHOLDS.LOW_CHANGE_PERCENTAGE) {
                        this.emit('liquidityChange', {
                            poolAddress,
                            change: this.calculateLiquidityChange(routerActivity, poolAddress),
                            impactPercentage: impact,
                            timestamp: Date.now()
                        });
                    }

                    // Trigger immediate processing if significant
                    if (this.isSignificantChange(routerActivity)) {
                        await this.processPoolActivities(poolAddress);
                    }
                } catch (error) {
                    logger.error(`Error processing router activity for pool ${poolAddress}:`, error);
                }
            }
        } catch (error) {
            logger.error('Error in processActivity:', error);
        }
    }

    private extractRoutersFromActivity(activity: ActivityData): RouterInfo[] {
        const routers = activity.amount_info.routers;
        
        // Handle direct swap case (routers is an object with no child_routers)
        if (!Array.isArray(routers) && !('child_routers' in routers)) {
            const directRouter = routers as DirectRouterInfo;
            return [{
                pool_address: directRouter.pool_address,
                amount1: directRouter.amount1.toString(),
                amount2: directRouter.amount2.toString(),
                token1: directRouter.token1,
                token2: directRouter.token2,
                token1_decimals: directRouter.token1_decimals,
                token2_decimals: directRouter.token2_decimals
            }];
        }

        // Handle aggregated swap case (routers has child_routers)
        if (!Array.isArray(routers) && 'child_routers' in routers) {
            const container = routers as RoutersContainer;
            return container.child_routers.map(r => ({
                pool_address: r.pool_address,
                amount1: r.amount1.toString(),
                amount2: r.amount2.toString(),
                token1: r.token1,
                token2: r.token2,
                token1_decimals: r.token1_decimals,
                token2_decimals: r.token2_decimals
            }));
        }

        // Handle array case
        return routers.map(r => ({
            pool_address: r.pool_address,
            amount1: r.amount1.toString(),
            amount2: r.amount2.toString(),
            token1: r.token1,
            token2: r.token2,
            token1_decimals: r.token1_decimals,
            token2_decimals: r.token2_decimals
        }));
    }

    private isValidActivity(activity: ActivityData): boolean {
        try {
            // Basic field validation
            if (!activity.activity_type || !activity.block_id || !activity.from_address) {
                logger.debug('Missing basic fields');
                return false;
            }

            // Platform can be string or array
            if (!activity.platform || (
                !Array.isArray(activity.platform) && typeof activity.platform !== 'string'
            )) {
                logger.debug('Invalid platform format');
                return false;
            }

            // Validate amount_info exists
            if (!activity.amount_info) {
                logger.debug('Missing amount_info');
                return false;
            }

            // Validate routers structure
            const routers = activity.amount_info.routers;
            if (!routers) {
                logger.debug('Missing routers');
                return false;
            }

            // Handle direct swap case (routers is an object with no child_routers)
            if (!Array.isArray(routers) && !('child_routers' in routers)) {
                return this.isValidRouterInfo(routers);
            }

            // Handle aggregated swap case (routers has child_routers)
            if (!Array.isArray(routers) && 'child_routers' in routers) {
                return routers.child_routers.length > 0 && 
                       routers.child_routers.every(r => this.isValidRouterInfo(r));
            }

            // Handle array case
            if (Array.isArray(routers)) {
                return routers.length > 0 && routers.every(r => this.isValidRouterInfo(r));
            }

            return false;
        } catch (error) {
            logger.warn(`Error validating activity: ${error}`);
            return false;
        }
    }

    private isValidRouterInfo(router: ActivityRouterInfo | (RoutersContainer & DirectRouterInfo)): boolean {
        return Boolean(
            router &&
            router.amount1 !== undefined &&
            router.amount2 !== undefined &&
            router.token1 &&
            router.token2 &&
            typeof router.token1_decimals === 'number' &&
            typeof router.token2_decimals === 'number'
        );
    }

    private async processPoolActivities(poolAddress: string): Promise<void> {
        const activities = this.activityBuffer.get(poolAddress) || [];
        if (activities.length === 0) return;

        try {
            // Get latest metrics
            const currentMetrics = this.metricsCache.get(poolAddress);
            
            // Process each activity
            for (const activity of activities) {
                const change = this.calculateLiquidityChange(activity, poolAddress);
                if (change && currentMetrics) {
                    // Calculate impact
                    const impactPercentage = this.calculateImpact(activity, poolAddress);
                    
                    // Store the processed activity
                    await this.liquidityStorage.storeLiquidityFlow(activity, impactPercentage);
                }
            }

            // Clear processed activities
            this.activityBuffer.set(poolAddress, []);

            // Update cache with latest pool state
            await this.loadPoolState(poolAddress);

        } catch (error) {
            logger.error(`Error processing activities for pool ${poolAddress}:`, error);
        }
    }

    private calculateLiquidityChange(activity: ActivityData, poolAddress: string): LiquidityChange | null {
        const router = this.extractRoutersFromActivity(activity)
            .find((r: RouterInfo) => r.pool_address === poolAddress);
            
        if (!router) return null;

        return {
            poolAddress,
            timestamp: new Date(activity.time).getTime(),
            changeType: this.determineChangeType(activity.activity_type),
            token1Change: {
                amount: Number(router.amount1),
                value: Number(router.amount1)
            },
            token2Change: {
                amount: Number(router.amount2),
                value: Number(router.amount2)
            },
            impactScore: 0,
            transactionHash: activity.trans_id
        };
    }

    private determineChangeType(activityType: string): 'ADD' | 'REMOVE' | 'SWAP' {
        switch (activityType) {
            case 'ACTIVITY_TOKEN_ADD_LIQ':
                return 'ADD';
            case 'ACTIVITY_TOKEN_REMOVE_LIQ':
                return 'REMOVE';
            default:
                return 'SWAP';
        }
    }

    private calculateImpact(activity: ActivityData, poolAddress: string): number {
        const metrics = this.metricsCache.get(poolAddress);
        if (!metrics || metrics.totalLiquidity === 0) return 0;

        const router = this.extractRoutersFromActivity(activity)
            .find((r: RouterInfo) => r.pool_address === poolAddress);
        
        if (!router) return 0;

        // Parse amounts and adjust for decimals
        const amount1 = parseFloat(router.amount1) * Math.pow(10, -router.token1_decimals);
        const amount2 = parseFloat(router.amount2) * Math.pow(10, -router.token2_decimals);
        
        // Calculate total value of the change
        const changeValue = amount1 + amount2;
        
        // Calculate impact as a percentage of total liquidity
        return (changeValue / metrics.totalLiquidity) * 100;
    }

    private isSignificantChange(activity: ActivityData): boolean {
        // Parse amounts and adjust for decimals
        const amount1 = parseFloat(activity.amount_info.amount1) * Math.pow(10, -activity.amount_info.token1_decimals);
        const amount2 = parseFloat(activity.amount_info.amount2) * Math.pow(10, -activity.amount_info.token2_decimals);
        
        const totalAmount = amount1 + amount2;
        
        // Check if the total amount is valid and meets minimum threshold
        return !isNaN(totalAmount) && totalAmount >= this.minSignificantValue;
    }

    public updateMetrics(poolAddress: string, metrics: LiquidityMetrics): void {
        this.metricsCache.set(poolAddress, metrics);
    }
}

