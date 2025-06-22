import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

// Enum sesuai dengan yang di backend Prisma
export enum CategoryType {
  ASET = 'ASET',
  KEWAJIBAN = 'KEWAJIBAN',
  MODAL = 'MODAL',
  PENDAPATAN = 'PENDAPATAN',
  BEBAN = 'BEBAN',
  INVESTASI = 'INVESTASI',
  PENDANAAN = 'PENDANAAN',
  OPERASIONAL = 'OPERASIONAL',
}

interface IFormInput {
  name: string;
  categoryType: CategoryType | '';
}

const categoryTypes = Object.values(CategoryType);

export default function TransactionCategoryForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    defaultValues: {
      name: '',
      categoryType: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await axios.post('http://localhost:3000/transaction-category', data);
      alert('Kategori berhasil disimpan!');
      reset();
    } catch (error) {
      alert('Gagal menyimpan kategori');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400, margin: 'auto' }}>
      <div>
        <label>Nama Kategori</label>
        <br />
        <input
          {...register('name', { required: 'Nama kategori wajib diisi' })}
          placeholder="Contoh: backend"
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Jenis Kategori</label>
        <br />
        <select
          {...register('categoryType', { required: 'Jenis kategori wajib dipilih' })}
          defaultValue=""
        >
          <option value="" disabled>
            -- Pilih --
          </option>
          {categoryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.categoryType && <p style={{ color: 'red' }}>{errors.categoryType.message}</p>}
      </div>

      <button type="submit" style={{ marginTop: 20 }}>
        Simpan Kategori
      </button>
    </form>
  );
}
