import { ScriptApi } from '@formancehq/formance';
import { FormanceRepositoryRoot } from './formance-repository.root';
import { TransactionMetadata } from '@domain/repositories/transaction.repository';
import { ConfigService } from '@nestjs/config';
import { FormanceConfig, formanceConfig } from '../formance.configuration';
import { isUndefined } from '@lib/guards/is-undefined';
import { Injectable } from '@nestjs/common';
import {
  Commission,
  CommissionMetadata,
  CreateCommissionValueObject,
  ICommissionRepository,
} from '@domain/repositories/commission.repository';

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
  ): Promise<Commission> {
    const response = await (
      await this.getInstance(ScriptApi)
    ).runScript({
      ledger: this.ledgerId,
      script: {
        reference: createPayload.reference,
        metadata: metadata,
        plain: createPayload.plain,
        vars: createPayload.vars,
      },
    });
    return response as any;
  }

  async createWithScript(metadata?: TransactionMetadata): Promise<any> {
    // const { data } = await (
    //   await this.getInstance(ScriptApi)
    // ).runScript({
    //   ledger: this.ledgerId,
    //   script: {
    //     reference: 'anything',
    //     metadata: metadata,
    //     plain: `vars {
    //       account $user
    //       }
    //       send [COIN 1000] (
    //         source = @world
    //         destination = $user
    //       )
    //       `,
    //     vars: {
    //       user: 'toto',
    //     },
    //   },
    // });
    // return data;
  }
}
