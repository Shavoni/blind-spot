import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'flush' | 'filled';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'w-full transition-all duration-200 outline-none';
  
  const variants = {
    default: `
      px-4 py-3 rounded-xl border bg-white dark:bg-gray-900
      border-gray-300 dark:border-gray-700
      focus:border-blue-500 dark:focus:border-blue-400
      focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10
      placeholder:text-gray-400 dark:placeholder:text-gray-500
    `,
    flush: `
      px-0 py-3 border-0 border-b-2
      border-gray-300 dark:border-gray-700
      focus:border-blue-500 dark:focus:border-blue-400
      bg-transparent
    `,
    filled: `
      px-4 py-3 rounded-xl border-0
      bg-gray-100 dark:bg-gray-800
      focus:bg-gray-50 dark:focus:bg-gray-700
      focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10
    `
  };

  const iconPadding = Icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : '';

  return (
    <div className="relative">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className={`absolute top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 ${
            iconPosition === 'left' ? 'left-4' : 'right-4'
          }`}>
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            ${baseStyles}
            ${variants[variant]}
            ${iconPadding}
            ${error ? 'border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/10 dark:focus:ring-red-400/10' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';