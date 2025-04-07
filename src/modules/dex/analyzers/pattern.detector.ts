import { ProcessedActivity } from '../processors/activity.pipeline';
import { FlowAnalysis } from './flow.analyzer';
import { logger } from '../../../utils/logger';

export interface PatternAnalysis {
    tradingPattern: {
        type: 'arbitrage' | 'frontrun' | 'sandwich' | 'normal';
        confidence: number;
        indicators: string[];
    };
    anomaly: {
        detected: boolean;
        type?: 'volume' | 'timing' | 'path' | 'price';
        severity: number;
        details: string;
    };
    risk: {
        level: 'low' | 'medium' | 'high';
        factors: string[];
    };
}

export class PatternDetector {
    private readonly VOLUME_THRESHOLD = 1000000; // 1M in normalized units
    private readonly TIME_THRESHOLD = 30000; // 30 seconds
    private readonly PRICE_IMPACT_THRESHOLD = 0.05; // 5%

    public detectPatterns(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): PatternAnalysis {
        try {
            const tradingPattern = this.analyzeTradingPattern(activity, flowAnalysis);
            const anomaly = this.detectAnomalies(activity, flowAnalysis);
            const risk = this.assessRisk(activity, flowAnalysis, anomaly);

            return {
                tradingPattern,
                anomaly,
                risk
            };
        } catch (error) {
            logger.error('Error detecting patterns:', error);
            throw error;
        }
    }

    private analyzeTradingPattern(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): PatternAnalysis['tradingPattern'] {
        const indicators: string[] = [];
        let confidence = 0;
        let type: 'arbitrage' | 'frontrun' | 'sandwich' | 'normal' = 'normal';

        // Check for arbitrage
        if (this.isArbitrage(activity, flowAnalysis)) {
            type = 'arbitrage';
            confidence = 0.8;
            indicators.push('price_difference', 'multiple_pools');
        }

        // Check for frontrunning
        if (this.isFrontrunning(activity, flowAnalysis)) {
            type = 'frontrun';
            confidence = 0.7;
            indicators.push('timing', 'similar_path');
        }

        // Check for sandwich attack
        if (this.isSandwichAttack(activity, flowAnalysis)) {
            type = 'sandwich';
            confidence = 0.9;
            indicators.push('price_impact', 'timing', 'volume');
        }

        return {
            type,
            confidence,
            indicators
        };
    }

    private detectAnomalies(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): PatternAnalysis['anomaly'] {
        const anomalies: string[] = [];
        let severity = 0;

        // Check volume anomaly
        if (flowAnalysis.tokenFlow.inputAmount > this.VOLUME_THRESHOLD) {
            anomalies.push('volume');
            severity = Math.max(severity, 0.7);
        }

        // Check timing anomaly
        if (this.isTimingAnomaly(activity)) {
            anomalies.push('timing');
            severity = Math.max(severity, 0.5);
        }

        // Check path anomaly
        if (!flowAnalysis.efficiency.optimalPath) {
            anomalies.push('path');
            severity = Math.max(severity, 0.3);
        }

        // Check price anomaly
        if (activity.analysis.priceImpact && activity.analysis.priceImpact > this.PRICE_IMPACT_THRESHOLD) {
            anomalies.push('price');
            severity = Math.max(severity, 0.8);
        }

        return {
            detected: anomalies.length > 0,
            type: anomalies[0] as 'volume' | 'timing' | 'path' | 'price',
            severity,
            details: anomalies.join(', ')
        };
    }

    private assessRisk(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis,
        anomaly: PatternAnalysis['anomaly']
    ): PatternAnalysis['risk'] {
        const factors: string[] = [];
        let level: 'low' | 'medium' | 'high' = 'low';

        // Volume risk
        if (flowAnalysis.tokenFlow.inputAmount > this.VOLUME_THRESHOLD) {
            factors.push('high_volume');
            level = 'medium';
        }

        // Path risk
        if (!flowAnalysis.efficiency.optimalPath) {
            factors.push('suboptimal_path');
            level = 'medium';
        }

        // Anomaly risk
        if (anomaly.detected) {
            factors.push(`anomaly_${anomaly.type}`);
            if (anomaly.severity > 0.7) {
                level = 'high';
            } else if (anomaly.severity > 0.4) {
                level = 'medium';
            }
        }

        return {
            level,
            factors
        };
    }

    private isArbitrage(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): boolean {
        // Check if the same token appears in the path
        const tokenSet = new Set(flowAnalysis.tokenFlow.path);
        return tokenSet.size < flowAnalysis.tokenFlow.path.length;
    }

    private isFrontrunning(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): boolean {
        // Check if there are similar transactions in a short time window
        // This would require historical data to be implemented properly
        return false;
    }

    private isSandwichAttack(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis
    ): boolean {
        // Check for high price impact and specific timing patterns
        return (
            activity.analysis.priceImpact !== undefined &&
            activity.analysis.priceImpact > this.PRICE_IMPACT_THRESHOLD &&
            this.isTimingAnomaly(activity)
        );
    }

    private isTimingAnomaly(activity: ProcessedActivity): boolean {
        // Check if the transaction timing is unusual
        // This would require historical data to be implemented properly
        return false;
    }
} 