import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { logger } from '../../../utils/logger';

interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

@Injectable()
export class DexApiClient {
    private readonly client;

    constructor(private readonly baseUrl: string = 'https://pro-api.solscan.io/v2.0') {
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 30000, // 30 second timeout
            headers: {
                'token': process.env.SOLSCAN_API_KEY || '',
                'Content-Type': 'application/json'
            }
        });
    }

    async get<T>(endpoint: string, params?: any): Promise<T> {
        try {
            const response = await this.client.get<T>(endpoint, { params });
            return response.data;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as {
                    response?: { status: number; data: any };
                    request?: any;
                    message?: string;
                };

                if (axiosError.response) {
                    logger.error('API request failed with response:', {
                        status: axiosError.response.status,
                        responseData: axiosError.response.data,
                        endpoint,
                        params
                    });

                    if (axiosError.response.status === 429) {
                        throw new Error('Rate limit exceeded. Please try again later.');
                    }

                    throw new Error(`API request failed with status ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`);
                } else if (axiosError.request) {
                    logger.error('No response received from API:', {
                        request: axiosError.request,
                        endpoint,
                        params
                    });
                    throw new Error('No response received from API. Please try again later.');
                } else {
                    logger.error('Error setting up API request:', {
                        message: axiosError.message || 'Unknown error',
                        endpoint,
                        params
                    });
                    throw new Error(`Error setting up API request: ${axiosError.message || 'Unknown error'}`);
                }
            }

            logger.error('Unknown error:', {
                error,
                endpoint,
                params
            });
            throw new Error('An unknown error occurred');
        }
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response = await this.client.post<T>(endpoint, data);
            return response.data;
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as {
                    response?: { status: number; data: any };
                    request?: any;
                    message?: string;
                };

                if (axiosError.response) {
                    logger.error('API request failed with response:', {
                        status: axiosError.response.status,
                        responseData: axiosError.response.data,
                        endpoint,
                        requestData: data
                    });

                    if (axiosError.response.status === 429) {
                        throw new Error('Rate limit exceeded. Please try again later.');
                    }

                    throw new Error(`API request failed with status ${axiosError.response.status}: ${JSON.stringify(axiosError.response.data)}`);
                } else if (axiosError.request) {
                    logger.error('No response received from API:', {
                        request: axiosError.request,
                        endpoint,
                        requestData: data
                    });
                    throw new Error('No response received from API. Please try again later.');
                } else {
                    logger.error('Error setting up API request:', {
                        message: axiosError.message || 'Unknown error',
                        endpoint,
                        requestData: data
                    });
                    throw new Error(`Error setting up API request: ${axiosError.message || 'Unknown error'}`);
                }
            }

            logger.error('Unknown error:', {
                error,
                endpoint,
                requestData: data
            });
            throw new Error('An unknown error occurred');
        }
    }
} 