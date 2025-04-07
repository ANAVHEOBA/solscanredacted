export function calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

export function calculateMovingAverage(values: number[], window: number): number[] {
    if (values.length < window) return [];
    
    const result: number[] = [];
    let sum = values.slice(0, window).reduce((a, b) => a + b, 0);
    
    result.push(sum / window);
    
    for (let i = window; i < values.length; i++) {
        sum = sum - values[i - window] + values[i];
        result.push(sum / window);
    }
    
    return result;
}

export function calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => {
        const diff = value - mean;
        return diff * diff;
    });
    
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
}

export function calculateZScore(value: number, mean: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    return (value - mean) / stdDev;
}

export function detectOutliers(values: number[]): number[] {
    if (values.length < 4) return [];
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = calculateStandardDeviation(values);
    
    return values.filter(value => Math.abs(calculateZScore(value, mean, stdDev)) > 3);
}

export function calculateVelocity(
    changes: Array<{ timestamp: number; value: number }>
): number {
    if (changes.length < 2) return 0;
    
    const timeRange = changes[changes.length - 1].timestamp - changes[0].timestamp;
    const valueChange = changes[changes.length - 1].value - changes[0].value;
    
    return timeRange === 0 ? 0 : valueChange / timeRange;
}

export function calculateExponentialMovingAverage(
    values: number[],
    smoothing: number = 2
): number[] {
    const result: number[] = [];
    let ema = values[0];
    
    result.push(ema);
    
    for (let i = 1; i < values.length; i++) {
        const multiplier = smoothing / (1 + values.length);
        ema = (values[i] * multiplier) + (ema * (1 - multiplier));
        result.push(ema);
    }
    
    return result;
}
