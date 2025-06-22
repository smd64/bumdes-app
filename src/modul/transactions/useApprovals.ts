import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';

interface ApprovePayload {
  transactionId: number;
  level: number;
}

export function useApproveTransaction() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ApprovePayload>({
    mutationFn: async ({ transactionId, level }) => {
      await axiosClient.post(`/transactions/${transactionId}/approve`, { level });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
    },
    onError: (error) => {
      console.error('Approval gagal:', error);
    },
  });
}
