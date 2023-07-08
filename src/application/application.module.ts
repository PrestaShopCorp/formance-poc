import { Module } from '@nestjs/common';
import { FormanceModule } from '@infrastructure/formance/formance.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [FormanceModule, PaymentsModule],
})
export class ApplicationModule {}
