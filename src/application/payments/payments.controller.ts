import {
  ITransactionRepository,
  Transaction,
} from '@domain/repositories/transaction.repository';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  TransactionDto,
  transactionToTransactionDto,
} from './dtos/transaction.dto';
import { CreatePaymentDto } from './create-payment.dto';
import { ICommissionRepository } from '@domain/repositories/commission.repository';
import { IWalletRepository } from '@domain/repositories/wallet.repository';

@Controller({ path: 'payments' })
export class PaymentsController {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,
    @Inject(ICommissionRepository)
    private readonly commissionRepository: ICommissionRepository,
    @Inject(IWalletRepository)
    private readonly walletRepository: IWalletRepository,
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

    // World to merchant
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

    // Merchant to prestashop merchant
    transactions.push(
      await this.commissionRepository.applyCommission({
        reference: `order:${invoice.id}:${Date.now()}`,
        plain: `vars {
      monetary $amount
      account $merchant
      account $merchantprestashop
    }
    send $amount (
      source = $merchant
      destination = $merchantprestashop
    )
    `,
        vars: {
          amount: {
            amount: invoice.amount,
            asset: invoice.currency,
          },
          merchant: `${merchantExternalId}`,
          merchantprestashop: `${merchantPrestashopId}`,
        },
      }),
    );

    // Prestashop merchant to prestashop commission and partner
    transactions.push(
      await this.commissionRepository.applyCommission({
        reference: `split:order:${invoice.id}:${Date.now()}`,
        plain: `vars {
  monetary $amount
  account $merchant
  account $seller
  account $prestashop
}
send $amount (
    source = $merchant
    destination = {
      70% to $seller
      remaining to $prestashop
    }
)
        `,
        vars: {
          amount: {
            amount: invoice.amount,
            asset: invoice.currency,
          },
          merchant: `${merchantPrestashopId}`,
          seller: `${sellerId}`,
          prestashop: `commission:prestashop:${product.type}`,
        },
      }),
    );

    // Transfer to wallet on ledger wallet-002
    const walletId = `ba5d360a-90b6-4178-b199-27b69069ad30`; //`seller:${seller.organization.uuid}`;
    const wallet = await this.walletRepository.getWallet(walletId);
    if (!wallet) {
      await this.walletRepository.createWallet({ id: walletId }); // the id here is the name
    }
    await this.walletRepository.creditWallet(
      walletId,
      invoice.amount,
      invoice.currency,
      sellerId,
    );

    return transactions.map((transaction) =>
      transactionToTransactionDto(transaction),
    );
  }
}
