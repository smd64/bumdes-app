import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  FormHelperText,
  Typography,
  useTheme,
} from '@mui/material';
import { Dropzone } from '@mantine/dropzone';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosClient from '../../api/axiosClient';

type FormData = {
  amount: number | '';
  unitUsahaId: string;
  categoryId: string;
  date: Date | null;
  description: string;
  attachment: File | null;
  type: 'INCOME' | 'EXPENSE' | '';
};

interface TransactionFormProps {
  defaultValues?: Partial<FormData & { id?: number }>;
  onSuccess?: () => void;
}

// ✅ Tambahkan ID unik untuk toast validasi error
const validationToastId = 'validation-error-toast';

export function TransactionForm({ defaultValues = {}, onSuccess }: TransactionFormProps) {
  const theme = useTheme();

  const [unitUsahaList, setUnitUsahaList] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loadingUnitUsaha, setLoadingUnitUsaha] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedDefaultValues: FormData = {
    amount: defaultValues.amount ?? '',
    unitUsahaId: defaultValues.unitUsahaId ? String(defaultValues.unitUsahaId) : '',
    categoryId: defaultValues.categoryId ? String(defaultValues.categoryId) : '',
    date:
      defaultValues.date && !(defaultValues.date instanceof Date)
        ? new Date(defaultValues.date)
        : defaultValues.date || null,
    description: defaultValues.description ?? '',
    attachment: null,
    type: defaultValues.type ?? '',
  };

  const defaultValuesRef = useRef<string>('');
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: formattedDefaultValues,
  });

  useEffect(() => {
    const newDefaults = JSON.stringify(defaultValues);
    if (defaultValuesRef.current !== newDefaults) {
      reset(formattedDefaultValues);
      defaultValuesRef.current = newDefaults;
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    (async () => {
      setLoadingUnitUsaha(true);
      try {
        const res = await axiosClient.get('/unit-usaha');
        setUnitUsahaList(res.data);
      } catch (err) {
        toast.error('Gagal mengambil unit usaha');
      } finally {
        setLoadingUnitUsaha(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get('/transaction-categories');
        setCategories(res.data);
      } catch (err) {
        toast.error('Gagal mengambil kategori transaksi');
      }
    })();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append('amount', String(data.amount));
      formData.append('unitUsahaId', data.unitUsahaId);
      formData.append('categoryId', data.categoryId);
      if (data.date) formData.append('date', data.date.toISOString().slice(0, 10));
      formData.append('description', data.description.trim());
      formData.append('type', data.type);

      if (data.attachment) {
        formData.append('attachment', data.attachment);
      }

      if (defaultValues.id) {
        await axiosClient.put(`/transactions/${defaultValues.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Transaksi berhasil diupdate');
      } else {
        await axiosClient.post('/transactions', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Transaksi berhasil disimpan');
      }

      reset();
      onSuccess?.();
    } catch (error: any) {
      if (error.response?.data?.message) {
        if (!toast.isActive(validationToastId)) {
          toast.error('Validasi gagal: ' + error.response.data.message.join(', '), {
            toastId: validationToastId,
          });
        }
      } else {
        toast.error('Terjadi kesalahan saat menyimpan transaksi');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 700,
          mx: 'auto',
          p: 5,
          boxShadow: 3,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          position: 'relative',
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} color="primary" textAlign="center">
          {defaultValues.id ? 'Edit Transaksi' : 'Form Transaksi'}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Kategori */}
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.categoryId}
            disabled={isSubmitting}
          >
            <InputLabel id="categoryId-label">Kategori Transaksi</InputLabel>
            <Controller
              name="categoryId"
              control={control}
              rules={{ required: 'Kategori wajib dipilih' }}
              render={({ field }) => (
                <Select labelId="categoryId-label" label="Kategori Transaksi" {...field}>
                  <MenuItem value="">
                    <em>Pilih Kategori</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.categoryId?.message}</FormHelperText>
          </FormControl>

          {/* Jumlah */}
          <TextField
            {...register('amount', {
              required: 'Jumlah wajib diisi',
              valueAsNumber: true,
              validate: (value) => (value > 0 ? true : 'Jumlah harus lebih dari 0'),
            })}
            label="Jumlah"
            type="number"
            fullWidth
            error={!!errors.amount}
            helperText={errors.amount?.message || 'Masukkan angka dalam Rupiah'}
            disabled={isSubmitting}
            margin="normal"
            inputProps={{ min: 0, step: 'any' }}
          />

          {/* Unit Usaha */}
          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.unitUsahaId}
            disabled={loadingUnitUsaha || isSubmitting}
          >
            <InputLabel id="unitUsahaId-label">Unit Usaha</InputLabel>
            <Controller
              name="unitUsahaId"
              control={control}
              rules={{ required: 'Unit Usaha wajib dipilih' }}
              render={({ field }) => (
                <Select labelId="unitUsahaId-label" label="Unit Usaha" {...field}>
                  <MenuItem value="">
                    <em>Pilih Unit Usaha</em>
                  </MenuItem>
                  {unitUsahaList.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id.toString()}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.unitUsahaId?.message}</FormHelperText>
          </FormControl>

          {/* Tanggal */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Tanggal"
                value={field.value ? dayjs(field.value) : null}
                onChange={(val) => field.onChange(val ? val.toDate() : null)}
                disabled={isSubmitting}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    error: !!errors.date,
                  },
                }}
              />
            )}
          />

          {/* Deskripsi */}
          <TextField
            {...register('description', { required: 'Deskripsi wajib diisi' })}
            label="Deskripsi"
            fullWidth
            multiline
            minRows={3}
            error={!!errors.description}
            helperText={errors.description?.message || 'Jelaskan transaksi secara singkat'}
            disabled={isSubmitting}
            margin="normal"
            inputProps={{ maxLength: 250 }}
          />

          {/* Attachment */}
          <Box mt={2} mb={3}>
            <Controller
              name="attachment"
              control={control}
              render={({ field }) => (
                <Dropzone
                  onDrop={(files) => field.onChange(files[0] || null)}
                  multiple={false}
                  accept={['image/*', '.pdf']}
                  disabled={isSubmitting}
                >
                  <Box
                    sx={{
                      border: `1px dashed ${theme.palette.primary.main}`,
                      borderRadius: 4,
                      padding: theme.spacing(3),
                      textAlign: 'center',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      color: theme.palette.text.secondary,
                      transition: 'border-color 0.3s',
                      '&:hover': {
                        borderColor: isSubmitting
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      },
                    }}
                  >
                    {field.value ? (
                      <Typography variant="body2" color="textPrimary">
                        {field.value.name}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Klik atau drag file di sini (gambar/pdf)
                      </Typography>
                    )}
                  </Box>
                </Dropzone>
              )}
            />
          </Box>

          {/* Tipe Transaksi */}
          <FormControl fullWidth margin="normal" error={!!errors.type} disabled={isSubmitting}>
            <InputLabel id="type-label">Tipe Transaksi</InputLabel>
            <Controller
              name="type"
              control={control}
              rules={{ required: 'Tipe transaksi harus dipilih' }}
              render={({ field }) => (
                <Select labelId="type-label" label="Tipe Transaksi" {...field}>
                  <MenuItem value="">
                    <em>Pilih Tipe</em>
                  </MenuItem>
                  <MenuItem value="INCOME">Pemasukan</MenuItem>
                  <MenuItem value="EXPENSE">Pengeluaran</MenuItem>
                </Select>
              )}
            />
            <FormHelperText>{errors.type?.message}</FormHelperText>
          </FormControl>

          {/* Submit Button */}
          <Box position="relative" mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
              size="large"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                boxShadow: theme.shadows[4],
                transition: 'background-color 0.3s, box-shadow 0.3s',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              {isSubmitting
                ? 'Menyimpan...'
                : defaultValues.id
                  ? 'Update Transaksi'
                  : 'Simpan Transaksi'}
            </Button>

            {isSubmitting && (
              <CircularProgress
                size={28}
                sx={{
                  color: theme.palette.primary.light,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-14px',
                  marginLeft: '-14px',
                }}
              />
            )}
          </Box>
        </form>
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
