// src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // 5 seconds

export const connectDatabase = async (retryCount = 0): Promise<void> => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        // Configure mongoose
        mongoose.set('strictQuery', true);
        
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        // Handle connection events
        mongoose.connection.on('connected', () => {
            logger.info('MongoDB connection established');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
            if (retryCount < MAX_RETRIES) {
                logger.info(`Retrying connection... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
                setTimeout(() => connectDatabase(retryCount + 1), RETRY_INTERVAL);
            } else {
                logger.error('Max retry attempts reached. Exiting...');
                process.exit(1);
            }
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
            if (retryCount < MAX_RETRIES) {
                setTimeout(() => connectDatabase(retryCount + 1), RETRY_INTERVAL);
            }
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await disconnectDatabase();
        });

        logger.info('Successfully connected to MongoDB.');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        if (retryCount < MAX_RETRIES) {
            logger.info(`Retrying connection... Attempt ${retryCount + 1}/${MAX_RETRIES}`);
            setTimeout(() => connectDatabase(retryCount + 1), RETRY_INTERVAL);
        } else {
            logger.error('Max retry attempts reached. Exiting...');
            process.exit(1);
        }
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.info('Successfully disconnected from MongoDB.');
    } catch (error) {
        logger.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
};

export default { connectDatabase, disconnectDatabase };