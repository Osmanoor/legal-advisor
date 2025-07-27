// File: src/components/layouts/AdminLayout.tsx

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { direction } = useLanguage();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className={cn("flex h-screen bg-background-body", direction === 'rtl' ? 'flex-row-reverse' : 'flex-row')}>
      <AdminSidebar />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden lg:mr-[277px]">
        <DashboardHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}