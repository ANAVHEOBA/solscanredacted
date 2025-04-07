// Alert Types
export type LiquidityAlertType = 'LIQUIDITY_DROP' | 'LIQUIDITY_SPIKE' | 'LIQUIDITY_TREND';
export type VolumeAlertType = 'VOLUME_SPIKE' | 'VOLUME_UPTREND' | 'VOLUME_DOWNTREND' | 'TRADING_PATTERN';
export type PriceAlertType = 'PRICE_SPIKE' | 'TREND_REVERSAL' | 'SUPPORT_TEST' | 'RESISTANCE_TEST';
export type ArbitrageAlertType = 'PRICE_DIFFERENCE' | 'HIGH_FREQUENCY_TRADING' | 'MARKET_INEFFICIENCY';
export type AlertCategory = 'LIQUIDITY' | 'VOLUME' | 'PRICE' | 'ARBITRAGE';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

// Base Alert Interface
interface BaseAlert {
    category: AlertCategory;
    type: string;
    severity: AlertSeverity;
    timestamp: number;
    message: string;
}

// Specific Alert Interfaces
export interface LiquidityAlert extends BaseAlert {
    category: 'LIQUIDITY';
    type: LiquidityAlertType;
    poolAddress: string;
    metrics: {
        currentLiquidity: number;
        change: number;
        timeframe: number;
    };
}

export interface VolumeAlert extends BaseAlert {
    category: 'VOLUME';
    type: VolumeAlertType;
    poolAddress: string;
    metrics: {
        currentVolume: number;
        change: number;
        timeframe: number;
    };
}

export interface PriceAlert extends BaseAlert {
    category: 'PRICE';
    type: PriceAlertType;
    tokenAddress: string;
    metrics: {
        currentPrice: number;
        priceChange: number;
        volatility: number;
    };
}

export interface ArbitrageAlert extends BaseAlert {
    category: 'ARBITRAGE';
    type: ArbitrageAlertType;
    tokenAddress: string;
    buyMarket: string;
    sellMarket: string;
    metrics: {
        priceDifference: number;
        profitPercentage: number;
        buyPrice: number;
        sellPrice: number;
    };
}

export type Alert = LiquidityAlert | VolumeAlert | PriceAlert | ArbitrageAlert;

// Analysis timeframes in milliseconds
export const TimeFrames = {
    SHORT_TERM: 3600000,   // 1 hour
    MEDIUM_TERM: 14400000, // 4 hours
    LONG_TERM: 86400000    // 24 hours
};

export interface LiquidityMetrics {
    poolAddress: string;
    timestamp: number;
    totalLiquidity: number;
    token1: {
        address: string;
        symbol: string;
        amount: number;
        value: number;
    };
    token2: {
        address: string;
        symbol: string;
        amount: number;
        value: number;
    };
    holderCount: number;
    volume24h: number;
}

export interface LiquidityChange {
    poolAddress: string;
    timestamp: number;
    changeType: 'ADD' | 'REMOVE' | 'SWAP';
    token1Change: {
        amount: number;
        value: number;
    };
    token2Change: {
        amount: number;
        value: number;
    };
    impactScore: number;
    transactionHash: string;
}

export interface VolumeMetrics {
    poolAddress: string;
    timestamp: number;
    total_volume_24h: number;
    total_trades_24h: number;
    total_volume_change_24h: number;
    total_trades_change_24h: number;
}

export interface VolumeChange {
    timestamp: number;
    volume_delta: number;
    trades_delta: number;
    percentage_change: number;
}

export interface RouterInfo {
    pool_address: string;
    amount1: string | number;
    amount2: string | number;
    token1: string;
    token2: string;
    token1_decimals: number;
    token2_decimals: number;
    program_address?: string;
}

export interface DirectRouterInfo extends RouterInfo {
    pool_address: string;
}

export interface RoutersContainer {
    amount1: number;
    amount2: number;
    child_routers: RouterInfo[];
    token1: string;
    token2: string;
    token1_decimals: number;
    token2_decimals: number;
    pool_address?: string;
}

export interface ActivityData {
    activity_type: string;
    block_id: number;
    block_time: number;
    from_address: string;
    platform: string | string[];
    sources: string[];
    time: string;
    trans_id: string;
    amount_info: {
        token1: string;
        token1_decimals: number;
        amount1: string;
        token2: string;
        token2_decimals: number;
        amount2: string;
        routers: RouterInfo[] | (RoutersContainer & DirectRouterInfo);
    };
}

export interface PriceMetrics {
    timestamp: number;
    price: number;
    momentum: number;
    volatility: number;
}

export interface SupportResistanceLevel {
    price: number;
    type: 'support' | 'resistance';
    strength: number;
    timestamp: number;
}

export interface TimeWindows {
    SHORT_TERM: number;   // 1 hour
    MEDIUM_TERM: number;  // 4 hours
    LONG_TERM: number;    // 24 hours
}

