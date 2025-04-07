// Last Block interfaces
export interface Block {
    fee_rewards: number;
    transactions_count: number;
    current_slot: number;
    block_height: number;
    block_time: number;
    time: string;
    block_hash: string;
    parent_slot: number;
    previous_block_hash: string;
}

export interface LastBlockParams {
    limit?: 10 | 20 | 30 | 40 | 60 | 100;
}

export interface LastBlockResponse {
    success: boolean;
    data: Block[];
}

// Block Transactions interfaces
export interface BlockTransaction {
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

export interface BlockTransactionsData {
    total: number;
    transactions: BlockTransaction[];
}

export interface BlockTransactionsParams {
    block: number;    // required
    page?: number;
    page_size?: 10 | 20 | 30 | 40 | 60 | 100;
    exclude_vote?: boolean;
    program?: string;
}

export interface BlockTransactionsResponse {
    success: boolean;
    data: BlockTransactionsData;
}

// Block Detail interfaces
export interface BlockDetail {
    blockhash: string;
    fee_rewards: number;
    transactions_count: number;
    block_height: number;
    block_time: number;
    time: string;
    parent_slot: number;
    previous_block_hash: string;
}

export interface BlockDetailParams {
    block: number;    // required
}

export interface BlockDetailResponse {
    success: boolean;
    data: BlockDetail;
} 