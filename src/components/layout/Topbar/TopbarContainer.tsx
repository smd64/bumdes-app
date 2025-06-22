// src/components/layout/Topbar/TopbarContainer.tsx
import React from 'react';

interface TopbarContainerProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export default function TopbarContainer({ left, center, right }: TopbarContainerProps) {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 shadow-md">
      {/* Kiri: Breadcrumbs atau hamburger */}
      <div className="flex items-center space-x-4">{left}</div>

      {/* Tengah: Search */}
      <div className="flex-1 mx-6 max-w-lg">{center}</div>

      {/* Kanan: Toggle, Notif, User */}
      <div className="flex items-center space-x-4">{right}</div>
    </header>
  );
}
