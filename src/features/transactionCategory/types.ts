export type CategoryType =
  | 'ASET'
  | 'KEWAJIBAN'
  | 'MODAL'
  | 'PENDAPATAN'
  | 'BEBAN'
  | 'INVESTASI'
  | 'PENDANAAN'
  | 'OPERASIONAL';

export interface TransactionCategory {
  id: number;
  name: string;
  categoryType: CategoryType;
  debitAccountId: number;
  creditAccountId: number;
  createdAt: string;
}

export interface TransactionCategoryCreate {
  name: string;
  categoryType: CategoryType;
  debitAccountId: number;
  creditAccountId: number;
}

export interface TransactionCategoryUpdate extends Partial<TransactionCategoryCreate> {
  id: number;
}
