import { Transaction } from '@domain/repositories/transaction.repository';

export class TransactionDto {
  constructor(public id: string) {}
}

export const transactionToTransactionDto = (
  payload: Transaction,
): TransactionDto => {
  const transaction = new TransactionDto(payload.id);

  return transaction;
};
