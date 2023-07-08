import { Amount } from '@domain/types/amount';
import { Currency } from '@domain/types/currency';
import { Metadata } from '@domain/types/metadata';

export type WalletMetadata = Metadata;

export interface CreateWalletValueObject {
  id: string;
}

export interface IWalletRepository {
  createWallet(
    createPayload: CreateWalletValueObject,
    metadata?: WalletMetadata,
  ): Promise<unknown>;
  getWallet(id: string): Promise<unknown>;
  creditWallet(
    id: string,
    amount: Amount,
    currency: Currency,
    source: string,
  ): Promise<void>;
}

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-redeclare
export const IWalletRepository = Symbol('IWalletRepository');
