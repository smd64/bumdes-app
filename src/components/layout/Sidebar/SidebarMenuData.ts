import {
  FaHome,
  FaUser,
  FaChartLine,
  FaMoneyCheckAlt,
  FaWarehouse,
  FaCogs,
  FaUsers,
  FaFileInvoice,
  FaClipboardList,
  FaStore,
} from 'react-icons/fa';

export const SidebarMenuData: Record<
  string,
  Array<{
    to?: string;
    label: string;
    icon?: React.ComponentType;
    badge?: string | number;
    submenu?: Array<{
      label: string;
      to: string;
    }>;
  }>
> = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: FaHome },
    {
      label: 'Pengguna',
      icon: FaUsers,
      submenu: [
        { label: 'Daftar Pengguna', to: 'users/all' },
        { label: 'Tambah Pengguna', to: 'users/addUser' },
      ],
    },
    { to: '/units', label: 'Unit Usaha', icon: FaStore },
    { to: '/finance', label: 'Keuangan', icon: FaMoneyCheckAlt },
    { to: '/reports', label: 'Laporan', icon: FaFileInvoice },
    { to: '/settings', label: 'Pengaturan', icon: FaCogs },
    { to: '/absen', label: 'Absensi', icon: FaClipboardList },
    { to: '/penduduk', label: 'Penduduk', icon: FaClipboardList },
  ],
  bendahara: [
    { to: '/dashboard', label: 'Dashboard', icon: FaHome },
    { to: '/transactions', label: 'Transaksi', icon: FaMoneyCheckAlt },
    { to: '/reports', label: 'Laporan Keuangan', icon: FaFileInvoice },
    { to: '/settings', label: 'Pengaturan', icon: FaCogs },
  ],
  manajer: [
    { to: '/dashboard', label: 'Dashboard', icon: FaHome },
    { to: '/units', label: 'Unit Usaha', icon: FaStore },
    { to: '/inventory', label: 'Inventaris', icon: FaWarehouse },
    { to: '/performance', label: 'Kinerja Unit', icon: FaChartLine },
    { to: '/reports', label: 'Laporan', icon: FaFileInvoice },
  ],
  anggota: [
    { to: '/dashboard', label: 'Dashboard', icon: FaHome },
    { to: '/profile', label: 'Profil Saya', icon: FaUser },
    { to: '/contributions', label: 'Sumbangan', icon: FaClipboardList },
    { to: '/reports', label: 'Laporan', icon: FaFileInvoice },
  ],
  guest: [{ to: '/dashboard', label: 'Dashboard', icon: FaHome }],
};

export default SidebarMenuData;
