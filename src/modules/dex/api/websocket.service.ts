import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DexService } from '../dex.service';
import { logger } from '../../../utils/logger';

@Injectable()
export class WebSocketService {
    private server?: Server;
    private readonly connectedClients: Map<string, Set<Socket>> = new Map();

    constructor(private readonly dexService: DexService) {}

    setServer(server: Server) {
        this.server = server;
        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.server) {
            throw new Error('Server not initialized');
        }

        this.server.on('connection', (socket: Socket) => {
            logger.info('Client connected');

            socket.on('subscribe:pool', (poolAddress: string) => {
                this.subscribeToPool(socket, poolAddress);
            });

            socket.on('unsubscribe:pool', (poolAddress: string) => {
                this.unsubscribeFromPool(socket, poolAddress);
            });

            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });
        });
    }

    private subscribeToPool(client: Socket, poolAddress: string) {
        if (!this.server) {
            throw new Error('Server not initialized');
        }

        if (!this.connectedClients.has(poolAddress)) {
            this.connectedClients.set(poolAddress, new Set());
        }
        this.connectedClients.get(poolAddress)?.add(client);
        client.join(`pool:${poolAddress}`);
        logger.info(`Client subscribed to pool: ${poolAddress}`);
    }

    private unsubscribeFromPool(client: Socket, poolAddress: string) {
        if (!this.server) {
            throw new Error('Server not initialized');
        }

        this.connectedClients.get(poolAddress)?.delete(client);
        client.leave(`pool:${poolAddress}`);
        logger.info(`Client unsubscribed from pool: ${poolAddress}`);
    }

    private handleDisconnect(client: Socket) {
        this.connectedClients.forEach((clients, poolAddress) => {
            if (clients.has(client)) {
                this.unsubscribeFromPool(client, poolAddress);
            }
        });
        logger.info('Client disconnected');
    }

    public broadcastToPool(poolAddress: string, event: string, data: any) {
        if (!this.server) {
            throw new Error('Server not initialized');
        }

        this.server.to(`pool:${poolAddress}`).emit(event, data);
    }

    public getSubscribedClients(poolAddress: string): Set<Socket> {
        return this.connectedClients.get(poolAddress) || new Set();
    }
} 