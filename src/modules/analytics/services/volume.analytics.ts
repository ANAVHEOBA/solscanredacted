import { MarketService } from '../../market/market.service';
import { DexService } from '../../dex/dex.service';
import { VolumeStrategy } from '../strategies/volume.strategy';
import { VolumeMetrics, VolumeAlert, ActivityData } from '../interfaces/analytics.interface';
import { TIME_WINDOWS } from '../constants/thresholds';

export class VolumeAnalytics {
    private strategy: VolumeStrategy;
    private activeMonitoring: Map<string, NodeJS.Timeout> = new Map();

    constructor(
        private marketService: MarketService,
        private dexService: DexService
    ) {
        this.strategy = new VolumeStrategy();
    }

    public async startMonitoring(poolAddress: string): Promise<boolean> {
        console.log(`Starting volume monitoring for pool ${poolAddress}`);

        // Stop existing monitoring if any
        this.stopMonitoring(poolAddress);

        try {
            // Initial analysis
            await this.analyzePool(poolAddress);

            // Set up periodic monitoring
            const interval = setInterval(
                () => this.analyzePool(poolAddress),
                TIME_WINDOWS.UPDATE_INTERVAL * 1000
            );

            this.activeMonitoring.set(poolAddress, interval);
            return true;
        } catch (error) {
            console.error(`Failed to start monitoring for ${poolAddress}:`, error);
            return false;
        }
    }

    public stopMonitoring(poolAddress: string): void {
        const interval = this.activeMonitoring.get(poolAddress);
        if (interval) {
            clearTimeout(interval);
            this.activeMonitoring.delete(poolAddress);
            console.log(`Stopped monitoring for pool ${poolAddress}`);
        }
    }

    public isMonitoring(poolAddress: string): boolean {
        return this.activeMonitoring.has(poolAddress);
    }

    private async analyzePool(poolAddress: string): Promise<VolumeAlert[]> {
        try {
            // Get market volume data
            const volumeData = await this.marketService.getMarketVolume(poolAddress);
            if (!volumeData.success) {
                throw new Error('Failed to fetch market volume data');
            }

            // Get recent DEX activities
            const activities = await this.dexService.getDefiActivities(poolAddress, {
                page: 1,
                page_size: 100,
                sort_by: 'block_time',
                sort_order: 'desc'
            });

            // Create metrics object
            const metrics: VolumeMetrics = {
                poolAddress,
                timestamp: Date.now(),
                total_volume_24h: volumeData.data.total_volume_24h,
                total_trades_24h: volumeData.data.total_trades_24h,
                total_volume_change_24h: volumeData.data.total_volume_change_24h,
                total_trades_change_24h: volumeData.data.total_trades_change_24h
            };

            // Analyze volume changes
            return this.strategy.analyzeVolumeChange(
                poolAddress,
                metrics,
                activities as ActivityData[]
            );

        } catch (error) {
            console.error(`Error analyzing pool ${poolAddress}:`, error);
            return [];
        }
    }
}
