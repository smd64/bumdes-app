import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../api/axiosClient';
import {
  Box,
  Button,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

interface GeneralLedgerEntry {
  akun: string;
  saldoBersih: number | null | undefined;
  posisi: 'Debit' | 'Kredit';
  type: 'ASET' | 'KEWAJIBAN' | 'MODAL' | 'PENDAPATAN' | 'BEBAN';
}

interface IncomeStatement {
  totalPendapatan: number | null | undefined;
  totalBeban: number | null | undefined;
  labaBersih: number | null | undefined;
}

interface BalanceSheet {
  totalAset: number | null | undefined;
  totalKewajiban: number | null | undefined;
  totalModal: number | null | undefined;
  ekuitas?: number;
  isSeimbang?: boolean;
}

export default function FinancialReports() {
  const [unitUsahaId, setUnitUsahaId] = useState(1);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-06-30');
  const [balanceDate, setBalanceDate] = useState('2023-06-30');

  // Params yang akan trigger fetch data saat berubah
  const [params, setParams] = useState<{
    unitUsahaId: number | null;
    startDate: string | null;
    endDate: string | null;
    balanceDate: string | null;
  }>({
    unitUsahaId: null,
    startDate: null,
    endDate: null,
    balanceDate: null,
  });

  const {
    data: ledger,
    isLoading: loadingLedger,
    error: errorLedger,
  } = useQuery<GeneralLedgerEntry[], Error>({
    queryKey: ['generalLedger', params.unitUsahaId, params.startDate, params.endDate],
    queryFn: async () => {
      const res = await axios.get(
        `/financial-report/general-ledger?unitUsahaId=${params.unitUsahaId}&startDate=${params.startDate}&endDate=${params.endDate}`,
      );
      return res.data;
    },
    enabled: params.unitUsahaId !== null && params.startDate !== null && params.endDate !== null,
  });

  const {
    data: income,
    isLoading: loadingIncome,
    error: errorIncome,
  } = useQuery<IncomeStatement, Error>({
    queryKey: ['incomeStatement', params.unitUsahaId, params.startDate, params.endDate],
    queryFn: async () => {
      const res = await axios.get(
        `/financial-report/income-statement?unitUsahaId=${params.unitUsahaId}&startDate=${params.startDate}&endDate=${params.endDate}`,
      );
      return res.data;
    },
    enabled: params.unitUsahaId !== null && params.startDate !== null && params.endDate !== null,
  });

  const {
    data: balance,
    isLoading: loadingBalance,
    error: errorBalance,
  } = useQuery<BalanceSheet, Error>({
    queryKey: ['balanceSheet', params.unitUsahaId, params.balanceDate],
    queryFn: async () => {
      const res = await axios.get(
        `/financial-report/balance-sheet?unitUsahaId=${params.unitUsahaId}&date=${params.balanceDate}`,
      );
      return res.data;
    },
    enabled: params.unitUsahaId !== null && params.balanceDate !== null,
  });

  // Sorting berdasarkan tipe akun supaya tampil rapi
  const sortTypeOrder = ['ASET', 'KEWAJIBAN', 'MODAL', 'PENDAPATAN', 'BEBAN'];
  const sortedLedger = ledger
    ? [...ledger].sort((a, b) => sortTypeOrder.indexOf(a.type) - sortTypeOrder.indexOf(b.type))
    : [];

  // Cukup setParams saja, react-query otomatis fetch data
  const handleLoadReports = () => {
    setParams({
      unitUsahaId,
      startDate,
      endDate,
      balanceDate,
    });
  };

  return (
    <Box p={3} maxWidth={900} margin="auto">
      <Typography variant="h4" mb={3}>
        Laporan Keuangan
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <TextField
          label="Unit Usaha ID"
          type="number"
          value={unitUsahaId}
          onChange={(e) => setUnitUsahaId(Number(e.target.value))}
          sx={{ width: 150 }}
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Balance Sheet Date"
          type="date"
          value={balanceDate}
          onChange={(e) => setBalanceDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleLoadReports}>
          Muat Laporan
        </Button>
      </Box>

      {/* Buku Besar */}
      <Typography variant="h5" mb={1}>
        Buku Besar (General Ledger)
      </Typography>
      {loadingLedger && <CircularProgress />}
      {errorLedger && <Alert severity="error">{errorLedger.message}</Alert>}
      {ledger && ledger.length === 0 && <Typography>Tidak ada data</Typography>}
      {ledger && ledger.length > 0 && (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Akun</TableCell>
                <TableCell align="center">Posisi</TableCell>
                <TableCell align="right">Saldo Bersih (Rp)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedLedger.map(({ akun, posisi, saldoBersih }) => (
                <TableRow key={akun}>
                  <TableCell>{akun}</TableCell>
                  <TableCell align="center">{posisi}</TableCell>
                  <TableCell align="right">
                    {(saldoBersih ?? 0).toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Laporan Laba Rugi */}
      <Typography variant="h5" mb={1}>
        Laporan Laba Rugi
      </Typography>
      {loadingIncome && <CircularProgress />}
      {errorIncome && <Alert severity="error">{errorIncome.message}</Alert>}
      {income && (
        <Box mb={3}>
          <Typography>
            Total Pendapatan:{' '}
            {(income.totalPendapatan ?? 0).toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </Typography>
          <Typography>
            Total Beban:{' '}
            {(income.totalBeban ?? 0).toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </Typography>
          <Typography>
            Laba Bersih:{' '}
            {(income.labaBersih ?? 0).toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </Typography>
        </Box>
      )}

      {/* Neraca */}
      <Typography variant="h5" mb={1}>
        Neraca (Balance Sheet)
      </Typography>
      {loadingBalance && <CircularProgress />}
      {errorBalance && <Alert severity="error">{errorBalance.message}</Alert>}
      {balance && (
        <Box mb={3}>
          <Typography>
            Total Aset:{' '}
            {(balance.totalAset ?? 0).toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </Typography>
          <Typography>
            Total Kewajiban:{' '}
            {(balance.totalKewajiban ?? 0).toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </Typography>
          <Typography>
            Ekuitas:{' '}
            {(balance.totalModal ?? 0).toLocaleString('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
