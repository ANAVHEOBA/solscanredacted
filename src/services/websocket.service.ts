import { Server as WebSocketServer } from 'socket.io';
import { Server } from 'http';
import { EventEmitter } from 'events';
import { ActivityData } from '../modules/analytics/interfaces/analytics.interface';
import { DexService } from '../modules/dex/dex.service';
import { logger } from '../utils/logger';

export class WebSocketService extends EventEmitter {
    private io: WebSocketServer;
    private monitoredPools: Set<string> = new Set();
    private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
    private reconnectAttempts: Map<string, number> = new Map();
    private readonly MAX_RECONNECT_ATTEMPTS = 5;
    private readonly POLLING_INTERVAL = 10000; // 10 seconds
    private readonly RECONNECT_DELAY = 5000;  // 5 seconds

    constructor(
        server: Server,
        private readonly dexService: DexService
    ) {
        super();
        this.io = new WebSocketServer(server);
        this.setupWebSocket();
    }

    private setupWebSocket(): void {
        this.io.on('connection', (socket) => {
            logger.info('New client connected');

            socket.on('subscribe', async (poolAddress: string) => {
                await this.startMonitoring(poolAddress);
                socket.join(poolAddress);
                logger.info(`Client subscribed to pool: ${poolAddress}`);
            });

            socket.on('unsubscribe', (poolAddress: string) => {
                socket.leave(poolAddress);
                this.stopMonitoring(poolAddress);
                logger.info(`Client unsubscribed from pool: ${poolAddress}`);
            });

            socket.on('disconnect', () => {
                logger.info('Client disconnected');
            });
        });
    }

    public async startMonitoring(poolAddress: string): Promise<void> {
        if (this.monitoredPools.has(poolAddress)) {
            return;
        }

        this.monitoredPools.add(poolAddress);
        this.reconnectAttempts.set(poolAddress, 0);

        await this.pollPoolActivity(poolAddress);
        
        const interval = setInterval(
            () => this.pollPoolActivity(poolAddress),
            this.POLLING_INTERVAL
        );

        this.pollingIntervals.set(poolAddress, interval);
    }

    public stopMonitoring(poolAddress: string): void {
        const interval = this.pollingIntervals.get(poolAddress);
        if (interval) {
            clearInterval(interval);
            this.pollingIntervals.delete(poolAddress);
        }
        this.monitoredPools.delete(poolAddress);
        this.reconnectAttempts.delete(poolAddress);
    }

    private async pollPoolActivity(poolAddress: string): Promise<void> {
        try {
            const activities = await this.dexService.getDefiActivities({
                address: poolAddress,
                page: 1,
                page_size: 100
            });

            if (activities && activities.length > 0) {
                // First emit to event listeners (ActivityService)
                activities.forEach((activity: ActivityData) => {
                    this.emit('activity', activity);
                });

                // Then emit to socket clients
                activities.forEach((activity: ActivityData) => {
                    this.io.to(poolAddress).emit('activity', activity);
                });
            }

            // Reset reconnect attempts on successful poll
            this.reconnectAttempts.set(poolAddress, 0);

        } catch (error) {
            logger.error(`Error polling pool ${poolAddress}:`, error);
            await this.handlePollingError(poolAddress);
        }
    }

    private async handlePollingError(poolAddress: string): Promise<void> {
        const attempts = (this.reconnectAttempts.get(poolAddress) || 0) + 1;
        this.reconnectAttempts.set(poolAddress, attempts);

        if (attempts >= this.MAX_RECONNECT_ATTEMPTS) {
            logger.error(`Max reconnection attempts reached for pool ${poolAddress}`);
            this.stopMonitoring(poolAddress);
            this.io.to(poolAddress).emit('error', {
                message: 'Failed to monitor pool activity',
                poolAddress
            });
            return;
        }

        // Exponential backoff
        const delay = this.RECONNECT_DELAY * Math.pow(2, attempts - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        logger.info(`Attempting to reconnect to pool ${poolAddress}, attempt ${attempts}`);
        await this.pollPoolActivity(poolAddress);
    }

    public getMonitoredPools(): string[] {
        return Array.from(this.monitoredPools);
    }

    public isMonitoring(poolAddress: string): boolean {
        return this.monitoredPools.has(poolAddress);
    }
}
