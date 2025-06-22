import React, { useState, useEffect } from 'react';
import { createJurnalUmum, Entry } from '../api/jurnalUmumApi';
import { toast } from 'react-toastify';

type AkunType = 'aset' | 'pendapatan' | 'beban' | 'kewajiban';

interface EntryForm extends Entry {
  akunId: number | '';
  debit: number;
  kredit: number;
}

const akunList = [
  { id: 1, name: 'Kas', tipe: 'aset' as AkunType },
  { id: 2, name: 'Pendapatan Penjualan', tipe: 'pendapatan' as AkunType },
  { id: 3, name: 'Beban Gaji', tipe: 'beban' as AkunType },
  { id: 4, name: 'Hutang Dagang', tipe: 'kewajiban' as AkunType },
];

export default function JurnalUmumForm() {
  const [unitUsahaId, setUnitUsahaId] = useState<number>(1);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().slice(0, 10));
  const [keterangan, setKeterangan] = useState<string>('');
  const [entries, setEntries] = useState<EntryForm[]>([{ akunId: '', debit: 0, kredit: 0 }]);
  const [loading, setLoading] = useState(false);

  // Hitung total debit dan kredit secara realtime
  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalKredit = entries.reduce((sum, e) => sum + e.kredit, 0);

  // Validasi apakah form sudah valid untuk disimpan
  const isValid =
    unitUsahaId > 0 &&
    tanggal !== '' &&
    keterangan.trim() !== '' &&
    totalDebit > 0 &&
    totalDebit === totalKredit &&
    entries.every((e) => e.akunId !== '' && (e.debit > 0 || e.kredit > 0));

  // Dapatkan tipe akun dari akunId
  const getAkunTipe = (akunId: number | '') => {
    const akun = akunList.find((a) => a.id === akunId);
    return akun?.tipe || null;
  };

  // Update entry dengan aturan debit/kredit yang sesuai tipe akun
  function handleEntryChange(index: number, field: keyof EntryForm, value: number | string) {
    const newEntries = [...entries];
    const tipe =
      field === 'akunId' ? getAkunTipe(Number(value)) : getAkunTipe(newEntries[index].akunId);

    if (field === 'akunId') {
      newEntries[index].akunId = Number(value);
      if (tipe === 'aset' || tipe === 'beban') {
        newEntries[index].debit = newEntries[index].debit || 0;
        newEntries[index].kredit = 0;
      } else if (tipe === 'pendapatan' || tipe === 'kewajiban') {
        newEntries[index].kredit = newEntries[index].kredit || 0;
        newEntries[index].debit = 0;
      } else {
        newEntries[index].debit = 0;
        newEntries[index].kredit = 0;
      }
    } else if (field === 'debit') {
      newEntries[index].debit = Number(value);
      newEntries[index].kredit = 0;
    } else if (field === 'kredit') {
      newEntries[index].kredit = Number(value);
      newEntries[index].debit = 0;
    }

    setEntries(newEntries);
  }

  // Tambah entry baru
  const addEntry = () => {
    setEntries([...entries, { akunId: '', debit: 0, kredit: 0 }]);
  };

  // Hapus entry
  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  // Fungsi untuk auto-balance entry (menambahkan entry baru agar balance)
  const handleAutoBalance = () => {
    const diff = totalDebit - totalKredit;
    if (diff === 0) return; // Sudah balance

    // Tentukan akun default untuk auto-balance (misal Hutang Dagang untuk kredit)
    const akunAutoBalance = akunList.find((a) =>
      diff > 0 ? a.tipe === 'kewajiban' : a.tipe === 'aset',
    );
    if (!akunAutoBalance) {
      toast.error('Tidak ada akun default untuk auto-balance');
      return;
    }

    const newEntry: EntryForm = {
      akunId: akunAutoBalance.id,
      debit: diff < 0 ? Math.abs(diff) : 0,
      kredit: diff > 0 ? diff : 0,
    };

    setEntries([...entries, newEntry]);
    toast.info('Auto-balance entry telah ditambahkan');
  };

  async function handleSubmit() {
    if (!isValid) {
      toast.error('Validasi gagal: Pastikan semua field terisi dengan benar dan debit = kredit');
      return;
    }

    setLoading(true);
    try {
      await createJurnalUmum({ unitUsahaId, tanggal, keterangan, entries });
      toast.success('Jurnal berhasil disimpan!');
      // Reset form
      setUnitUsahaId(1);
      setTanggal(new Date().toISOString().slice(0, 10));
      setKeterangan('');
      setEntries([{ akunId: '', debit: 0, kredit: 0 }]);
    } catch (error: any) {
      toast.error(`Gagal simpan jurnal: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>Form Input Jurnal Umum</h2>

      <div>
        <label>
          Unit Usaha ID:{' '}
          <input
            type="number"
            value={unitUsahaId}
            min={1}
            onChange={(e) => setUnitUsahaId(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Tanggal:{' '}
          <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Keterangan:{' '}
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            placeholder="Deskripsi jurnal"
          />
        </label>
      </div>

      <table
        border={1}
        cellPadding={6}
        style={{ borderCollapse: 'collapse', marginTop: 20, width: '100%' }}
      >
        <thead>
          <tr>
            <th>Akun</th>
            <th>Debit</th>
            <th>Kredit</th>
            <th>Hapus</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const tipe = getAkunTipe(entry.akunId);
            const debitDisabled = !(tipe === 'aset' || tipe === 'beban');
            const kreditDisabled = !(tipe === 'pendapatan' || tipe === 'kewajiban');
            const rowError =
              entry.akunId === '' ||
              (entry.debit === 0 && entry.kredit === 0) ||
              (entry.debit > 0 && entry.kredit > 0);

            return (
              <tr
                key={i}
                style={{ backgroundColor: rowError ? '#ffcccc' : undefined }}
                title={
                  rowError
                    ? 'Harap pilih akun dan isi salah satu debit atau kredit dengan benar.'
                    : ''
                }
              >
                <td>
                  <select
                    value={entry.akunId}
                    onChange={(e) => handleEntryChange(i, 'akunId', e.target.value)}
                  >
                    <option value="">-- Pilih Akun --</option>
                    {akunList.map((akun) => (
                      <option key={akun.id} value={akun.id}>
                        {akun.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={entry.debit}
                    disabled={debitDisabled}
                    onChange={(e) => handleEntryChange(i, 'debit', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min={0}
                    value={entry.kredit}
                    disabled={kreditDisabled}
                    onChange={(e) => handleEntryChange(i, 'kredit', e.target.value)}
                  />
                </td>
                <td>
                  <button type="button" onClick={() => removeEntry(i)}>
                    Hapus
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{totalDebit.toLocaleString()}</td>
            <td>{totalKredit.toLocaleString()}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: 10 }}>
        <button type="button" onClick={addEntry}>
          Tambah Entry
        </button>

        <button
          type="button"
          onClick={handleAutoBalance}
          disabled={totalDebit === totalKredit || entries.length === 0}
          style={{ marginLeft: 10 }}
          title={
            totalDebit !== totalKredit
              ? 'Klik untuk otomatis menambahkan entry agar debit dan kredit balance'
              : 'Sudah balance'
          }
        >
          Auto-Balance
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button type="button" onClick={handleSubmit} disabled={!isValid || loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {!isValid && (
        <div style={{ marginTop: 10, color: 'red' }}>
          <strong>Warning:</strong> Pastikan semua data valid, total debit dan kredit harus sama dan
          lebih dari 0.
        </div>
      )}
    </div>
  );
}
