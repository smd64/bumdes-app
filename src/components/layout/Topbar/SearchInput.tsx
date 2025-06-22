// src/components/Topbar/SearchInput.tsx
import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative text-gray-600 focus-within:text-blue-600">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        name="search"
        placeholder="Ctrl + K Search..."
        value={query}
        onChange={handleChange}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
