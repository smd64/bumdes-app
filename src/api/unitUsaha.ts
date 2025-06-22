import axiosClient from './axiosClient';

export interface UnitUsaha {
  id: number;
  name: string;
  description: string;
  saldo?: string;
  createdAt?: string;
}

// Create
export const tambahUnitUsaha = async (data: { name: string; description: string }) => {
  const res = await axiosClient.post('/unit-usaha', data);
  return res.data;
};

// Read all
export const getUnitUsaha = async (): Promise<UnitUsaha[]> => {
  const res = await axiosClient.get('/unit-usaha');
  return res.data;
};

// Read by id
export const getUnitUsahaById = async (id: number): Promise<UnitUsaha> => {
  const res = await axiosClient.get(`/unit-usaha/${id}`);
  return res.data;
};

// Update
export const updateUnitUsaha = async (
  id: number,
  data: { name?: string; description?: string },
) => {
  const res = await axiosClient.put(`/unit-usaha/${id}`, data);
  return res.data;
};

// Delete
export const deleteUnitUsaha = async (id: number) => {
  const res = await axiosClient.delete(`/unit-usaha/${id}`);
  return res.data;
};
