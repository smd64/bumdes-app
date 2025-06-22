import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginAPI, logout as logoutAPI, User } from '../api/auth';
import { setAccessToken } from '../api/axiosClient';
import axiosClient from '../api/axiosClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil user dari localStorage kalau ada
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const tryRefreshToken = async () => {
      try {
        const csrfRes = await axiosClient.get('/auth/csrf-token', { withCredentials: true });
        const csrfToken = csrfRes.data.csrfToken;

        const res = await axiosClient.post('/auth/refresh', null, {
          withCredentials: true,
          headers: {
            'X-CSRF-Token': csrfToken,
          },
        });

        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        localStorage.setItem('access_token', res.data.accessToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } catch (err: any) {
        // Tangani hanya jika 401 (unauthorized karena belum login / expired)
        if (err.response?.status === 401) {
          // ❌ Jangan tampilkan log error 401 ini karena normal
          // console.warn('Belum login, refresh gagal (401)');
        } else {
          // ✅ Hanya tampilkan error untuk kasus selain 401
          console.error('Gagal refresh token:', err);
        }

        // Reset auth state
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    const shouldAttemptRefresh = !localStorage.getItem('access_token') && !user;

    if (shouldAttemptRefresh) {
      tryRefreshToken();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loginUser = async (username: string, password: string) => {
    const res = await loginAPI(username, password);
    setAccessToken(res.accessToken);
    setUser(res.user);
    localStorage.setItem('access_token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
  };

  const logoutUser = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
