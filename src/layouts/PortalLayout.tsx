import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { Footer } from '../components/Footer';
import { StandardSidebar } from '../components/StandardSidebar';
export function PortalLayout() {
  return <div className="min-h-screen flex flex-col bg-surface">
      <TopBar />
      <StandardSidebar />
      <main className="mt-16 flex-1 lg:ml-[280px]">
        <Outlet />
      </main>
      <div className="lg:ml-[280px]"><Footer /></div>
    </div>;
}
