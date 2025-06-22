import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axiosClient';

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const res = await axios.get('/accounts'); // <-- tanpa /api
      return res.data;
    },
  });
};
