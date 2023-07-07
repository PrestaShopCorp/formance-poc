import { Metadata } from '@domain/types/metadata';
import { Reference } from '@domain/types/reference';
import { Transaction } from './transaction.repository';

export type CommissionMetadata = Metadata;

export interface Commission {
  id: string;
}

type Var = Record<string, string>;
type Vars = Record<string, string | Var>;

export interface CreateCommissionValueObject {
  reference?: Reference;
  plain: string;
  vars?: Vars;
}

export interface ICommissionRepository {
  applyCommission(
    createPayload: CreateCommissionValueObject,
    metadata?: CommissionMetadata,
  ): Promise<Transaction>;
}

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-redeclare
export const ICommissionRepository = Symbol('ICommissionRepository');
