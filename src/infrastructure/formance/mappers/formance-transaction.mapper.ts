import { Transaction } from '@domain/repositories/transaction.repository';
import { Transaction as FormanceTransaction } from '@formancehq/formance';

export const formanceTransactionToTransaction = (
  payload: FormanceTransaction,
): Transaction => {
  return {
    id: payload.txid.toString(),
  };
};
