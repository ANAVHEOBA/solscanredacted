// Token Meta interfaces
export interface TokenMetadata {
    name: string;
    image: string;
    symbol: string;
    description: string;
    twitter?: string;
    website?: string;
}

export interface TokenMeta {
    address: string;
    name: string;
    symbol: string;
    icon: string;
    decimals: number;
    holder: number;
    creator: string;
    create_tx: string;
    created_time: number;
    metadata: TokenMetadata;
    mint_authority: string | null;
    freeze_authority: string | null;
    supply: string;
    price: number;
    volume_24h: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_24h: number;
}

export interface TokenMetaParams {
    address: string;    // required
}

export interface TokenMetaResponse {
    success: boolean;
    data: TokenMeta;
}

// Token Price interfaces
export interface TokenPrice {
    date: number;
    price: number;
}

export interface TokenPriceParams {
    address: string;    // required
    from_time?: number;
    to_time?: number;
}

export interface TokenPriceResponse {
    success: boolean;
    data: TokenPrice[];
}

// Token Markets interfaces
export interface TokenMarket {
    pool_id: string;
    program_id: string;
    token_1: string;
    token_2: string;
    token_account_1: string;
    token_account_2: string;
    total_trades_24h: number;
    total_trades_prev_24h: number;
    total_volume_24h: number;
    total_volume_prev_24h: number;
}

export interface TokenMarketsParams {
    token: string[];   // required
    sort_by?: string;
    program?: string[];
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
}

export interface TokenMarketsResponse {
    success: boolean;
    data: TokenMarket[];
}

// Token Holders interfaces
export interface TokenHolder {
    address: string;
    amount: number;
    decimals: number;
    owner: string;
    rank: number;
}

export interface TokenHoldersParams {
    address: string;    // required
    page?: number;
    page_size?: 10 | 20 | 30 | 40;
    from_amount?: string;
    to_amount?: string;
}

export interface TokenHoldersResponse {
    success: boolean;
    data: {
        total: number;
        items: TokenHolder[];
    };
}

// Token Transfer interfaces
export type TransferActivityType = 
    'ACTIVITY_SPL_TRANSFER' | 
    'ACTIVITY_SPL_BURN' | 
    'ACTIVITY_SPL_MINT' | 
    'ACTIVITY_SPL_CREATE_ACCOUNT';

export interface TokenTransfer {
    block_id: number;
    trans_id: string;
    block_time: number;
    time: string;
    activity_type: TransferActivityType;
    from_address: string;
    to_address: string;
    token_address: string;
    token_decimals: number;
    amount: number;
}

export interface TokenTransferParams {
    address: string;    // required
    activity_type?: TransferActivityType[];
    from?: string;
    to?: string;
    amount?: number[];
    block_time?: number[];
    exclude_amount_zero?: boolean;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'block_time';
    sort_order?: 'asc' | 'desc';
    value?: number[];
}

export interface TokenTransferResponse {
    success: boolean;
    data: TokenTransfer[];
}

// Token DeFi Activities interfaces
export type DefiActivityType = 
    'ACTIVITY_TOKEN_SWAP' | 
    'ACTIVITY_AGG_TOKEN_SWAP' | 
    'ACTIVITY_TOKEN_ADD_LIQ' | 
    'ACTIVITY_TOKEN_REMOVE_LIQ' | 
    'ACTIVITY_SPL_TOKEN_STAKE' | 
    'ACTIVITY_SPL_TOKEN_UNSTAKE' | 
    'ACTIVITY_TOKEN_DEPOSIT_VAULT' | 
    'ACTIVITY_TOKEN_WITHDRAW_VAULT' | 
    'ACTIVITY_SPL_INIT_MINT' | 
    'ACTIVITY_ORDERBOOK_ORDER_PLACE';

export interface Router {
    token1: string;
    token1_decimals: number;
    amount1: string;
    token2: string;
    token2_decimals: number;
    amount2: string;
}

export interface TokenDefiActivity {
    block_id: number;
    trans_id: string;
    block_time: number;
    activity_type: DefiActivityType;
    from_address: string;
    to_address: string;
    sources: string[];
    platform: string;
    routers: {
        token1: string;
        token1_decimals: number;
        amount1: number;
        token2: string;
        token2_decimals: number;
        amount2: number;
        child_routers: Router[];
    };
}

export interface TokenDefiActivityParams {
    address: string;    // required
    from?: string;
    platform?: string[];
    source?: string[];
    activity_type?: DefiActivityType[];
    token?: string;
    from_time?: number;
    to_time?: number;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'block_time';
    sort_order?: 'asc' | 'desc';
}

export interface TokenDefiActivityResponse {
    success: boolean;
    data: TokenDefiActivity[];
} 