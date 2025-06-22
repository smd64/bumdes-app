import React, { useState } from 'react';
import axios from 'axios';
import { useFormContext } from 'react-hook-form'; // kalau kamu pakai react-hook-form
import { Button, Loader, Textarea, Text } from '@mantine/core'; // sesuaikan dengan UI lib kamu

export function OcrUpload() {
  const { setValue } = useFormContext(); // untuk isi otomatis ke form lain, misal deskripsi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');

  async function handleOCRUpload(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setExtractedText('');
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const text = res.data.extractedText as string;
      setExtractedText(text);

      // Jika menggunakan react-hook-form, isi field deskripsi otomatis
      setValue('description', text);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal ekstrak teks');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label htmlFor="ocr-upload">Upload Bukti Transaksi (Foto/Struk)</label>
      <input
        id="ocr-upload"
        type="file"
        accept="image/*,application/pdf"
        onChange={handleOCRUpload}
        disabled={loading}
        style={{ marginTop: 8, marginBottom: 12 }}
      />
      {loading && <Loader size="sm" />}
      {error && (
        <Text color="red" size="sm">
          {error}
        </Text>
      )}
      {extractedText && (
        <>
          <Text size="sm" weight={500} mb={4}>
            Hasil Ekstrak:
          </Text>
          <Textarea value={extractedText} readOnly minRows={5} />
        </>
      )}
    </div>
  );
}
