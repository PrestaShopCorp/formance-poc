import { WalletsApi } from '@formancehq/formance';
import { FormanceRepositoryRoot } from './formance-repository.root';
import { Transaction } from '@domain/repositories/transaction.repository';
import { ConfigService } from '@nestjs/config';
import { FormanceConfig, formanceConfig } from '../formance.configuration';
import { isUndefined } from '@lib/guards/is-undefined';
import { Injectable } from '@nestjs/common';
import {
  CreateWalletValueObject,
  IWalletRepository,
} from '@domain/repositories/wallet.repository';
import { Metadata } from '@domain/types/metadata';
import { Amount } from '@domain/types/amount';
import { Currency } from '@domain/types/currency';

@Injectable()
export class FormanceWalleRepository
  extends FormanceRepositoryRoot<WalletsApi>
  implements IWalletRepository
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

  async createWallet(
    createPayload: CreateWalletValueObject,
    metadata?: Metadata | undefined,
  ): Promise<unknown> {
    const { data } = await (
      await this.getInstance(WalletsApi)
    ).createWallet({
      createWalletRequest: {
        name: createPayload.id,
        metadata,
      },
    });
    return data;
  }

  async getWallet(id: string): Promise<unknown | undefined> {
    try {
      const { data } = await (
        await this.getInstance(WalletsApi)
      ).getWallet({
        id,
      });
      return data;
    } catch (error) {
      if ((error as { code: number }).code === 404) {
        return undefined;
      }
      throw error;
    }
  }

  async creditWallet(
    id: string,
    amount: Amount,
    currency: Currency,
    source: string,
  ): Promise<void> {
    await (
      await this.getInstance(WalletsApi)
    ).creditWallet({
      id,
      creditWalletRequest: {
        amount: {
          amount: amount,
          asset: currency,
        },
        sources: [
          {
            type: 'ACCOUNT',
            identifier: source,
          },
        ],
      },
    });
  }
}
