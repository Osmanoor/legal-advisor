// src/features/admin/components/Analytics/WeeklyVisitsChart.tsx
// Updated for i18n

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AdminAnalyticsData } from '@/hooks/api/useAdminAnalytics';
import { useLanguage } from '@/hooks/useLanguage';

interface WeeklyVisitsChartProps {
  data: AdminAnalyticsData['weeklyVisits'];
}

export const WeeklyVisitsChart: React.FC<WeeklyVisitsChartProps> = ({ data }) => {
  const { t } = useLanguage();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.analytics.weeklyVisits')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '0.5rem' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Bar dataKey="visits" fill="#51B749" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};