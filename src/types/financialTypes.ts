// src/types/financialTypes.ts
export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

export interface BalanceSheet {
  assets: number;
  liabilities: number;
  equity: number;
  balance: number;
}

export interface CashFlow {
  category: string;
  amount: number;
}

export interface GeneralLedgerEntry {
  date: string;
  amount: number;
  description: string;
  category: string;
  account: string;
}
