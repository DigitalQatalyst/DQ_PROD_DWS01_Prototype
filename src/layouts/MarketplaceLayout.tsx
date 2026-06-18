import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { StandardSidebar } from '../components/StandardSidebar';

function MarketplaceCopyrightFooter() {
  return (
    <footer className="border-t border-border-subtle bg-white px-6 py-3 text-center text-[12px] text-text-muted">
      © {new Date().getFullYear()} DigitalQatalyst. All rights reserved.
    </footer>
  );
}

export function MarketplaceLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <StandardSidebar />
      <div className="mt-16 flex min-h-[calc(100vh-64px)] flex-col lg:ml-[280px]">
        <main className="flex-1">
          <Outlet />
        </main>
        <MarketplaceCopyrightFooter />
      </div>
    </div>
  );
}
