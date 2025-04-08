import { BalanceChangeActivity } from '../dex.interface';
import { logger } from '../../../utils/logger';

export interface BalanceAnalysis {
    flowMetrics: {
        totalInflow: number;
        totalOutflow: number;
        netFlow: number;
        flowCount: {
            inflow: number;
            outflow: number;
        };
    };
    tokenMetrics: {
        uniqueTokens: string[];
        mostActive: {
            token: string;
            volume: number;
        };
        volumeByToken: {
            [token: string]: number;
        };
    };
    timeMetrics: {
        firstActivity: number;
        lastActivity: number;
        averageInterval: number;
        peakVolume: {
            time: number;
            volume: number;
        };
    };
    riskMetrics: {
        largeTransfers: {
            count: number;
            threshold: number;
            transactions: Array<{
                time: number;
                amount: number;
                token: string;
            }>;
        };
        volatility: number;
        unusualPatterns: Array<{
            type: string;
            severity: number;
            details: string;
        }>;
    };
}

export class BalanceAnalyzer {
    private readonly LARGE_TRANSFER_THRESHOLD = 1000; // Adjust based on token decimals

    public analyzeBalanceChanges(activities: BalanceChangeActivity[]): BalanceAnalysis {
        try {
            const flowMetrics = this.analyzeFlowMetrics(activities);
            const tokenMetrics = this.analyzeTokenMetrics(activities);
            const timeMetrics = this.analyzeTimeMetrics(activities);
            const riskMetrics = this.analyzeRiskMetrics(activities);

            return {
                flowMetrics,
                tokenMetrics,
                timeMetrics,
                riskMetrics
            };
        } catch (error) {
            logger.error('Error analyzing balance changes:', error);
            throw error;
        }
    }

    private analyzeFlowMetrics(activities: BalanceChangeActivity[]): BalanceAnalysis['flowMetrics'] {
        let totalInflow = 0;
        let totalOutflow = 0;
        let inflowCount = 0;
        let outflowCount = 0;

        activities.forEach(activity => {
            const normalizedAmount = activity.amount / Math.pow(10, activity.token_decimals);
            
            if (activity.change_type === 'inc') {
                totalInflow += normalizedAmount;
                inflowCount++;
            } else {
                totalOutflow += normalizedAmount;
                outflowCount++;
            }
        });

        return {
            totalInflow,
            totalOutflow,
            netFlow: totalInflow - totalOutflow,
            flowCount: {
                inflow: inflowCount,
                outflow: outflowCount
            }
        };
    }

    private analyzeTokenMetrics(activities: BalanceChangeActivity[]): BalanceAnalysis['tokenMetrics'] {
        const volumeByToken: { [token: string]: number } = {};
        const uniqueTokens = new Set<string>();

        activities.forEach(activity => {
            const token = activity.token_address;
            const normalizedAmount = activity.amount / Math.pow(10, activity.token_decimals);
            
            uniqueTokens.add(token);
            volumeByToken[token] = (volumeByToken[token] || 0) + normalizedAmount;
        });

        let mostActiveToken = '';
        let maxVolume = 0;
        Object.entries(volumeByToken).forEach(([token, volume]) => {
            if (volume > maxVolume) {
                mostActiveToken = token;
                maxVolume = volume;
            }
        });

        return {
            uniqueTokens: Array.from(uniqueTokens),
            mostActive: {
                token: mostActiveToken,
                volume: maxVolume
            },
            volumeByToken
        };
    }

    private analyzeTimeMetrics(activities: BalanceChangeActivity[]): BalanceAnalysis['timeMetrics'] {
        if (activities.length === 0) {
            return {
                firstActivity: 0,
                lastActivity: 0,
                averageInterval: 0,
                peakVolume: {
                    time: 0,
                    volume: 0
                }
            };
        }

        const sortedActivities = [...activities].sort((a, b) => a.block_time - b.block_time);
        const intervals = [];
        let peakVolume = 0;
        let peakTime = 0;

        for (let i = 1; i < sortedActivities.length; i++) {
            intervals.push(sortedActivities[i].block_time - sortedActivities[i-1].block_time);
            
            const volume = sortedActivities[i].amount / Math.pow(10, sortedActivities[i].token_decimals);
            if (volume > peakVolume) {
                peakVolume = volume;
                peakTime = sortedActivities[i].block_time;
            }
        }

        return {
            firstActivity: sortedActivities[0].block_time,
            lastActivity: sortedActivities[sortedActivities.length - 1].block_time,
            averageInterval: intervals.length > 0 ? 
                intervals.reduce((a, b) => a + b, 0) / intervals.length : 0,
            peakVolume: {
                time: peakTime,
                volume: peakVolume
            }
        };
    }

    private analyzeRiskMetrics(activities: BalanceChangeActivity[]): BalanceAnalysis['riskMetrics'] {
        const largeTransfers = {
            count: 0,
            threshold: this.LARGE_TRANSFER_THRESHOLD,
            transactions: [] as Array<{time: number; amount: number; token: string}>
        };

        const changes: number[] = [];
        const unusualPatterns = [];

        activities.forEach(activity => {
            const normalizedAmount = activity.amount / Math.pow(10, activity.token_decimals);
            changes.push(normalizedAmount);

            if (normalizedAmount > this.LARGE_TRANSFER_THRESHOLD) {
                largeTransfers.count++;
                largeTransfers.transactions.push({
                    time: activity.block_time,
                    amount: normalizedAmount,
                    token: activity.token_address
                });
            }
        });

        // Calculate volatility as standard deviation of changes
        const mean = changes.reduce((a, b) => a + b, 0) / changes.length;
        const variance = changes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / changes.length;
        const volatility = Math.sqrt(variance);

        // Detect unusual patterns
        if (largeTransfers.count > 3) {
            unusualPatterns.push({
                type: 'high_value_transfers',
                severity: 0.8,
                details: `Multiple large transfers detected (${largeTransfers.count})`
            });
        }

        if (volatility > 100) {
            unusualPatterns.push({
                type: 'high_volatility',
                severity: 0.7,
                details: `High balance change volatility (${volatility.toFixed(2)})`
            });
        }

        return {
            largeTransfers,
            volatility,
            unusualPatterns
        };
    }
} 