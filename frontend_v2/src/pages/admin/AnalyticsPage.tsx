// src/pages/admin/AnalyticsPage.tsx
// Updated for i18n

import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAdminAnalytics } from '@/hooks/api/useAdminAnalytics';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, BarChartBig, HelpCircle } from 'lucide-react';

import { StatCard } from '@/features/admin/components/Analytics/StatCard';
import { ActionsReport } from '@/features/admin/components/Analytics/ActionsReport';
import { WeeklyVisitsChart } from '@/features/admin/components/Analytics/WeeklyVisitsChart';
import { UserTypeChart } from '@/features/admin/components/Analytics/UserTypeChart';

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const { data, isLoading, error } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t('admin.analytics.errorLoading')}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title={t('admin.analytics.visits')}
          value={data.stats.visits.value}
          change={data.stats.visits.change}
          icon={BarChartBig}
        />
        <StatCard
          title={t('admin.analytics.users')}
          value={data.stats.users.value}
          change={data.stats.users.change}
          icon={Users}
        />
         <div className="bg-white p-5 rounded-lg border border-gray-200 flex justify-between items-center">
             <div>
                <p className="text-3xl font-semibold">{data.mostVisitedPage}</p>
                <p className="text-sm text-gray-500">{t('admin.analytics.mostVisited')}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
                <HelpCircle className="w-8 h-8 text-cta" />
            </div>
         </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <WeeklyVisitsChart data={data.weeklyVisits} />
        </div>
        <div className="lg:col-span-1">
            <ActionsReport data={data.actionsReport} mostVisited={data.mostVisitedPage} />
        </div>
      </div>

       <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
                <UserTypeChart data={data.userTypes} />
            </div>
             <div className="lg:col-span-2">
                {/* Placeholder for another chart or report */}
            </div>
       </div>
    </div>
  );
}