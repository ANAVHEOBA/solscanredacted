import { ParsedActivity } from './activity.parser';
import { logger } from '../../../utils/logger';

export interface ExtractedRouter {
    poolAddress: string;
    programAddress: string;
    token1: string;
    token1Decimals: number;
    amount1: string;
    token2: string;
    token2Decimals: number;
    amount2: string;
}

export interface RouterPath {
    path: ExtractedRouter[];
    totalAmount1: string;
    totalAmount2: string;
    hops: number;
}

export class RouterExtractor {
    public extractRouterPath(activity: ParsedActivity): RouterPath {
        try {
            const routers = this.extractRouters(activity.amountInfo.routers);
            
            return {
                path: routers,
                totalAmount1: activity.amountInfo.amount1,
                totalAmount2: activity.amountInfo.amount2,
                hops: routers.length
            };
        } catch (error) {
            logger.error('Error extracting router path:', error);
            throw error;
        }
    }

    private extractRouters(routers: any[]): ExtractedRouter[] {
        return routers.map(router => {
            this.validateRouter(router);
            
            // Handle both router formats
            const poolAddress = router.pool_address || router.poolAddress || 'unknown';
            const programAddress = router.program_address || router.programAddress || 'unknown';
            
            return {
                poolAddress,
                programAddress,
                token1: router.token1,
                token1Decimals: router.token1_decimals,
                amount1: router.amount1.toString(),
                token2: router.token2,
                token2Decimals: router.token2_decimals,
                amount2: router.amount2.toString()
            };
        });
    }

    private validateRouter(router: any): void {
        const requiredFields = [
            'token1', 'token1_decimals', 'amount1',
            'token2', 'token2_decimals', 'amount2'
        ];

        for (const field of requiredFields) {
            if (!(field in router)) {
                throw new Error(`Missing required field in router: ${field}`);
            }
        }
    }

    public analyzeRouterPath(path: RouterPath): {
        isDirect: boolean;
        isAggregated: boolean;
        tokenPath: string[];
        liquidityPools: string[];
    } {
        const tokenPath: string[] = [];
        const liquidityPools: string[] = [];

        // Extract token path
        tokenPath.push(path.path[0].token1);
        for (const router of path.path) {
            tokenPath.push(router.token2);
            liquidityPools.push(router.poolAddress);
        }

        return {
            isDirect: path.hops === 1,
            isAggregated: path.hops > 1,
            tokenPath,
            liquidityPools
        };
    }
} 