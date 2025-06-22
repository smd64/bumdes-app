// src/components/ProfilePhoto.tsx
import React, { useEffect, useState } from 'react';
import api from '../api/axiosClient';

interface UserData {
  profilePicture?: string;
}

const ProfilePhoto: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    api.get('/user/me').then((res) => setUser(res.data));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Foto Profil</h2>
      {user.profilePicture ? (
        <img
          src={`http://localhost:3000${user.profilePicture}`}
          alt="Foto Profil"
          width={150}
          style={{ borderRadius: '8px' }}
        />
      ) : (
        <p>Belum ada foto</p>
      )}
    </div>
  );
};

export default ProfilePhoto;
