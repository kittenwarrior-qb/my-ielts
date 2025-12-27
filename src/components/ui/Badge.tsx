import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: ReactNode;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
    primary: 'bg-ielts-100 text-ielts-700 border border-ielts-200 dark:bg-ielts-900/30 dark:text-ielts-300 dark:border-ielts-800',
    success: 'bg-success-100 text-success-700 border border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-800',
    warning: 'bg-warning-100 text-warning-700 border border-warning-200 dark:bg-warning-900/30 dark:text-warning-300 dark:border-warning-800',
    danger: 'bg-danger-100 text-danger-700 border border-danger-200 dark:bg-danger-900/30 dark:text-danger-300 dark:border-danger-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
