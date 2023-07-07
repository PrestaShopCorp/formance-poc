import { Amount } from '@domain/types/amount';
import { Currency } from '@domain/types/currency';
import { ProductType } from '@domain/types/product-type';

export class ShopDto {
  uuid: string;
  constructor(uuid: string) {
    this.uuid = uuid;
  }
}
export class OrganizationDto {
  uuid: string;
  email: string;
  constructor(uuid: string, email: string) {
    this.uuid = uuid;
    this.email = email;
  }
}
export class SellerDto {
  organization: OrganizationDto;
  constructor(organization: OrganizationDto) {
    this.organization = organization;
  }
}
export class BuyerDto {
  shop: ShopDto;
  organization: OrganizationDto;
  constructor(shop: ShopDto, organization: OrganizationDto) {
    this.shop = shop;
    this.organization = organization;
  }
}
export class ProductDto {
  id: string;
  type: ProductType;
  constructor(id: string, type: ProductType) {
    this.id = id;
    this.type = type;
  }
}
export class InvoiceDto {
  id: string;
  amount: Amount;
  currency: Currency;
  constructor(id: string, amount: Amount, currency: Currency) {
    this.id = id;
    this.amount = amount;
    this.currency = currency;
  }
}
export class CreatePaymentDto {
  buyer: BuyerDto;
  seller: SellerDto;
  product: ProductDto;
  invoice: InvoiceDto;

  constructor(
    buyer: BuyerDto,
    seller: SellerDto,
    product: ProductDto,
    invoice: InvoiceDto,
  ) {
    this.buyer = buyer;
    this.seller = seller;
    this.product = product;
    this.invoice = invoice;
  }
}
