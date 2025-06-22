// useTransactions.ts
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await axiosClient.get('/transactions');
      console.log('Raw data dari API:', data);
      const processed = data.map((tx: any) => ({
        ...tx,
        amount: Number(tx.amount),
        approvals: tx.approvals ?? [],
        date: tx.date ?? tx.createdAt ?? '',
      }));
      console.log('Processed transactions:', processed);
      return processed;
    },
  });
  console.log('transactions:', transactions);
}
