import { Server } from 'http';
import { createServer } from 'http';
import { WebSocketService } from '../../../../services/websocket.service';
import { ActivityService } from '../activity.service';
import { DexService } from '../../../dex/dex.service';
import { DefiActivity, DefiActivityParams, DefiActivityResponse } from '../../../dex/dex.interface';
import { createMockActivity } from '../../../../tests/helpers/mock.types';
import { jest } from '@jest/globals';

describe('ActivityService', () => {
    let httpServer: Server;
    let webSocketService: WebSocketService;
    let activityService: ActivityService;
    let dexService: DexService;
    let port: number;

    const poolAddress = 'test-pool-123';
    const mockActivity = createMockActivity(poolAddress);

    beforeAll(async () => {
        // Create HTTP server
        httpServer = createServer();
        port = 3002;
        httpServer.listen(port);

        // Create DexService mock with activity
        const mockGetDefiActivities = jest.fn().mockImplementation(async () => ({
            success: true,
            data: [mockActivity]
        }));
        
        dexService = {
            getDefiActivities: mockGetDefiActivities
        } as unknown as DexService;

        // Initialize services
        webSocketService = new WebSocketService(httpServer, dexService);
        activityService = new ActivityService(webSocketService);

        // Wait for server to be ready
        await new Promise<void>((resolve) => {
            httpServer.once('listening', () => {
                resolve();
            });
        });
    });

    afterAll(() => {
        return new Promise<void>((resolve) => {
            httpServer.close(() => {
                resolve();
            });
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Clear any existing monitored pools
        activityService.getMonitoredPools().forEach(pool => {
            activityService.stopMonitoring(pool);
        });
    });

    it('should initialize correctly', () => {
        expect(activityService).toBeDefined();
    });

    it('should start monitoring a pool', () => {
        activityService.startMonitoring(poolAddress);
        expect(activityService.isMonitoring(poolAddress)).toBe(true);
    });

    it('should not start monitoring the same pool twice', () => {
        activityService.startMonitoring(poolAddress);
        activityService.startMonitoring(poolAddress);
        expect(activityService.getMonitoredPools()).toHaveLength(1);
    });

    it('should stop monitoring a pool', () => {
        activityService.startMonitoring(poolAddress);
        activityService.stopMonitoring(poolAddress);
        expect(activityService.isMonitoring(poolAddress)).toBe(false);
    });

    it('should process activities for monitored pools', async () => {
        // Start monitoring and ensure processor is initialized
        activityService.startMonitoring(poolAddress);
        
        // Wait for processor to be fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const processor = activityService['activeProcessors'].get(poolAddress);
        expect(processor).toBeDefined();
        
        const processorSpy = jest.spyOn(processor as any, 'processActivity');

        // Trigger polling to get activities
        await webSocketService['pollPoolActivity'](poolAddress);
        
        // Wait for event propagation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify the activity was processed
        expect(processorSpy).toHaveBeenCalledWith(expect.objectContaining({
            ...mockActivity,
            block_time: expect.any(Number),
            time: expect.any(String)
        }));
    });

    it('should handle multiple pools independently', () => {
        const poolAddress2 = 'test-pool-456';
        
        activityService.startMonitoring(poolAddress);
        activityService.startMonitoring(poolAddress2);
        
        expect(activityService.getMonitoredPools()).toHaveLength(2);
        expect(activityService.isMonitoring(poolAddress)).toBe(true);
        expect(activityService.isMonitoring(poolAddress2)).toBe(true);
    });

    it('should clean up processors when stopping monitoring', () => {
        activityService.startMonitoring(poolAddress);
        const processor = activityService['activeProcessors'].get(poolAddress);
        
        const stopSpy = jest.spyOn(processor as any, 'stopProcessing');
        
        activityService.stopMonitoring(poolAddress);
        
        expect(stopSpy).toHaveBeenCalled();
        expect(activityService['activeProcessors'].has(poolAddress)).toBe(false);
    });
}); 