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

export type SidebarItemType = {
  path?: string;
  label: string;
  icon?: React.ComponentType; // ✅ pastikan ini digunakan di SidebarItem
  children?: SidebarItemType[];
};

const SidebarMenuData: Record<string, SidebarItemType[]> = {
  admin: [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    {
      label: 'Pengguna',
      icon: FaUsers,
      children: [
        { label: 'Daftar Pengguna', path: '/users/all' },
        { label: 'Tambah Pengguna', path: '/createUser' },
      ],
    },
    { path: '/units', label: 'Unit Usaha', icon: FaStore },
    { path: '/finance', label: 'Keuangan', icon: FaMoneyCheckAlt },
    { path: '/reports', label: 'Laporan', icon: FaFileInvoice },
    { path: '/settings', label: 'Pengaturan', icon: FaCogs },
    { path: '/absen', label: 'Absensi', icon: FaClipboardList },
    { path: '/penduduk', label: 'Penduduk', icon: FaClipboardList },
  ],
  guest: [{ path: '/dashboard', label: 'Dashboard', icon: FaHome }],
};

export default SidebarMenuData;
