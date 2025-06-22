import axiosClient, { setAccessToken } from './axiosClient';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string; // ganti dari access_token jadi accessToken
  user: User;
}

// Ambil CSRF Token dari backend
async function getCsrfToken(): Promise<string> {
  const res = await axiosClient.get('/auth/csrf-token', { withCredentials: true });
  return res.data.csrfToken;
}

// Login dengan CSRF Token
export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const csrfToken = await getCsrfToken();

    const res = await axiosClient.post<LoginResponse>(
      '/auth/login',
      { username, password },
      {
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      },
    );

    setAccessToken(res.data.accessToken); // update ke accessToken
    return res.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Login gagal';
    throw new Error(message);
  }
}

// Logout dengan CSRF Token
export async function logout(): Promise<void> {
  try {
    const csrfToken = await getCsrfToken();

    await axiosClient.post('/auth/logout', null, {
      withCredentials: true,
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });
  } catch (error) {
    // log error jika perlu
  } finally {
    setAccessToken(null);
  }
}

// Update parameter tambah role
export async function register(username: string, password: string, role: string): Promise<void> {
  try {
    const csrfToken = await getCsrfToken();

    await axiosClient.post(
      '/auth/register',
      { username, password, role }, // kirim role juga
      {
        withCredentials: true,
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      },
    );
  } catch (error: any) {
    const message = error?.response?.data?.message || 'Registrasi gagal';
    throw new Error(message);
  }
}
