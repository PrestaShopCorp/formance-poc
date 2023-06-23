import { Module } from '@nestjs/common';
import { FormanceTransactionRepository } from './repositories/formance-transaction.repository';
import { ConfigModule } from '@nestjs/config';
import { ITransactionRepository } from '@domain/repositories/transaction.repository';
import { configuration } from './formance.configuration';
// import Joi from 'joi';

const services = [
  { provide: ITransactionRepository, useClass: FormanceTransactionRepository },
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
