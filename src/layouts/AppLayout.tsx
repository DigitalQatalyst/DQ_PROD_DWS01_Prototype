import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { StandardSidebar } from '../components/StandardSidebar';
export function AppLayout() {
  const location = useLocation();
  const isTrackerRecordDetail = /^\/tracker\/active-tracker\/[^/]+\/records\/[^/]+/.test(location.pathname);

  return <div className="min-h-screen bg-surface">
      <TopBar />
      <StandardSidebar />
      <main className={isTrackerRecordDetail ? 'mt-16 h-[calc(100vh-64px)] overflow-hidden p-0 lg:ml-[280px]' : 'mt-16 min-h-[calc(100vh-64px)] p-8 lg:ml-[280px]'}>
        <Outlet />
      </main>
    </div>;
}
