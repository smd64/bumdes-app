// src/components/layout/Topbar/Topbar.tsx
import React from 'react';
import TopbarContainer from './TopbarContainer';
import SearchInput from './SearchInput';
import Notifications from './Notifications';
import UserMenu from './UserMenu';
import TopbarBreadcrumbs from './TopbarBreadcrumbs';
import ThemeToggle from '../Theme/ThemeToggle';

export default function Topbar() {
  return (
    <TopbarContainer
      left={<TopbarBreadcrumbs />}
      center={<SearchInput />}
      right={
        <>
          <ThemeToggle />
          <Notifications />
          <UserMenu />
        </>
      }
    />
  );
}
