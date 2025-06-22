// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import {
  fetchFinancialSummary,
  fetchBalanceSheet,
  fetchCashFlow,
  fetchGeneralLedger,
} from '../services/financialServices';

import FinancialSummaryComponent from '../components/FinancialSummary';
import BalanceSheetComponent from '../components/BalanceSheet';
import CashFlowComponent from '../components/CashFlow';
import GeneralLedgerComponent from '../components/GeneralLedger';

const Dashboard: React.FC = () => {
  const unitUsahaId = '1'; // Sementara hardcoded
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlow[]>([]);
  const [generalLedger, setGeneralLedger] = useState<GeneralLedgerEntry[]>([]);
  const [filters, setFilters] = useState({ from: '2025-01-01', to: '2025-12-31' });

  useEffect(() => {
    const unitId = parseInt(unitUsahaId);

    fetchFinancialSummary(unitId, true).then(setFinancialSummary).catch(console.error);

    fetchBalanceSheet(unitId, filters.to).then(setBalanceSheet).catch(console.error);

    fetchCashFlow(unitId, filters.from, filters.to).then(setCashFlow).catch(console.error);

    fetchGeneralLedger(unitId, '101', filters.from, filters.to)
      .then(setGeneralLedger)
      .catch(console.error);
  }, [unitUsahaId, filters]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📊 Dashboard Keuangan</h1>

      {financialSummary ? (
        <>
          <h2>📌 Ringkasan Keuangan</h2>
          <FinancialSummaryComponent data={financialSummary} />
        </>
      ) : (
        <p>Memuat ringkasan keuangan...</p>
      )}

      {balanceSheet ? (
        <>
          <h2>📑 Neraca</h2>
          <BalanceSheetComponent data={balanceSheet} />
        </>
      ) : (
        <p>Memuat neraca...</p>
      )}

      {cashFlow.length > 0 ? (
        <>
          <h2>💸 Arus Kas</h2>
          <CashFlowComponent data={cashFlow} />
        </>
      ) : (
        <p>Memuat arus kas...</p>
      )}

      {generalLedger.length > 0 ? (
        <>
          <h2>📘 Buku Besar</h2>
          <GeneralLedgerComponent data={generalLedger} />
        </>
      ) : (
        <p>Memuat buku besar...</p>
      )}
    </div>
  );
};

export default Dashboard;
