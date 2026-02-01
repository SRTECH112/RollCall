import React from 'react';
import { cn } from '../../lib/utils';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  disabled = false,
  loading = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg hover:shadow-xl hover:shadow-primary-500/20 transform hover:scale-105 active:scale-95 focus:ring-primary-500 border border-transparent',
    secondary: 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-600 shadow-md hover:shadow-lg focus:ring-dark-500',
    success: 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 focus:ring-primary-500',
    warning: 'bg-warning-600 hover:bg-warning-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 focus:ring-warning-500',
    ghost: 'hover:bg-dark-800 text-dark-text-secondary hover:text-white focus:ring-dark-500',
    outline: 'border-2 border-primary-600 text-primary-500 hover:bg-primary-600/10 hover:text-primary-400 focus:ring-primary-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && 'transform-none hover:scale-100',
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
