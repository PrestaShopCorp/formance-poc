import { registerAs } from '@nestjs/config';
import { URL } from './repositories/formance-repository.root';

export interface FormanceConfig {
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
  }),
);
