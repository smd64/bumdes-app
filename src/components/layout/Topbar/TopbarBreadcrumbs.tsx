import { NavLink } from 'react-router-dom';

export default function TopbarBreadcrumbs() {
  // Dummy breadcrumbs, bisa di-update dinamis dari route
  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Users', path: '/users' },
    { label: 'Edit', path: '/users/edit' },
  ];

  return (
    <nav aria-label="breadcrumb" className="text-gray-600 dark:text-gray-300 text-sm font-medium">
      {breadcrumbs.map((crumb, idx) => (
        <span key={crumb.path} className="inline-flex items-center">
          <NavLink to={crumb.path} className="hover:text-blue-600">
            {crumb.label}
          </NavLink>
          {idx < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
}
