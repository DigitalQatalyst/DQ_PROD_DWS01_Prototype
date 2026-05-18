import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { Footer } from '../components/Footer';
export function PortalLayout() {
  return <div className="min-h-screen flex flex-col bg-surface">
      <TopBar />
      <main className="flex-1 mt-16">
        <Outlet />
      </main>
      <Footer />
    </div>;
}