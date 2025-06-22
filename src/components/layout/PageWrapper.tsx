// src/components/layout/PageWrapper.tsx
import React, { useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import { SidebarProvider } from './Sidebar/SidebarContext';
import QuickActionButton from './QuickActionButton';

const getTitle = (path: string) =>
  path
    .split('/')
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(' - ') || 'Dashboard';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    document.title = `${getTitle(location.pathname)} | MyApp`;
  }, [location.pathname]);

  const breadcrumbItems = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      to: '/' + arr.slice(0, index + 1).join('/'),
    }));

  return (
    <SidebarProvider>
      <Flex direction="column" minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
        <Topbar />
        <Flex flex="1">
          <Sidebar />
          <Box flex="1" ml={{ base: 0, md: '240px' }} px={6} py={4} overflowY="auto">
            <Breadcrumbs items={breadcrumbItems} />
            {children}
          </Box>
        </Flex>
        <QuickActionButton />
      </Flex>
    </SidebarProvider>
  );
};

export default PageWrapper;
