import { ITransactionRepository } from '@domain/repositories/transaction.repository';
import { Controller, Get, Inject } from '@nestjs/common';
import {
  TransactionDto,
  transactionToTransactionDto,
} from '../dtos/transaction.dto';

@Controller({ path: 'transactions' })
export class TransactionsController {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  @Get('create')
  async createTransaction(): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.createTransaction(
      {
        from: 'merchant:ZcJJ7lTP63WA6ttf:order:FR1435173',
        to: 'prestashop:merchant:ZcJJ7lTP63WA6ttf:order:FR1435173',
        amount: 1000,
        currency: 'EUR/2',
      },
      {
        productId: 'rbm_example',
        shopUuid: 'fbe25d33-6323-4d93-bcee-8eb92f26d4fe',
        amount: '1000EUR/2',
      },
    );
    return transactionToTransactionDto(transaction);
  }
}
