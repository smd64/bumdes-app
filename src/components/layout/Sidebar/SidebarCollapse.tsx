// src/components/Sidebar/SidebarCollapse.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarCollapseProps {
  item: {
    label: string;
    icon?: IconType;
    submenu: { label: string; to: string }[];
  };
  collapsed: boolean;
}

const submenuVariants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  visible: { height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
};

export default function SidebarCollapse({ item, collapsed }: SidebarCollapseProps) {
  const [isOpen, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setOpen(!isOpen)}
        className={`flex items-center w-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition ${
          isOpen
            ? 'bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-white'
            : 'text-gray-700 dark:text-gray-300'
        }`}
        title={collapsed ? item.label : undefined}
      >
        {Icon && <Icon className="mr-3 text-lg flex-shrink-0" />}
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
        {!collapsed && (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && !collapsed && (
          <motion.div
            variants={submenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="ml-10 mt-1 space-y-1 overflow-hidden"
          >
            {item.submenu &&
              item.submenu.map((subItem, idx) => (
                <NavLink
                  key={idx}
                  to={subItem.to}
                  className={({ isActive }) =>
                    `ml-8 block px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`
                  }
                >
                  {subItem.label}
                </NavLink>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
