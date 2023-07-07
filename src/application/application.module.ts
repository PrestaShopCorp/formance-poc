import { Module } from '@nestjs/common';
import { FormanceModule } from '@infrastructure/formance/formance.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [FormanceModule, PaymentsModule, TransactionsModule],
})
export class ApplicationModule {}
