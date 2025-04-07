import { Server } from 'http';
import { createServer } from 'http';
import { Server as WebSocketServer } from 'socket.io';
import { WebSocketService } from '../services/websocket.service';
import { ActivityService } from '../modules/analytics/services/activity.service';
import { DexService } from '../modules/dex/dex.service';
import { DefiActivity, DefiActivityResponse } from '../modules/dex/dex.interface';
import { createMockActivity } from './helpers/mock.types';
import { jest } from '@jest/globals';
import { Socket } from 'socket.io';

// Mock socket.io-client
const mockSocketClient = {
    connected: true,
    on: jest.fn(),
    emit: jest.fn(),
    close: jest.fn()
};

jest.mock('socket.io-client', () => ({
    io: jest.fn(() => mockSocketClient)
}));

describe('WebSocket and Activity Integration Tests', () => {
    let httpServer: Server;
    let webSocketService: WebSocketService;
    let activityService: ActivityService;
    let dexService: DexService;
    let port: number;
    let connectionHandler: (socket: Socket) => void;

    const poolAddress = 'test-pool-123';
    const mockActivity = createMockActivity(poolAddress);

    beforeAll(async () => {
        // Create HTTP server
        httpServer = createServer();
        port = 3001;
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

        // Mock Socket.IO server methods
        webSocketService['io'] = {
            on: jest.fn((event: string, handler: Function) => {
                if (event === 'connection') {
                    connectionHandler = handler as (socket: Socket) => void;
                }
            }),
            to: jest.fn().mockReturnThis(),
            emit: jest.fn()
        } as unknown as WebSocketServer;

        // Wait for server to be ready
        await new Promise<void>((resolve) => {
            httpServer.once('listening', () => {
                resolve();
            });
        });
    });

    afterAll(() => {
        // Clean up all intervals
        webSocketService.getMonitoredPools().forEach(pool => {
            webSocketService['stopMonitoring'](pool);
        });
        
        return new Promise<void>((resolve) => {
            httpServer.close(() => {
                resolve();
            });
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Clear any existing monitored pools
        webSocketService.getMonitoredPools().forEach(pool => {
            webSocketService['stopMonitoring'](pool);
        });
    });

    describe('WebSocketService', () => {
        it('should successfully connect a client', () => {
            expect(mockSocketClient.connected).toBe(true);
        });

        it('should start monitoring a pool when client subscribes', async () => {
            // Create a mock socket
            const mockSocket = {
                join: jest.fn(),
                leave: jest.fn(),
                on: jest.fn((event: string, handler: Function) => {
                    if (event === 'subscribe') {
                        // Store the handler to call it later
                        mockSocket.handlers = mockSocket.handlers || {};
                        mockSocket.handlers[event] = handler;
                    }
                }),
                emit: jest.fn(),
                handlers: {} as Record<string, Function>
            };

            // Simulate connection
            connectionHandler(mockSocket as unknown as Socket);

            // Get the subscribe handler from the mock calls
            const [[, subscribeHandler]] = mockSocket.on.mock.calls.filter(([event]) => event === 'subscribe');
            await subscribeHandler(poolAddress);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            expect(webSocketService.isMonitoring(poolAddress)).toBe(true);
            expect(dexService.getDefiActivities).toHaveBeenCalledWith({
                address: poolAddress,
                page: 1,
                page_size: 100
            });
        });

        it('should stop monitoring a pool when client unsubscribes', async () => {
            mockSocketClient.emit('subscribe', poolAddress);
            mockSocketClient.emit('unsubscribe', poolAddress);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            expect(webSocketService.isMonitoring(poolAddress)).toBe(false);
        });

        it('should emit activities to subscribed clients', async () => {
            // Create a mock socket
            const mockSocket = {
                join: jest.fn(),
                leave: jest.fn(),
                on: jest.fn(),
                emit: jest.fn()
            };

            // Simulate connection and subscription
            connectionHandler(mockSocket as unknown as Socket);
            await webSocketService.startMonitoring(poolAddress);

            // Get the io.to mock
            const toMock = webSocketService['io'].to as jest.Mock;
            const emitMock = webSocketService['io'].emit as jest.Mock;

            // Create activity with fixed timestamp for testing
            const activity = { 
                ...mockActivity,
                block_time: expect.any(Number),
                time: expect.any(String)
            };
            
            // Emit activity
            webSocketService.emit('activity', activity);
            
            // Wait for event propagation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if the activity was emitted to the room
            expect(toMock).toHaveBeenCalledWith(poolAddress);
            expect(emitMock).toHaveBeenCalledWith('activity', expect.objectContaining(activity));
        });
    });

    describe('ActivityService', () => {
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
    });
}); 