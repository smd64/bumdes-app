import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { tambahUnitUsaha } from '../../api/unitUsaha';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().required('Nama wajib diisi'),
  description: yup.string().required('Deskripsi wajib diisi'),
});

export default function UnitUsahaForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: any) => {
    try {
      const response = await tambahUnitUsaha(data);
      toast.success('Unit usaha berhasil ditambahkan!');
      console.log(response);
      reset();
    } catch (err: any) {
      toast.error('Gagal menambahkan unit usaha');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block mb-1">Nama Unit Usaha</label>
        <input
          {...register('name')}
          className="w-full border p-2"
          placeholder="Contoh: Toko Desa Makmur"
        />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>
      </div>

      <div>
        <label className="block mb-1">Deskripsi</label>
        <textarea
          {...register('description')}
          className="w-full border p-2"
          placeholder="Contoh: Menjual sembako dan alat pertanian"
        />
        <p className="text-red-500 text-sm">{errors.description?.message}</p>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Tambah Unit Usaha
      </button>
    </form>
  );
}
