import { Server } from 'http';
import { createServer } from 'http';
import { Socket } from 'socket.io';
import { WebSocketService } from '../websocket.service';
import { DexService } from '../../modules/dex/dex.service';
import { DefiActivity, DefiActivityParams } from '../../modules/dex/dex.interface';
import { createMockActivity } from '../../tests/helpers/mock.types';
import { jest } from '@jest/globals';

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

describe('WebSocketService', () => {
    let httpServer: Server;
    let webSocketService: WebSocketService;
    let dexService: DexService;
    let port: number;

    const poolAddress = 'test-pool-123';
    const mockActivity = createMockActivity(poolAddress);

    beforeAll(async () => {
        // Create HTTP server
        httpServer = createServer();
        port = 3003; // Using a different port
        httpServer.listen(port);

        // Create DexService mock
        const mockGetDefiActivities = jest.fn();
        mockGetDefiActivities.mockImplementation(async () => [mockActivity]);

        dexService = {
            getDefiActivities: mockGetDefiActivities
        } as unknown as DexService;

        // Initialize service
        webSocketService = new WebSocketService(httpServer, dexService);

        // Wait for server to be ready
        await new Promise<void>((resolve) => {
            httpServer.once('listening', () => {
                resolve();
            });
        });
    });

    afterAll(() => {
        // Ensure server is closed
        return new Promise<void>((resolve) => {
            httpServer.close(() => {
                resolve();
            });
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize correctly', () => {
        expect(webSocketService).toBeDefined();
    });

    it('should track monitored pools', async () => {
        // Create a mock socket with the required methods
        const mockSocket = {
            join: jest.fn(),
            leave: jest.fn(),
            on: jest.fn(),
            emit: jest.fn()
        } as unknown as Socket;

        // Simulate connection and subscription
        webSocketService['setupWebSocket']();
        webSocketService['io'].emit('connection', mockSocket);

        // Trigger the subscription handler directly
        await webSocketService['startMonitoring'](poolAddress);

        expect(webSocketService.isMonitoring(poolAddress)).toBe(true);
        expect(dexService.getDefiActivities).toHaveBeenCalledWith({
            address: poolAddress,
            page: 1,
            page_size: 100
        } as DefiActivityParams);
    });

    it('should stop monitoring pools', async () => {
        // Create a mock socket with the required methods
        const mockSocket = {
            join: jest.fn(),
            leave: jest.fn(),
            on: jest.fn(),
            emit: jest.fn()
        } as unknown as Socket;

        // Simulate connection and subscription/unsubscription
        webSocketService['setupWebSocket']();
        webSocketService['io'].emit('connection', mockSocket);

        // Start and stop monitoring directly
        await webSocketService['startMonitoring'](poolAddress);
        webSocketService['stopMonitoring'](poolAddress);

        expect(webSocketService.isMonitoring(poolAddress)).toBe(false);
    });

    it('should emit activities to subscribers', (done) => {
        const callback = jest.fn();
        webSocketService.on('activity', callback);
        webSocketService.emit('activity', mockActivity);
        
        setImmediate(() => {
            expect(callback).toHaveBeenCalledWith(mockActivity);
            done();
        });
    });

    it('should handle reconnection attempts', async () => {
        // Create a mock socket with the required methods
        const mockSocket = {
            join: jest.fn(),
            leave: jest.fn(),
            on: jest.fn(),
            emit: jest.fn()
        } as unknown as Socket;

        // Clear any previous calls
        jest.clearAllMocks();

        // Simulate connection and subscription
        webSocketService['setupWebSocket']();
        webSocketService['io'].emit('connection', mockSocket);

        // Start monitoring
        await webSocketService['startMonitoring'](poolAddress);

        // Force a polling error
        const mockError = new Error('Test error');
        (dexService.getDefiActivities as jest.Mock).mockImplementationOnce(() => Promise.reject(mockError));

        // Trigger a poll manually
        await webSocketService['pollPoolActivity'](poolAddress);
        
        expect(dexService.getDefiActivities).toHaveBeenCalledTimes(3); // Initial + error + retry
    });
}); 