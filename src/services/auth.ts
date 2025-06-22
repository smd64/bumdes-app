export async function login(username: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error('Login gagal');

  const data = await res.json();
  localStorage.setItem('token', data.access_token);
  return data;
}
