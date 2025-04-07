import { ProcessedActivity } from '../processors/activity.pipeline';
import { FlowAnalysis } from './flow.analyzer';
import { logger } from '../../../utils/logger';

export interface ImpactAnalysis {
    marketImpact: {
        priceImpact: number;
        slippage: number;
        executionQuality: number;
    };
    liquidityImpact: {
        poolReserves: {
            before: { token1: number; token2: number };
            after: { token1: number; token2: number };
        };
        depth: number;
        concentration: number;
    };
    economicImpact: {
        fees: number;
        value: number;
        efficiency: number;
    };
}

export class ImpactCalculator {
    private readonly MIN_LIQUIDITY_DEPTH = 10000; // Minimum liquidity depth in normalized units
    private readonly MAX_CONCENTRATION = 0.8; // Maximum concentration ratio

    public calculateImpact(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis,
        currentReserves: { token1: number; token2: number }[]
    ): ImpactAnalysis {
        try {
            const marketImpact = this.calculateMarketImpact(activity, flowAnalysis);
            const liquidityImpact = this.calculateLiquidityImpact(activity, currentReserves);
            const economicImpact = this.calculateEconomicImpact(activity, flowAnalysis);

            return {
                marketImpact,
                liquidityImpact,
                economicImpact
            };
        } catch (error) {
            logger.error('Error calculating impact:', error);
            throw error;
        }
    }

    private calculateMarketImpact(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): ImpactAnalysis['marketImpact'] {
        const priceImpact = activity.analysis.priceImpact || 0;
        const slippage = activity.analysis.slippage || 0;

        // Calculate execution quality based on price impact and slippage
        const executionQuality = this.calculateExecutionQuality(priceImpact, slippage);

        return {
            priceImpact,
            slippage,
            executionQuality
        };
    }

    private calculateLiquidityImpact(
        activity: ProcessedActivity,
        currentReserves: { token1: number; token2: number }[]
    ): ImpactAnalysis['liquidityImpact'] {
        const poolReserves = this.calculatePoolReserves(activity, currentReserves);
        const depth = this.calculateLiquidityDepth(poolReserves);
        const concentration = this.calculateConcentration(poolReserves);

        return {
            poolReserves,
            depth,
            concentration
        };
    }

    private calculateEconomicImpact(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): ImpactAnalysis['economicImpact'] {
        const fees = this.calculateFees(activity);
        const value = this.calculateValue(activity);
        const efficiency = this.calculateEfficiency(activity, flowAnalysis);

        return {
            fees,
            value,
            efficiency
        };
    }

    private calculateExecutionQuality(priceImpact: number, slippage: number): number {
        // Normalize to 0-1 range, where 1 is best quality
        const maxImpact = 0.1; // 10% max impact
        const maxSlippage = 0.05; // 5% max slippage

        const normalizedImpact = Math.max(0, 1 - (priceImpact / maxImpact));
        const normalizedSlippage = Math.max(0, 1 - (slippage / maxSlippage));

        return (normalizedImpact + normalizedSlippage) / 2;
    }

    private calculatePoolReserves(
        activity: ProcessedActivity,
        currentReserves: { token1: number; token2: number }[]
    ): ImpactAnalysis['liquidityImpact']['poolReserves'] {
        const firstPool = currentReserves[0];
        const lastPool = currentReserves[currentReserves.length - 1];

        return {
            before: {
                token1: firstPool.token1,
                token2: firstPool.token2
            },
            after: {
                token1: lastPool.token1,
                token2: lastPool.token2
            }
        };
    }

    private calculateLiquidityDepth(
        reserves: ImpactAnalysis['liquidityImpact']['poolReserves']
    ): number {
        // Calculate average liquidity depth
        const beforeDepth = Math.min(reserves.before.token1, reserves.before.token2);
        const afterDepth = Math.min(reserves.after.token1, reserves.after.token2);
        return (beforeDepth + afterDepth) / 2;
    }

    private calculateConcentration(
        reserves: ImpactAnalysis['liquidityImpact']['poolReserves']
    ): number {
        // Calculate concentration ratio (higher is more concentrated)
        const beforeRatio = Math.max(
            reserves.before.token1 / reserves.before.token2,
            reserves.before.token2 / reserves.before.token1
        );
        const afterRatio = Math.max(
            reserves.after.token1 / reserves.after.token2,
            reserves.after.token2 / reserves.after.token1
        );
        return (beforeRatio + afterRatio) / 2;
    }

    private calculateFees(activity: ProcessedActivity): number {
        // Calculate total fees paid
        const feeRate = 0.003; // 0.3% fee rate
        return activity.normalizedPath.totalAmount1.normalized * feeRate;
    }

    private calculateValue(activity: ProcessedActivity): number {
        // Calculate total value of the transaction
        return activity.normalizedPath.totalAmount1.normalized;
    }

    private calculateEfficiency(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): number {
        // Calculate efficiency based on gas usage and path optimality
        const gasEfficiency = 1 - (flowAnalysis.efficiency.gasUsed / 1000000); // Normalize gas usage
        const pathEfficiency = flowAnalysis.efficiency.optimalPath ? 1 : 0.5;
        
        return (gasEfficiency + pathEfficiency) / 2;
    }
} 