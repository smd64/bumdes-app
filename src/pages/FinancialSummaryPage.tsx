import React, { useEffect, useState } from 'react';
import axios from '../api/axiosClient';

type FinancialSummary = {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
};

type Props = {
  unitUsahaId: number;
};

const FinancialSummaryPage: React.FC<Props> = ({ unitUsahaId }) => {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [includePending, setIncludePending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unitUsahaId) return;

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get<FinancialSummary>(
          `/financial-summary/${unitUsahaId}?includePending=${includePending}`,
        );
        setSummary(res.data);
      } catch (err) {
        setError('Gagal memuat ringkasan keuangan');
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [unitUsahaId, includePending]);

  if (loading) return <div className="p-4">Memuat ringkasan keuangan...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!summary) return <div className="p-4 text-red-600">Tidak ada data.</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Ringkasan Keuangan</h2>
      <div className="mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="mr-2"
            checked={includePending}
            onChange={() => setIncludePending((prev) => !prev)}
          />
          Tampilkan transaksi pending
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Total Pemasukan:</span>
          <span>Rp {summary.totalIncome.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Pengeluaran:</span>
          <span>Rp {summary.totalExpense.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Keuntungan Bersih:</span>
          <span>Rp {summary.netProfit.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryPage;
