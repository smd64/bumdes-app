import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

interface BreadcrumbProps {
  items: { label: string; to?: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ items }) => {
  const location = useLocation();

  return (
    <nav className="text-sm font-medium mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex text-gray-500 dark:text-gray-400">
        <li className="flex items-center">
          <Link
            to="/"
            className="text-teal-600 dark:text-teal-300 hover:underline flex items-center"
            aria-label="Home"
          >
            <FaHome className="mr-1" />
            Home
          </Link>
          <span className="mx-2">›</span>
        </li>

        {items.map(({ label, to }, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={i} className="flex items-center">
              {!isLast && to ? (
                <>
                  <Link to={to} className="text-teal-600 dark:text-teal-300 hover:underline">
                    {label}
                  </Link>
                  <span className="mx-2">›</span>
                </>
              ) : (
                <span className="text-gray-600 dark:text-gray-400" aria-current="page">
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
