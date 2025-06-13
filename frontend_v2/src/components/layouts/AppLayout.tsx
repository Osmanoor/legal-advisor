// src/components/layouts/AppLayout.tsx
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { direction } = useLanguage();

  return (
    <div className="flex h-screen bg-gray-100" dir={direction}> {/* Overall page direction */}
      {/* Sidebar (Fixed on the right as per design) */}
      <DashboardSidebar />

      {/* Main Content Area (Takes remaining space) */}
      <div className="flex-1 flex flex-col overflow-hidden"
           style={{ marginRight: direction === 'rtl' ? '277px' : '0', marginLeft: direction === 'ltr' ? '277px' : '0' }}
           // Adjust margin to account for fixed sidebar width (277px)
      >
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6"> {/* Main content scrolls */}
          {/* The content for each specific page (Calculator, Chat, etc.) will be rendered here */}
          {children}
        </main>
      </div>
    </div>
  );
}