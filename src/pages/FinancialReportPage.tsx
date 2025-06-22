// src/pages/FinancialReportPage.tsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axiosClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FinancialReportPageProps {
  unitUsahaId: number;
}

interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: { name: string };
  account: { name: string };
}

interface CashFlow {
  [categoryType: string]: number;
}

interface BalanceSheet {
  aset: number;
  kewajiban: number;
  modal: number;
  keseimbangan: number;
}

interface ReportData {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  balanceSheet: BalanceSheet;
  cashFlow: CashFlow;
  transactions: Transaction[];
}

const FinancialReportPage: React.FC<FinancialReportPageProps> = ({ unitUsahaId }) => {
  const [period, setPeriod] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM
  });
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/financial-summary/${unitUsahaId}/report`, {
          params: { period },
        });
        setReport(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Error loading report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [unitUsahaId, period]);

  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod(e.target.value);
  };

  if (loading) return <div>Loading laporan keuangan...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!report) return null;

  // Prepare data for chart (example: income & expense over time)
  // For demo, grouping transactions by date and summing amounts by type would be more complex,
  // here simplified to show total income & expense as two points
  const chartData = [
    { name: 'Income', amount: report.totalIncome },
    { name: 'Expense', amount: report.totalExpense },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Laporan Keuangan Lengkap Unit Usaha #{unitUsahaId}</h2>

      <label>
        Pilih Periode: &nbsp;
        <input type="month" value={period} onChange={handlePeriodChange} />
      </label>

      <h3>Summary</h3>
      <ul>
        <li>Total Pendapatan: Rp {report.totalIncome.toLocaleString()}</li>
        <li>Total Pengeluaran: Rp {report.totalExpense.toLocaleString()}</li>
        <li>Laba Bersih: Rp {report.netProfit.toLocaleString()}</li>
      </ul>

      <h3>Neraca (Balance Sheet)</h3>
      <ul>
        <li>Aset: Rp {report.balanceSheet.aset.toLocaleString()}</li>
        <li>Kewajiban: Rp {report.balanceSheet.kewajiban.toLocaleString()}</li>
        <li>Modal: Rp {report.balanceSheet.modal.toLocaleString()}</li>
        <li>
          Keseimbangan (Aset - Kewajiban - Modal): Rp{' '}
          {report.balanceSheet.keseimbangan.toLocaleString()}
        </li>
      </ul>

      <h3>Arus Kas (Cash Flow)</h3>
      <ul>
        {Object.entries(report.cashFlow).map(([category, amount]) => (
          <li key={category}>
            {category}: Rp {amount.toLocaleString()}
          </li>
        ))}
      </ul>

      <h3>Chart Pendapatan & Pengeluaran</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString()}`} />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      <h3>Daftar Transaksi</h3>
      <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Akun</th>
            <th>Kategori</th>
            <th>Jumlah (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {report.transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.account.name}</td>
              <td>{tx.category.name}</td>
              <td>{tx.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialReportPage;
