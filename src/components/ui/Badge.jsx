import React from 'react';
import { cn } from '../../lib/utils';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-dark-800 text-white border border-dark-700',
    success: 'bg-primary-900/30 text-primary-400 border border-primary-800/50',
    warning: 'bg-warning-900/30 text-warning-400 border border-warning-800/50',
    primary: 'bg-nexblue-900/30 text-nexblue-400 border border-nexblue-800/50',
    secondary: 'bg-dark-700 text-dark-text-secondary border border-dark-600',
    destructive: 'bg-red-900/30 text-red-400 border border-red-800/50'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = 'Badge';

export default Badge;
