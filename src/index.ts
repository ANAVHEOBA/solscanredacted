// src/index.ts
import { createServer, Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import createApp from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;
let server: HttpServer;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // Give time for logs to be written
    setTimeout(() => process.exit(1), 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
    try {
        // Connect to MongoDB
        await connectDatabase();
        logger.info('Connected to MongoDB');

        // Create HTTP server
        server = createServer();

        // Initialize Socket.IO with ping timeout and interval
        const io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            },
            pingTimeout: 60000,
            pingInterval: 25000
        });

        // Create Express app and get WebSocket service
        const { app: expressApp, webSocketService } = await createApp(server);

        // Mount express app on the server
        server.on('request', expressApp);

        // Start server
        server.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`WebSocket server initialized`);
        });

        // Graceful shutdown
        const shutdown = async () => {
            logger.info('Shutting down gracefully...');
            
            // Close server first to stop accepting new connections
            server.close(() => {
                logger.info('HTTP server closed');
            });

            // Close WebSocket connections
            io.close(() => {
                logger.info('WebSocket server closed');
            });

            // Disconnect from MongoDB
            await disconnectDatabase();

            // Exit process
            process.exit(0);
        };

        // Handle shutdown signals
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();