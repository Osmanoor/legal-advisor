// File: src/features/admin/components/Analytics/ActionsReport.tsx
// @new

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { AdminAnalyticsData } from '@/hooks/api/useAdminAnalytics';

interface ActionsReportProps {
  data: AdminAnalyticsData['actionsReport'];
  mostVisited: string;
}

export const ActionsReport: React.FC<ActionsReportProps> = ({ data, mostVisited }) => {
  const actions = [
    { label: 'الضغطات على الموقع', value: data.clicks },
    { label: 'أستخدام الادوات', value: data.toolUsage },
    { label: 'التواصل', value: data.communication },
    { label: 'تسجيل تعليق', value: data.feedback },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">الأفعال</CardTitle>
        <HelpCircle className="w-4 h-4 text-gray-400" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="bg-gray-50 p-3 rounded-md text-center">
          <p className="text-sm text-gray-500">الصفحة الأكثر زيارة</p>
          <p className="text-lg font-semibold text-cta">{mostVisited}</p>
        </div>
        {actions.map(action => (
          <div key={action.label} className="flex justify-between items-center text-sm">
            <p className="text-gray-600">{action.label}</p>
            <p className="font-semibold text-cta">{action.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};