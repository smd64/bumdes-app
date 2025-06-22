import axiosClient from './axiosClient';

export async function fetchCurrentUser() {
  const response = await axiosClient.get('/user/me'); // endpoint sesuaikan API-mu
  return response.data;
}

export async function fetchUserList() {
  const response = await axiosClient.get('/user');
  return response.data;
}
