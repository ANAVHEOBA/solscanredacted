import { Injectable } from '@nestjs/common';
import { ActivityDatabase } from '../storage/activity.database';
import { FlowAnalyzer } from '../analyzers/flow.analyzer';
import { ImpactCalculator } from '../analyzers/impact.calculator';
import { PatternDetector } from '../analyzers/pattern.detector';
import { ProcessedActivity } from '../processors/activity.pipeline';
import { logger } from '../../../utils/logger';
import { ActivityPipeline } from '../processors/activity.pipeline';
import { ActivityParser } from '../processors/activity.parser';
import { RouterExtractor } from '../processors/router.extractor';
import { TokenNormalizer } from '../processors/token.normalizer';
import { DataValidatorService } from './data-validator.service';
import { DefiActivity, ActivityType } from '../dex.interface';

@Injectable()
export class DexActivityCollectorService {
    private readonly activityPipeline: ActivityPipeline;
    private readonly flowAnalyzer: FlowAnalyzer;
    private readonly patternDetector: PatternDetector;
    private readonly impactCalculator: ImpactCalculator;

    constructor(
        private readonly activityDatabase: ActivityDatabase,
        private readonly dataValidator: DataValidatorService
    ) {
        this.activityPipeline = new ActivityPipeline(
            new ActivityParser(),
            new RouterExtractor(),
            new TokenNormalizer()
        );
        this.flowAnalyzer = new FlowAnalyzer();
        this.patternDetector = new PatternDetector();
        this.impactCalculator = new ImpactCalculator();
    }

    async processAndStoreActivity(activity: ProcessedActivity): Promise<void> {
        try {
            // Analyze the activity
            const flowAnalysis = this.flowAnalyzer.analyzeFlow(activity);
            
            // Use default reserves since we don't have access to real-time data
            const defaultReserves = [{
                token1: flowAnalysis.tokenFlow.inputAmount * 100, // Assume pool has 100x the input amount
                token2: flowAnalysis.tokenFlow.outputAmount * 100 // Assume pool has 100x the output amount
            }];
            
            const impactAnalysis = this.impactCalculator.calculateImpact(activity, flowAnalysis, defaultReserves);
            const patternAnalysis = this.patternDetector.detectPatterns(activity, flowAnalysis);

            // Store the activity with all analyses
            await this.activityDatabase.storeActivity(
                activity,
                flowAnalysis,
                patternAnalysis,
                impactAnalysis
            );

            logger.info(`Successfully processed and stored activity for transaction ${activity.parsed.transactionId}`);
            } catch (error) {
            logger.error('Error processing and storing activity:', error);
                throw error;
            }
        }

    // Add a method to process and store mock data for testing
    public async addMockActivity(): Promise<void> {
        const timestamp = Date.now();
        const mockActivity: DefiActivity = {
            block_id: timestamp,
            trans_id: `mock-tx-${timestamp}`,
            block_time: timestamp,
            time: new Date(timestamp).toISOString(),
            activity_type: ActivityType.ACTIVITY_AGG_TOKEN_SWAP,
            from_address: 'mock-address',
            to_address: 'mock-address',
            platform: 'raydium',
            sources: ['whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc'],
            amount_info: {
                token1: 'tokenA',
                token1_decimals: 9,
                amount1: 1000000000,
                token2: 'tokenB',
                token2_decimals: 9,
                amount2: 950000000,
                routers: [{
                    token1: 'tokenA',
                    token1_decimals: 9,
                    amount1: '1000000000',
                    token2: 'tokenB',
                    token2_decimals: 9,
                    amount2: '950000000'
                }]
            }
        };

        // Process and store the activity
        const processedActivity = await this.activityPipeline.processActivity(mockActivity);
        const flowAnalysis = this.flowAnalyzer.analyzeFlow(processedActivity);
        const patternAnalysis = this.patternDetector.detectPatterns(processedActivity, flowAnalysis);
        
        // Use default reserves based on flow analysis
        const defaultReserves = [{
            token1: flowAnalysis.tokenFlow.inputAmount * 100, // Assume pool has 100x the input amount
            token2: flowAnalysis.tokenFlow.outputAmount * 100 // Assume pool has 100x the output amount
        }];

        const impactAnalysis = this.impactCalculator.calculateImpact(
            processedActivity,
            flowAnalysis,
            defaultReserves
        );

        await this.activityDatabase.storeActivity(
            processedActivity,
            flowAnalysis,
            patternAnalysis,
            impactAnalysis
        );
    }
} 