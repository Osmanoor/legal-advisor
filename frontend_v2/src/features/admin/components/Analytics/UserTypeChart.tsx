// src/features/admin/components/Analytics/UserTypeChart.tsx
// Updated for i18n

import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AdminAnalyticsData } from '@/hooks/api/useAdminAnalytics';
import { useLanguage } from '@/hooks/useLanguage';

interface UserTypeChartProps {
  data: AdminAnalyticsData['userTypes'];
}

export const UserTypeChart: React.FC<UserTypeChartProps> = ({ data }) => {
  const { t } = useLanguage();
  const total = data.registered + data.guests;
  const chartData = [
    { name: t('admin.analytics.guests'), value: data.guests, fill: '#C5FFC1' },
    { name: t('admin.analytics.registered'), value: data.registered, fill: '#51B749' },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('admin.analytics.userTypes')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart
            innerRadius="60%"
            outerRadius="90%"
            data={chartData}
            startAngle={90}
            endAngle={-270}
            barSize={20}
          >
            <PolarAngleAxis type="number" domain={[0, total]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={10} />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value, entry) => <span className="text-gray-600">{value} ({entry.payload?.value}%)</span>}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};