import { StreamProcessor, RouterInfo } from '../processors/stream.processor';
import { WebSocketService } from '../../../services/websocket.service';
import { ActivityData, LiquidityChange } from '../interfaces/analytics.interface';
import { logger } from '../../../utils/logger';

export class ActivityService {
    private activeProcessors: Map<string, StreamProcessor> = new Map();

    constructor(private readonly webSocketService: WebSocketService) {
        this.setupWebSocketListeners();
    }

    private setupWebSocketListeners(): void {
        // Listen for new activities from WebSocket
        this.webSocketService.on('activity', (activity: ActivityData) => {
            this.processActivity(activity);
        });
    }

    public startMonitoring(poolAddress: string): void {
        if (this.activeProcessors.has(poolAddress)) {
            logger.info(`Already monitoring pool: ${poolAddress}`);
            return;
        }

        // Create new stream processor for this pool
        const processor = new StreamProcessor();
        processor.startProcessing(poolAddress);
        this.activeProcessors.set(poolAddress, processor);

        // Start WebSocket monitoring - IMPORTANT: Do this after setting up processor
        if (!this.webSocketService.isMonitoring(poolAddress)) {
            // Use direct method call instead of emit
            this.webSocketService.startMonitoring(poolAddress);
        }

        logger.info(`Started monitoring pool: ${poolAddress}`);
    }

    public stopMonitoring(poolAddress: string): void {
        const processor = this.activeProcessors.get(poolAddress);
        if (processor) {
            processor.stopProcessing(poolAddress);
            this.activeProcessors.delete(poolAddress);
            this.webSocketService.emit('unsubscribe', poolAddress);
            logger.info(`Stopped monitoring pool: ${poolAddress}`);
        }
    }

    private processActivity(activity: ActivityData): void {
        // Extract pool addresses from the activity
        const poolAddresses = this.extractPoolAddresses(activity);

        // Process activity for each affected pool
        poolAddresses.forEach(poolAddress => {
            const processor = this.activeProcessors.get(poolAddress);
            if (processor) {
                processor.processActivity(activity);
            }
        });
    }

    private extractPoolAddresses(activity: ActivityData): string[] {
        const addresses = new Set<string>();
        
        // Extract from routers
        activity.amount_info.routers.forEach((router: RouterInfo) => {
            if (router.pool_address) {
                addresses.add(router.pool_address);
            }
        });

        return Array.from(addresses);
    }

    public getMonitoredPools(): string[] {
        return Array.from(this.activeProcessors.keys());
    }

    public isMonitoring(poolAddress: string): boolean {
        return this.activeProcessors.has(poolAddress);
    }
} 