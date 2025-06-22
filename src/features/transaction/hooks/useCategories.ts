// src/features/transaction/hooks/useCategories.ts
import { useQuery } from '@tanstack/react-query';
import axios from '../../../api/axiosClient';

export const useTransactionCategories = () => {
  return useQuery({
    queryKey: ['transaction-categories'],
    queryFn: async () => {
      const res = await axios.get('/transaction-categories'); // pastikan endpoint benar
      return res.data;
    },
  });
};
