import { MarketService } from '../../market/market.service';
import { TokenService } from '../../token/token.service';
import { AlertProcessor } from '../processors/alert.processor';
import { PriceAlert, PriceMetrics, SupportResistanceLevel } from '../interfaces/analytics.interface';

export class PriceAnalytics {
    private monitoredTokens: Set<string> = new Set();
    private priceHistory: Map<string, PriceMetrics[]> = new Map();
    private supportResistanceLevels: Map<string, SupportResistanceLevel[]> = new Map();
    private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

    constructor(
        private marketService: MarketService,
        private tokenService: TokenService,
        private alertProcessor: AlertProcessor
    ) {}

    public async startMonitoring(tokenAddress: string): Promise<boolean> {
        if (this.monitoredTokens.has(tokenAddress)) {
            return false;
        }

        try {
            // Initialize price history
            const priceData = await this.tokenService.getTokenPrice({ address: tokenAddress });
            if (!priceData || !priceData.length) {
                throw new Error('Failed to fetch initial price data');
            }

            this.priceHistory.set(tokenAddress, []);
            this.monitoredTokens.add(tokenAddress);

            // Start periodic monitoring
            const interval = setInterval(async () => {
                await this.analyzeToken(tokenAddress);
            }, 5 * 60 * 1000); // Every 5 minutes

            this.monitoringIntervals.set(tokenAddress, interval);
            await this.analyzeToken(tokenAddress);

            return true;
        } catch (error) {
            console.error(`Failed to start monitoring token ${tokenAddress}:`, error);
            return false;
        }
    }

    public stopMonitoring(tokenAddress: string): void {
        const interval = this.monitoringIntervals.get(tokenAddress);
        if (interval) {
            clearInterval(interval);
            this.monitoringIntervals.delete(tokenAddress);
        }
        this.monitoredTokens.delete(tokenAddress);
        this.priceHistory.delete(tokenAddress);
        this.supportResistanceLevels.delete(tokenAddress);
    }

    public isMonitoring(tokenAddress: string): boolean {
        return this.monitoredTokens.has(tokenAddress);
    }

    private async analyzeToken(tokenAddress: string): Promise<void> {
        try {
            const priceData = await this.tokenService.getTokenPrice({ address: tokenAddress });
            if (!priceData || !priceData.length) {
                return;
            }

            const currentPrice = priceData[priceData.length - 1].price;
            const history = this.priceHistory.get(tokenAddress) || [];
            
            // Calculate metrics
            const metrics: PriceMetrics = {
                timestamp: Date.now(),
                price: currentPrice,
                momentum: this.calculateMomentum(history, currentPrice),
                volatility: this.calculateVolatility(history)
            };

            // Update price history
            history.push(metrics);
            if (history.length > 100) { // Keep last 100 data points
                history.shift();
            }
            this.priceHistory.set(tokenAddress, history);

            // Update support/resistance levels
            this.updateSupportResistanceLevels(tokenAddress, history);

            // Check for patterns
            await this.detectPatterns(tokenAddress, history);

        } catch (error) {
            console.error(`Error analyzing token ${tokenAddress}:`, error);
        }
    }

    private calculateMomentum(history: PriceMetrics[], currentPrice: number): number {
        if (history.length < 2) return 0;
        const previousPrice = history[history.length - 1].price;
        return ((currentPrice - previousPrice) / previousPrice) * 100;
    }

    private calculateVolatility(history: PriceMetrics[]): number {
        if (history.length < 2) return 0;
        const prices = history.map(h => h.price);
        const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
        const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
        return Math.sqrt(variance);
    }

    private updateSupportResistanceLevels(tokenAddress: string, history: PriceMetrics[]): void {
        if (history.length < 10) return;

        const prices = history.map(h => h.price);
        const levels = this.supportResistanceLevels.get(tokenAddress) || [];

        // Simple algorithm to detect support/resistance levels
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min;
        const threshold = range * 0.02; // 2% of price range

        // Find price levels where price bounces off
        for (let i = 1; i < prices.length - 1; i++) {
            if (Math.abs(prices[i] - prices[i - 1]) < threshold &&
                Math.abs(prices[i] - prices[i + 1]) < threshold) {
                levels.push({
                    price: prices[i],
                    type: prices[i + 1] > prices[i] ? 'support' : 'resistance',
                    strength: 1,
                    timestamp: history[i].timestamp
                });
            }
        }

        // Keep only strongest levels
        const filteredLevels = levels
            .sort((a, b) => b.strength - a.strength)
            .slice(0, 5);

        this.supportResistanceLevels.set(tokenAddress, filteredLevels);
    }

    private async detectPatterns(tokenAddress: string, history: PriceMetrics[]): Promise<void> {
        if (history.length < 5) return;

        const recentPrices = history.slice(-5);
        const priceChanges = recentPrices.map((m, i) => 
            i === 0 ? 0 : ((m.price - recentPrices[i-1].price) / recentPrices[i-1].price) * 100
        );

        // Detect sudden spikes (>5% change in 5 minutes)
        if (Math.abs(priceChanges[priceChanges.length - 1]) > 5) {
            const alert: PriceAlert = {
                category: 'PRICE',
                type: 'PRICE_SPIKE',
                severity: 'HIGH',
                tokenAddress,
                timestamp: Date.now(),
                message: `Sudden ${priceChanges[priceChanges.length - 1] > 0 ? 'upward' : 'downward'} price movement detected`,
                metrics: {
                    priceChange: priceChanges[priceChanges.length - 1],
                    currentPrice: history[history.length - 1].price,
                    momentum: history[history.length - 1].momentum,
                    volatility: history[history.length - 1].volatility
                }
            };
            await this.alertProcessor.processAlert(alert);
        }

        // Detect trend reversals
        const trendReversed = priceChanges.slice(-3).every((change, i) => 
            i === 0 ? true : Math.sign(change) !== Math.sign(priceChanges[priceChanges.length - 4])
        );

        if (trendReversed) {
            const alert: PriceAlert = {
                category: 'PRICE',
                type: 'TREND_REVERSAL',
                severity: 'MEDIUM',
                tokenAddress,
                timestamp: Date.now(),
                message: 'Potential trend reversal detected',
                metrics: {
                    priceChange: priceChanges[priceChanges.length - 1],
                    currentPrice: history[history.length - 1].price,
                    momentum: history[history.length - 1].momentum,
                    volatility: history[history.length - 1].volatility
                }
            };
            await this.alertProcessor.processAlert(alert);
        }
    }
}
