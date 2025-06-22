import { NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';

interface SidebarItemProps {
  item: {
    label: string;
    to: string;
    icon?: IconType;
  };
  collapsed: boolean;
}

export default function SidebarItem({ item, collapsed }: SidebarItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
          isActive
            ? 'bg-blue-600 text-white dark:bg-blue-500'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`
      }
      title={collapsed ? item.label : undefined}
    >
      {Icon && <Icon className="mr-3 text-lg flex-shrink-0" />}
      {!collapsed && <span className="select-none">{item.label}</span>}
    </NavLink>
  );
}
