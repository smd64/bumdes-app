import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosClient';

export const useFinancialSummary = (unitUsahaId: number, includePending: boolean) => {
  return useQuery(['financialSummary', unitUsahaId, includePending], async () => {
    const { data } = await api.get(`/financial-summary/${unitUsahaId}`, {
      params: { includePending },
    });
    return data;
  });
};
