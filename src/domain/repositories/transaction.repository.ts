import { AccountId } from '@domain/types/account-id';
import { Amount } from '@domain/types/amount';
import { Currency } from '@domain/types/currency';
import { Metadata } from '@domain/types/metadata';

export type TransactionMetadata = Metadata;

export interface Transaction {
  id: string;
}

export interface CreateTransactionValueObject {
  from: AccountId;
  to: AccountId;
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
