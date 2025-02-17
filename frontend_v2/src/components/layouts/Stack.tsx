// src/components/layouts/Stack.tsx
import { HTMLAttributes } from 'react';
import clsx from 'clsx';
import { Breakpoint } from '../../config/responsive';

type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
type Direction = 'row' | 'column';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: ResponsiveValue<Direction>;
  spacing?: ResponsiveValue<number>;
}

export function Stack({
  direction = 'column',
  spacing = 4,
  className,
  children,
  ...props
}: StackProps) {
  const getResponsiveClasses = (
    prefix: string,
    value: ResponsiveValue<string | number>
  ): string => {
    if (typeof value === 'string' || typeof value === 'number') {
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

  const directionClasses = getResponsiveClasses('flex', 
    typeof direction === 'string' ? direction :
    Object.entries(direction).reduce((acc, [breakpoint, value]) => ({
      ...acc,
      [breakpoint]: value
    }), {})
  );

  const getSpacingPrefix = (dir: Direction) => 
    dir === 'row' ? 'space-x' : 'space-y';

  const spacingClasses = typeof direction === 'string'
    ? getResponsiveClasses(getSpacingPrefix(direction), spacing)
    : Object.entries(direction).map(([breakpoint, dir]) =>
        breakpoint === 'xs'
          ? getResponsiveClasses(getSpacingPrefix(dir), spacing)
          : `${breakpoint}:${getResponsiveClasses(getSpacingPrefix(dir), spacing)}`
      ).join(' ');

  return (
    <div
      className={clsx(
        'flex',
        directionClasses,
        spacingClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
