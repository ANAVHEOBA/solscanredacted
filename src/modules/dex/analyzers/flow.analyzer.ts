import { ProcessedActivity } from '../processors/activity.pipeline';
import { logger } from '../../../utils/logger';

export interface FlowAnalysis {
    tokenFlow: {
        inputToken: string;
        outputToken: string;
        inputAmount: number;
        outputAmount: number;
        path: string[];
    };
    liquidityImpact: {
        poolAddresses: string[];
        volume: number;
        direction: 'add' | 'remove' | 'swap';
    };
    efficiency: {
        hops: number;
        gasUsed: number;
        optimalPath: boolean;
    };
}

export class FlowAnalyzer {
    public analyzeFlow(activity: ProcessedActivity): FlowAnalysis {
        try {
            const tokenFlow = this.analyzeTokenFlow(activity);
            const liquidityImpact = this.analyzeLiquidityImpact(activity);
            const efficiency = this.analyzeEfficiency(activity);

            return {
                tokenFlow,
                liquidityImpact,
                efficiency
            };
        } catch (error) {
            logger.error('Error analyzing flow:', error);
            throw error;
        }
    }

    private analyzeTokenFlow(activity: ProcessedActivity): FlowAnalysis['tokenFlow'] {
        const firstRouter = activity.routerPath.path[0];
        const lastRouter = activity.routerPath.path[activity.routerPath.hops - 1];

        return {
            inputToken: firstRouter.token1,
            outputToken: lastRouter.token2,
            inputAmount: activity.normalizedPath.totalAmount1.normalized,
            outputAmount: activity.normalizedPath.totalAmount2.normalized,
            path: activity.analysis.tokenPath
        };
    }

    private analyzeLiquidityImpact(activity: ProcessedActivity): FlowAnalysis['liquidityImpact'] {
        const poolAddresses = activity.analysis.liquidityPools;
        const volume = activity.normalizedPath.totalAmount1.normalized;

        let direction: 'add' | 'remove' | 'swap' = 'swap';
        if (activity.parsed.activityType === 'add_liquidity') {
            direction = 'add';
        } else if (activity.parsed.activityType === 'remove_liquidity') {
            direction = 'remove';
        }

        return {
            poolAddresses,
            volume,
            direction
        };
    }

    private analyzeEfficiency(activity: ProcessedActivity): FlowAnalysis['efficiency'] {
        const hops = activity.routerPath.hops;
        const gasUsed = this.estimateGasUsage(activity);
        const optimalPath = this.isOptimalPath(activity);

        return {
            hops,
            gasUsed,
            optimalPath
        };
    }

    private estimateGasUsage(activity: ProcessedActivity): number {
        // Base gas cost for a swap
        const BASE_GAS = 100000;
        // Additional gas per hop
        const GAS_PER_HOP = 50000;
        // Gas for complex operations
        const COMPLEX_OPERATION_GAS = 20000;

        let totalGas = BASE_GAS;
        
        // Add gas for each hop
        totalGas += activity.routerPath.hops * GAS_PER_HOP;

        // Add gas for complex operations
        if (activity.analysis.isAggregated) {
            totalGas += COMPLEX_OPERATION_GAS;
        }

        return totalGas;
    }

    private isOptimalPath(activity: ProcessedActivity): boolean {
        // Check if the path is optimal based on:
        // 1. Number of hops (fewer is better)
        // 2. Whether it's a direct swap when possible
        // 3. Whether it uses known efficient pools

        const MAX_OPTIMAL_HOPS = 3;
        const KNOWN_EFFICIENT_POOLS = new Set([
            // Add known efficient pool addresses here
        ]);

        // Check hop count
        if (activity.routerPath.hops > MAX_OPTIMAL_HOPS) {
            return false;
        }

        // Check if it's a direct swap when possible
        if (activity.routerPath.hops > 1 && !activity.analysis.isAggregated) {
            return false;
        }

        // Check if it uses known efficient pools
        const usesEfficientPools = activity.analysis.liquidityPools.every(
            pool => KNOWN_EFFICIENT_POOLS.has(pool)
        );

        return usesEfficientPools;
    }
} 