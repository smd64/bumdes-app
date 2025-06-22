// src/api/jurnalUmumApi.ts
import axiosClient from './axiosClient'; // sesuaikan path dengan proyekmu

export interface Entry {
  id?: number;
  akunId: number;
  debit?: number;
  kredit?: number;
}

export interface JurnalUmum {
  id?: number;
  unitUsahaId: number;
  tanggal: string; // ISO string, contoh "2025-06-19T08:00:00.000Z"
  keterangan: string;
  entries: Entry[];
  unitUsaha?: { id: number; name: string };
}

const baseUrl = '/jurnal-umum';

export const getJurnalUmumList = () => axiosClient.get<JurnalUmum[]>(baseUrl);

export const getJurnalUmum = (id: number) => axiosClient.get<JurnalUmum>(`${baseUrl}/${id}`);

export const createJurnalUmum = (data: JurnalUmum) => axiosClient.post(baseUrl, data);

export const updateJurnalUmum = (id: number, data: Partial<JurnalUmum>) =>
  axiosClient.put(`${baseUrl}/${id}`, data);

export const deleteJurnalUmum = (id: number) => axiosClient.delete(`${baseUrl}/${id}`);
