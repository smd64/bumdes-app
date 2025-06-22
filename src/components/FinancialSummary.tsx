// src/components/FinancialSummary.tsx
import React from 'react';
import { FinancialSummary } from '../types/financialTypes';

interface Props {
  data: FinancialSummary;
}

const FinancialSummaryComponent: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <h2>Ringkasan Keuangan</h2>
      <p>Pendapatan: {data.totalIncome}</p>
      <p>Pengeluaran: {data.totalExpense}</p>
      <p>Laba Bersih: {data.netProfit}</p>
    </div>
  );
};

export default FinancialSummaryComponent;
