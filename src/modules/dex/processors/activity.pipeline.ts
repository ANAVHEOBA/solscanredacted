import { DefiActivity } from '../dex.interface';
import { ActivityParser, ParsedActivity } from './activity.parser';
import { RouterExtractor, ExtractedRouter, RouterPath } from './router.extractor';
import { TokenNormalizer, NormalizedPath } from './token.normalizer';
import { logger } from '../../../utils/logger';

export interface ProcessedActivity {
    parsed: ParsedActivity;
    routerPath: RouterPath;
    normalizedPath: NormalizedPath;
    analysis: {
        isDirect: boolean;
        isAggregated: boolean;
        tokenPath: string[];
        liquidityPools: string[];
        priceImpact?: number;
        slippage?: number;
    };
}

export class ActivityPipeline {
    constructor(
        private readonly activityParser: ActivityParser,
        private readonly routerExtractor: RouterExtractor,
        private readonly tokenNormalizer: TokenNormalizer
    ) {}

    public async processActivity(activity: DefiActivity): Promise<ProcessedActivity> {
        try {
            // Step 1: Parse the activity
            const parsedActivity = this.activityParser.parseActivity(activity);

            // Step 2: Extract router information
            const routerPath = this.routerExtractor.extractRouterPath(parsedActivity);

            // Step 3: Normalize token amounts
            const normalizedPath = this.normalizeRouterPath(routerPath);

            // Step 4: Analyze the path
            const analysis = this.routerExtractor.analyzeRouterPath(routerPath);

            return {
                parsed: parsedActivity,
                routerPath,
                normalizedPath,
                analysis
            };
        } catch (error) {
            logger.error('Error processing activity:', error);
            throw error;
        }
    }

    private normalizeRouterPath(routerPath: RouterPath): NormalizedPath {
        const normalizedRouters = routerPath.path.map(router => 
            this.tokenNormalizer.normalizeRouterPath(router)
        );

        return {
            path: normalizedRouters,
            totalAmount1: this.tokenNormalizer.normalizeAmount(
                routerPath.totalAmount1,
                routerPath.path[0].token1Decimals
            ),
            totalAmount2: this.tokenNormalizer.normalizeAmount(
                routerPath.totalAmount2,
                routerPath.path[routerPath.hops - 1].token2Decimals
            ),
            hops: routerPath.hops
        };
    }

    public calculateMetrics(
        processedActivity: ProcessedActivity,
        poolReserves: { token1: number; token2: number }[]
    ): void {
        try {
            processedActivity.analysis.priceImpact = this.tokenNormalizer.calculatePriceImpact(
                processedActivity.normalizedPath,
                poolReserves
            );

            // Calculate expected output based on pool reserves
            const expectedOutput = this.calculateExpectedOutput(
                processedActivity.normalizedPath,
                poolReserves
            );

            processedActivity.analysis.slippage = this.tokenNormalizer.calculateSlippage(
                processedActivity.normalizedPath,
                expectedOutput
            );
        } catch (error) {
            logger.error('Error calculating metrics:', error);
            throw error;
        }
    }

    private calculateExpectedOutput(
        normalizedPath: NormalizedPath,
        poolReserves: { token1: number; token2: number }[]
    ): number {
        let expectedOutput = normalizedPath.totalAmount1.normalized;
        
        for (let i = 0; i < normalizedPath.hops; i++) {
            const reserves = poolReserves[i];
            const k = reserves.token1 * reserves.token2;
            const newReserveIn = reserves.token1 + expectedOutput;
            expectedOutput = reserves.token2 - (k / newReserveIn);
        }

        return expectedOutput;
    }
} 