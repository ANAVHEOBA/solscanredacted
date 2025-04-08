import { BalanceChangeActivity } from '../dex.interface';
import { logger } from '../../../utils/logger';

// Export interfaces and classes
export interface BalanceChangeAnalysis {
    summary: {
        totalChanges: number;
        uniqueTokens: string[];
        totalInflow: number;
        totalOutflow: number;
        netChange: number;
        averageChangeSize: number;
    };
    tokenBreakdown: {
        [token: string]: {
            inflow: number;
            outflow: number;
            netChange: number;
            changeCount: number;
            averageChangeSize: number;
        };
    };
    timeAnalysis: {
        firstChange: number;
        lastChange: number;
        averageInterval: number;
        busyPeriods: Array<{
            startTime: number;
            endTime: number;
            changeCount: number;
            totalVolume: number;
        }>;
    };
    patterns: {
        largeChanges: Array<{
            time: number;
            token: string;
            amount: number;
            type: 'inflow' | 'outflow';
            transactionId: string;
        }>;
        frequentInteractions: Array<{
            token: string;
            frequency: number;
            totalVolume: number;
            averageSize: number;
        }>;
        volatilityScore: number;
    };
}

export class BalanceChangeAnalyzer {
    private readonly LARGE_CHANGE_THRESHOLD = 1000; // Configurable threshold
    private readonly BUSY_PERIOD_THRESHOLD = 300; // 5 minutes in seconds

    public analyzeChanges(changes: BalanceChangeActivity[]): BalanceChangeAnalysis {
        try {
            const sortedChanges = [...changes].sort((a, b) => a.block_time - b.block_time);
            
            return {
                summary: this.analyzeSummary(sortedChanges),
                tokenBreakdown: this.analyzeTokenBreakdown(sortedChanges),
                timeAnalysis: this.analyzeTimePatterns(sortedChanges),
                patterns: this.analyzePatterns(sortedChanges)
            };
        } catch (error) {
            logger.error('Error analyzing balance changes:', error);
            throw error;
        }
    }

    private analyzeSummary(changes: BalanceChangeActivity[]): BalanceChangeAnalysis['summary'] {
        const uniqueTokens = new Set<string>();
        let totalInflow = 0;
        let totalOutflow = 0;
        let totalChangeAmount = 0;

        changes.forEach(change => {
            const normalizedAmount = change.amount / Math.pow(10, change.token_decimals);
            uniqueTokens.add(change.token_address);
            totalChangeAmount += Math.abs(normalizedAmount);

            if (change.change_type === 'inc') {
                totalInflow += normalizedAmount;
            } else {
                totalOutflow += normalizedAmount;
            }
        });

        return {
            totalChanges: changes.length,
            uniqueTokens: Array.from(uniqueTokens),
            totalInflow,
            totalOutflow,
            netChange: totalInflow - totalOutflow,
            averageChangeSize: changes.length > 0 ? totalChangeAmount / changes.length : 0
        };
    }

    private analyzeTokenBreakdown(changes: BalanceChangeActivity[]): BalanceChangeAnalysis['tokenBreakdown'] {
        const breakdown: BalanceChangeAnalysis['tokenBreakdown'] = {};

        changes.forEach(change => {
            const token = change.token_address;
            const normalizedAmount = change.amount / Math.pow(10, change.token_decimals);

            if (!breakdown[token]) {
                breakdown[token] = {
                    inflow: 0,
                    outflow: 0,
                    netChange: 0,
                    changeCount: 0,
                    averageChangeSize: 0
                };
            }

            if (change.change_type === 'inc') {
                breakdown[token].inflow += normalizedAmount;
            } else {
                breakdown[token].outflow += normalizedAmount;
            }

            breakdown[token].changeCount++;
            breakdown[token].netChange = breakdown[token].inflow - breakdown[token].outflow;
            breakdown[token].averageChangeSize = 
                (breakdown[token].inflow + breakdown[token].outflow) / breakdown[token].changeCount;
        });

        return breakdown;
    }

