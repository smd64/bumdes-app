import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type User = {
  name: string;
  role: string;
  avatarUrl?: string;
};

const user: User = {
  name: 'John Doe',
  role: 'Admin',
  avatarUrl: '', // kosong berarti fallback pakai inisial
};

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Generate fallback inisial
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.name} avatar`}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline font-medium text-gray-900 dark:text-gray-100">
          {user.name}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 text-gray-700 dark:text-gray-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            role="menu"
            aria-orientation="vertical"
            aria-label="User menu"
          >
            <li
              role="menuitem"
              tabIndex={0}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => alert('Profile clicked')}
              onKeyDown={(e) => e.key === 'Enter' && alert('Profile clicked')}
            >
              Profile
            </li>
            <li
              role="menuitem"
              tabIndex={0}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100"
              onClick={() => alert('Settings clicked')}
              onKeyDown={(e) => e.key === 'Enter' && alert('Settings clicked')}
            >
              Settings
            </li>
            <li>
              <hr className="border-t border-gray-200 dark:border-gray-700 my-1" />
            </li>
            <li
              role="menuitem"
              tabIndex={0}
              className="px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-700 cursor-pointer"
              onClick={() => alert('Logout clicked')}
              onKeyDown={(e) => e.key === 'Enter' && alert('Logout clicked')}
            >
              Logout
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
