import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'bendahara' | 'manajer' | 'anggota' | 'user'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  // Ambil CSRF token saat komponen mount
  useEffect(() => {
    fetch('http://localhost:3000/auth/csrf-token', {
      credentials: 'include', // Penting agar cookie CSRF bisa terbaca
    })
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch(() => setError('Gagal mendapatkan CSRF token'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password, role }),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error('Error from backend:', errData);
        setError(
          Array.isArray(errData.message)
            ? errData.message.join(', ')
            : errData.message || 'Registrasi gagal',
        );
        return;
      }

      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value as any)} required>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="bendahara">Bendahara</option>
        <option value="manajer">Manajer</option>
        <option value="anggota">Anggota</option>
      </select>
      <button type="submit" disabled={loading || !csrfToken}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default Register;
