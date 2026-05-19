import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { Stage02Sidebar } from '../components/Stage02Sidebar';

export function Stage02Layout() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('dws-sidebar-collapsed') === 'true');

  useEffect(() => {
    localStorage.setItem('dws-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <Stage02Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className={`mt-16 min-h-[calc(100vh-64px)] transition-all duration-200 ${collapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'}`}>
        <Outlet />
      </main>
    </div>
  );
}
