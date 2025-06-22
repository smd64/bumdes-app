import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccounts, deleteAccount } from '../api/accounts';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';

export default function AccountListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });

  const columns: GridColDef[] = [
    { field: 'code', headerName: 'Kode', width: 150 },
    { field: 'name', headerName: 'Nama Akun', flex: 1 },
    { field: 'type', headerName: 'Jenis', width: 150 },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 180,
      renderCell: (params) => (
        <>
          <Button onClick={() => navigate(`/accounts/${params.row.id}/edit`)}>Edit</Button>
          <Button color="error" onClick={() => deleteMutation.mutate(params.row.id)}>
            Hapus
          </Button>
        </>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={data ?? []} columns={columns} getRowId={(row) => row.id} />
    </div>
  );
}
