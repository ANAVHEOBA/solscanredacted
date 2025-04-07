import dotenv from 'dotenv';

dotenv.config();

interface ApiConfig {
    port: number;
    solscanApiKey: string | undefined;
    solscanBaseUrl: string;
    environment: string;
}

export const apiConfig: ApiConfig = {
    port: Number(process.env.PORT) || 3000,
    solscanApiKey: process.env.SOLSCAN_API_KEY,
    solscanBaseUrl: 'https://pro-api.solscan.io/v2.0',
    environment: process.env.NODE_ENV || 'development',
};

export default apiConfig;
