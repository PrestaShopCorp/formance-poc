import {
  Configuration,
  ServerConfiguration,
  createConfiguration,
} from '@formancehq/formance';
import {
  TransactionsApiRequestFactory,
  TransactionsApiResponseProcessor,
} from '@formancehq/formance/dist/apis/TransactionsApi';

export type URL = string;

export abstract class FormanceRepositoryRoot<T> {
  readonly apiInstance: T;
  readonly ledgerId: string;
  constructor(
    url: URL,
    organizationId: string,
    ledgerId: string,
    type: {
      new (
        configuration: Configuration,
        requestFactory?: TransactionsApiRequestFactory,
        responseProcessor?: TransactionsApiResponseProcessor,
      ): T;
    },
  ) {
    const configuration: Configuration = createConfiguration({
      baseServer: new ServerConfiguration(url, {
        organization: organizationId,
      }),
    });
    this.apiInstance = new type(configuration);
    this.ledgerId = ledgerId;
  }
}
