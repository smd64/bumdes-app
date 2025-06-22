import * as yup from 'yup';
import { CategoryType } from '../enums/category-type'; // sesuaikan path

export const accountSchema = yup.object({
  code: yup.string().required('Kode akun wajib diisi'),
  name: yup.string().required('Nama akun wajib diisi'),
  type: yup
    .mixed<CategoryType>()
    .oneOf(Object.values(CategoryType))
    .required('Jenis akun wajib diisi'),

  // 👇 Tambahkan validasi opsional untuk parentId (bisa kosong/null)
  parentId: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value)),
});
