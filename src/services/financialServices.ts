import axiosClient from '../api/axiosClient';
import type {
  FinancialSummary,
  CashFlow,
  GeneralLedgerEntry,
  BalanceSheet,
} from '../types/financialTypes';

export const fetchFinancialSummary = async (
  unitUsahaId: number,
  includePending: boolean,
): Promise<FinancialSummary> => {
  const response = await axiosClient.get(`/financial-summary/${unitUsahaId}`, {
    params: { includePending },
  });
  return response.data;
};

export const fetchBalanceSheet = async (
  unitUsahaId: number,
  until: string,
): Promise<BalanceSheet> => {
  const response = await axiosClient.get(`/financial-summary/${unitUsahaId}/balance-sheet`, {
    params: { until },
  });
  return response.data;
};

export const fetchCashFlow = async (
  unitUsahaId: number,
  from: string,
  to: string,
): Promise<CashFlow[]> => {
  const response = await axiosClient.get(`/financial-summary/${unitUsahaId}/cash-flow`, {
    params: { from, to },
  });
  return response.data;
};

export const fetchGeneralLedger = async (
  unitUsahaId: number,
  accountCode: string,
  from: string,
  to: string,
): Promise<GeneralLedgerEntry[]> => {
  const response = await axiosClient.get(`/financial-summary/${unitUsahaId}/general-ledger`, {
    params: { accountCode, from, to },
  });
  return response.data;
};
