export type TransactionAccount = string;
export type Currency = 'EUR/2';
export type Amount = number;
export type TransactionMetadata = Record<string, unknown>;

export interface Transaction {
  id: string;
}

export interface CreateTransactionValueObject {
  from: TransactionAccount;
  to: TransactionAccount;
  amount: Amount;
  currency: Currency;
}

export interface ITransactionRepository {
  createTransaction(
    createPayload: CreateTransactionValueObject,
    metadata?: TransactionMetadata,
  ): Promise<Transaction>;
}

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-redeclare
export const ITransactionRepository = Symbol('ITransactionRepository');
