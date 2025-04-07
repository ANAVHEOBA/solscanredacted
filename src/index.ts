// src/index.ts
import { createServer } from 'http';
import createApp from './app';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Connect to MongoDB
        await connectDatabase();
        logger.info('Connected to MongoDB');

        // Create Express app and get WebSocket service
        const { app, webSocketService } = createApp();

        // Create HTTP server
        const server = createServer(app);

        // Initialize WebSocket service with server
        Object.defineProperty(webSocketService, 'io', {
            value: webSocketService['io'].attach(server),
            writable: false
        });

        // Start server
        server.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();