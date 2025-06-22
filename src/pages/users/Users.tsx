// src/pages/users/Users.tsx
import { Outlet } from 'react-router-dom';

export default function Users() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manajemen User</h1>
      <Outlet />
    </div>
  );
}
