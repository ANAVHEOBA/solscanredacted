import mongoose, { Schema, Document } from 'mongoose';
import { LiquidityMetrics, LiquidityChange } from '../interfaces/analytics.interface';

interface TokenInfo {
    address: string;
    amount: number;
    decimals: number;
    value: number;
}

interface OHLCV {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    count: number;
}

// Interface for the document in MongoDB
export interface ILiquidityFlow extends Document {
    poolAddress: string;
    timestamp: number;
    eventType: 'ADD' | 'REMOVE' | 'SWAP';
    token1: TokenInfo;
    token2: TokenInfo;
    transactionHash: string;
    blockNumber: number;
    fromAddress: string;
    impact: number;
}

// Schema for liquidity flows
const LiquidityFlowSchema = new Schema({
    poolAddress: { type: String, required: true, index: true },
    timestamp: { type: Number, required: true, index: true },
    eventType: { type: String, required: true, enum: ['ADD', 'REMOVE', 'SWAP'] },
    token1: {
        address: { type: String, required: true },
        amount: { type: Number, required: true },
        decimals: { type: Number, required: true },
        value: { type: Number, required: true }
    },
    token2: {
        address: { type: String, required: true },
        amount: { type: Number, required: true },
        decimals: { type: Number, required: true },
        value: { type: Number, required: true }
    },
    transactionHash: { type: String, required: true, unique: true },
    blockNumber: { type: Number, required: true },
    fromAddress: { type: String, required: true },
    impact: { type: Number, required: true }
}, {
    timestamps: true
});

// Indexes for efficient queries
LiquidityFlowSchema.index({ poolAddress: 1, timestamp: -1 });
LiquidityFlowSchema.index({ eventType: 1, timestamp: -1 });
LiquidityFlowSchema.index({ fromAddress: 1, timestamp: -1 });

// Create the model
export const LiquidityFlow = mongoose.model<ILiquidityFlow>('LiquidityFlow', LiquidityFlowSchema);

// Pool state model for current liquidity
export interface IPoolState extends Document {
    poolAddress: string;
    lastUpdated: number;
    totalLiquidity: number;
    token1: TokenInfo;
    token2: TokenInfo;
    volume24h: number;
    txCount24h: number;
    timeSeriesData: {
        '1m': OHLCV[];
        '5m': OHLCV[];
        '15m': OHLCV[];
        '1h': OHLCV[];
        '4h': OHLCV[];
        '1d': OHLCV[];
    };
}

const PoolStateSchema = new Schema({
    poolAddress: { type: String, required: true, unique: true },
    lastUpdated: { type: Number, required: true },
    totalLiquidity: { type: Number, required: true },
    token1: {
        address: { type: String, required: true },
        amount: { type: Number, required: true },
        decimals: { type: Number, required: true },
        value: { type: Number, required: true }
    },
    token2: {
        address: { type: String, required: true },
        amount: { type: Number, required: true },
        decimals: { type: Number, required: true },
        value: { type: Number, required: true }
    },
    volume24h: { type: Number, default: 0 },
    txCount24h: { type: Number, default: 0 },
    timeSeriesData: {
        '1m': [
            {
                timestamp: Number,
                open: Number,
                high: Number,
                low: Number,
                close: Number,
                volume: Number,
                count: Number
            }
        ],
        '5m': [
            {
                timestamp: Number,
                open: Number,
                high: Number,
                low: Number,
                close: Number,
                volume: Number,
                count: Number
            }
        ],
        '15m': [
            {
                timestamp: Number,
                open: Number,
                high: Number,
                low: Number,
                close: Number,
                volume: Number,
                count: Number
            }
        ],
        '1h': [
            {
                timestamp: Number,
                open: Number,
                high: Number,
                low: Number,
                close: Number,
                volume: Number,
                count: Number
            }
        ],
        '4h': [
            {
                timestamp: Number,
                open: Number,
                high: Number,
                low: Number,
                close: Number,
                volume: Number,
                count: Number
            }
        ],
        '1d': [
            {
                timestamp: Number,
                open: Number,
                high: Number,
                low: Number,
                close: Number,
                volume: Number,
                count: Number
            }
        ]
    }
}, {
    timestamps: true
});

// Index for efficient queries
PoolStateSchema.index({ lastUpdated: -1 });
PoolStateSchema.index({ totalLiquidity: -1 });

// Create the model
export const PoolState = mongoose.model<IPoolState>('PoolState', PoolStateSchema); 