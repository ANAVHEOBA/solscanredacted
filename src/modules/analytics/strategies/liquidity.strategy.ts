import { 
    LiquidityMetrics, 
    LiquidityChange, 
    LiquidityAlert 
} from '../interfaces/analytics.interface';
import { LIQUIDITY_THRESHOLDS, TIME_WINDOWS } from '../constants/thresholds';
import { 
    calculatePercentageChange,
    calculateMovingAverage,
    detectOutliers,
    calculateVelocity
} from '../utils/statistical.utils';

export class LiquidityStrategy {
    private historicalMetrics: Map<string, LiquidityMetrics[]> = new Map();
    private recentChanges: Map<string, LiquidityChange[]> = new Map();

    public analyzeLiquidityChange(
        poolAddress: string,
        currentMetrics: LiquidityMetrics,
        change: LiquidityChange
    ): LiquidityAlert[] {
        console.log('\n=== Starting Liquidity Analysis ===');
        console.log('Pool Address:', poolAddress);
        console.log('Current Metrics:', {
            totalLiquidity: currentMetrics.totalLiquidity,
            token1: {
                symbol: currentMetrics.token1.symbol,
                amount: currentMetrics.token1.amount,
                value: currentMetrics.token1.value
            },
            token2: {
                symbol: currentMetrics.token2.symbol,
                amount: currentMetrics.token2.amount,
                value: currentMetrics.token2.value
            },
            volume24h: currentMetrics.volume24h
        });
        console.log('Change Details:', {
            type: change.changeType,
            token1Change: change.token1Change,
            token2Change: change.token2Change,
            impactScore: change.impactScore
        });

        const alerts: LiquidityAlert[] = [];
        
        // Store historical data
        this.updateHistoricalData(poolAddress, currentMetrics, change);
        
        // Analyze for different patterns
        const suddenChanges = this.detectSuddenChanges(poolAddress, currentMetrics, change);
        const gradualDrain = this.detectGradualDrain(poolAddress);
        const whaleMovements = this.detectWhaleMovements(poolAddress, change);
        const poolImbalances = this.detectPoolImbalances(currentMetrics);
        
        alerts.push(...suddenChanges, ...gradualDrain, ...whaleMovements, ...poolImbalances);
        
        console.log('\n=== Analysis Results ===');
        console.log('Sudden Changes Detected:', suddenChanges.length);
        console.log('Gradual Drain Alerts:', gradualDrain.length);
        console.log('Whale Movement Alerts:', whaleMovements.length);
        console.log('Pool Imbalance Alerts:', poolImbalances.length);
        console.log('Total Alerts Generated:', alerts.length);
        
        if (alerts.length > 0) {
            console.log('\nAlert Details:');
            alerts.forEach((alert, index) => {
                console.log(`\nAlert ${index + 1}:`);
                console.log('Type:', alert.type);
                console.log('Severity:', alert.severity);
                console.log('Description:', alert.description);
            });
        }

        return alerts;
    }

    private updateHistoricalData(
        poolAddress: string,
        metrics: LiquidityMetrics,
        change: LiquidityChange
    ): void {
        console.log('\n=== Updating Historical Data ===');
        
        // Update metrics history
        if (!this.historicalMetrics.has(poolAddress)) {
            this.historicalMetrics.set(poolAddress, []);
            console.log('Initialized new metrics history for pool');
        }
        this.historicalMetrics.get(poolAddress)!.push(metrics);

        // Update recent changes
        if (!this.recentChanges.has(poolAddress)) {
            this.recentChanges.set(poolAddress, []);
            console.log('Initialized new changes history for pool');
        }
        this.recentChanges.get(poolAddress)!.push(change);

        // Maintain history size
        this.pruneHistoricalData(poolAddress);
        
        console.log('Historical Metrics Count:', this.historicalMetrics.get(poolAddress)?.length);
        console.log('Recent Changes Count:', this.recentChanges.get(poolAddress)?.length);
    }

    private detectSuddenChanges(
        poolAddress: string,
        currentMetrics: LiquidityMetrics,
        change: LiquidityChange
    ): LiquidityAlert[] {
        console.log('\n=== Detecting Sudden Changes ===');
        const alerts: LiquidityAlert[] = [];
        const history = this.historicalMetrics.get(poolAddress) || [];
        
        if (history.length < 2) {
            console.log('Insufficient history for sudden change detection');
            return alerts;
        }
        
        const previousMetrics = history[history.length - 2];
        const percentChange = calculatePercentageChange(
            currentMetrics.totalLiquidity,
            previousMetrics.totalLiquidity
        );

        console.log('Previous Total Liquidity:', previousMetrics.totalLiquidity);
        console.log('Current Total Liquidity:', currentMetrics.totalLiquidity);
        console.log('Percentage Change:', percentChange.toFixed(2) + '%');
        console.log('Critical Threshold:', LIQUIDITY_THRESHOLDS.CRITICAL_CHANGE_PERCENTAGE + '%');

        if (Math.abs(percentChange) >= LIQUIDITY_THRESHOLDS.CRITICAL_CHANGE_PERCENTAGE) {
            console.log('Critical change detected!');
            alerts.push({
                id: `sudden-${poolAddress}-${Date.now()}`,
                timestamp: Date.now(),
                severity: 'CRITICAL',
                type: 'SUDDEN_REMOVE',
                poolAddress,
                metrics: currentMetrics,
                change,
                description: `Sudden ${percentChange > 0 ? 'increase' : 'decrease'} of ${Math.abs(percentChange).toFixed(2)}% in pool liquidity`
            });
        }

        return alerts;
    }

