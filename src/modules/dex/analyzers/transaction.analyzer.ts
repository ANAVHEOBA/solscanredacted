import { Transaction } from '../dex.interface';
import { logger } from '../../../utils/logger';

export interface TransactionAnalysis {
    summary: {
        totalTransactions: number;
        uniqueSigners: string[];
        totalFees: number;
        averageFee: number;
        successRate: number;
    };
    programBreakdown: {
        [programId: string]: {
            callCount: number;
            instructionTypes: { [type: string]: number };
            totalFees: number;
            successCount: number;
        };
    };
    timeAnalysis: {
        firstTransaction: number;
        lastTransaction: number;
        averageInterval: number;
        busyPeriods: Array<{
            startTime: number;
            endTime: number;
            transactionCount: number;
            totalFees: number;
            programs: string[];
        }>;
    };
    patterns: {
        highFeeTransactions: Array<{
            time: number;
            hash: string;
            fee: number;
            programs: string[];
            status: string;
        }>;
        complexTransactions: Array<{
            time: number;
            hash: string;
            instructionCount: number;
            programs: string[];
            status: string;
        }>;
        frequentPrograms: Array<{
            programId: string;
            callCount: number;
            successRate: number;
            averageFee: number;
        }>;
        signerActivity: {
            [signer: string]: {
                transactionCount: number;
                totalFees: number;
                successCount: number;
                programs: { [programId: string]: number };
            };
        };
    };
}

export class TransactionAnalyzer {
    private readonly HIGH_FEE_THRESHOLD = 50000; // 0.00005 SOL
    private readonly COMPLEX_TX_THRESHOLD = 4; // More than 4 instructions
    private readonly BUSY_PERIOD_THRESHOLD = 300; // 5 minutes in seconds

    public analyzeTransactions(transactions: Transaction[]): TransactionAnalysis {
        try {
            if (!Array.isArray(transactions)) {
                logger.error('Invalid transactions input:', transactions);
                throw new Error('Transactions must be an array');
            }

            if (transactions.length === 0) {
                return this.getEmptyAnalysis();
            }

            const sortedTransactions = [...transactions].sort((a, b) => 
                (a.block_time || 0) - (b.block_time || 0)
            );
            
            return {
                summary: this.analyzeSummary(sortedTransactions),
                programBreakdown: this.analyzeProgramBreakdown(sortedTransactions),
                timeAnalysis: this.analyzeTimePatterns(sortedTransactions),
                patterns: this.analyzePatterns(sortedTransactions)
            };
        } catch (error) {
            logger.error('Error analyzing transactions:', error);
            return this.getEmptyAnalysis();
        }
    }

    private getEmptyAnalysis(): TransactionAnalysis {
        return {
            summary: {
                totalTransactions: 0,
                uniqueSigners: [],
                totalFees: 0,
                averageFee: 0,
                successRate: 0
            },
            programBreakdown: {},
            timeAnalysis: {
                firstTransaction: 0,
                lastTransaction: 0,
                averageInterval: 0,
                busyPeriods: []
            },
            patterns: {
                highFeeTransactions: [],
                complexTransactions: [],
                frequentPrograms: [],
                signerActivity: {}
            }
        };
    }

    private analyzeSummary(transactions: Transaction[]): TransactionAnalysis['summary'] {
        try {
            const uniqueSigners = new Set<string>();
            let totalFees = 0;
            let successCount = 0;

            transactions.forEach(tx => {
                if (Array.isArray(tx.signer)) {
                    tx.signer.forEach(signer => uniqueSigners.add(signer));
                }
                totalFees += tx.fee || 0;
                if (tx.status === 'Success') successCount++;
            });

            return {
                totalTransactions: transactions.length,
                uniqueSigners: Array.from(uniqueSigners),
                totalFees,
                averageFee: transactions.length > 0 ? totalFees / transactions.length : 0,
                successRate: transactions.length > 0 ? successCount / transactions.length : 0
            };
        } catch (error) {
            logger.error('Error in analyzeSummary:', error);
            return this.getEmptyAnalysis().summary;
        }
    }

    private analyzeProgramBreakdown(transactions: Transaction[]): TransactionAnalysis['programBreakdown'] {
        try {
            const breakdown: TransactionAnalysis['programBreakdown'] = {};

            transactions.forEach(tx => {
                if (!Array.isArray(tx.program_ids)) return;

                tx.program_ids.forEach(programId => {
                    if (!programId) return;

                    if (!breakdown[programId]) {
                        breakdown[programId] = {
                            callCount: 0,
                            instructionTypes: {},
                            totalFees: 0,
                            successCount: 0
                        };
                    }

                    breakdown[programId].callCount++;
                    breakdown[programId].totalFees += tx.fee || 0;
                    if (tx.status === 'Success') breakdown[programId].successCount++;

                    // Track instruction types for this program
                    if (Array.isArray(tx.parsed_instructions)) {
                        tx.parsed_instructions
                            .filter(inst => inst && inst.program_id === programId && inst.type)
                            .forEach(inst => {
                                breakdown[programId].instructionTypes[inst.type] = 
                                    (breakdown[programId].instructionTypes[inst.type] || 0) + 1;
                            });
                    }
                });
            });

            return breakdown;
        } catch (error) {
            logger.error('Error in analyzeProgramBreakdown:', error);
            return {};
        }
    }

