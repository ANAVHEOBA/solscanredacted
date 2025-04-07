import { ExtractedRouter } from './router.extractor';
import { logger } from '../../../utils/logger';

export interface NormalizedAmount {
    raw: string;
    normalized: number;
    decimals: number;
}

export interface NormalizedRouter {
    poolAddress: string;
    programAddress: string;
    token1: string;
    amount1: NormalizedAmount;
    token2: string;
    amount2: NormalizedAmount;
}

export interface NormalizedPath {
    path: NormalizedRouter[];
    totalAmount1: NormalizedAmount;
    totalAmount2: NormalizedAmount;
    hops: number;
}

export class TokenNormalizer {
    public normalizeRouterPath(router: ExtractedRouter): NormalizedRouter {
        try {
            return {
                poolAddress: router.poolAddress,
                programAddress: router.programAddress,
                token1: router.token1,
                amount1: this.normalizeAmount(router.amount1, router.token1Decimals),
                token2: router.token2,
                amount2: this.normalizeAmount(router.amount2, router.token2Decimals)
            };
        } catch (error) {
            logger.error('Error normalizing router:', error);
            throw error;
        }
    }

    public normalizeAmount(amount: string, decimals: number): NormalizedAmount {
        try {
            const rawAmount = BigInt(amount);
            const normalized = Number(rawAmount) / Math.pow(10, decimals);

            return {
                raw: amount,
                normalized,
                decimals
            };
        } catch (error) {
            logger.error('Error normalizing amount:', error);
            throw error;
        }
    }

    public calculatePriceImpact(
        normalizedPath: NormalizedPath,
        poolReserves: { token1: number; token2: number }[]
    ): number {
        try {
            if (normalizedPath.hops !== poolReserves.length) {
                throw new Error('Mismatch between path hops and pool reserves');
            }

            let totalImpact = 0;
            for (let i = 0; i < normalizedPath.hops; i++) {
                const router = normalizedPath.path[i];
                const reserves = poolReserves[i];

                const impact = this.calculateSinglePoolImpact(
                    router.amount1.normalized,
                    router.amount2.normalized,
                    reserves.token1,
                    reserves.token2
                );

                totalImpact += impact;
            }

            return totalImpact / normalizedPath.hops;
        } catch (error) {
            logger.error('Error calculating price impact:', error);
            throw error;
        }
    }

    private calculateSinglePoolImpact(
        amountIn: number,
        amountOut: number,
        reserveIn: number,
        reserveOut: number
    ): number {
        const k = reserveIn * reserveOut;
        const newReserveIn = reserveIn + amountIn;
        const newReserveOut = k / newReserveIn;
        const expectedOut = reserveOut - newReserveOut;
        
        return Math.abs((amountOut - expectedOut) / expectedOut);
    }

    public calculateSlippage(
        normalizedPath: NormalizedPath,
        expectedOutput: number
    ): number {
        const actualOutput = normalizedPath.totalAmount2.normalized;
        return Math.abs((actualOutput - expectedOutput) / expectedOutput);
    }
} 