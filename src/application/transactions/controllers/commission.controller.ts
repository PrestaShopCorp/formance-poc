import { Controller, Inject, Post } from '@nestjs/common';
import {
  TransactionDto,
  transactionToTransactionDto,
} from '../dtos/transaction.dto';
import { ICommissionRepository } from '@domain/repositories/commission.repository';

@Controller({ path: 'comissions' })
export class TransactionsController {
  constructor(
    @Inject(ICommissionRepository)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  @Post()
  async createCommission(): Promise<any> {
    const transaction = await this.commissionRepository.applyCommission(
      {
        reference: 'order:FR1435173',
        plain: `
        send [COIN 1000] (
          source = @centralbank
          destination = @player:benwyatt
        )
        `,
        vars: {},
      },
      {
        productId: 'rbm_example',
        shopUuid: 'fbe25d33-6323-4d93-bcee-8eb92f26d4fe',
        amount: '1000EUR/2',
      },
    );
    return transaction;
  }
}
