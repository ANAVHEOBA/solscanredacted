// src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDatabase = async (): Promise<void> => {
    try {
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        console.log('Successfully disconnected from MongoDB.');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
        process.exit(1);
    }
};

export default { connectDatabase, disconnectDatabase };