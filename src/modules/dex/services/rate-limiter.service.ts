export class RateLimiter {
    private requestTimes: number[] = [];
    private readonly windowSize: number;
    private readonly maxRequests: number;

    constructor(requestsPerMinute: number, burstSize: number) {
        this.windowSize = 60 * 1000; // 1 minute in milliseconds
        this.maxRequests = requestsPerMinute;
        this.requestTimes = [];
    }

    public async waitForSlot(): Promise<void> {
        const now = Date.now();
        this.cleanupOldRequests(now);

        if (this.requestTimes.length >= this.maxRequests) {
            const oldestRequest = this.requestTimes[0];
            const waitTime = oldestRequest + this.windowSize - now;
            
            if (waitTime > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.waitForSlot();
            }
        }

        this.requestTimes.push(now);
    }

    private cleanupOldRequests(now: number): void {
        const cutoff = now - this.windowSize;
        this.requestTimes = this.requestTimes.filter(time => time > cutoff);
    }

    public getCurrentLoad(): number {
        return this.requestTimes.length;
    }

    public reset(): void {
        this.requestTimes = [];
    }
} 