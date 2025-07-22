// src/features/admin/components/Settings/FeatureAccessCard.tsx

import React from 'react';
import { AllPermissions } from '@/types/admin';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FeatureAccessCardProps {
  title: string;
  permissions: AllPermissions[];
  enabledFeatures: Record<string, boolean>;
  onToggle: (permissionName: string, isEnabled: boolean) => void;
}

export const FeatureAccessCard: React.FC<FeatureAccessCardProps> = ({ title, permissions, enabledFeatures, onToggle }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="space-y-4 p-4 border rounded-lg">
        {permissions.map(perm => (
          <div key={perm.id} className="flex items-center justify-between">
            <div>
              <Label htmlFor={`perm-${perm.name}`} className="font-medium">{perm.name}</Label>
              <p className="text-sm text-gray-500">{perm.description}</p>
            </div>
            <Switch
              id={`perm-${perm.name}`}
              checked={enabledFeatures[perm.name] ?? false}
              onCheckedChange={(checked) => onToggle(perm.name, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};