import { DefiActivity } from '../dex.interface';
import { logger } from '../../../utils/logger';

export interface ParsedActivity {
    blockId: number;
    transactionId: string;
    timestamp: number;
    activityType: string;
    fromAddress: string;
    platforms: string[];
    sources: string[];
    amountInfo: {
        token1: string;
        token1Decimals: number;
        amount1: string;
        token2: string;
        token2Decimals: number;
        amount2: string;
        routers: any[];
    };
}

export class ActivityParser {
    public parseActivity(activity: DefiActivity): ParsedActivity {
        try {
            this.validateActivity(activity);

            return {
                blockId: activity.block_id,
                transactionId: activity.trans_id,
                timestamp: activity.block_time,
                activityType: activity.activity_type,
                fromAddress: activity.from_address,
                platforms: Array.isArray(activity.platform) ? activity.platform : [activity.platform],
                sources: activity.sources || [],
                amountInfo: {
                    token1: activity.amount_info.token1,
                    token1Decimals: activity.amount_info.token1_decimals,
                    amount1: activity.amount_info.amount1.toString(),
                    token2: activity.amount_info.token2,
                    token2Decimals: activity.amount_info.token2_decimals,
                    amount2: activity.amount_info.amount2.toString(),
                    routers: this.parseRouters(activity.amount_info.routers)
                }
            };
        } catch (error) {
            logger.error('Error parsing activity:', error);
            throw error;
        }
    }

    private validateActivity(activity: DefiActivity): void {
        if (!activity.block_id || !activity.trans_id || !activity.activity_type) {
            throw new Error('Missing required activity fields');
        }

        if (!activity.amount_info) {
            throw new Error('Missing amount_info in activity');
        }

        this.validateAmountInfo(activity.amount_info);
    }

    private validateAmountInfo(amountInfo: any): void {
        const requiredFields = [
            'token1', 'token1_decimals', 'amount1',
            'token2', 'token2_decimals', 'amount2',
            'routers'
        ];

        for (const field of requiredFields) {
            if (!(field in amountInfo)) {
                throw new Error(`Missing required field in amount_info: ${field}`);
            }
        }
    }

    private parseRouters(routers: any): any[] {
        if (!routers) {
            return [];
        }

        if (Array.isArray(routers)) {
            return routers;
        }

        if (routers.child_routers) {
            return routers.child_routers;
        }

        return [routers];
    }
} 