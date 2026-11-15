import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Route outlet wrapper; global chrome lives in AppShell so Desk mounts once.
 */
export default function Layout() {
  return <Outlet />;
}
