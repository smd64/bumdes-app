import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './components/layout/Sidebar/SidebarContext';
import { ThemeProvider } from './components/layout/Theme/ThemeContext';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import FinancialSummaryPageWrapper from './pages/FinancialSummaryPageWrapper';
import FinancialReportPageWrapper from './pages/FinancialReportPage';
import ApprovalTasks from './pages/ApprovalTasks';

import LayoutWrapper from './components/layout/LayoutWrapper';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import AddUser from './components/AddUser';
import FinancialReports from './pages/FinancialReportsPage';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import UnitUsahaList from './pages/UnitUsahaList';
import UnitUsahaForm from './components/Form/UnitUsahaForm';
import UnitUsahaEditForm from './components/Form/UnitUsahaEditForm';

import TransaksiKasForm from './components/Transaction/TransaksiKasForm';
import { TransactionForm } from './modul/Transactions/TransactionForm';
import { TransactionList } from './modul/Transactions/TransactionList';

import { TransactionCategoryList } from './features/transactionCategory';

import AccountListPage from './pages/AccountListPage';
import CreateAccountPage from './pages/CreateAccountPage';
import EditAccountPage from './pages/EditAccountPage';

import JurnalUmumList from './components/JurnalUmumList';
import JurnalUmumForm from './components/JurnalUmumForm';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core'; // <-- import MantineProvider

const queryClient = new QueryClient();

export default function App() {
  const userId = 123;

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        {' '}
        {/* <-- Bungkus dengan MantineProvider */}
        <AuthProvider>
          <SidebarProvider>
            <ThemeProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Routes>
                  {/* Tanpa layout */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Dengan layout */}
                  <Route path="/" element={<LayoutWrapper />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="dashboard/:unitUsahaId" element={<Dashboard />} />

                    <Route path="users/all" element={<UserList />} />
                    <Route path="users/addUser" element={<AddUser />} />

                    <Route
                      path="unit-usaha/:id/keuangan"
                      element={<FinancialSummaryPageWrapper />}
                    />

                    <Route
                      path="unit-usaha/:id/laporan-keuangan-v2"
                      element={<FinancialReports />}
                    />

                    <Route
                      path="unit-usaha/:id/laporan-keuangan"
                      element={<FinancialReportPageWrapper />}
                    />

                    <Route path="tugas-approval" element={<ApprovalTasks />} />
                    <Route path="transaction-categories" element={<TransactionCategoryList />} />

                    <Route path="unit-usaha/list" element={<UnitUsahaList />} />
                    <Route path="unit-usaha/tambah" element={<UnitUsahaForm />} />
                    <Route path="unit-usaha/edit/:id" element={<UnitUsahaEditForm />} />

                    <Route path="transaksi/tambah" element={<TransaksiKasForm />} />
                    <Route path="transactions/new" element={<TransactionForm />} />
                    <Route path="transactions/list" element={<TransactionList userId={userId} />} />

                    <Route path="jurnal-umum" element={<JurnalUmumList />} />
                    <Route path="jurnal-umum/tambah" element={<JurnalUmumForm />} />
                    <Route path="jurnal-umum/edit/:id" element={<JurnalUmumForm />} />

                    {/* Account */}
                    <Route path="accounts" element={<AccountListPage />} />
                    <Route path="accounts/create" element={<CreateAccountPage />} />
                    <Route path="accounts/:id/edit" element={<EditAccountPage />} />
                  </Route>
                </Routes>

                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </LocalizationProvider>
            </ThemeProvider>
          </SidebarProvider>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
