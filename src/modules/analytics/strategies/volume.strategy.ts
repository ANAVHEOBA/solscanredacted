import { 
    VolumeMetrics, 
    VolumeChange,
    VolumeAlert,
    TimeWindow,
    ActivityData
} from '../interfaces/analytics.interface';
import { VOLUME_THRESHOLDS, TIME_WINDOWS } from '../constants/thresholds';
import { 
    calculatePercentageChange,
    calculateMovingAverage,
    detectOutliers,
    calculateStandardDeviation,
    calculateZScore
} from '../utils/statistical.utils';

export class VolumeStrategy {
    private historicalVolumes: Map<string, VolumeMetrics[]> = new Map();
    private recentActivities: Map<string, ActivityData[]> = new Map();

    public analyzeVolumeChange(
        poolAddress: string,
        currentMetrics: VolumeMetrics,
        activities: ActivityData[]
    ): VolumeAlert[] {
        console.log('\n=== Starting Volume Analysis ===');
        console.log('Pool Address:', poolAddress);
        console.log('Current Metrics:', {
            total_volume_24h: currentMetrics.total_volume_24h,
            total_trades_24h: currentMetrics.total_trades_24h,
            total_volume_change_24h: currentMetrics.total_volume_change_24h,
            total_trades_change_24h: currentMetrics.total_trades_change_24h
        });

        const alerts: VolumeAlert[] = [];
        
        // Store historical data
        this.updateHistoricalData(poolAddress, currentMetrics, activities);
        
        // Analyze different time windows
        const shortTermAnomalies = this.detectShortTermAnomalies(poolAddress);
        const mediumTermTrends = this.detectMediumTermTrends(poolAddress);
        const longTermPatterns = this.detectLongTermPatterns(poolAddress);
        
        alerts.push(...shortTermAnomalies, ...mediumTermTrends, ...longTermPatterns);
        
        console.log('\n=== Analysis Results ===');
        console.log('Short-term Anomalies:', shortTermAnomalies.length);
        console.log('Medium-term Trends:', mediumTermTrends.length);
        console.log('Long-term Patterns:', longTermPatterns.length);
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
        metrics: VolumeMetrics,
        activities: ActivityData[]
    ): void {
        console.log('\n=== Updating Historical Data ===');
        
        // Update volume metrics history
        if (!this.historicalVolumes.has(poolAddress)) {
            this.historicalVolumes.set(poolAddress, []);
            console.log('Initialized new volume history for pool');
        }
        this.historicalVolumes.get(poolAddress)!.push(metrics);

        // Update activities history
        if (!this.recentActivities.has(poolAddress)) {
            this.recentActivities.set(poolAddress, []);
            console.log('Initialized new activities history for pool');
        }
        this.recentActivities.get(poolAddress)!.push(...activities);

        // Maintain history size
        this.pruneHistoricalData(poolAddress);
        
        console.log('Historical Volumes Count:', this.historicalVolumes.get(poolAddress)?.length);
        console.log('Recent Activities Count:', this.recentActivities.get(poolAddress)?.length);
    }

    private detectShortTermAnomalies(poolAddress: string): VolumeAlert[] {
        console.log('\n=== Detecting Short-term Anomalies ===');
        const alerts: VolumeAlert[] = [];
        const history = this.historicalVolumes.get(poolAddress) || [];
        const activities = this.recentActivities.get(poolAddress) || [];
        
        if (history.length < TIME_WINDOWS.SHORT_TERM) {
            console.log('Insufficient history for short-term analysis');
            return alerts;
        }

        // Analyze recent volume spikes
        const recentVolumes = history.slice(-TIME_WINDOWS.SHORT_TERM)
            .map(m => m.total_volume_24h);
        const stdDev = calculateStandardDeviation(recentVolumes);
        const mean = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length;
        
        const latestVolume = recentVolumes[recentVolumes.length - 1];
        const zScore = calculateZScore(latestVolume, mean, stdDev);

        console.log('Recent Mean Volume:', mean);
        console.log('Standard Deviation:', stdDev);
        console.log('Latest Volume:', latestVolume);
        console.log('Z-Score:', zScore);

        if (Math.abs(zScore) > VOLUME_THRESHOLDS.ZSCORE_THRESHOLD) {
            console.log('Volume spike detected!');
            alerts.push({
                id: `spike-${poolAddress}-${Date.now()}`,
                timestamp: Date.now(),
                severity: 'HIGH',
                type: 'VOLUME_SPIKE',
                poolAddress,
                metrics: history[history.length - 1],
                description: `Abnormal volume detected: ${Math.abs(zScore).toFixed(2)} standard deviations from mean`
            });
        }

        return alerts;
    }

