import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps & React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  ...props
}) => {
  const baseStyles = 'relative overflow-hidden transition-all duration-300 rounded-2xl';
  
  const variants = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
    glass: 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-700/20',
    gradient: 'bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20',
    elevated: 'bg-white dark:bg-gray-900 shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const hoverStyles = hover ? 'hover:scale-[1.02] hover:shadow-3xl cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {variant === 'glass' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
      )}
      {children}
    </div>
  );
};