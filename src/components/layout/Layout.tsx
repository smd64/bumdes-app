// src/components/layout/Layout.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { Topbar } from './Topbar/Topbar';
import { Sidebar } from './Sidebar/Sidebar';
import { SidebarMenuData } from './Sidebar/SidebarMenuData';
import { SidebarProvider } from './Sidebar/SidebarContext';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import { useAuth } from '../../context/AuthContext'; // pake useAuth sesuai context kamu

const SIDEBAR_WIDTH = 260;

const formatTitle = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return 'Dashboard';

  return segments
    .map((s) =>
      s
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    )
    .join(' - ');
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const matches = useMediaQuery('(min-width: 768px)');
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = `${formatTitle(location.pathname)} | MyApp`;
  }, [location.pathname]);

  if (loading) {
    // tampilkan loading saat auth masih dicek
    return <div>Loading...</div>;
  }

  const userRole = user?.role || 'guest';
  const menuItems = SidebarMenuData[userRole] || [];

  const breadcrumbItems = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      to: '/' + arr.slice(0, index + 1).join('/'),
    }));

  return (
    <SidebarProvider>
      <Flex direction="column" style={{ minHeight: '100vh' }}>
        <Topbar />
        <Flex style={{ flex: 1 }}>
          <Sidebar menuItems={menuItems} />
          <Box
            style={{
              flex: 1,
              marginLeft: matches ? SIDEBAR_WIDTH : 0,
              transition: 'margin-left 0.3s ease',
              padding: 24,
              overflowY: 'auto',
            }}
          >
            <Breadcrumbs items={breadcrumbItems} />
            {children}
          </Box>
        </Flex>
      </Flex>
    </SidebarProvider>
  );
};

export default Layout;
