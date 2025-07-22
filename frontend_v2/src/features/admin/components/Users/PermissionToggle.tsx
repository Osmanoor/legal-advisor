// src/features/admin/components/Users/PermissionToggle.tsx

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, ArrowDownUp } from 'lucide-react';
import { AllPermissions } from '@/types/admin';

export type OverrideState = 'ALLOW' | 'DENY' | null;

interface PermissionToggleProps {
  permission: AllPermissions;
  state: OverrideState;
  onChange: (newState: OverrideState) => void;
  isDisabled?: boolean;
}

export const PermissionToggle: React.FC<PermissionToggleProps> = ({ permission, state, onChange, isDisabled = false }) => {
  const handleClick = () => {
    if (isDisabled) return;
    let nextState: OverrideState = null;
    if (state === null) nextState = 'ALLOW';
    else if (state === 'ALLOW') nextState = 'DENY';
    else nextState = null;
    onChange(nextState);
  };

  const stateConfig = {
    [null as any]: {
      label: 'Inherit',
      icon: <ArrowDownUp size={16} className="text-gray-500" />,
      bg: 'bg-gray-100',
      text: 'text-gray-600',
    },
    ALLOW: {
      label: 'Allow',
      icon: <Check size={16} className="text-green-600" />,
      bg: 'bg-green-100',
      text: 'text-green-700',
    },
    DENY: {
      label: 'Deny',
      icon: <X size={16} className="text-red-600" />,
      bg: 'bg-red-100',
      text: 'text-red-700',
    },
  };

  const currentConfig = stateConfig[state as any];

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 border rounded-lg",
        isDisabled ? 'bg-gray-50 opacity-60' : 'cursor-pointer hover:border-gray-400'
      )}
      onClick={handleClick}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <div>
        <p className="font-medium text-sm">{permission.name}</p>
        <p className="text-xs text-gray-500">{permission.description}</p>
      </div>
      <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium", currentConfig.bg, currentConfig.text)}>
        {currentConfig.icon}
        <span>{currentConfig.label}</span>
      </div>
    </div>
  );
};