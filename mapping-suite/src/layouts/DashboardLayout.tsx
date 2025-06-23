'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-60">
        {/* Top Bar */}
        <Topbar />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pt-24 bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
