import { Metadata } from '@domain/types/metadata';
import { Reference } from '@domain/types/reference';

export type CommissionMetadata = Metadata;

export interface Commission {
  id: string;
}

export interface CreateCommissionValueObject {
  reference?: Reference;
  plain: string;
  vars?: Record<string, string>;
}

export interface ICommissionRepository {
  applyCommission(
    createPayload: CreateCommissionValueObject,
    metadata?: CommissionMetadata,
  ): Promise<Commission>;
}

// eslint-disable-next-line no-redeclare, @typescript-eslint/no-redeclare
export const ICommissionRepository = Symbol('ICommissionRepository');
