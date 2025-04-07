import { LiquidityAnalytics } from '../services/liquidity.analytics';
import { Alert, AlertCategory, ActivityData } from '../interfaces/analytics.interface';

export type AlertHandler = (alert: Alert) => Promise<void>;

export class AlertProcessor {
    private alertHandlers: AlertHandler[] = [];
    private analytics: LiquidityAnalytics | null = null;
    private alertHistory: Map<string, Alert[]> = new Map();
    private swapHistory: Map<string, ActivityData[]> = new Map();

    constructor() {
        // Initialize with default console handler
        this.registerAlertHandler(AlertProcessor.consoleAlertHandler);
    }

    public static consoleAlertHandler: AlertHandler = async (alert: Alert) => {
        console.log(`[${alert.severity}] ${alert.message}`);
    };

    public setAnalytics(analytics: LiquidityAnalytics): void {
        this.analytics = analytics;
    }

    public registerAlertHandler(handler: AlertHandler): void {
        if (handler) {
            this.alertHandlers.push(handler);
        }
    }

    public async processSwapActivity(activity: ActivityData): Promise<void> {
        // Store swap in history
        const poolKey = this.getPoolKey(activity);
        const swaps = this.swapHistory.get(poolKey) || [];
        swaps.push(activity);
        
        // Keep last 100 swaps per pool
        if (swaps.length > 100) {
            swaps.shift();
        }
        this.swapHistory.set(poolKey, swaps);

        // Analyze for patterns
        await this.analyzeSwapPatterns(activity, swaps);
    }

    private async analyzeSwapPatterns(current: ActivityData, history: ActivityData[]): Promise<void> {
        const ANALYSIS_WINDOW = 3600; // 1 hour in seconds
        const recentSwaps = history.filter(swap => 
            current.block_time - swap.block_time < ANALYSIS_WINDOW
        );

        // 1. High frequency trading detection
        if (recentSwaps.length >= 10) {
            const fromAddresses = new Set(recentSwaps.map(swap => swap.from_address));
            if (fromAddresses.size <= 3) {
                await this.processAlert({
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

        // 2. Price impact analysis
        if (history.length >= 2) {
            const previousSwap = history[history.length - 2];
            const currentPrice = current.routers.amount2 / current.routers.amount1;
            const previousPrice = previousSwap.routers.amount2 / previousSwap.routers.amount1;
            const priceChange = Math.abs((currentPrice - previousPrice) / previousPrice * 100);

            if (priceChange > 5) {
                await this.processAlert({
                    category: 'ARBITRAGE',
                    type: 'PRICE_DIFFERENCE',
                    severity: priceChange > 10 ? 'HIGH' : 'MEDIUM',
                    timestamp: current.block_time,
                    message: `Significant price impact detected: ${priceChange.toFixed(2)}% change in single swap`,
                    tokenAddress: current.routers.token1,
                    buyMarket: current.platform[0],
                    sellMarket: current.platform[1],
                    metrics: {
                        priceDifference: priceChange,
                        profitPercentage: priceChange,
                        buyPrice: currentPrice,
                        sellPrice: previousPrice
                    }
                });
            }
        }
    }

    public async processAlert(alert: Alert): Promise<void> {
        // Store alert in history
        const key = this.getAlertKey(alert);
        const alerts = this.alertHistory.get(key) || [];
        alerts.push(alert);
        if (alerts.length > 100) {
            alerts.shift();
        }
        this.alertHistory.set(key, alerts);

        // Process alert through handlers
        await Promise.all(this.alertHandlers.map(handler => handler(alert)));
    }

    public getAlerts(category: AlertCategory, address: string): Alert[] {
        const key = `${category}:${address}`;
        return this.alertHistory.get(key) || [];
    }

    public getAlertCount(category: AlertCategory, address: string): number {
        const key = `${category}:${address}`;
        return this.alertHistory.get(key)?.length || 0;
    }

    private getAlertKey(alert: Alert): string {
        if ('poolAddress' in alert) {
            return `${alert.category}:${alert.poolAddress}`;
        }
        if ('tokenAddress' in alert) {
            return `${alert.category}:${alert.tokenAddress}`;
        }
        throw new Error('Invalid alert format: missing address identifier');
    }

    private getPoolKey(activity: ActivityData): string {
        return `${activity.platform[0]}:${activity.routers.token1}:${activity.routers.token2}`;
    }
}
