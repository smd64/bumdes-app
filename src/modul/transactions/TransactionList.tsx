import React, { useState, useCallback } from 'react';
import { useTransactions } from './useTransactions'; // Hook fetch data
import axiosClient from '../../api/axiosClient';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import {
  Box,
  CircularProgress,
  Typography,
  Chip,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Transaction } from './types';
import { TransactionForm } from './TransactionForm';
import { toast } from 'react-toastify';

interface Props {
  userId: number;
}

// Format Rupiah
const renderAmountCell = (params: GridRenderCellParams) => {
  const num = typeof params.value === 'string' ? parseFloat(params.value) : params.value;
  return isNaN(num) ? '-' : <>Rp {num.toLocaleString('id-ID')}</>;
};

// Status pakai Chip warna
const renderStatusCell = (params: GridRenderCellParams) => {
  const status = params.value as string;
  const map: Record<string, any> = {
    APPROVED: 'success',
    PENDING: 'warning',
    REJECTED: 'error',
  };
  return (
    <Chip
      label={status}
      color={map[status] || 'default'}
      size="small"
      sx={{ textTransform: 'capitalize' }}
    />
  );
};

// Tanggal dengan tooltip lengkap
const renderDateCell = (params: GridRenderCellParams) => {
  const d = new Date(params.row.date || params.row.createdAt);
  if (isNaN(d.getTime())) return '-';

  const displayDate = d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const fullDate = d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <Tooltip title={fullDate} arrow>
      <span>{displayDate}</span>
    </Tooltip>
  );
};

export function TransactionList({ userId }: Props) {
  const { data: transactions, isLoading, error, refetch } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Confirm tombol hapus ditekan
  const confirmDelete = useCallback((id: number) => {
    setToDeleteId(id);
    setDeleteDialogOpen(true);
  }, []);

  // Proses hapus transaksi
  const handleDelete = useCallback(async () => {
    if (toDeleteId === null) return;
    setIsDeleting(true);
    try {
      await axiosClient.delete(`/transactions/${toDeleteId}`);
      toast.success('Transaksi berhasil dihapus');
      refetch();
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus transaksi');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setToDeleteId(null);
    }
  }, [toDeleteId, refetch]);

  // Tombol edit diklik, set data transaksi yang diedit, sesuaikan tipe data
  const handleEdit = useCallback((tx: Transaction) => {
    setEditingTransaction({
      ...tx,
      unitUsahaId: String(tx.unitUsahaId),
      accountId: String(tx.accountId),
      date: new Date(tx.date),
    });
  }, []);

  // Kolom DataGrid
  const columns: GridColDef[] = [
    { field: 'description', headerName: 'Deskripsi', flex: 2, minWidth: 200 },
    { field: 'amount', headerName: 'Jumlah', flex: 1, minWidth: 120, renderCell: renderAmountCell },
    { field: 'status', headerName: 'Status', flex: 1, minWidth: 120, renderCell: renderStatusCell },
    { field: 'date', headerName: 'Tanggal', flex: 1, minWidth: 160, renderCell: renderDateCell },
    {
      field: 'actions',
      headerName: 'Aksi',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row as Transaction)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => confirmDelete((params.row as Transaction).id)}
          >
            Hapus
          </Button>
        </>
      ),
    },
  ];

  // Style modal box
  const styleModal = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    width: { xs: '90vw', sm: 600, md: 700 },
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 2,
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Tombol Tambah */}
      <Box mb={2} textAlign="right">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAdding(true)}
          size="large"
        >
          Tambah Transaksi
        </Button>
      </Box>

      {(isLoading || isDeleting) && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error instanceof Error ? (
        <Box textAlign="center" mt={4}>
          <Typography color="error">Gagal memuat data: {error.message}</Typography>
          <Button variant="outlined" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </Box>
      ) : (
        <Box mb={3}>
          <DataGrid
            autoHeight
            rows={transactions || []}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
            }}
            pagination
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 1,
              '& .MuiDataGrid-cell': { outline: 'none !important' },
            }}
          />
        </Box>
      )}

      {/* Modal Edit */}
      {editingTransaction && (
        <Modal
          open
          onClose={() => setEditingTransaction(null)}
          aria-labelledby="edit-transaction-modal"
          aria-describedby="edit-transaction-form"
        >
          <Box sx={styleModal}>
            <TransactionForm
              defaultValues={editingTransaction}
              onSuccess={() => {
                setEditingTransaction(null);
                refetch();
              }}
            />
          </Box>
        </Modal>
      )}

      {/* Modal Tambah */}
      {adding && (
        <Modal
          open
          onClose={() => setAdding(false)}
          aria-labelledby="add-transaction-modal"
          aria-describedby="add-transaction-form"
        >
          <Box sx={styleModal}>
            <Typography variant="h6" gutterBottom>
              Tambah Transaksi
            </Typography>
            <TransactionForm
              onSuccess={() => {
                setAdding(false);
                refetch();
              }}
            />
          </Box>
        </Modal>
      )}

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>Yakin ingin menghapus transaksi ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={isDeleting}
            fullWidth
            startIcon={isDeleting ? <CircularProgress size={16} /> : undefined}
          >
            <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>Hapus</Box>
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
              {isDeleting ? 'Menghapus...' : 'Hapus'}
            </Box>
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
