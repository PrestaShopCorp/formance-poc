import { Module } from '@nestjs/common';
import { FormanceTransactionRepository } from './repositories/formance-transaction.repository';
import { ConfigModule } from '@nestjs/config';
import { ITransactionRepository } from '@domain/repositories/transaction.repository';
import { configuration } from './formance.configuration';
import { FormanceCommissionRepository } from './repositories/formance-commission.repository';
import { ICommissionRepository } from '@domain/repositories/commission.repository';
import { IWalletRepository } from '@domain/repositories/wallet.repository';
import { FormanceWalleRepository } from './repositories/formance-wallet.repository';
// import Joi from 'joi';

const services = [
  { provide: ITransactionRepository, useClass: FormanceTransactionRepository },
  { provide: ICommissionRepository, useClass: FormanceCommissionRepository },
  { provide: IWalletRepository, useClass: FormanceWalleRepository },
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // validationSchema: Joi.object({
      //   LEDGER_ID: Joi.string().required(),
      //   LEDGER_URL: Joi.string().required(),
      //   LEDGER_ORGANIZATION_ID: Joi.string().required(),
      // }),
    }),
  ],
  providers: [...services],
  exports: [...services],
})
export class FormanceModule {}
