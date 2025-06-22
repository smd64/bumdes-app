// src/features/transactionCategory/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

import type {
  TransactionCategory,
  TransactionCategoryCreate,
  TransactionCategoryUpdate,
} from './types';

const queryKey = ['transactionCategories'];

export const useCategories = () => {
  return useQuery<TransactionCategory[], Error>({
    queryKey,
    queryFn: api.fetchCategories,
  });
};

export const useCategory = (id: number) => {
  return useQuery<TransactionCategory, Error>({
    queryKey: [...queryKey, id],
    queryFn: () => api.fetchCategoryById(id),
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation<TransactionCategory, Error, TransactionCategoryCreate>({
    mutationFn: api.createCategory,
    onSuccess: () => qc.invalidateQueries(queryKey),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation<TransactionCategory, Error, TransactionCategoryUpdate>({
    mutationFn: api.updateCategory,
    onSuccess: () => qc.invalidateQueries(queryKey),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: api.deleteCategory,
    onSuccess: () => qc.invalidateQueries(queryKey),
  });
};
