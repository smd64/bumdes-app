import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getUnitUsahaById, updateUnitUsaha } from '../../api/unitUsaha';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const schema = yup.object().shape({
  name: yup.string().required('Nama wajib diisi'),
  description: yup.string().required('Deskripsi wajib diisi'),
});

export default function UnitUsahaEditForm() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getUnitUsahaById(Number(id));
        reset({
          name: data.name,
          description: data.description,
        });
      } catch (error) {
        toast.error('Gagal memuat data unit usaha');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (!id) return;
      await updateUnitUsaha(Number(id), data);
      toast.success('Unit usaha berhasil diperbarui!');
      navigate('/unit-usaha/list');
    } catch (error) {
      toast.error('Gagal memperbarui unit usaha');
      console.error(error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
      <div>
        <label>Nama Unit Usaha</label>
        <input {...register('name')} className="w-full border p-2" />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>

      <div>
        <label>Deskripsi</label>
        <textarea {...register('description')} className="w-full border p-2" />
        <p className="text-red-500 text-sm">{errors.description?.message}</p>
      </div>

      <button
        type="submit"
        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
      >
        Update Unit Usaha
      </button>
    </form>
  );
}
