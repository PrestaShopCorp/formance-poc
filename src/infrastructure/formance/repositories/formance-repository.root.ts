import {
  Configuration,
  ServerConfiguration,
  createConfiguration,
} from '@formancehq/formance';
import {
  FormanceAuthentificationService,
  OAuthCredentials,
} from '../services/formance-authentification.service';
import { BaseAPIRequestFactory } from '@formancehq/formance/dist/apis/baseapi';

export type URL = string;

export abstract class FormanceRepositoryRoot<T> {
  constructor(
    private readonly credentials: OAuthCredentials,
    private readonly url: URL,
    private readonly organizationId: string,
    protected readonly ledgerId: string,
  ) {}

  async getInstance(type: {
    new (
      configuration: Configuration,
      requestFactory?: any,
      responseProcessor?: any,
    ): T;
  }): Promise<T> {
    const formanceAuthentificationService: FormanceAuthentificationService =
      new FormanceAuthentificationService(this.credentials, this.url);

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