    private detectMediumTermTrends(poolAddress: string): VolumeAlert[] {
        console.log('\n=== Detecting Medium-term Trends ===');
        const alerts: VolumeAlert[] = [];
        const history = this.historicalVolumes.get(poolAddress) || [];
        
        if (history.length < TIME_WINDOWS.MEDIUM_TERM) {
            console.log('Insufficient history for medium-term analysis');
            return alerts;
        }

        // Analyze volume trend
        const volumes = history.slice(-TIME_WINDOWS.MEDIUM_TERM)
            .map(m => m.total_volume_24h);
        const movingAverage = calculateMovingAverage(volumes, 5);
        
        console.log('Volume Points:', volumes.length);
        console.log('Moving Average Points:', movingAverage.length);

        if (movingAverage.length >= 2) {
            const trend = calculatePercentageChange(
                movingAverage[movingAverage.length - 1],
                movingAverage[0]
            );

            console.log('Volume Trend:', trend.toFixed(2) + '%');
            console.log('Trend Threshold:', VOLUME_THRESHOLDS.TREND_THRESHOLD + '%');

            if (Math.abs(trend) > VOLUME_THRESHOLDS.TREND_THRESHOLD) {
                console.log('Significant trend detected!');
                alerts.push({
                    id: `trend-${poolAddress}-${Date.now()}`,
                    timestamp: Date.now(),
                    severity: 'MEDIUM',
                    type: trend > 0 ? 'VOLUME_UPTREND' : 'VOLUME_DOWNTREND',
                    poolAddress,
                    metrics: history[history.length - 1],
                    description: `Sustained ${trend > 0 ? 'increase' : 'decrease'} in volume: ${Math.abs(trend).toFixed(2)}%`
                });
            }
        }

        return alerts;
    }

    private detectLongTermPatterns(poolAddress: string): VolumeAlert[] {
        console.log('\n=== Detecting Long-term Patterns ===');
        const alerts: VolumeAlert[] = [];
        const history = this.historicalVolumes.get(poolAddress) || [];
        
        if (history.length < TIME_WINDOWS.LONG_TERM) {
            console.log('Insufficient history for long-term analysis');
            return alerts;
        }

        // Analyze trading activity patterns
        const volumes = history.slice(-TIME_WINDOWS.LONG_TERM)
            .map(m => m.total_volume_24h);
        const trades = history.slice(-TIME_WINDOWS.LONG_TERM)
            .map(m => m.total_trades_24h);
        
        const volumeOutliers = detectOutliers(volumes);
        const tradeOutliers = detectOutliers(trades);

        console.log('Volume Outliers:', volumeOutliers.length);
        console.log('Trade Outliers:', tradeOutliers.length);

        if (volumeOutliers.length > 0 || tradeOutliers.length > 0) {
            alerts.push({
                id: `pattern-${poolAddress}-${Date.now()}`,
                timestamp: Date.now(),
                severity: 'LOW',
                type: 'TRADING_PATTERN',
                poolAddress,
                metrics: history[history.length - 1],
                description: `Unusual trading pattern detected: ${volumeOutliers.length} volume outliers, ${tradeOutliers.length} trade outliers`
            });
        }

        return alerts;
    }

    private pruneHistoricalData(poolAddress: string): void {
        const maxHistory = TIME_WINDOWS.LONG_TERM;
        
        const volumes = this.historicalVolumes.get(poolAddress);
        if (volumes && volumes.length > maxHistory) {
            this.historicalVolumes.set(poolAddress, volumes.slice(-maxHistory));
            console.log(`Pruned volume history to ${maxHistory} entries`);
        }
        
        const activities = this.recentActivities.get(poolAddress);
        if (activities && activities.length > maxHistory) {
            this.recentActivities.set(poolAddress, activities.slice(-maxHistory));
            console.log(`Pruned activities history to ${maxHistory} entries`);
        }
    }
}
