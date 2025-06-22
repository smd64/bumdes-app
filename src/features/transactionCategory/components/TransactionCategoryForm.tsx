import React, { useState } from 'react';
import {
  TransactionCategory,
  TransactionCategoryCreate,
  TransactionCategoryUpdate,
  CategoryType,
} from '../types';
import { useCreateCategory, useUpdateCategory } from '../hooks';
import { useAccounts } from '../../account/hooks'; // pastikan path sesuai

interface Props {
  initialData?: TransactionCategory;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryTypeOptions: CategoryType[] = [
  'ASET',
  'KEWAJIBAN',
  'MODAL',
  'PENDAPATAN',
  'BEBAN',
  'INVESTASI',
  'PENDANAAN',
  'OPERASIONAL',
];

const TransactionCategoryForm: React.FC<Props> = ({ initialData, onSuccess, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [categoryType, setCategoryType] = useState<CategoryType>(
    initialData?.categoryType || 'PENDAPATAN',
  );
  const [debitAccountId, setDebitAccountId] = useState<number>(initialData?.debitAccountId || 0);
  const [creditAccountId, setCreditAccountId] = useState<number>(initialData?.creditAccountId || 0);

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: TransactionCategoryCreate | TransactionCategoryUpdate = {
      name,
      categoryType,
      debitAccountId,
      creditAccountId,
      ...(initialData ? { id: initialData.id } : {}),
    };
    try {
      if (initialData) {
        await updateMutation.mutateAsync(payload as TransactionCategoryUpdate);
      } else {
        await createMutation.mutateAsync(payload as TransactionCategoryCreate);
      }
      onSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nama Kategori</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label>Tipe</label>
        <select
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value as CategoryType)}
        >
          {categoryTypeOptions.map((ct) => (
            <option key={ct} value={ct}>
              {ct}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Akun Debit</label>
        <select
          value={debitAccountId}
          onChange={(e) => setDebitAccountId(Number(e.target.value))}
          required
        >
          <option value="">-- Pilih Akun --</option>
          {accounts.map((acc: any) => (
            <option key={acc.id} value={acc.id}>
              {acc.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Akun Kredit</label>
        <select
          value={creditAccountId}
          onChange={(e) => setCreditAccountId(Number(e.target.value))}
          required
        >
          <option value="">-- Pilih Akun --</option>
          {accounts.map((acc: any) => (
            <option key={acc.id} value={acc.id}>
              {acc.code} - {acc.name} ({acc.type})
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={createMutation.isLoading || updateMutation.isLoading}>
        {initialData ? 'Update' : 'Create'}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
};

export default TransactionCategoryForm;
