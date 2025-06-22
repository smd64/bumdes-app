import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

type TransactionType = 'INCOME' | 'EXPENSE';

type FormValues = {
  id?: number;
  description: string;
  amount: number;
  type: TransactionType;
  unitUsahaId: string;
  categoryId: string; // tambah categoryId di form
};

type UnitUsaha = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
};

export default function TransaksiKasForm() {
  const [unitUsahaList, setUnitUsahaList] = useState<UnitUsaha[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<FormValues[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedUnitUsahaId, setSelectedUnitUsahaId] = useState<string>('');
  const [chartData, setChartData] = useState<any>(null);

  const schema = yup.object().shape({
    description: yup.string().required('Deskripsi wajib diisi'),
    amount: yup
      .number()
      .positive('Jumlah harus positif')
      .max(1_000_000_000, 'Jumlah terlalu besar')
      .required('Jumlah wajib diisi'),
    type: yup.string().oneOf(['INCOME', 'EXPENSE']).required('Jenis transaksi wajib dipilih'),
    unitUsahaId: yup.string().required('Pilih unit usaha'),
    categoryId: yup.string().required('Pilih kategori transaksi'),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    axiosClient
      .get<UnitUsaha[]>('/unit-usaha')
      .then((res) => setUnitUsahaList(res.data))
      .catch(() => toast.error('Gagal memuat unit usaha'));

    axiosClient
      .get<Category[]>('/transaction-categories')
      .then((res) => setCategories(res.data))
      .catch(() => toast.error('Gagal memuat kategori transaksi'));
  }, []);

  const loadTransactions = () => {
    axiosClient
      .get<FormValues[]>('/transactions')
      .then((res) => {
        setTransactions(res.data);
        setChartData(null);
      })
      .catch(() => toast.error('Gagal memuat transaksi'));
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        unitUsahaId: Number(data.unitUsahaId),
        categoryId: Number(data.categoryId),
      };

      if (editingId) {
        await axiosClient.put(`/transactions/${editingId}`, payload);
        toast.success('Transaksi berhasil diupdate');
      } else {
        await axiosClient.post('/transactions', payload);
        toast.success('Transaksi berhasil dibuat');
      }

      reset();
      setEditingId(null);
      loadTransactions();
    } catch (err: any) {
      toast.error(
        `Gagal menyimpan transaksi: ${err.response?.data?.message || err.message || 'Error'}`,
      );
    }
  };

  const onEdit = (tx: any) => {
    setEditingId(tx.id ?? null);
    setValue('description', tx.description);
    setValue('amount', tx.amount);
    setValue('type', tx.type);
    setValue('unitUsahaId', tx.unitUsahaId);
    setValue('categoryId', tx.categoryId?.toString() || '');
    setSelectedUnitUsahaId(tx.unitUsahaId);
  };

  const onDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return;

    try {
      await axiosClient.delete(`/transactions/${id}`);
      toast.success('Transaksi berhasil dihapus');
      if (editingId === id) {
        reset();
        setEditingId(null);
      }
      loadTransactions();
    } catch (err: any) {
      toast.error(
        `Gagal menghapus transaksi: ${err.response?.data?.message || err.message || 'Error'}`,
      );
    }
  };

  const exportToExcel = () => {
    const filteredTx = selectedUnitUsahaId
      ? transactions.filter((tx) => tx.unitUsahaId === Number(selectedUnitUsahaId))
      : transactions;

    const wsData = [
      ['Deskripsi', 'Jumlah (Rp)', 'Jenis', 'Unit Usaha', 'Kategori Transaksi'],
      ...filteredTx.map((tx) => [
        tx.description,
        tx.amount,
        tx.type,
        unitUsahaList.find((u) => u.id === Number(tx.unitUsahaId))?.name ?? '-',
        categories.find((c) => c.id === Number(tx.categoryId))?.name ?? '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'transaksi.xlsx');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {editingId ? 'Edit Transaksi' : 'Tambah Transaksi'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div>
          <label>Deskripsi</label>
          <input {...register('description')} className="w-full border p-2" />
          <p className="text-red-500 text-sm">{errors.description?.message}</p>
        </div>

        <div>
          <label>Jumlah (Rp)</label>
          <input type="number" {...register('amount')} className="w-full border p-2" />
          <p className="text-red-500 text-sm">{errors.amount?.message}</p>
        </div>

        <div>
          <label>Jenis Transaksi</label>
          <select {...register('type')} className="w-full border p-2">
            <option value="">-- Pilih --</option>
            <option value="INCOME">Pemasukan</option>
            <option value="EXPENSE">Pengeluaran</option>
          </select>
          <p className="text-red-500 text-sm">{errors.type?.message}</p>
        </div>

        <div>
          <label>Unit Usaha</label>
          <select
            {...register('unitUsahaId')}
            className="w-full border p-2"
            onChange={(e) => {
              const val = e.target.value;
              setSelectedUnitUsahaId(val);
              setValue('unitUsahaId', val);
            }}
          >
            <option value="">-- Pilih --</option>
            {unitUsahaList.map((unit) => (
              <option key={unit.id} value={unit.id.toString()}>
                {unit.name}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm">{errors.unitUsahaId?.message}</p>
        </div>

        {/* Dropdown Kategori Transaksi */}
        <div>
          <label>Kategori Transaksi</label>
          <select {...register('categoryId')} className="w-full border p-2">
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-sm">{errors.categoryId?.message}</p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={false}
        >
          {editingId ? 'Update Transaksi' : 'Simpan Transaksi'}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            onClick={() => {
              reset();
              setEditingId(null);
            }}
          >
            Batal
          </button>
        )}
      </form>

      <div className="mb-4 flex items-center">
        <label className="mr-2 font-semibold">Filter Unit Usaha:</label>
        <select
          value={selectedUnitUsahaId}
          onChange={(e) => setSelectedUnitUsahaId(e.target.value)}
          className="border p-2"
        >
          <option value="">-- Semua --</option>
          {unitUsahaList.map((unit) => (
            <option key={unit.id} value={unit.id.toString()}>
              {unit.name}
            </option>
          ))}
        </select>

        <button
          onClick={exportToExcel}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export ke Excel
        </button>
      </div>

      {chartData && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Grafik Pemasukan & Pengeluaran 6 Bulan Terakhir
          </h3>
          <Chart type="bar" data={chartData} />
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">Daftar Transaksi</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Deskripsi</th>
            <th className="border border-gray-300 p-2">Jumlah (Rp)</th>
            <th className="border border-gray-300 p-2">Jenis</th>
            <th className="border border-gray-300 p-2">Unit Usaha</th>
            <th className="border border-gray-300 p-2">Kategori</th>
            <th className="border border-gray-300 p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {transactions.filter((tx) =>
            selectedUnitUsahaId ? tx.unitUsahaId === Number(selectedUnitUsahaId) : true,
          ).length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4 text-gray-500">
                Belum ada transaksi
              </td>
            </tr>
          )}
          {transactions
            .filter((tx) =>
              selectedUnitUsahaId ? tx.unitUsahaId === Number(selectedUnitUsahaId) : true,
            )
            .map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{tx.description}</td>
                <td className="border border-gray-300 p-2">{tx.amount.toLocaleString()}</td>
                <td className="border border-gray-300 p-2">{tx.type}</td>
                <td className="border border-gray-300 p-2">
                  {unitUsahaList.find((u) => u.id === Number(tx.unitUsahaId))?.name || '-'}
                </td>
                <td className="border border-gray-300 p-2">
                  {categories.find((c) => c.id === Number(tx.categoryId))?.name || '-'}
                </td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button className="text-blue-600 hover:underline" onClick={() => onEdit(tx)}>
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => onDelete(tx.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
