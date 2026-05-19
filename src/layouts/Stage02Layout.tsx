import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { Stage02Sidebar } from '../components/Stage02Sidebar';

export function Stage02Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <Stage02Sidebar />
      <main className="mt-16 min-h-[calc(100vh-64px)] lg:ml-[280px]">
        <Outlet />
      </main>
    </div>
  );
}
