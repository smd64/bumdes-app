import React, { useEffect, useState } from 'react';
import { getUnitUsaha, deleteUnitUsaha, UnitUsaha } from '../api/unitUsaha';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function UnitUsahaList() {
  const [units, setUnits] = useState<UnitUsaha[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getUnitUsaha();
      setUnits(data);
    } catch (error) {
      toast.error('Gagal memuat data unit usaha');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin mau hapus unit usaha ini?')) return;

    try {
      await deleteUnitUsaha(id);
      toast.success('Unit usaha berhasil dihapus');
      fetchData();
    } catch (error) {
      toast.error('Gagal menghapus unit usaha');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Daftar Unit Usaha</h2>
      <Link
        to="/unit-usaha/tambah"
        className="mb-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Tambah Unit Usaha
      </Link>

      {units.length === 0 ? (
        <p>Belum ada unit usaha.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Nama</th>
              <th className="border px-3 py-2">Deskripsi</th>
              <th className="border px-3 py-2">Saldo</th>
              <th className="border px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.id}>
                <td className="border px-3 py-2">{unit.id}</td>
                <td className="border px-3 py-2">{unit.name}</td>
                <td className="border px-3 py-2">{unit.description}</td>
                <td className="border px-3 py-2">{unit.saldo}</td>
                <td className="border px-3 py-2 space-x-2">
                  <Link
                    to={`/unit-usaha/edit/${unit.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(unit.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
