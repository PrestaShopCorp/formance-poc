import {
  ITransactionRepository,
  Transaction,
} from '@domain/repositories/transaction.repository';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  TransactionDto,
  transactionToTransactionDto,
} from '../transactions/dtos/transaction.dto';
import { CreatePaymentDto } from './create-payment.dto';
import { ICommissionRepository } from '@domain/repositories/commission.repository';

@Controller({ path: 'payments' })
export class PaymentsController {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(ICommissionRepository)
    private readonly commissionRepository: ICommissionRepository,
  ) {}

  /**
   * @example:
   * {
   *   "buyer": {
   *     "shop": {
   *       "uuid": "fbe25d33-6323-4d93-bcee-8eb92f26d4fe"
   *     },
   *     "organization": {
   *       "uuid": "ZcJJ7lTP63WA6ttf",
   *       "email": "john.do@mail.fr"
   *     }
   *   },
   *   "seller": {
   *     "organization": {
   *       "uuid": "199UIoTjJSqLI2MCS",
   *       "email": "john.do@partner.com"
   *     }
   *   },
   *   "product": {
   *     "id": "builtfor_example",
   *     "type": "builtfor"
   *   },
   *   "invoice": {
   *     "id": "FR123456",
   *     "amount": 1000,
   *     "currency": "EUR/2"
   *   }
   * }
   *
   *
   * @param body
   * @returns
   */
  @Post('')
  async addFromWorld(
    @Body() body: CreatePaymentDto,
  ): Promise<TransactionDto[]> {
    const { seller, buyer, invoice, product } = body;
    const merchantExternalId = `merchant:${buyer.organization.uuid}:order:${invoice.id}`;
    const merchantPrestashopId = `prestashop:${merchantExternalId}`;
    const sellerId = `seller:${seller.organization.uuid}:order:${invoice.id}`;
    const transactions: Transaction[] = [];

    transactions.push(
      await this.transactionRepository.createTransaction(
        {
          from: 'world',
          to: merchantExternalId,
          amount: invoice.amount,
          currency: invoice.currency,
        },
        {
          productId: product.id,
          shopUuid: buyer.shop.uuid,
          amount: `${invoice.amount}${invoice.currency}`,
        },
      ),
    );
    //     transactions.push(
    //       await this.commissionRepository.applyCommission({
    //         reference: `order:${invoice.id}`,
    //         plain: `vars {
    //   monetary $amount
    //   account $merchant
    //   account $merchantPrestashop
    // }
    // send $amount (
    //   source = $merchant
    //   destination = $merchantPrestashop
    // )
    // `,
    //         vars: {
    //           amount: `${invoice.currency} ${invoice.amount}`,
    //           merchant: `@${merchantExternalId}`,
    //           merchantPrestashop: `@${merchantPrestashopId}`,
    //         },
    //       }),
    //     );
    transactions.push(
      await this.commissionRepository.applyCommission({
        reference: `order:${invoice.id}:${Date.now()}`,
        plain: `
send [${invoice.currency} ${invoice.amount}] (
  source = @${merchantExternalId}
  destination = @${merchantPrestashopId}
)
`,
      }),
    );
    transactions.push(
      await this.commissionRepository.applyCommission({
        reference: `split:order:${invoice.id}`,
        plain: `
send [${invoice.currency} ${invoice.amount}] (
    source = @${merchantPrestashopId}
    destination = {
      70% to @${sellerId}
      remaining to @commission:prestashop:${product.type}
    }
)
`,
      }),
    );
    //     transactions.push(
    //       await this.commissionRepository.applyCommission({
    //         reference: `split:order:${invoice.id}`,
    //         plain: `vars {
    //   monetary $amount
    //   account $merchant
    //   account $seller
    //   account $prestashop
    // }
    // send $amount (
    //     source = $merchant
    //     destination = {
    //       70% to $seller
    //       remaining to $prestashop
    //     }
    // )
    //         `,
    //         vars: {
    //           amount: {
    //             amount: invoice.amount.toString(),
    //             currency: invoice.currency,
    //           },
    //           merchant: `@${merchantPrestashopId}`,
    //           seller: `@${sellerId}`,
    //           prestashop: `commission:prestashop:${product.type}`,
    //         },
    //       }),
    //     );
    return transactions.map((transaction) =>
      transactionToTransactionDto(transaction),
    );
  }
}
