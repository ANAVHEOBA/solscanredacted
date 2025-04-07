// Last Transaction interfaces
export interface ParsedInstruction {
    type: string;
    program: string;
    program_id: string;
}

export interface Transaction {
    slot: number;
    fee: number;
    status: string;
    signer: string[];
    block_time: number;
    tx_hash: string;
    parsed_instructions: ParsedInstruction[];
    program_ids: string[];
    time: string;
}

export interface LastTransactionParams {
    limit?: 10 | 20 | 30 | 40 | 60 | 100;
    filter?: 'exceptVote' | 'all';
}

export interface LastTransactionResponse {
    success: boolean;
    data: Transaction[];
}

// Transaction Detail interfaces
export interface BalanceChange {
    address: string;
    pre_balance: string;
    post_balance: string;
    change_amount: string;
}

export interface TokenBalanceChange {
    address: string;
    token: string;
    amount: number;
    decimals: number;
    pre_balance: string;
    post_balance: string;
    change_amount: string;
}

export interface TransactionDetail {
    block_id: number;
    fee: number;
    reward: any[];
    sol_bal_change: BalanceChange[];
    token_bal_change: TokenBalanceChange[];
}

export interface TransactionDetailParams {
    tx: string;    // required
}

export interface TransactionDetailResponse {
    success: boolean;
    data: TransactionDetail;
}

// Transaction Actions interfaces
export interface Transfer {
    source_owner: string;
    source: string;
    destination: string;
    destination_owner: string;
    transfer_type: string;
    token_address: string;
    decimals: number;
    amount_str: string;
    amount: number;
    program_id: string;
    outer_program_id: string;
    ins_index: number;
    outer_ins_index: number;
}

export interface ActivityData {
    amm_id: string;
    amm_authority: string | null;
    account: string;
    token_1: string;
    token_2: string;
    amount_1: number;
    amount_1_str: string;
    amount_2: number;
    amount_2_str: string;
    token_decimal_1: number;
    token_decimal_2: number;
    token_account_1_1: string;
    token_account_1_2: string;
    token_account_2_1: string;
    token_account_2_2: string;
    owner_1: string;
    owner_2: string;
}

export interface Activity {
    name: string;
    activity_type: string;
    program_id: string;
    data: ActivityData;
    ins_index: number;
    outer_ins_index: number;
    outer_program_id: string;
}

export interface TransactionActions {
    tx_hash: string;
    block_id: number;
    block_time: number;
    time: string;
    fee: number;
    transfers: Transfer[];
    activities: Activity[];
}

export interface TransactionActionsParams {
    tx: string;    // required
}

export interface TransactionActionsResponse {
    success: boolean;
    data: TransactionActions;
}
