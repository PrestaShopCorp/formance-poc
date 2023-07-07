import { ITransactionRepository } from '@domain/repositories/transaction.repository';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  TransactionDto,
  transactionToTransactionDto,
} from '../transactions/dtos/transaction.dto';
import { AddFromWorldDto } from './add-from-world.dto';
import { ICommissionRepository } from '@domain/repositories/commission.repository';

@Controller({ path: 'payments' })
export class PaymentsController {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(ICommissionRepository)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  @Post('')
  async addFromWorld(@Body() body: AddFromWorldDto): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.createTransaction(
      {
        from: 'world',
        to: body.accountDestination,
        amount: body.amount,
        currency: body.currency,
      },
      body.metadata,
    );
    this.commissionRepository.applyCommission(
      {
        reference: body.accountDestination.split(':').at(-1),
        plain: `
          send [COIN ${body.amount}}] (
            source = @${body.accountDestination}
            destination = @prestashop:${body.accountDestination}
          )
        `,
        vars: {},
      },
      body.metadata,
    );
    return transactionToTransactionDto(transaction);
  }
}
