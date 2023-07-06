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
import { ClientRequestInterceptor } from '@mswjs/interceptors/ClientRequest';

const readStream = async (readable: any): Promise<string> => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString();
};
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
    super(config.ledgerUrl, config.ledgerOrganizationId, config.ledgerId);
  }

  async createTransaction(
    createPayload: CreateTransactionValueObject,
    metadata?: TransactionMetadata,
  ): Promise<Transaction> {
    const interceptor = new ClientRequestInterceptor();

    // Enable the interception of requests.
    interceptor.apply();

    // Listen to any "http.ClientRequest" being dispatched,
    // and log its method and full URL.
    interceptor.on('request', async (request, requestId) => {
      console.log('body request', await readStream(request.body));
      console.log(request.method, request.url);
    });

    // Listen to any responses sent to "http.ClientRequest".
    // Note that this listener is read-only and cannot affect responses.
    interceptor.on('response', async (response, request) => {
      console.log(await readStream(request.body));
      console.log(response.headers);
    });
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
