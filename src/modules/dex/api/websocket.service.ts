import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ActivityDatabase } from '../storage/activity.database';
import { PoolStateDatabase } from '../storage/pool.state.database';
import { logger } from '../../../utils/logger';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class DexWebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private subscribedPools: Map<string, Set<string>> = new Map();
    private subscribedActivities: Map<string, Set<string>> = new Map();

    constructor(
        private readonly activityDatabase: ActivityDatabase,
        private readonly poolStateDatabase: PoolStateDatabase
    ) {}

    handleConnection(client: Socket) {
        logger.info(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        logger.info(`Client disconnected: ${client.id}`);
        this.cleanupSubscriptions(client.id);
    }

    @SubscribeMessage('subscribe:pool')
    async handlePoolSubscription(client: Socket, poolAddress: string) {
        try {
            if (!this.subscribedPools.has(poolAddress)) {
                this.subscribedPools.set(poolAddress, new Set());
            }
            this.subscribedPools.get(poolAddress)?.add(client.id);
            logger.info(`Client ${client.id} subscribed to pool ${poolAddress}`);

            // Send current pool state
            const state = await this.poolStateDatabase.getPoolState(poolAddress);
            if (state) {
                client.emit('pool:update', state);
            }
        } catch (error) {
            logger.error('Error handling pool subscription:', error);
            client.emit('error', { message: 'Failed to subscribe to pool' });
        }
    }

    @SubscribeMessage('unsubscribe:pool')
    handlePoolUnsubscription(client: Socket, poolAddress: string) {
        this.subscribedPools.get(poolAddress)?.delete(client.id);
        logger.info(`Client ${client.id} unsubscribed from pool ${poolAddress}`);
    }

    @SubscribeMessage('subscribe:activity')
    async handleActivitySubscription(client: Socket, activityId: string) {
        try {
            if (!this.subscribedActivities.has(activityId)) {
                this.subscribedActivities.set(activityId, new Set());
            }
            this.subscribedActivities.get(activityId)?.add(client.id);
            logger.info(`Client ${client.id} subscribed to activity ${activityId}`);

            // Send current activity state
            const activity = await this.activityDatabase.getActivity(activityId);
            if (activity) {
                client.emit('activity:update', activity);
            }
        } catch (error) {
            logger.error('Error handling activity subscription:', error);
            client.emit('error', { message: 'Failed to subscribe to activity' });
        }
    }

    @SubscribeMessage('unsubscribe:activity')
    handleActivityUnsubscription(client: Socket, activityId: string) {
        this.subscribedActivities.get(activityId)?.delete(client.id);
        logger.info(`Client ${client.id} unsubscribed from activity ${activityId}`);
    }

    public async broadcastPoolUpdate(poolAddress: string, state: any) {
        const subscribers = this.subscribedPools.get(poolAddress);
        if (subscribers) {
            for (const clientId of subscribers) {
                const client = this.server.sockets.sockets.get(clientId);
                if (client) {
                    client.emit('pool:update', state);
                }
            }
        }
    }

    public async broadcastActivityUpdate(activityId: string, activity: any) {
        const subscribers = this.subscribedActivities.get(activityId);
        if (subscribers) {
            for (const clientId of subscribers) {
                const client = this.server.sockets.sockets.get(clientId);
                if (client) {
                    client.emit('activity:update', activity);
                }
            }
        }
    }

    private cleanupSubscriptions(clientId: string) {
        // Cleanup pool subscriptions
        for (const [poolAddress, subscribers] of this.subscribedPools) {
            subscribers.delete(clientId);
            if (subscribers.size === 0) {
                this.subscribedPools.delete(poolAddress);
            }
        }

        // Cleanup activity subscriptions
        for (const [activityId, subscribers] of this.subscribedActivities) {
            subscribers.delete(clientId);
            if (subscribers.size === 0) {
                this.subscribedActivities.delete(activityId);
            }
        }
    }
} 