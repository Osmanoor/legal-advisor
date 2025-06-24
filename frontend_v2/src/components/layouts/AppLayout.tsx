// File: src/components/layouts/AppLayout.tsx

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { useUIStore } from '@/stores/uiStore'; // Import UI store

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { direction } = useLanguage();
  const { isSidebarOpen, setSidebarOpen } = useUIStore(); // Get state and setter

  return (
    <div className="flex h-screen bg-gray-100" dir={direction}>
      {/* Sidebar (now handles its own visibility) */}
      <DashboardSidebar />

      {/* Overlay for mobile view when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area (takes remaining space) */}
      <div
        className="flex-1 flex flex-col overflow-hidden lg:mr-[277px]"
        // The margin is now a responsive class, only applied on lg screens and up.
        // No inline style needed anymore.
      >
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white px-4 md:px-6"> {/* Main content scrolls */}
          {children}
        </main>
      </div>
    </div>
  );
}