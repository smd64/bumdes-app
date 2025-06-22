import { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notifications() {
  const notifications = useStore((state) => state.notifications);
  const markRead = useStore((state) => state.markNotificationRead);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Notifications"
        className="relative p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
        onClick={() => setOpen(!open)}
      >
        🔔
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded z-50"
            role="list"
          >
            {notifications.length === 0 && (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            )}
            {notifications.map((notif) => (
              <div
                key={notif.id}
                role="listitem"
                tabIndex={0}
                className={`p-2 cursor-pointer ${
                  notif.read ? 'text-gray-500' : 'font-semibold'
                } hover:bg-gray-100 dark:hover:bg-gray-700`}
                onClick={() => markRead(notif.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') markRead(notif.id);
                }}
              >
                {notif.message}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
