// src/components/BalanceSheet.tsx
import React from 'react';
import { BalanceSheet } from '../types/financialTypes';

interface Props {
  data: BalanceSheet;
}

const BalanceSheetComponent: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <h2>Neraca Keuangan</h2>
      <p>Aset: {data.assets}</p>
      <p>Kewajiban: {data.liabilities}</p>
      <p>Modal: {data.equity}</p>
      <p>Keseimbangan: {data.balance}</p>
    </div>
  );
};

export default BalanceSheetComponent;
