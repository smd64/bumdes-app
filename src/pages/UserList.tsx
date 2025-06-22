import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

interface User {
  id: number;
  username: string;
  role: string;
}

const UserList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient
      .get('/user', {
        params: {
          search,
          role: roleFilter,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('Gagal mengambil data user');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;

    try {
      await axiosClient.delete(`/user/${id}`);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Gagal menghapus user:', err);
      alert('Gagal menghapus user');
    }
  };

  const handleEdit = async (id: number) => {
    const newRole = prompt('Masukkan role baru (admin/user):');
    if (!newRole || !['admin', 'user'].includes(newRole)) {
      alert('Role tidak valid');
      return;
    }

    try {
      await axiosClient.patch(`/user/${id}`, { role: newRole });
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Gagal update user:', err);
      alert('Gagal update user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User List</h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <input
          type="text"
          placeholder="Cari username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mb-2 sm:mb-0"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Semua Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="sm:grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg flex flex-col space-y-2">
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-gray-600 capitalize">{user.role}</p>

            {currentUser?.role === 'admin' && (
              <div className="flex space-x-2 mt-auto">
                <button
                  onClick={() => handleEdit(user.id)}
                  className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
