import axiosClient from './axiosClient';

export const getAccounts = () => axiosClient.get('/accounts').then((res) => res.data);
export const getAccount = (id: number) =>
  axiosClient.get(`/accounts/${id}`).then((res) => res.data);
export const createAccount = (data: CreateAccountPayload) => axiosClient.post('/accounts', data);
export const updateAccount = (id: number, data: UpdateAccountPayload) =>
  axiosClient.put(`/accounts/${id}`, data);
export const deleteAccount = (id: number) => axiosClient.delete(`/accounts/${id}`);
