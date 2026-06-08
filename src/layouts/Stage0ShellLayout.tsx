import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { Stage0Sidebar } from '../components/Stage0Sidebar';

export function Stage0ShellLayout() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('stage0-sidebar-collapsed') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('stage0-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-[#F6F8FC]">
      <TopBar />
      <Stage0Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main
        className={`mt-16 min-h-[calc(100vh-64px)] transition-all duration-200 ${
          collapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
