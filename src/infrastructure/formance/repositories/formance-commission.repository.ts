import { ScriptApi } from '@formancehq/formance';
import { FormanceRepositoryRoot } from './formance-repository.root';
import { Transaction } from '@domain/repositories/transaction.repository';
import { ConfigService } from '@nestjs/config';
import { FormanceConfig, formanceConfig } from '../formance.configuration';
import { isUndefined } from '@lib/guards/is-undefined';
import { Injectable } from '@nestjs/common';
import {
  CommissionMetadata,
  CreateCommissionValueObject,
  ICommissionRepository,
} from '@domain/repositories/commission.repository';
import { formanceTransactionToTransaction } from '../mappers/formance-transaction.mapper';

@Injectable()
export class FormanceCommissionRepository
  extends FormanceRepositoryRoot<ScriptApi>
  implements ICommissionRepository
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

  async applyCommission(
    createPayload: CreateCommissionValueObject,
    metadata?: CommissionMetadata,
  ): Promise<Transaction> {
    const instance = await this.getInstance(ScriptApi);
    const response = await instance.runScript({
      ledger: this.ledgerId,
      script: {
        reference: createPayload.reference,
        metadata: metadata,
        plain: createPayload.plain,
        vars: createPayload.vars,
      },
    });
    // valeurs possibles 'INSUFFICIENT_FUND' 'INTERNAL' 'CONFLICT' (2 références identiques)
    // if (response.errorCode) {
    //   throw new Error(`${response.errorMessage}`);
    // }
    if (isUndefined(response.transaction)) {
      throw new Error('Undefined transaction');
    }
    return formanceTransactionToTransaction(response.transaction);
  }
}
