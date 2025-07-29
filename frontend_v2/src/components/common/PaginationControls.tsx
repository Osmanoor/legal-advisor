// src/components/common/PaginationControls.tsx
// Updated for i18n

import React, { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
  siblingCount?: number;
}

const DOTS = '...';

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
  siblingCount = 1,
}) => {
  const { t, direction } = useLanguage();
  const PrevIcon = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5;
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
    return range(1, totalPages);
  }, [totalPages, siblingCount, currentPage]);

  if (currentPage === 0 || totalPages < 2) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 w-full", className)}>
      <div className="text-sm text-gray-600">
        {t('pagination.showingResults', { start: startItem.toString(), end: endItem.toString(), total: totalItems.toString() })}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <PrevIcon className="h-4 w-4" />
          <span className="ml-1">{t('pagination.previous')}</span>
        </Button>
        <div className="flex items-center gap-1">
          {paginationRange?.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <span key={`dots-${index}`} className="flex items-center justify-center w-9 h-9">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }
            return (
              <Button
                key={pageNumber}
                variant={pageNumber === currentPage ? 'default' : 'ghost'}
                size="icon"
                className="w-9 h-9"
                onClick={() => onPageChange(pageNumber as number)}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <span className="mr-1">{t('pagination.next')}</span>
          <NextIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};