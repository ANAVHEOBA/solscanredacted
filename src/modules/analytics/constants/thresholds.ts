export const LIQUIDITY_THRESHOLDS = {
    // Percentage changes that trigger alerts (more sensitive now)
    CRITICAL_CHANGE_PERCENTAGE: 10,  // Was 20%
    HIGH_CHANGE_PERCENTAGE: 5,       // Was 10%
    MEDIUM_CHANGE_PERCENTAGE: 2,     // Was 5%
    LOW_CHANGE_PERCENTAGE: 1,        // Was 2%

    // Time windows for analysis (shorter for testing)
    SUDDEN_CHANGE_WINDOW: 2,         // Was 5 minutes
    GRADUAL_DRAIN_WINDOW: 30,        // Was 60 minutes
    WHALE_TRACKING_WINDOW: 720,      // Was 1440 minutes

    // Minimum amounts for tracking (lower for testing)
    MIN_SIGNIFICANT_VALUE: 5000,     // Was 10,000
    WHALE_MOVEMENT_THRESHOLD: 50000, // Was 100,000

    // Pool health indicators (more sensitive)
    MIN_LIQUIDITY_DEPTH: 25000,     // Was 50,000
    MAX_HOLDER_CONCENTRATION: 0.20,  // Was 0.25
    MIN_HOLDER_COUNT: 5,            // Was 10
    
    // Volume-based thresholds (more sensitive)
    MIN_24H_VOLUME: 2500,           // Was 5,000
    VOLUME_DROP_ALERT: 0.25,        // Was 0.5 (25% drop now triggers alert)
} as const;

export const TIME_WINDOWS = {
    REAL_TIME: 1,                   // 1 minute (unchanged)
    SHORT_TERM: 12,     // 1 hour (5 minute intervals)
    MEDIUM_TERM: 48,    // 4 hours (5 minute intervals)
    LONG_TERM: 288,     // 24 hours (5 minute intervals)
    UPDATE_INTERVAL: 300 // 5 minutes in seconds
} as const;

export const ALERT_COOLDOWN = {
    CRITICAL: 5,                    // Was 15 minutes
    HIGH: 10,                       // Was 30 minutes
    MEDIUM: 20,                     // Was 60 minutes
    LOW: 30,                        // Was 120 minutes
} as const;

export const VOLUME_THRESHOLDS = {
    ZSCORE_THRESHOLD: 2.5,           // Standard deviations for spike detection
    TREND_THRESHOLD: 25,             // Percentage change for trend detection
    MIN_VOLUME: 1000,                // Minimum volume to track
    MIN_TRADES: 10,                  // Minimum trades to track
    VOLUME_DROP_THRESHOLD: 50,       // Percentage drop to alert
    TRADE_SPIKE_THRESHOLD: 200,      // Percentage increase in trades
    OUTLIER_THRESHOLD: 3             // Standard deviations for outlier detection
};
