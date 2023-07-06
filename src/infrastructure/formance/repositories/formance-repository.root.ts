import {
  Configuration,
  ServerConfiguration,
  createConfiguration,
} from '@formancehq/formance';
import {
  TransactionsApiRequestFactory,
  TransactionsApiResponseProcessor,
} from '@formancehq/formance/dist/apis/TransactionsApi';
import { FormanceAuthentificationService } from '../services/formance-authentification.service';

export type URL = string;

export abstract class FormanceRepositoryRoot<T> {
  constructor(
    private readonly url: URL,
    private readonly organizationId: string,
    protected readonly ledgerId: string,
  ) {}

  async getInstance(type: {
    new (
      configuration: Configuration,
      requestFactory?: TransactionsApiRequestFactory,
      responseProcessor?: TransactionsApiResponseProcessor,
    ): T;
  }): Promise<T> {
    const formanceAuthentificationService: FormanceAuthentificationService =
      new FormanceAuthentificationService(this.url);
    const { access_token: accessToken } =
      await formanceAuthentificationService.getAuth();
    const configuration: Configuration = createConfiguration({
      baseServer: new ServerConfiguration(this.url, {
        organization: this.organizationId,
      }),
      authMethods: {
        Authorization: {
          accessToken: accessToken,
        },
      },
    });
    return new type(configuration);
  }
}
