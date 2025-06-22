// src/pages/profile/ProfilePage.tsx
import React from 'react';
import UpdateProfile from '../../components/UpdateProfile';
import UploadPhoto from '../../components/UploadPhoto';
import ProfilePhoto from '../../components/ProfilePhoto';

const ProfilePage: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Profil Saya</h1>
      <UpdateProfile />
      <hr />
      <UploadPhoto />
      <hr />
      <ProfilePhoto />
    </div>
  );
};

export default ProfilePage;
