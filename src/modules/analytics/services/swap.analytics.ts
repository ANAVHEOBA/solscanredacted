import { ActivityData, Alert, AlertCategory } from '../interfaces/analytics.interface';
import { AlertProcessor } from '../processors/alert.processor';

export class SwapAnalytics {
    private monitoredPools: Set<string> = new Set();
    private swapHistory: Map<string, ActivityData[]> = new Map();
    private readonly ANALYSIS_WINDOW = 3600; // 1 hour in seconds
    private readonly MAX_HISTORY_PER_POOL = 1000;

    constructor(
        private alertProcessor: AlertProcessor
    ) {}

    public startMonitoring(poolAddress: string): boolean {
        if (this.monitoredPools.has(poolAddress)) {
            return false;
        }
        this.monitoredPools.add(poolAddress);
        return true;
    }

    public stopMonitoring(poolAddress: string): void {
        this.monitoredPools.delete(poolAddress);
    }

    public isMonitoring(poolAddress: string): boolean {
        return this.monitoredPools.has(poolAddress);
    }

    public async processSwapActivity(activity: ActivityData): Promise<void> {
        const poolKey = this.getPoolKey(activity);
        if (!this.monitoredPools.has(poolKey)) {
            return;
        }

        // Store swap in history
        const swaps = this.swapHistory.get(poolKey) || [];
        swaps.push(activity);
        if (swaps.length > this.MAX_HISTORY_PER_POOL) {
            swaps.shift();
        }
        this.swapHistory.set(poolKey, swaps);

        // Analyze patterns
        await this.analyzeSwapPatterns(activity, swaps);
    }

    public async getSwapHistory(poolAddress: string, timeframe: number): Promise<ActivityData[]> {
        const swaps = this.swapHistory.get(poolAddress) || [];
        const now = Math.floor(Date.now() / 1000);
        return swaps.filter(swap => now - swap.block_time < timeframe);
    }

    private async analyzeSwapPatterns(current: ActivityData, history: ActivityData[]): Promise<void> {
        const recentSwaps = history.filter(swap => 
            current.block_time - swap.block_time < this.ANALYSIS_WINDOW
        );

        // 1. High frequency trading detection
        await this.detectHighFrequencyTrading(current, recentSwaps);

        // 2. Large swap detection
        await this.detectLargeSwaps(current, recentSwaps);

        // 3. Price impact analysis
        await this.analyzePriceImpact(current, recentSwaps);

        // 4. Multi-hop analysis
        if (current.routers.child_routers && current.routers.child_routers.length > 1) {
            await this.analyzeMultiHopSwap(current);
        }
    }

    private async detectHighFrequencyTrading(current: ActivityData, recentSwaps: ActivityData[]): Promise<void> {
        const fromAddresses = new Set(recentSwaps.map(swap => swap.from_address));
        if (recentSwaps.length >= 10 && fromAddresses.size <= 3) {
            await this.alertProcessor.processAlert({
                category: 'ARBITRAGE',
                type: 'HIGH_FREQUENCY_TRADING',
                severity: 'HIGH',
                timestamp: current.block_time,
                message: `High frequency trading detected: ${recentSwaps.length} swaps in last hour from ${fromAddresses.size} addresses`,
                tokenAddress: current.routers.token1,
                buyMarket: current.platform[0],
                sellMarket: current.platform[1],
                metrics: {
                    priceDifference: 0,
                    profitPercentage: 0,
                    buyPrice: parseFloat(current.routers.amount1.toString()) / Math.pow(10, current.routers.token1_decimals),
                    sellPrice: parseFloat(current.routers.amount2.toString()) / Math.pow(10, current.routers.token2_decimals)
                }
            });
        }
    }

    private async detectLargeSwaps(current: ActivityData, recentSwaps: ActivityData[]): Promise<void> {
        const avgAmount = recentSwaps.reduce((sum, swap) => sum + swap.value, 0) / recentSwaps.length;
        const currentAmount = current.value;

        if (currentAmount > avgAmount * 5) {
            await this.alertProcessor.processAlert({
                category: 'VOLUME',
                type: 'VOLUME_SPIKE',
                severity: 'HIGH',
                timestamp: current.block_time,
                message: `Large swap detected: ${currentAmount} vs avg ${avgAmount}`,
                poolAddress: this.getPoolKey(current),
                metrics: {
                    currentVolume: currentAmount,
                    change: (currentAmount - avgAmount) / avgAmount * 100,
                    timeframe: this.ANALYSIS_WINDOW
                }
            });
        }
    }

    private async analyzePriceImpact(current: ActivityData, recentSwaps: ActivityData[]): Promise<void> {
        if (recentSwaps.length < 2) return;

        const previousSwap = recentSwaps[recentSwaps.length - 2];
        const currentPrice = current.routers.amount2 / current.routers.amount1;
        const previousPrice = previousSwap.routers.amount2 / previousSwap.routers.amount1;
        const priceChange = Math.abs((currentPrice - previousPrice) / previousPrice * 100);

        if (priceChange > 5) {
            await this.alertProcessor.processAlert({
                category: 'PRICE',
                type: 'PRICE_SPIKE',
                severity: priceChange > 10 ? 'HIGH' : 'MEDIUM',
                timestamp: current.block_time,
                message: `Significant price impact detected: ${priceChange.toFixed(2)}% change`,
                tokenAddress: current.routers.token1,
                metrics: {
                    currentPrice: currentPrice,
                    priceChange: priceChange,
                    volatility: this.calculateVolatility(recentSwaps)
                }
            });
        }
    }

    private async analyzeMultiHopSwap(activity: ActivityData): Promise<void> {
        const hops = activity.routers.child_routers!;
        let totalSlippage = 0;
        
        for (let i = 0; i < hops.length - 1; i++) {
            const currentHop = hops[i];
            const nextHop = hops[i + 1];
            
            const expectedRate = parseFloat(currentHop.amount2) / parseFloat(currentHop.amount1);
            const actualRate = parseFloat(nextHop.amount2) / parseFloat(nextHop.amount1);
            const slippage = Math.abs((actualRate - expectedRate) / expectedRate * 100);
            
            totalSlippage += slippage;
        }

        if (totalSlippage > 1) {
            await this.alertProcessor.processAlert({
                category: 'ARBITRAGE',
                type: 'MARKET_INEFFICIENCY',
                severity: totalSlippage > 3 ? 'HIGH' : 'MEDIUM',
                timestamp: activity.block_time,
                message: `High slippage in multi-hop swap: ${totalSlippage.toFixed(2)}%`,
                tokenAddress: activity.routers.token1,
                buyMarket: activity.platform[0],
                sellMarket: activity.platform[1],
                metrics: {
                    priceDifference: totalSlippage,
                    profitPercentage: 0,
                    buyPrice: parseFloat(activity.routers.amount1.toString()),
                    sellPrice: parseFloat(activity.routers.amount2.toString())
                }
            });
        }
    }

    private calculateVolatility(swaps: ActivityData[]): number {
        const prices = swaps.map(swap => swap.routers.amount2 / swap.routers.amount1);
        const mean = prices.reduce((a, b) => a + b) / prices.length;
        const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
        return Math.sqrt(variance);
    }

    private getPoolKey(activity: ActivityData): string {
        return `${activity.platform[0]}:${activity.routers.token1}:${activity.routers.token2}`;
    }
}
