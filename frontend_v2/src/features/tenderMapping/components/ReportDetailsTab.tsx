// src/features/tenderMapping/components/ReportDetailsTab.tsx
import React from 'react';
import { TenderDetail } from '@/types/tenderMapping';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ReportDetailsTabProps {
  details: TenderDetail[];
}

const Icon = ({ name, ...props }: { name: string } & LucideIcons.LucideProps) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return <LucideIcons.FileText {...props} />;
  return <LucideIcon {...props} />;
};

export const ReportDetailsTab: React.FC<ReportDetailsTabProps> = ({ details = [] }) => {
  const { direction } = useLanguage();

  const renderValue = (value: string) => {
    return value;
  };

  return (
    <div className="bg-white border border-inputTheme-border rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {details.map((item) => (
          <div key={item.key} className="flex flex-col">
            {/* Label on top */}
            <p
              className="text-xs text-text-on-light-faint mb-1.5"
              style={{ fontFamily: 'var(--font-primary-arabic)' }}
              dir={direction} // Label text direction
            >
              {item.label}
            </p>
            {/* Card for icon and value */}
            <div
              className={`bg-white border border-inputTheme-border rounded-lg p-1 shadow-sm flex items-center ${
                direction === 'rtl' ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* Group for icon and value, to keep them together */}
              <div className={`flex items-center ${direction === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${direction === 'rtl' ? 'ml-3' : 'mr-3'}`}>
                  <Icon name={item.icon || 'FileText'} className="w-5 h-5 text-cta" />
                </div>
                <div className="flex-grow">
                  <p
                    className="text-sm font-medium text-text-on-light-strong"
                    style={{ fontFamily: 'var(--font-primary-arabic)' }}
                    dir={direction} // Value text direction
                  >
                    {renderValue(item.value)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};