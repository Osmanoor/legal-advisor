// src/features/library/components/BreadcrumbNav.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import React from "react";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onNavigate: (index: number) => void;
}

export function BreadcrumbNav({ items, onNavigate }: BreadcrumbNavProps) {
  const { direction } = useLanguage();
  const ChevronIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className="flex items-center gap-2 text-gray-400 overflow-x-auto">
      {items.map((crumb, index) => (
        <React.Fragment key={crumb.id}>
          {index > 0 && <ChevronIcon size={16} />}
          <button
            onClick={() => onNavigate(index)}
            className="hover:text-white transition-colors whitespace-nowrap"
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
