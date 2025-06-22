import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosClient from '../api/axiosClient';

interface FormData {
  username: string;
  password: string;
  role: 'user' | 'admin';
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username wajib diisi')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore')
    .min(3, 'Username minimal 3 karakter'),
  password: yup
    .string()
    .required('Password wajib diisi')
    .min(8, 'Password minimal 8 karakter')
    .matches(/[a-z]/, 'Password harus mengandung huruf kecil')
    .matches(/[A-Z]/, 'Password harus mengandung huruf besar')
    .matches(/\d/, 'Password harus mengandung angka'),
  role: yup.string().oneOf(['user', 'admin'], 'Role tidak valid'),
});

const AddUser = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    try {
      await axiosClient.post('/user', data);
      alert('User berhasil ditambahkan');
      reset();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menambahkan user');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Tambah User Baru</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            {...register('username')}
            className={`w-full border p-2 rounded ${errors.username ? 'border-red-500' : ''}`}
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full border p-2 rounded ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="role">
            Role
          </label>
          <select
            id="role"
            {...register('role')}
            className={`w-full border p-2 rounded ${errors.role ? 'border-red-500' : ''}`}
            defaultValue="user"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role.message}</p>}
        </div>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Loading...' : 'Tambah User'}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
