import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { StandardSidebar } from '../components/StandardSidebar';

export function Stage02Layout() {
  return (
    <div className="h-screen overflow-hidden bg-surface">
      <TopBar />
      <StandardSidebar />
      <main className="mt-16 h-[calc(100vh-64px)] overflow-y-auto lg:ml-[280px]">
        <Outlet />
      </main>
    </div>
  );
}
