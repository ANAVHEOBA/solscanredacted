import { ActivityType } from '../dex.interface';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export interface DexActivityCollectorConfig {
    maxRetries: number;
    retryDelay: number;
    batchSize: 10 | 20 | 30 | 40 | 60 | 100;
    rateLimit: {
        requestsPerMinute: number;
        burstSize: number;
    };
}

export interface DexActivityCollectorStats {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    lastRequestTime: number;
}

export interface DexActivityCollectorOptions {
    address?: string;
    activityTypes?: ActivityType[];
    platforms?: string[];
    sources?: string[];
    tokens?: string[];
    timeRange?: {
        from: number;
        to: number;
    };
    pageSize?: 10 | 20 | 30 | 40 | 60 | 100;
    sortBy?: 'block_time';
    sortOrder?: 'asc' | 'desc';
}

export interface DexActivityCollectorResult {
    activities: any[];
    stats: DexActivityCollectorStats;
    metadata: {
        totalPages: number;
        currentPage: number;
        hasMore: boolean;
    };
}

@ObjectType()
export class FlowAnalysis {
    @Field(() => String, { nullable: false })
    inputToken!: string;

    @Field(() => String, { nullable: false })
    outputToken!: string;

    @Field(() => Number, { nullable: false })
    inputAmount!: number;

    @Field(() => Number, { nullable: false })
    outputAmount!: number;

    @Field(() => [String], { nullable: false })
    path!: string[];
}

@ObjectType()
export class PatternAnalysis {
    @Field(() => String, { nullable: false })
    type!: string;

    @Field(() => Number, { nullable: false })
    confidence!: number;

    @Field(() => String, { nullable: false })
    description!: string;
}

@ObjectType()
export class ImpactAnalysis {
    @Field(() => Number, { nullable: false })
    priceImpact!: number;

    @Field(() => Number, { nullable: false })
    volumeImpact!: number;

    @Field(() => String, { nullable: false })
    severity!: string;
}

@ObjectType()
export class StoredActivity {
    @Field(() => ID, { nullable: false })
    id!: string;

    @Field(() => String, { nullable: false })
    poolAddress!: string;

    @Field(() => String, { nullable: false })
    type!: string;

    @Field(() => Number, { nullable: false })
    timestamp!: number;

    @Field(() => FlowAnalysis, { nullable: false })
    flowAnalysis!: FlowAnalysis;

    @Field(() => PatternAnalysis, { nullable: false })
    patternAnalysis!: PatternAnalysis;

    @Field(() => ImpactAnalysis, { nullable: false })
    impactAnalysis!: ImpactAnalysis;
}

@ObjectType()
export class PoolMetrics {
    @Field(() => Number, { nullable: false })
    volume24h!: number;

    @Field(() => Number, { nullable: false })
    tvl!: number;

    @Field(() => Number, { nullable: false })
    apy!: number;

    @Field(() => Number, { nullable: false })
    swapCount!: number;
}

@ObjectType()
export class PoolState {
    @Field(() => ID, { nullable: false })
    address!: string;

    @Field(() => String, { nullable: false })
    token1!: string;

    @Field(() => String, { nullable: false })
    token2!: string;

    @Field(() => Number, { nullable: false })
    lastUpdate!: number;

    @Field(() => PoolMetrics, { nullable: false })
    metrics!: PoolMetrics;
} 