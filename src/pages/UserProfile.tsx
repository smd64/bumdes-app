import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setError('Failed to fetch UserProfile');
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError('Network error');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>UserProfile</h2>
      <p>ID: {user.id}</p>
      <p>Username: {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
