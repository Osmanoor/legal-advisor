// src/components/layouts/Container.tsx
import { HTMLProps } from 'react';
import clsx from 'clsx';

interface ContainerProps extends HTMLProps<HTMLDivElement> {
  fluid?: boolean;
  className?: string;
}

export function Container({ 
  fluid = false, 
  className,
  children,
  ...props 
}: ContainerProps) {
  return (
    <div
      className={clsx(
        'mx-auto px-4 sm:px-6 lg:px-8',
        {
          'max-w-7xl': !fluid,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}