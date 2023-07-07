import { Module } from '@nestjs/common';
import { FormanceModule } from '@infrastructure/formance/formance.module';
import { TransactionsController } from './controllers/commission.controller';

@Module({
  imports: [FormanceModule],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
