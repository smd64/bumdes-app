// src/components/Sidebar/Sidebar.tsx
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SidebarSection from './SidebarSection';
import SidebarCollapse from './SidebarCollapse';
import SidebarItem from './SidebarItem';
import menuData from './SidebarMenuData';
import { motion } from 'framer-motion';
import { useSidebar } from './SidebarContext';

interface SidebarProps {
  role: string;
}

const sidebarVariants = {
  collapsed: { width: 72, transition: { duration: 0.3, ease: 'easeInOut' } },
  expanded: { width: 240, transition: { duration: 0.3, ease: 'easeInOut' } },
};

export default function Sidebar({ role }: SidebarProps) {
  const { isCollapsed, toggleCollapse } = useSidebar();
  const menuConfig = menuData?.[role] ?? menuData['guest'] ?? [];

  if (!Array.isArray(menuConfig)) {
    return <div className="p-4 text-red-600">Menu tidak tersedia.</div>;
  }

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      className="flex flex-col h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700"
            />
            <span className="text-lg font-medium text-gray-900 dark:text-gray-100 select-none">
              MyDashboard
            </span>
          </div>
        )}
        <button
          onClick={toggleCollapse}
          aria-label="Toggle sidebar"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-2 rounded
             hover:bg-gray-100 dark:hover:bg-gray-800
             text-gray-600 dark:text-gray-300
             focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isCollapsed ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        <SidebarSection title="Menu Utama" collapsed={isCollapsed}>
          {menuConfig.map((item) =>
            item.submenu ? (
              <SidebarCollapse key={item.label} item={item} collapsed={isCollapsed} />
            ) : (
              <SidebarItem key={item.label} item={item} collapsed={isCollapsed} />
            ),
          )}
        </SidebarSection>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800">
        <button
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:text-red-800 transition focus:outline-none focus:ring-2 focus:ring-red-600 rounded"
          title="Logout"
        >
          <span role="img" aria-label="Logout" className="text-lg select-none">
            🔒
          </span>
          {!isCollapsed && 'Logout'}
        </button>
      </div>
    </motion.aside>
  );
}
