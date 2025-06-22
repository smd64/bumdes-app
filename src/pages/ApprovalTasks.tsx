import React, { useEffect, useState } from 'react';
import axios from '../api/axiosClient';

type Transaction = {
  id: number;
  description: string;
  amount: number;
  createdAt: string;
  unitUsaha: { name: string };
};

const ApprovalTasks: React.FC = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // pastikan baseURL di axiosClient sudah sesuai dengan backend-mu
      const res = await axios.get('/transactions/pending');

      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data tugas approval');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await axios.patch(`/transactions/${id}/approve`);
      fetchData();
    } catch (err) {
      alert('Gagal approve transaksi');
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.patch(`/transactions/${id}/reject`);
      fetchData();
    } catch (err) {
      alert('Gagal reject transaksi');
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Memuat tugas approval...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Tugas Approval</h2>
      {data.length === 0 ? (
        <p>Tidak ada transaksi menunggu persetujuan.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((tx) => (
            <li key={tx.id} className="border p-4 rounded shadow">
              <p>
                <strong>Usaha:</strong> {tx.unitUsaha.name}
              </p>
              <p>
                <strong>Deskripsi:</strong> {tx.description}
              </p>
              <p>
                <strong>Jumlah:</strong> Rp {Number(tx.amount).toLocaleString('id-ID')}
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleApprove(tx.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(tx.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApprovalTasks;
