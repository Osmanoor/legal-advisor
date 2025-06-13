// src/features/tenderMapping/components/ReportDetailsTab.tsx
import React from 'react';
import { TenderDetail } from '@/types/tenderMapping';
import * as LucideIcons from 'lucide-react';

interface ReportDetailsTabProps {
  details: TenderDetail[];
}

const Icon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return <LucideIcons.FileText {...props} />;
  return <LucideIcon {...props} />;
};

// --- FIX: Add a default prop value `details = []` ---
export const ReportDetailsTab: React.FC<ReportDetailsTabProps> = ({ details = [] }) => {

  const renderValue = (value: string) => {
    return value;
  };

  return (
    <div className="bg-white border border-inputTheme-border rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {details.map((item) => (
          <div key={item.key} className="bg-white border border-inputTheme-border rounded-lg p-3 shadow-sm flex items-center justify-end text-right">
            <div className="flex-grow">
              <p className="text-xs text-text-on-light-faint mb-0.5" style={{ fontFamily: 'var(--font-primary-arabic)' }}>{item.label}</p>
              <p className="text-sm font-medium text-text-on-light-strong" style={{ fontFamily: 'var(--font-primary-arabic)' }}>{renderValue(item.value)}</p>
            </div>
            <div className="w-10 h-10 bg-cta/10 rounded-md flex items-center justify-center ml-4">
              <Icon name={item.icon || 'FileText'} className="w-5 h-5 text-cta" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};