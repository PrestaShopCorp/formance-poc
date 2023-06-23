import { Module } from '@nestjs/common';
import { FormanceModule } from '@infrastructure/formance/formance.module';
import { TransactionsController } from './controllers/transactions.controller';

@Module({
  imports: [FormanceModule],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
