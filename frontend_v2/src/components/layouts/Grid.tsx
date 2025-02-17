// src/components/layouts/Grid.tsx
import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { Breakpoint } from '../../config/responsive';

type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

interface GridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'cols'> {
  cols?: ResponsiveValue<number>;
  gap?: ResponsiveValue<number>;
}

export function Grid({ 
  cols = 1,
  gap = 4,
  className,
  children,
  ...props 
}: GridProps) {
  const getResponsiveClasses = (
    prefix: string,
    value: ResponsiveValue<number>
  ): string => {
    if (typeof value === 'number') {
      return `${prefix}-${value}`;
    }

    return Object.entries(value)
      .map(([breakpoint, val]) => 
        breakpoint === 'xs' 
          ? `${prefix}-${val}` 
          : `${breakpoint}:${prefix}-${val}`
      )
      .join(' ');
  };

  const colsClasses = getResponsiveClasses('grid-cols', cols);
  const gapClasses = getResponsiveClasses('gap', gap);

  return (
    <div
      className={clsx(
        'grid',
        colsClasses,
        gapClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}