import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient'; // sesuaikan path

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      // Kirim data transaksi ke backend
      const response = await axiosClient.post('/transactions', data);
      return response.data;
    },
    onSuccess: () => {
      // Refresh data setelah berhasil
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      console.error('Gagal membuat transaksi:', error);
    },
  });
}
