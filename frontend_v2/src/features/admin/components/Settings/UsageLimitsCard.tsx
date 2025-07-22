// src/features/admin/components/Settings/UsageLimitsCard.tsx

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UsageLimitsCardProps {
  title: string;
  limits: Record<string, number>;
  onLimitChange: (limitName: string, value: number) => void;
}

export const UsageLimitsCard: React.FC<UsageLimitsCardProps> = ({ title, limits, onLimitChange }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-4 p-4 border rounded-lg">
        {Object.entries(limits).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <Label htmlFor={`limit-${key}`} className="font-medium">{key.replace(/_/g, ' ')}</Label>
            <Input
              id={`limit-${key}`}
              type="number"
              value={value}
              onChange={(e) => onLimitChange(key, parseInt(e.target.value, 10))}
              className="w-32"
              min="-1"
              placeholder="-1 for unlimited"
            />
          </div>
        ))}
      </div>
    </div>
  );
};