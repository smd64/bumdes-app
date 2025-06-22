import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../api/accounts';
import AccountForm from '../components/Form/AccountForm';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState(null);

  const mutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Akun berhasil ditambahkan!');
      navigate('/accounts');
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message;

      // Contoh: tangani error validasi kode duplikat dari backend
      if (msg && msg.includes('kode')) {
        setFormError({ field: 'code', message: msg });
      } else {
        toast.error(msg || 'Terjadi kesalahan.');
      }
    },
  });

  return (
    <AccountForm
      onSubmit={mutation.mutate}
      isLoading={mutation.isLoading}
      externalError={formError}
    />
  );
}
