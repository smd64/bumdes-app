import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const CreateUserForm = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      // POST ini akan otomatis request CSRF token dulu (jika belum ada) lalu attach token di header
      await axiosClient.post('/user', { username, role });
      setSuccess(true);
      setUsername('');
      setRole('');
    } catch (err) {
      console.error('Create user failed:', err);
      setError('Gagal membuat user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username: </label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </div>
      <div>
        <label>Role: </label>
        <input value={role} onChange={(e) => setRole(e.target.value)} required />
      </div>
      <button type="submit">Create User</button>
      {success && <p>User berhasil dibuat!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default CreateUserForm;
