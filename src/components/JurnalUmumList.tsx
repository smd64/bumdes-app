import React, { useEffect, useState } from 'react';
import { getJurnalUmumList, deleteJurnalUmum, JurnalUmum } from '../api/jurnalUmumApi';
import JurnalUmumForm from './JurnalUmumForm';

const JurnalUmumList: React.FC = () => {
  const [jurnals, setJurnals] = useState<JurnalUmum[]>([]);
  const [selectedJurnal, setSelectedJurnal] = useState<JurnalUmum | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getJurnalUmumList();
      setJurnals(res.data);
    } catch (error) {
      alert('Gagal memuat data jurnal');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin mau hapus?')) {
      await deleteJurnalUmum(id);
      fetchData();
    }
  };

  const handleEdit = (jurnal: JurnalUmum) => {
    setSelectedJurnal(jurnal);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedJurnal(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedJurnal(null);
    fetchData();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Daftar Jurnal Umum</h2>
      <button onClick={handleCreate}>+ Tambah Jurnal Umum</button>
      {showForm && <JurnalUmumForm jurnal={selectedJurnal} onClose={handleFormClose} />}

      <table
        border={1}
        cellPadding={10}
        style={{ marginTop: 20, width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Unit Usaha</th>
            <th>Tanggal</th>
            <th>Keterangan</th>
            <th>Entries</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {jurnals.map((jurnal) => (
            <tr key={jurnal.id}>
              <td>{jurnal.id}</td>
              <td>{jurnal.unitUsaha?.name || jurnal.unitUsahaId}</td>
              <td>{new Date(jurnal.tanggal).toLocaleDateString()}</td>
              <td>{jurnal.keterangan}</td>
              <td>
                <ul>
                  {jurnal.entries.map((entry) => (
                    <li key={entry.id}>
                      Akun: {entry.akunId} | Debit: {entry.debit || 0} | Kredit: {entry.kredit || 0}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={() => handleEdit(jurnal)}>Edit</button>{' '}
                <button onClick={() => jurnal.id && handleDelete(jurnal.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JurnalUmumList;
