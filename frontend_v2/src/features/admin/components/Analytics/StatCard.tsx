// File: src/features/admin/components/Analytics/StatCard.tsx
// @new

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon }) => {
  return (
    <Card>
      <CardContent className="p-5 flex justify-between items-center">
        <div>
          <p className="text-3xl font-semibold">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-center text-sm text-green-600 mt-1">
            <ArrowUp className="w-4 h-4 mr-1" />
            <span>{change}%</span>
          </div>
        </div>
        <div className="bg-green-100 p-3 rounded-full">
          <Icon className="w-8 h-8 text-cta" />
        </div>
      </CardContent>
    </Card>
  );
};