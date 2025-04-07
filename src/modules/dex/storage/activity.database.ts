import { ProcessedActivity } from '../processors/activity.pipeline';
import { FlowAnalysis } from '../analyzers/flow.analyzer';
import { PatternAnalysis } from '../analyzers/pattern.detector';
import { ImpactAnalysis } from '../analyzers/impact.calculator';
import { logger } from '../../../utils/logger';

export interface StoredActivity {
    id: string;
    timestamp: number;
    activity: ProcessedActivity;
    flowAnalysis: FlowAnalysis;
    patternAnalysis: PatternAnalysis;
    impactAnalysis: ImpactAnalysis;
    metadata: {
        blockNumber: number;
        transactionHash: string;
        poolAddress: string;
    };
}

export class ActivityDatabase {
    private activities: Map<string, StoredActivity> = new Map();
    private activityIndexes: {
        byPool: Map<string, Set<string>>;
        byTimestamp: Map<number, Set<string>>;
        byTransaction: Map<string, string>;
    } = {
        byPool: new Map(),
        byTimestamp: new Map(),
        byTransaction: new Map()
    };

    public async storeActivity(
        activity: ProcessedActivity,
        flowAnalysis: FlowAnalysis,
        patternAnalysis: PatternAnalysis,
        impactAnalysis: ImpactAnalysis
    ): Promise<void> {
        try {
            const storedActivity: StoredActivity = {
                id: this.generateActivityId(activity),
                timestamp: activity.parsed.timestamp,
                activity,
                flowAnalysis,
                patternAnalysis,
                impactAnalysis,
                metadata: {
                    blockNumber: activity.parsed.blockId,
                    transactionHash: activity.parsed.transactionId,
                    poolAddress: activity.analysis.liquidityPools[0]
                }
            };

            // Store the activity
            this.activities.set(storedActivity.id, storedActivity);

            // Update indexes
            this.updateIndexes(storedActivity);

            logger.info(`Stored activity ${storedActivity.id}`);
        } catch (error) {
            logger.error('Error storing activity:', error);
            throw error;
        }
    }

    public async getActivity(id: string): Promise<StoredActivity | undefined> {
        return this.activities.get(id);
    }

    public async getActivitiesByPool(
        poolAddress: string,
        startTime?: number,
        endTime?: number
    ): Promise<StoredActivity[]> {
        const activityIds = this.activityIndexes.byPool.get(poolAddress) || new Set();
        const activities: StoredActivity[] = [];

        for (const id of activityIds) {
            const activity = this.activities.get(id);
            if (activity) {
                if (startTime && activity.timestamp < startTime) continue;
                if (endTime && activity.timestamp > endTime) continue;
                activities.push(activity);
            }
        }

        return activities.sort((a, b) => a.timestamp - b.timestamp);
    }

    public async getActivitiesByTimeRange(
        startTime: number,
        endTime: number
    ): Promise<StoredActivity[]> {
        const activities: StoredActivity[] = [];
        
        for (let timestamp = startTime; timestamp <= endTime; timestamp++) {
            const activityIds = this.activityIndexes.byTimestamp.get(timestamp) || new Set();
            for (const id of activityIds) {
                const activity = this.activities.get(id);
                if (activity) {
                    activities.push(activity);
                }
            }
        }

        return activities.sort((a, b) => a.timestamp - b.timestamp);
    }

    public async getActivityByTransaction(
        transactionHash: string
    ): Promise<StoredActivity | undefined> {
        const activityId = this.activityIndexes.byTransaction.get(transactionHash);
        if (activityId) {
            return this.activities.get(activityId);
        }
        return undefined;
    }

    private generateActivityId(activity: ProcessedActivity): string {
        return `${activity.parsed.blockId}-${activity.parsed.transactionId}`;
    }

    private updateIndexes(activity: StoredActivity): void {
        // Index by pool
        const poolAddress = activity.metadata.poolAddress;
        if (!this.activityIndexes.byPool.has(poolAddress)) {
            this.activityIndexes.byPool.set(poolAddress, new Set());
        }
        this.activityIndexes.byPool.get(poolAddress)?.add(activity.id);

        // Index by timestamp
        if (!this.activityIndexes.byTimestamp.has(activity.timestamp)) {
            this.activityIndexes.byTimestamp.set(activity.timestamp, new Set());
        }
        this.activityIndexes.byTimestamp.get(activity.timestamp)?.add(activity.id);

        // Index by transaction
        this.activityIndexes.byTransaction.set(
            activity.metadata.transactionHash,
            activity.id
        );
    }

    public async clearOldActivities(maxAge: number): Promise<void> {
        const currentTime = Date.now();
        const oldActivities: string[] = [];

        for (const [id, activity] of this.activities) {
            if (currentTime - activity.timestamp > maxAge) {
                oldActivities.push(id);
            }
        }

        for (const id of oldActivities) {
            this.removeActivity(id);
        }
    }

    private removeActivity(id: string): void {
        const activity = this.activities.get(id);
        if (!activity) return;

        // Remove from main storage
        this.activities.delete(id);

        // Remove from pool index
        const poolAddress = activity.metadata.poolAddress;
        this.activityIndexes.byPool.get(poolAddress)?.delete(id);

        // Remove from timestamp index
        this.activityIndexes.byTimestamp.get(activity.timestamp)?.delete(id);

        // Remove from transaction index
        this.activityIndexes.byTransaction.delete(activity.metadata.transactionHash);
    }
} 