// src/features/transactionCategory/api.ts
import apiClient from '../../api/axiosClient';
import type {
  TransactionCategory,
  TransactionCategoryCreate,
  TransactionCategoryUpdate,
} from './types';

const baseUrl = '/transaction-categories';

export const fetchCategories = async (): Promise<TransactionCategory[]> => {
  const res = await apiClient.get<TransactionCategory[]>(baseUrl);
  return res.data;
};

export const fetchCategoryById = async (id: number): Promise<TransactionCategory> => {
  const res = await apiClient.get<TransactionCategory>(`${baseUrl}/${id}`);
  return res.data;
};

export const createCategory = async (
  data: TransactionCategoryCreate,
): Promise<TransactionCategory> => {
  const res = await apiClient.post<TransactionCategory>(baseUrl, data);
  return res.data;
};

export const updateCategory = async ({
  id,
  ...data
}: TransactionCategoryUpdate): Promise<TransactionCategory> => {
  const res = await apiClient.put<TransactionCategory>(`${baseUrl}/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`${baseUrl}/${id}`);
};
