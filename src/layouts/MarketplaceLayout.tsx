import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { MarketplaceSidebar } from '../components/MarketplaceSidebar';

function MarketplaceCopyrightFooter() {
  return (
    <footer className="border-t border-border-subtle bg-white px-6 py-3 text-center text-[12px] text-text-muted">
      © {new Date().getFullYear()} DigitalQatalyst. All rights reserved.
    </footer>
  );
}

export function MarketplaceLayout() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('marketplace-sidebar-collapsed') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('marketplace-sidebar-collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <MarketplaceSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <div
        className={`mt-16 flex min-h-[calc(100vh-64px)] flex-col transition-all duration-200 ${
          collapsed ? 'lg:ml-[88px]' : 'lg:ml-[280px]'
        }`}
      >
        <main className="flex-1">
          <Outlet />
        </main>
        <MarketplaceCopyrightFooter />
      </div>
    </div>
  );
}
