import { TransactionsApi } from '@formancehq/formance';
import { FormanceRepositoryRoot } from './formance-repository.root';
import {
  CreateTransactionValueObject,
  ITransactionRepository,
  Transaction,
  TransactionMetadata,
} from '@domain/repositories/transaction.repository';
import { ConfigService } from '@nestjs/config';
import { FormanceConfig, formanceConfig } from '../formance.configuration';
import { isUndefined } from '@lib/guards/is-undefined';
import { formanceTransactionToTransaction } from '../mappers/formance-transaction.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FormanceTransactionRepository
  extends FormanceRepositoryRoot<TransactionsApi>
  implements ITransactionRepository
{
  constructor(configService: ConfigService) {
    const config = configService.get<FormanceConfig>(formanceConfig.toString());
    if (isUndefined(config)) {
      throw new Error(
        `Configuration ${formanceConfig.toString()} can't be undefined`,
      );
    }
    super(
      config.oauthCredentials,
      config.ledgerUrl,
      config.ledgerOrganizationId,
      config.ledgerId,
    );
  }

  async createTransaction(
    createPayload: CreateTransactionValueObject,
    metadata?: TransactionMetadata,
  ): Promise<Transaction> {
    const { data } = await (
      await this.getInstance(TransactionsApi)
    ).createTransaction({
      ledger: this.ledgerId,
      postTransaction: {
        timestamp: new Date(),
        postings: [
          {
            amount: createPayload.amount,
            asset: createPayload.currency,
            destination: createPayload.to,
            source: createPayload.from,
          },
        ],
        // What to use as reference
        // reference: 'ref:001',
        metadata: metadata,
      },
    });

    return formanceTransactionToTransaction(data[0]);
  }
}
