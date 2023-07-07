import { registerAs } from '@nestjs/config';
import { URL } from './repositories/formance-repository.root';
import { OAuthCredentials } from './services/formance-authentification.service';

export interface FormanceConfig {
  oauthCredentials: OAuthCredentials;
  ledgerId: string;
  ledgerUrl: URL;
  ledgerOrganizationId: string;
}

export const formanceConfig = Symbol('formance');

export const configuration = registerAs<FormanceConfig>(
  formanceConfig.toString(),
  () => ({
    ledgerId: process.env.LEDGER_ID,
    ledgerUrl: process.env.LEDGER_URL,
    ledgerOrganizationId: process.env.LEDGER_ORGANIZATION_ID,
    oauthCredentials: {
      clientId: process.env.LEDGER_CLIENT_ID,
      secretId: process.env.LEDGER_SECRET_ID,
    },
  }),
);
