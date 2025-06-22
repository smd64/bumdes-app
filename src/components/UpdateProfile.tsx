import { useState } from 'react';
import axiosClient from '../api/axiosClient';

const UpdateProfile = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Hapus field kosong agar validasi DTO tidak error
    const cleaned = Object.fromEntries(Object.entries(form).filter(([_, val]) => val !== ''));

    try {
      const response = await axiosClient.patch('/user/me', cleaned);
      alert('Profil berhasil diperbarui!');
      console.log(response.data);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal update profil');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="fullName"
        placeholder="Nama Lengkap"
        value={form.fullName}
        onChange={handleChange}
      />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input
        name="phoneNumber"
        placeholder="No HP"
        value={form.phoneNumber}
        onChange={handleChange}
      />
      <input name="address" placeholder="Alamat" value={form.address} onChange={handleChange} />
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateProfile;
