import { DefiActivity, ActivityType } from '../../modules/dex/dex.interface';

export interface MockRouter {
    token1: string;
    token1_decimals: number;
    amount1: string;
    token2: string;
    token2_decimals: number;
    amount2: string;
}

export interface MockAmountInfo {
    token1: string;
    token1_decimals: number;
    amount1: number;
    token2: string;
    token2_decimals: number;
    amount2: number;
    routers: MockRouter[];
}

export const createMockActivity = (poolAddress: string): DefiActivity => ({
    block_id: 12345,
    trans_id: 'test-transaction',
    block_time: Date.now(),
    time: new Date().toISOString(),
    activity_type: ActivityType.ACTIVITY_TOKEN_SWAP,
    from_address: 'test-from-address',
    to_address: poolAddress,
    sources: ['test-source'],
    platform: 'test-platform',
    amount_info: {
        token1: 'token1',
        token1_decimals: 9,
        amount1: 100,
        token2: 'token2',
        token2_decimals: 9,
        amount2: 90,
        routers: [{
            token1: 'token1',
            token1_decimals: 9,
            amount1: '100',
            token2: 'token2',
            token2_decimals: 9,
            amount2: '90'
        }]
    }
}); 