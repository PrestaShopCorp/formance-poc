import { Module } from '@nestjs/common';
import { FormanceModule } from '@infrastructure/formance/formance.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [FormanceModule, TransactionsModule],
})
export class ApplicationModule {}
