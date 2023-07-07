import { AccountId } from '@domain/types/account-id';
import { Amount } from '@domain/types/amount';
import { Currency } from '@domain/types/currency';
import { Metadata } from '@domain/types/metadata';

export class AddFromWorldDto {
  accountDestination: AccountId;
  amount: Amount;
  currency: Currency;
  metadata: Metadata;
  constructor(
    accountDestination: AccountId,
    amount: Amount,
    currency: Currency,
    metadata: Metadata,
  ) {
    this.accountDestination = accountDestination;
    this.amount = amount;
    this.currency = currency;
    this.metadata = metadata;
  }
}
