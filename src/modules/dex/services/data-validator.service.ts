import { Injectable } from '@nestjs/common';
import { logger } from '../../../utils/logger';

@Injectable()
export class DataValidatorService {
    validatePoolAddress(address: string): boolean {
        if (!address || typeof address !== 'string') {
            return false;
        }
        // Basic Solana address validation (base58 string of length 32-44)
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    }

    validateTokenAddress(address: string): boolean {
        // Solana address validation - base58 characters, length between 32-44
        const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
        const isValidFormat = base58Regex.test(address);
        
        if (!isValidFormat) {
            this.logValidationError('validateTokenAddress', `Invalid address format: ${address}`);
            return false;
        }
        
        return true;
    }

    validateAmount(amount: string | number): boolean {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return !isNaN(num) && num >= 0;
    }

    validateTimestamp(timestamp: number): boolean {
        const now = Date.now();
        return timestamp > 0 && timestamp <= now;
    }

    validatePagination(page: number, pageSize: number): boolean {
        return page > 0 && pageSize > 0 && pageSize <= 100;
    }

    validateTimeRange(startTime: number, endTime: number): boolean {
        if (typeof startTime !== 'number' || typeof endTime !== 'number') {
            return false;
        }
        if (startTime < 0 || endTime < 0) {
            return false;
        }
        if (startTime > endTime) {
            return false;
        }
        if (endTime > Date.now() + 86400000) { // Not more than 24h in future
            return false;
        }
        return true;
    }

    validateLimit(limit: number): boolean {
        return Number.isInteger(limit) && limit > 0 && limit <= 100;
    }

    validateAddress(address: string): boolean {
        if (!address || typeof address !== 'string') {
            return false;
        }
        // Basic Solana address validation (base58 string of length 32-44)
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    }

    logValidationError(context: string, error: string): void {
        logger.error(`Validation error in ${context}: ${error}`);
    }
} 