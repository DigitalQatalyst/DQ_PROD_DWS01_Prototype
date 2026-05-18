import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { RoleScopedSidebar } from '../components/RoleScopedSidebar';
export function AppLayout() {
  return <div className="min-h-screen bg-surface">
      <TopBar />
      <RoleScopedSidebar />
      <main className="ml-[280px] mt-16 p-8 min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
    </div>;
}