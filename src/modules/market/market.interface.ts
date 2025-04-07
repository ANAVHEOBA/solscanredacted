// Market List interfaces
export interface Market {
    pool_address: string;
    program_id: string;
    token1: string;
    token1_account: string;
    token2: string;
    token2_account: string;
    total_volume_24h: number;
    total_trade_24h: number;
    created_time: number;
}

export interface MarketListParams {
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    program?: string;
}

export interface MarketListResponse {
    success: boolean;
    data: Market[];
}

// Market Info interfaces
export interface TokenInfo {
    token: string;
    token_account: string;
    amount: number;
}

export interface MarketInfo {
    pool_address: string;
    program_id: string;
    tokens_info: TokenInfo[];
    create_tx_hash: string;
    create_block_time: number;
    creator: string;
    lp_token: string;
}

export interface MarketInfoParams {
    address: string;    // required
}

export interface MarketInfoResponse {
    success: boolean;
    data: MarketInfo;
}

// Market Volume interfaces
export interface VolumeDay {
    day: number;    // Format: YYYYMMDD
    value: number;
}

export interface MarketVolume {
    pool_address: string;
    program_id: string;
    total_volume_24h: number;
    total_volume_change_24h: number;
    total_trades_24h: number;
    total_trades_change_24h: number;
    days: VolumeDay[];
}

export interface MarketVolumeParams {
    address: string;    // required
    time?: string[];    // Format: YYYYMMDD
}

export interface MarketVolumeResponse {
    success: boolean;
    data: MarketVolume;
} 