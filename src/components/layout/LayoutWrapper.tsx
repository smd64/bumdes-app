// src/components/layout/LayoutWrapper.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import TopbarContainer from '../../components/layout/Topbar/Topbar';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../components/layout/Sidebar/SidebarContext';

export default function LayoutWrapper() {
  const { user } = useAuth();
  const { isCollapsed, toggleCollapse } = useSidebar();

  return (
    <div className="flex flex-col h-screen">
      {/* Topbar */}
      <TopbarContainer />

      {/* Konten utama: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar role={user?.role || 'guest'} />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
