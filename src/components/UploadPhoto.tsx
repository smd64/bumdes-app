// src/components/UploadPhoto.tsx
import React, { useState } from 'react';
import api from '../api/axiosClient';

const UploadPhoto: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const getXsrfToken = (): string => {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  };

  const handleUpload = async () => {
    if (!file) return alert('Pilih file dulu');

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.patch('/user/me/photo', formData, {
        headers: {
          'X-XSRF-TOKEN': getXsrfToken(),
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Foto berhasil diunggah');
    } catch (err) {
      console.error(err);
      alert('Upload gagal');
    }
  };

  return (
    <div>
      <h2>Upload Foto Profil</h2>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPhoto;
