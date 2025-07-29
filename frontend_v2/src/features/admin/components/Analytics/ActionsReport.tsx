// src/features/admin/components/Analytics/ActionsReport.tsx
// Updated for i18n

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { AdminAnalyticsData } from '@/hooks/api/useAdminAnalytics';
import { useLanguage } from '@/hooks/useLanguage';

interface ActionsReportProps {
  data: AdminAnalyticsData['actionsReport'];
  mostVisited: string;
}

export const ActionsReport: React.FC<ActionsReportProps> = ({ data, mostVisited }) => {
  const { t } = useLanguage();

  const actions = [
    { labelKey: 'admin.analytics.clicks', value: data.clicks },
    { labelKey: 'admin.analytics.toolUsage', value: data.toolUsage },
    { labelKey: 'admin.analytics.communication', value: data.communication },
    { labelKey: 'admin.analytics.feedback', value: data.feedback },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{t('admin.analytics.actions')}</CardTitle>
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <p className="text-sm text-gray-500">{t('admin.analytics.mostVisited')}</p>
          <p className="text-lg font-semibold text-cta">{mostVisited}</p>
        </div>
        {actions.map(action => (
          <div key={action.labelKey} className="flex justify-between items-center text-sm">
            <p className="text-gray-600">{t(action.labelKey)}</p>
            <p className="font-semibold text-cta">{action.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};