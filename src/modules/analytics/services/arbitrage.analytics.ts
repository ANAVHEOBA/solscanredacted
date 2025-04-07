import { MarketService } from '../../market/market.service';
import { DexService } from '../../dex/dex.service';
import { AlertProcessor } from '../processors/alert.processor';
import { ArbitrageAlert, AlertSeverity } from '../interfaces/analytics.interface';

interface MarketPrice {
    marketId: string;
    price: number;
    timestamp: number;
}

interface ArbitrageOpportunity {
    tokenAddress: string;
    buyMarket: string;
    sellMarket: string;
    priceDifference: number;
    potentialProfit: number;
    timestamp: number;
}

export class ArbitrageAnalytics {
    private monitoredTokens: Set<string> = new Set();
    private priceHistory: Map<string, MarketPrice[]> = new Map();
    private readonly PRICE_HISTORY_LIMIT = 1000;
    private readonly MIN_PROFIT_THRESHOLD = 0.01; // 1% minimum profit threshold
    private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

    constructor(
        private marketService: MarketService,
        private dexService: DexService,
        private alertProcessor: AlertProcessor
    ) {}

    public async startMonitoring(tokenAddress: string): Promise<boolean> {
        if (this.monitoredTokens.has(tokenAddress)) {
            return false;
        }

        this.monitoredTokens.add(tokenAddress);
        await this.initializePriceHistory(tokenAddress);
        
        const interval = setInterval(
            () => this.analyzeArbitrageOpportunities(tokenAddress),
            30000 // Check every 30 seconds
        );
        
        this.monitoringIntervals.set(tokenAddress, interval);
        return true;
    }

    public stopMonitoring(tokenAddress: string): void {
        const interval = this.monitoringIntervals.get(tokenAddress);
        if (interval) {
            clearInterval(interval);
            this.monitoringIntervals.delete(tokenAddress);
        }
        this.monitoredTokens.delete(tokenAddress);
        this.priceHistory.delete(tokenAddress);
    }

    public isMonitoring(tokenAddress: string): boolean {
        return this.monitoredTokens.has(tokenAddress);
    }

    private async initializePriceHistory(tokenAddress: string): Promise<void> {
        try {
            const markets = await this.marketService.getMarketsForToken(tokenAddress);
            const prices: MarketPrice[] = [];
            
            for (const market of markets) {
                const marketInfo = await this.marketService.getMarketInfo(market.address);
                if (marketInfo && marketInfo.tokens_info) {
                    const price = this.calculatePrice(marketInfo.tokens_info);
                    prices.push({
                        marketId: market.address,
                        price,
                        timestamp: Date.now()
                    });
                }
            }
            
            this.priceHistory.set(tokenAddress, prices);
        } catch (error) {
            console.error(`Failed to initialize price history for token ${tokenAddress}:`, error);
        }
    }

    private calculatePrice(tokensInfo: any[]): number {
        if (tokensInfo.length !== 2) return 0;
        const [token0, token1] = tokensInfo;
        return token0.amount / token1.amount;
    }

    private async analyzeArbitrageOpportunities(tokenAddress: string): Promise<void> {
        try {
            const markets = await this.marketService.getMarketsForToken(tokenAddress);
            const currentPrices: MarketPrice[] = [];
            const opportunities: ArbitrageOpportunity[] = [];

            // Get current prices from all markets
            for (const market of markets) {
                const marketInfo = await this.marketService.getMarketInfo(market.address);
                if (marketInfo && marketInfo.tokens_info) {
                    const price = this.calculatePrice(marketInfo.tokens_info);
                    currentPrices.push({
                        marketId: market.address,
                        price,
                        timestamp: Date.now()
                    });
                }
            }

            // Find arbitrage opportunities
            for (let i = 0; i < currentPrices.length; i++) {
                for (let j = i + 1; j < currentPrices.length; j++) {
                    const market1 = currentPrices[i];
                    const market2 = currentPrices[j];
                    const priceDiff = Math.abs(market1.price - market2.price);
                    const avgPrice = (market1.price + market2.price) / 2;
                    const profitPercentage = priceDiff / avgPrice;

                    if (profitPercentage > this.MIN_PROFIT_THRESHOLD) {
                        const opportunity: ArbitrageOpportunity = {
                            tokenAddress,
                            buyMarket: market1.price < market2.price ? market1.marketId : market2.marketId,
                            sellMarket: market1.price < market2.price ? market2.marketId : market1.marketId,
                            priceDifference: priceDiff,
                            potentialProfit: profitPercentage,
                            timestamp: Date.now()
                        };
                        opportunities.push(opportunity);
                        
                        // Generate alert for significant arbitrage opportunity
                        await this.generateArbitrageAlert(opportunity);
                    }
                }
            }

            // Update price history
            this.updatePriceHistory(tokenAddress, currentPrices);

        } catch (error) {
            console.error(`Failed to analyze arbitrage opportunities for token ${tokenAddress}:`, error);
        }
    }

    private updatePriceHistory(tokenAddress: string, newPrices: MarketPrice[]): void {
        let history = this.priceHistory.get(tokenAddress) || [];
        history = [...history, ...newPrices];
        
        // Keep only the latest PRICE_HISTORY_LIMIT entries
        if (history.length > this.PRICE_HISTORY_LIMIT) {
            history = history.slice(history.length - this.PRICE_HISTORY_LIMIT);
        }
        
        this.priceHistory.set(tokenAddress, history);
    }

    private async generateArbitrageAlert(opportunity: ArbitrageOpportunity): Promise<void> {
        const severity: AlertSeverity = 
            opportunity.potentialProfit >= 0.05 ? 'HIGH' :
            opportunity.potentialProfit >= 0.02 ? 'MEDIUM' : 'LOW';

        const alert: ArbitrageAlert = {
            category: 'ARBITRAGE',
            type: 'PRICE_DIFFERENCE',
            severity,
            tokenAddress: opportunity.tokenAddress,
            buyMarket: opportunity.buyMarket,
            sellMarket: opportunity.sellMarket,
            timestamp: opportunity.timestamp,
            message: `Arbitrage opportunity detected: ${(opportunity.potentialProfit * 100).toFixed(2)}% profit potential`,
            metrics: {
                priceDifference: opportunity.priceDifference,
                profitPercentage: opportunity.potentialProfit,
                buyPrice: 0, // Add actual prices if available
                sellPrice: 0
            }
        };

        await this.alertProcessor.processAlert(alert);
    }
}

