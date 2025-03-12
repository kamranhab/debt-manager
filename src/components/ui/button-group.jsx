import React from 'react';
import { cn } from '../../lib/utils';

/**
 * ButtonGroup component for grouping related buttons together
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements (buttons)
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.rest - Additional props passed to the container
 */
export function ButtonGroup({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 