    private detectGradualDrain(poolAddress: string): LiquidityAlert[] {
        console.log('\n=== Detecting Gradual Drain ===');
        const alerts: LiquidityAlert[] = [];
        const history = this.historicalMetrics.get(poolAddress) || [];
        
        if (history.length < TIME_WINDOWS.MEDIUM_TERM) {
            console.log('Insufficient history for gradual drain detection');
            return alerts;
        }
        
        const recentMetrics = history.slice(-TIME_WINDOWS.MEDIUM_TERM);
        const liquidityValues = recentMetrics.map(m => m.totalLiquidity);
        const movingAverage = calculateMovingAverage(liquidityValues, 5);
        
        console.log('Historical Data Points:', history.length);
        console.log('Moving Average Points:', movingAverage.length);

        if (movingAverage.length >= 2) {
            const trend = calculateVelocity(
                movingAverage.map((value, index) => ({
                    timestamp: recentMetrics[index].timestamp,
                    value
                }))
            );

            console.log('Detected Trend:', trend.toFixed(2) + '% per hour');
            console.log('Medium Change Threshold:', -LIQUIDITY_THRESHOLDS.MEDIUM_CHANGE_PERCENTAGE + '%');

            if (trend < -LIQUIDITY_THRESHOLDS.MEDIUM_CHANGE_PERCENTAGE) {
                console.log('Gradual drain detected!');
                alerts.push({
                    id: `drain-${poolAddress}-${Date.now()}`,
                    timestamp: Date.now(),
                    severity: 'HIGH',
                    type: 'GRADUAL_DRAIN',
                    poolAddress,
                    metrics: history[history.length - 1],
                    description: `Gradual liquidity drain detected: ${Math.abs(trend).toFixed(2)}% decrease per hour`
                });
            }
        }

        return alerts;
    }

    private detectWhaleMovements(
        poolAddress: string,
        change: LiquidityChange
    ): LiquidityAlert[] {
        console.log('\n=== Detecting Whale Movements ===');
        const alerts: LiquidityAlert[] = [];
        
        const totalValue = 
            change.token1Change.value +
            change.token2Change.value;

        console.log('Total Change Value:', totalValue);
        console.log('Whale Movement Threshold:', LIQUIDITY_THRESHOLDS.WHALE_MOVEMENT_THRESHOLD);

        if (Math.abs(totalValue) >= LIQUIDITY_THRESHOLDS.WHALE_MOVEMENT_THRESHOLD) {
            console.log('Whale movement detected!');
            alerts.push({
                id: `whale-${poolAddress}-${Date.now()}`,
                timestamp: Date.now(),
                severity: 'HIGH',
                type: 'WHALE_MOVEMENT',
                poolAddress,
                metrics: this.historicalMetrics.get(poolAddress)!.slice(-1)[0],
                change,
                description: `Whale movement detected: $${Math.abs(totalValue).toFixed(2)} ${change.changeType.toLowerCase()}`
            });
        }

        return alerts;
    }

    private detectPoolImbalances(metrics: LiquidityMetrics): LiquidityAlert[] {
        console.log('\n=== Detecting Pool Imbalances ===');
        const alerts: LiquidityAlert[] = [];
        
        const token1Value = metrics.token1.value;
        const token2Value = metrics.token2.value;
        const totalValue = token1Value + token2Value;
        
        if (totalValue === 0) {
            console.log('Zero total value, skipping imbalance check');
            return alerts;
        }
        
        const ratio = Math.max(token1Value, token2Value) / totalValue;
        
        console.log('Token1 Value:', token1Value);
        console.log('Token2 Value:', token2Value);
        console.log('Pool Ratio:', (ratio * 100).toFixed(2) + '%');
        console.log('Imbalance Threshold:', (0.75 * 100) + '%');

        if (ratio > 0.75) {
            console.log('Pool imbalance detected!');
            alerts.push({
                id: `imbalance-${metrics.poolAddress}-${Date.now()}`,
                timestamp: Date.now(),
                severity: 'MEDIUM',
                type: 'IMBALANCE',
                poolAddress: metrics.poolAddress,
                metrics,
                description: `Pool imbalance detected: ${(ratio * 100).toFixed(2)}% concentration in one token`
            });
        }

        return alerts;
    }

    private pruneHistoricalData(poolAddress: string): void {
        const maxHistory = TIME_WINDOWS.LONG_TERM;
        
        const metrics = this.historicalMetrics.get(poolAddress);
        if (metrics && metrics.length > maxHistory) {
            this.historicalMetrics.set(poolAddress, metrics.slice(-maxHistory));
            console.log(`Pruned metrics history to ${maxHistory} entries`);
        }
        
        const changes = this.recentChanges.get(poolAddress);
        if (changes && changes.length > maxHistory) {
            this.recentChanges.set(poolAddress, changes.slice(-maxHistory));
            console.log(`Pruned changes history to ${maxHistory} entries`);
        }
    }
}
