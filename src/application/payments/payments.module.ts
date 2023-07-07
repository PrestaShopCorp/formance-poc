import { Module } from '@nestjs/common';
import { FormanceModule } from '@infrastructure/formance/formance.module';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [FormanceModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
