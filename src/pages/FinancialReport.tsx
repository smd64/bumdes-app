import React, { useState, useEffect } from 'react';
import axios from '../api/axiosClient';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format, parseISO } from 'date-fns';

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: { name: string };
  account: { name: string };
};

type CashFlowData = Record<string, number>;

type BalanceSheetData = {
  aset: number;
  kewajiban: number;
  modal: number;
  keseimbangan: number;
};

type ReportData = {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  balanceSheet: BalanceSheetData;
  cashFlow: CashFlowData;
  transactions: Transaction[];
};

export const FinancialReport: React.FC = () => {
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitUsahaId = 1; // Ganti sesuai kebutuhan / ambil dari context/login user

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/financial-summary/${unitUsahaId}/report`, {
        params: { period },
      });
      setReport(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data laporan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // Prepare data for charts
  const cashFlowData = report
    ? Object.entries(report.cashFlow).map(([key, value]) => ({
        categoryType: key,
        amount: value,
      }))
    : [];

  const balanceSheetData = report
    ? [
        { name: 'Aset', value: report.balanceSheet.aset },
        { name: 'Kewajiban', value: report.balanceSheet.kewajiban },
        { name: 'Modal', value: report.balanceSheet.modal },
      ]
    : [];

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: 'auto' }}>
      <h2>Laporan Keuangan</h2>

      {/* Filter periode */}
      <label>
        Pilih Periode: &nbsp;
        <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} />
      </label>

      {report && (
        <>
          <h3>Ringkasan</h3>
          <ul>
            <li>Total Pendapatan: Rp {report.totalIncome.toLocaleString()}</li>
            <li>Total Pengeluaran: Rp {report.totalExpense.toLocaleString()}</li>
            <li>Laba Bersih: Rp {report.netProfit.toLocaleString()}</li>
          </ul>

          <h3>Arus Kas (Cash Flow) per Kategori</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cashFlowData}>
              <XAxis dataKey="categoryType" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <h3>Neraca (Balance Sheet)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={balanceSheetData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>

          <h3>Daftar Transaksi</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }} border={1}>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Deskripsi</th>
                <th>Jenis</th>
                <th>Kategori</th>
                <th>Akun</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {report.transactions.map((trx) => (
                <tr key={trx.id}>
                  <td>{format(parseISO(trx.date), 'dd/MM/yyyy')}</td>
                  <td>{trx.description}</td>
                  <td>{trx.type}</td>
                  <td>{trx.category?.name || '-'}</td>
                  <td>{trx.account?.name || '-'}</td>
                  <td style={{ textAlign: 'right' }}>Rp {trx.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
