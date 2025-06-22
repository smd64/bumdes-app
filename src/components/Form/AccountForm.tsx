import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { accountSchema } from '../../schemas/account.schema';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axiosClient';
import { Box, TextField, MenuItem, Button, CircularProgress, Alert } from '@mui/material';

const accountTypes = [
  'ASET',
  'KEWAJIBAN',
  'MODAL',
  'PENDAPATAN',
  'BEBAN',
  'INVESTASI',
  'PENDANAAN',
  'OPERASIONAL',
];

interface FormValues {
  code: string;
  name: string;
  type: string;
  parentId?: number | string | null;
}

interface Account {
  id: number;
  code: string;
  name: string;
}

type Props = {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void;
  isLoading?: boolean;
  externalError?: { field: string; message: string };
};

export default function AccountForm({
  defaultValues = {},
  onSubmit,
  isLoading = false,
  externalError,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(accountSchema),
    defaultValues: {
      ...defaultValues,
      parentId:
        defaultValues.parentId !== undefined && defaultValues.parentId !== null
          ? String(defaultValues.parentId)
          : '',
    },
  });

  const {
    data: akunIndukList,
    isLoading: loadingAccounts,
    error: errAccounts,
  } = useQuery({
    queryKey: ['parentAccounts'],
    queryFn: () => axios.get('/accounts?type=BEBAN').then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (externalError?.field && externalError?.message) {
      setError(externalError.field, {
        type: 'manual',
        message: externalError.message,
      });
    }
  }, [externalError, setError]);

  const onFormSubmit = (data: FormValues) => {
    const cleanedData = {
      ...data,
      parentId: data.parentId === '' ? null : Number(data.parentId),
    };
    onSubmit(cleanedData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onFormSubmit)}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}
    >
      <TextField
        label="Kode Akun"
        {...register('code')}
        error={!!errors.code}
        helperText={errors.code?.message}
      />

      <TextField
        label="Nama Akun"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        select
        label="Jenis Akun"
        {...register('type')}
        error={!!errors.type}
        helperText={errors.type?.message}
      >
        {accountTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      {loadingAccounts ? (
        <CircularProgress size={24} />
      ) : errAccounts ? (
        <Alert severity="error">{errAccounts.message}</Alert>
      ) : (
        <TextField
          select
          label="Akun Induk (Opsional)"
          {...register('parentId')}
          value={watch('parentId') ?? ''}
          error={!!errors.parentId}
          helperText={errors.parentId?.message}
        >
          <MenuItem value="">— Tidak Ada —</MenuItem>
          {akunIndukList?.map((akun: Account) => (
            <MenuItem key={akun.id} value={String(akun.id)}>
              {akun.code} — {akun.name}
            </MenuItem>
          ))}
        </TextField>
      )}

      <Button type="submit" variant="contained" disabled={isLoading}>
        Simpan
      </Button>
    </Box>
  );
}
