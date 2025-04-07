import { logger } from '../../../utils/logger';

export interface PoolState {
    address: string;
    token1: {
        address: string;
        reserves: number;
        decimals: number;
    };
    token2: {
        address: string;
        reserves: number;
        decimals: number;
    };
    timestamp: number;
    volume24h: number;
    fees24h: number;
    price: number;
    liquidity: number;
}

export interface PoolMetrics {
    address: string;
    timestamp: number;
    metrics: {
        volume: number;
        fees: number;
        price: number;
        liquidity: number;
        priceChange24h: number;
        volumeChange24h: number;
    };
}

export class PoolStateDatabase {
    private poolStates: Map<string, PoolState> = new Map();
    private poolMetrics: Map<string, PoolMetrics> = new Map();
    private poolHistory: Map<string, PoolState[]> = new Map();

    public async updatePoolState(state: PoolState): Promise<void> {
        try {
            // Update current state
            this.poolStates.set(state.address, state);

            // Update history
            if (!this.poolHistory.has(state.address)) {
                this.poolHistory.set(state.address, []);
            }
            this.poolHistory.get(state.address)?.push(state);

            // Update metrics
            await this.updatePoolMetrics(state);

            logger.info(`Updated pool state for ${state.address}`);
        } catch (error) {
            logger.error('Error updating pool state:', error);
            throw error;
        }
    }

    public async getPoolState(address: string): Promise<PoolState | undefined> {
        return this.poolStates.get(address);
    }

    public async getPoolMetrics(address: string): Promise<PoolMetrics | undefined> {
        return this.poolMetrics.get(address);
    }

    public async getPoolHistory(
        address: string,
        startTime?: number,
        endTime?: number
    ): Promise<PoolState[]> {
        const history = this.poolHistory.get(address) || [];
        
        if (startTime && endTime) {
            return history.filter(
                state => state.timestamp >= startTime && state.timestamp <= endTime
            );
        }

        return history;
    }

    private async updatePoolMetrics(state: PoolState): Promise<void> {
        const currentMetrics = this.poolMetrics.get(state.address) || {
            address: state.address,
            timestamp: state.timestamp,
            metrics: {
                volume: 0,
                fees: 0,
                price: 0,
                liquidity: 0,
                priceChange24h: 0,
                volumeChange24h: 0
            }
        };

        const history = this.poolHistory.get(state.address) || [];
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        // Calculate 24h metrics
        const recentStates = history.filter(s => s.timestamp >= oneDayAgo);
        const volume24h = recentStates.reduce((sum, s) => sum + s.volume24h, 0);
        const fees24h = recentStates.reduce((sum, s) => sum + s.fees24h, 0);

        // Calculate price change
        const oldestState = recentStates[0];
        const priceChange24h = oldestState
            ? ((state.price - oldestState.price) / oldestState.price) * 100
            : 0;

        // Calculate volume change
        const volumeChange24h = oldestState
            ? ((volume24h - oldestState.volume24h) / oldestState.volume24h) * 100
            : 0;

        const updatedMetrics: PoolMetrics = {
            address: state.address,
            timestamp: state.timestamp,
            metrics: {
                volume: volume24h,
                fees: fees24h,
                price: state.price,
                liquidity: state.liquidity,
                priceChange24h,
                volumeChange24h
            }
        };

        this.poolMetrics.set(state.address, updatedMetrics);
    }

    public async clearOldStates(maxAge: number): Promise<void> {
        const currentTime = Date.now();

        // Clear old states from history
        for (const [address, history] of this.poolHistory) {
            const filteredHistory = history.filter(
                state => currentTime - state.timestamp <= maxAge
            );
            this.poolHistory.set(address, filteredHistory);
        }

        // Clear old metrics
        for (const [address, metrics] of this.poolMetrics) {
            if (currentTime - metrics.timestamp > maxAge) {
                this.poolMetrics.delete(address);
            }
        }
    }

    public async getTopPoolsByVolume(limit: number = 10): Promise<PoolMetrics[]> {
        const allMetrics = Array.from(this.poolMetrics.values());
        return allMetrics
            .sort((a, b) => b.metrics.volume - a.metrics.volume)
            .slice(0, limit);
    }

    public async getTopPoolsByLiquidity(limit: number = 10): Promise<PoolMetrics[]> {
        const allMetrics = Array.from(this.poolMetrics.values());
        return allMetrics
            .sort((a, b) => b.metrics.liquidity - a.metrics.liquidity)
            .slice(0, limit);
    }
} 