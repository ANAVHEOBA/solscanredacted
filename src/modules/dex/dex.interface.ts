export interface DefiActivity {
    block_id: number;
    trans_id: string;
    block_time: number;
    time: string;
    activity_type: ActivityType;
    from_address: string;
    to_address: string;
    sources: string[];
    platform: string;
    amount_info: {
        token1: string;
        token1_decimals: number;
        amount1: number;
        token2: string;
        token2_decimals: number;
        amount2: number;
        routers: {
            token1: string;
            token1_decimals: number;
            amount1: string;
            token2: string;
            token2_decimals: number;
            amount2: string;
        }[];
    };
}

export enum ActivityType {
    ACTIVITY_TOKEN_SWAP = "ACTIVITY_TOKEN_SWAP",
    ACTIVITY_AGG_TOKEN_SWAP = "ACTIVITY_AGG_TOKEN_SWAP",
    ACTIVITY_TOKEN_ADD_LIQ = "ACTIVITY_TOKEN_ADD_LIQ",
    ACTIVITY_TOKEN_REMOVE_LIQ = "ACTIVITY_TOKEN_REMOVE_LIQ",
    // ... other activity types
}

export interface DefiActivityParams {
    address?: string;
    activity_type?: ActivityType[];
    from?: string;
    platform?: string[];
    source?: string[];
    token?: string;
    from_time?: number;
    to_time?: number;
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    sort_by?: 'block_time';
    sort_order?: 'asc' | 'desc';
}

export interface DefiActivityResponse {
    success: boolean;
    data: DefiActivity[];
}

// New interfaces for balance change
export interface BalanceChangeActivity {
    block_id: number;
    block_time: number;
    time: string;
    trans_id: string;
    address: string;
    token_address: string;
    token_account: string;
    token_decimals: number;
    amount: number;
    pre_balance: number;
    post_balance: number;
    change_type: 'inc' | 'dec';
    fee: number;
}

export interface BalanceChangeParams {
    address: string;              // required
    token_account?: string;
    token?: string;
    from_time?: number;
    to_time?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    page?: number;
    remove_spam?: 'true' | 'false';
    amount?: number[];
    flow?: 'in' | 'out';
    sort_by?: 'block_time';
    sort_order?: 'asc' | 'desc';
}

export interface BalanceChangeResponse {
    success: boolean;
    data: BalanceChangeActivity[];
}

// Transaction interfaces
export interface Transaction {
    slot: number;
    fee: number;
    status: string;
    signer: string[];
    block_time: number;
    tx_hash: string;
    parsed_instructions: {
        type: string;
        program: string;
        program_id: string;
    }[];
    program_ids: string[];
    time: string;
}

export interface TransactionParams {
    address: string;    // required
    before?: string;
    limit?: 10 | 20 | 30 | 40;
}

export interface TransactionResponse {
    success: boolean;
    data: Transaction[];
}

// Portfolio interfaces
export interface TokenInfo {
    token_address: string;
    amount: number;
    balance: number;
    token_price: number;
    token_decimals: number;
    token_name: string;
    token_symbol: string;
    token_icon: string;
    value: number;
}

export interface Portfolio {
    total_value: number;
    native_balance: TokenInfo;
    tokens: TokenInfo[];
}

export interface PortfolioParams {
    address: string;    // required
}

export interface PortfolioResponse {
    success: boolean;
    data: Portfolio;
    metadata: any;
}

// Token Accounts interfaces
export interface TokenAccount {
    token_account: string;
    token_address: string;
    amount: number;
    token_decimals: number;
    owner: string;
}

export interface TokenAccountParams {
    address: string;    // required
    type: 'token' | 'nft';  // required
    page?: number;
    page_size?: 10 | 20 | 30 | 40;
    hide_zero?: boolean;
}

export interface TokenAccountResponse {
    success: boolean;
    data: TokenAccount[];
}

// Account Detail interfaces
export interface AccountDetail {
    account: string;
    lamports: number;
    type: string;
    executable: boolean;
    owner_program: string;
    rent_epoch: number;
    is_oncurve: boolean;
}

export interface AccountDetailParams {
    address: string;    // required
}

export interface AccountDetailResponse {
    success: boolean;
    data: AccountDetail;
}

// Account Metadata interfaces
export interface AccountMetadata {
    account_address: string;
    account_label: string;
    account_icon: string;
    account_tags: string[];
    account_type: string;
}

export interface AccountMetadataParams {
    address: string;    // required
}

export interface AccountMetadataResponse {
    success: boolean;
    data: AccountMetadata;
}