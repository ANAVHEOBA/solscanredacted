// src/index.ts
import { createServer, Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import createApp from './app';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Connect to MongoDB
        await connectDatabase();
        logger.info('Connected to MongoDB');

        // Create HTTP server
        const server: HttpServer = createServer();

        // Initialize Socket.IO
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Create Express app and get WebSocket service
        const { app: expressApp, webSocketService } = createApp(server);

        // WebSocket connection handling
        io.on('connection', (socket) => {
            logger.info('Client connected');

            socket.on('subscribe:pool', (poolAddress: string) => {
                socket.join(`pool:${poolAddress}`);
                logger.info(`Client subscribed to pool: ${poolAddress}`);
            });

            socket.on('unsubscribe:pool', (poolAddress: string) => {
                socket.leave(`pool:${poolAddress}`);
                logger.info(`Client unsubscribed from pool: ${poolAddress}`);
            });

            socket.on('disconnect', () => {
                logger.info('Client disconnected');
            });
        });

        // Start server
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`WebSocket server initialized`);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();