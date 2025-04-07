import { StreamProcessor, RouterInfo } from './stream.processor';
import { ActivityData, LiquidityMetrics } from '../interfaces/analytics.interface';
import { LIQUIDITY_THRESHOLDS } from '../constants/thresholds';

describe('StreamProcessor', () => {
    let streamProcessor: StreamProcessor;
    const mockPoolAddress = '0x1234567890abcdef';
    
    beforeEach(() => {
        streamProcessor = new StreamProcessor();
    });

    afterEach(() => {
        streamProcessor.stopProcessing(mockPoolAddress);
    });

    const mockRouter: RouterInfo = {
        token1: '0xtoken1',
        token1_decimals: 18,
        amount1: '10000',
        token2: '0xtoken2',
        token2_decimals: 18,
        amount2: '5000',
        pool_address: mockPoolAddress
    };

    const mockActivityData: ActivityData = {
        activity_type: 'ACTIVITY_TOKEN_SWAP',
        block_id: 12345,
        block_time: Date.now(),
        from_address: '0xsender',
        platform: 'uniswap',
        sources: ['dex'],
        time: new Date().toISOString(),
        trans_id: '0xtx123',
        to_address: '0xreceiver',
        amount_info: {
            token1: '0xtoken1',
            token1_decimals: 18,
            amount1: LIQUIDITY_THRESHOLDS.MIN_SIGNIFICANT_VALUE * 2,
            token2: '0xtoken2',
            token2_decimals: 18,
            amount2: LIQUIDITY_THRESHOLDS.MIN_SIGNIFICANT_VALUE,
            routers: [mockRouter]
        }
    };

    const mockMetrics: LiquidityMetrics = {
        poolAddress: mockPoolAddress,
        timestamp: Date.now(),
        totalLiquidity: LIQUIDITY_THRESHOLDS.MIN_LIQUIDITY_DEPTH,
        token1: {
            address: '0xtoken1',
            symbol: 'TKN1',
            amount: LIQUIDITY_THRESHOLDS.MIN_LIQUIDITY_DEPTH / 2,
            value: LIQUIDITY_THRESHOLDS.MIN_LIQUIDITY_DEPTH / 2
        },
        token2: {
            address: '0xtoken2',
            symbol: 'TKN2',
            amount: LIQUIDITY_THRESHOLDS.MIN_LIQUIDITY_DEPTH / 2,
            value: LIQUIDITY_THRESHOLDS.MIN_LIQUIDITY_DEPTH / 2
        },
        holderCount: LIQUIDITY_THRESHOLDS.MIN_HOLDER_COUNT,
        volume24h: LIQUIDITY_THRESHOLDS.MIN_24H_VOLUME
    };

    describe('processActivity', () => {
        it('should process activity and emit liquidityChange event for significant changes', (done) => {
            // Start processing for the pool
            streamProcessor.startProcessing(mockPoolAddress);
            
            // Update metrics cache
            streamProcessor.updateMetrics(mockPoolAddress, mockMetrics);

            // Listen for liquidityChange event
            streamProcessor.once('liquidityChange', (data) => {
                try {
                    expect(data).toBeDefined();
                    expect(data.poolAddress).toBe(mockPoolAddress);
                    expect(data.change).toBeDefined();
                    expect(data.impactPercentage).toBeGreaterThan(LIQUIDITY_THRESHOLDS.LOW_CHANGE_PERCENTAGE);
                    done();
                } catch (error) {
                    done(error);
                }
            });

            // Process the activity
            streamProcessor.processActivity(mockActivityData);
        }, 10000);

        it('should not emit event for non-significant changes', () => {
            const smallActivity = {
                ...mockActivityData,
                amount_info: {
                    ...mockActivityData.amount_info,
                    amount1: 1,
                    amount2: 1,
                    routers: [{
                        ...mockActivityData.amount_info.routers[0],
                        amount1: '1',
                        amount2: '1'
                    }]
                }
            };

            const eventSpy = jest.fn();
            streamProcessor.on('liquidityChange', eventSpy);

            streamProcessor.startProcessing(mockPoolAddress);
            streamProcessor.updateMetrics(mockPoolAddress, mockMetrics);
            streamProcessor.processActivity(smallActivity);

            expect(eventSpy).not.toHaveBeenCalled();
        });
    });

    describe('startProcessing and stopProcessing', () => {
        it('should start and stop processing correctly', () => {
            // Start processing
            streamProcessor.startProcessing(mockPoolAddress);
            expect(streamProcessor['processingIntervals'].has(mockPoolAddress)).toBe(true);
            expect(streamProcessor['activityBuffer'].has(mockPoolAddress)).toBe(true);

            // Stop processing
            streamProcessor.stopProcessing(mockPoolAddress);
            expect(streamProcessor['processingIntervals'].has(mockPoolAddress)).toBe(false);
            expect(streamProcessor['activityBuffer'].has(mockPoolAddress)).toBe(false);
            expect(streamProcessor['metricsCache'].has(mockPoolAddress)).toBe(false);
        });

        it('should not start processing twice for the same pool', () => {
            streamProcessor.startProcessing(mockPoolAddress);
            const firstInterval = streamProcessor['processingIntervals'].get(mockPoolAddress);

            streamProcessor.startProcessing(mockPoolAddress);
            const secondInterval = streamProcessor['processingIntervals'].get(mockPoolAddress);

            expect(firstInterval).toBe(secondInterval);
        });
    });

    describe('metrics management', () => {
        it('should properly update and retrieve metrics', () => {
            streamProcessor.updateMetrics(mockPoolAddress, mockMetrics);
            const cachedMetrics = streamProcessor['metricsCache'].get(mockPoolAddress);
            
            expect(cachedMetrics).toBeDefined();
            expect(cachedMetrics).toEqual(mockMetrics);
        });
    });
}); 