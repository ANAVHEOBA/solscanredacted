import { SolscanService } from '../../services/solscan.service';
import {
    Transaction,
    LastTransactionParams,
    TransactionDetail,
    TransactionDetailParams,
    TransactionActions,
    TransactionActionsParams
} from './transaction.interface';

export class TransactionService {
    constructor(private solscanService: SolscanService) {}

    async getLastTransactions(params: LastTransactionParams): Promise<Transaction[]> {
        try {
            const response = await this.solscanService.getLastTransactions(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTransactionDetail(params: TransactionDetailParams): Promise<TransactionDetail> {
        try {
            const response = await this.solscanService.getTransactionDetail(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getTransactionActions(params: TransactionActionsParams): Promise<TransactionActions> {
        try {
            const response = await this.solscanService.getTransactionActions(params);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