    private analyzeTimePatterns(transactions: Transaction[]): TransactionAnalysis['timeAnalysis'] {
        if (transactions.length === 0) {
            return {
                firstTransaction: 0,
                lastTransaction: 0,
                averageInterval: 0,
                busyPeriods: []
            };
        }

        const intervals: number[] = [];
        const busyPeriods: TransactionAnalysis['timeAnalysis']['busyPeriods'] = [];
        let currentPeriod: {
            startTime: number;
            endTime: number;
            transactions: Transaction[];
        } | null = null;

        for (let i = 1; i < transactions.length; i++) {
            const interval = transactions[i].block_time - transactions[i-1].block_time;
            intervals.push(interval);

            // Detect busy periods
            if (interval <= this.BUSY_PERIOD_THRESHOLD) {
                if (!currentPeriod) {
                    currentPeriod = {
                        startTime: transactions[i-1].block_time,
                        endTime: transactions[i].block_time,
                        transactions: [transactions[i-1], transactions[i]]
                    };
                } else {
                    currentPeriod.endTime = transactions[i].block_time;
                    currentPeriod.transactions.push(transactions[i]);
                }
            } else if (currentPeriod) {
                const uniquePrograms = new Set<string>();
                currentPeriod.transactions.forEach(tx => 
                    tx.program_ids.forEach(id => uniquePrograms.add(id))
                );

                busyPeriods.push({
                    startTime: currentPeriod.startTime,
                    endTime: currentPeriod.endTime,
                    transactionCount: currentPeriod.transactions.length,
                    totalFees: currentPeriod.transactions.reduce((sum, tx) => sum + tx.fee, 0),
                    programs: Array.from(uniquePrograms)
                });
                currentPeriod = null;
            }
        }

        // Add last busy period if exists
        if (currentPeriod) {
            const uniquePrograms = new Set<string>();
            currentPeriod.transactions.forEach(tx => 
                tx.program_ids.forEach(id => uniquePrograms.add(id))
            );

            busyPeriods.push({
                startTime: currentPeriod.startTime,
                endTime: currentPeriod.endTime,
                transactionCount: currentPeriod.transactions.length,
                totalFees: currentPeriod.transactions.reduce((sum, tx) => sum + tx.fee, 0),
                programs: Array.from(uniquePrograms)
            });
        }

        return {
            firstTransaction: transactions[0].block_time,
            lastTransaction: transactions[transactions.length - 1].block_time,
            averageInterval: intervals.length > 0 ? 
                intervals.reduce((a, b) => a + b, 0) / intervals.length : 0,
            busyPeriods
        };
    }

    private analyzePatterns(transactions: Transaction[]): TransactionAnalysis['patterns'] {
        const highFeeTransactions: TransactionAnalysis['patterns']['highFeeTransactions'] = [];
        const complexTransactions: TransactionAnalysis['patterns']['complexTransactions'] = [];
        const programStats: { [programId: string]: { calls: number; fees: number; successes: number; } } = {};
        const signerActivity: TransactionAnalysis['patterns']['signerActivity'] = {};

        transactions.forEach(tx => {
            // Track high fee transactions
            if (tx.fee > this.HIGH_FEE_THRESHOLD) {
                highFeeTransactions.push({
                    time: tx.block_time,
                    hash: tx.tx_hash,
                    fee: tx.fee,
                    programs: tx.program_ids,
                    status: tx.status
                });
            }

            // Track complex transactions
            if (tx.parsed_instructions.length > this.COMPLEX_TX_THRESHOLD) {
                complexTransactions.push({
                    time: tx.block_time,
                    hash: tx.tx_hash,
                    instructionCount: tx.parsed_instructions.length,
                    programs: tx.program_ids,
                    status: tx.status
                });
            }

            // Track program statistics
            tx.program_ids.forEach(programId => {
                if (!programStats[programId]) {
                    programStats[programId] = { calls: 0, fees: 0, successes: 0 };
                }
                programStats[programId].calls++;
                programStats[programId].fees += tx.fee;
                if (tx.status === 'Success') programStats[programId].successes++;
            });

            // Track signer activity
            tx.signer.forEach(signer => {
                if (!signerActivity[signer]) {
                    signerActivity[signer] = {
                        transactionCount: 0,
                        totalFees: 0,
                        successCount: 0,
                        programs: {}
                    };
                }
                signerActivity[signer].transactionCount++;
                signerActivity[signer].totalFees += tx.fee;
                if (tx.status === 'Success') signerActivity[signer].successCount++;
                tx.program_ids.forEach(programId => {
                    signerActivity[signer].programs[programId] = 
                        (signerActivity[signer].programs[programId] || 0) + 1;
                });
            });
        });

        // Calculate frequent programs
        const frequentPrograms = Object.entries(programStats)
            .map(([programId, stats]) => ({
                programId,
                callCount: stats.calls,
                successRate: stats.calls > 0 ? stats.successes / stats.calls : 0,
                averageFee: stats.calls > 0 ? stats.fees / stats.calls : 0
            }))
            .sort((a, b) => b.callCount - a.callCount)
            .slice(0, 5);

        return {
            highFeeTransactions,
            complexTransactions,
            frequentPrograms,
            signerActivity
        };
    }
} 