    private analyzeTimePatterns(changes: BalanceChangeActivity[]): BalanceChangeAnalysis['timeAnalysis'] {
        if (changes.length === 0) {
            return {
                firstChange: 0,
                lastChange: 0,
                averageInterval: 0,
                busyPeriods: []
            };
        }

        const intervals: number[] = [];
        const busyPeriods: BalanceChangeAnalysis['timeAnalysis']['busyPeriods'] = [];
        let currentPeriod: {
            startTime: number;
            endTime: number;
            changes: BalanceChangeActivity[];
        } | null = null;

        for (let i = 1; i < changes.length; i++) {
            const interval = changes[i].block_time - changes[i-1].block_time;
            intervals.push(interval);

            // Detect busy periods
            if (interval <= this.BUSY_PERIOD_THRESHOLD) {
                if (!currentPeriod) {
                    currentPeriod = {
                        startTime: changes[i-1].block_time,
                        endTime: changes[i].block_time,
                        changes: [changes[i-1], changes[i]]
                    };
                } else {
                    currentPeriod.endTime = changes[i].block_time;
                    currentPeriod.changes.push(changes[i]);
                }
            } else if (currentPeriod) {
                busyPeriods.push({
                    startTime: currentPeriod.startTime,
                    endTime: currentPeriod.endTime,
                    changeCount: currentPeriod.changes.length,
                    totalVolume: currentPeriod.changes.reduce((sum, change) => 
                        sum + change.amount / Math.pow(10, change.token_decimals), 0)
                });
                currentPeriod = null;
            }
        }

        // Add last busy period if exists
        if (currentPeriod) {
            busyPeriods.push({
                startTime: currentPeriod.startTime,
                endTime: currentPeriod.endTime,
                changeCount: currentPeriod.changes.length,
                totalVolume: currentPeriod.changes.reduce((sum, change) => 
                    sum + change.amount / Math.pow(10, change.token_decimals), 0)
            });
        }

        return {
            firstChange: changes[0].block_time,
            lastChange: changes[changes.length - 1].block_time,
            averageInterval: intervals.length > 0 ? 
                intervals.reduce((a, b) => a + b, 0) / intervals.length : 0,
            busyPeriods
        };
    }

    private analyzePatterns(changes: BalanceChangeActivity[]): BalanceChangeAnalysis['patterns'] {
        const largeChanges: BalanceChangeAnalysis['patterns']['largeChanges'] = [];
        const tokenFrequency: { [token: string]: { count: number; volume: number; total: number; } } = {};

        changes.forEach(change => {
            const normalizedAmount = change.amount / Math.pow(10, change.token_decimals);
            const token = change.token_address;

            // Track large changes
            if (normalizedAmount > this.LARGE_CHANGE_THRESHOLD) {
                largeChanges.push({
                    time: change.block_time,
                    token,
                    amount: normalizedAmount,
                    type: change.change_type === 'inc' ? 'inflow' : 'outflow',
                    transactionId: change.trans_id
                });
            }

            // Track token frequency
            if (!tokenFrequency[token]) {
                tokenFrequency[token] = { count: 0, volume: 0, total: 0 };
            }
            tokenFrequency[token].count++;
            tokenFrequency[token].volume += normalizedAmount;
            tokenFrequency[token].total += Math.abs(normalizedAmount);
        });

        // Calculate frequent interactions
        const frequentInteractions = Object.entries(tokenFrequency)
            .map(([token, stats]) => ({
                token,
                frequency: stats.count,
                totalVolume: stats.volume,
                averageSize: stats.total / stats.count
            }))
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 5);

        // Calculate volatility score based on change sizes
        const changeValues = changes.map(c => c.amount / Math.pow(10, c.token_decimals));
        const mean = changeValues.reduce((a, b) => a + b, 0) / changeValues.length;
        const variance = changeValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / changeValues.length;
        const volatilityScore = Math.sqrt(variance);

        return {
            largeChanges,
            frequentInteractions,
            volatilityScore
        };
    }
} 