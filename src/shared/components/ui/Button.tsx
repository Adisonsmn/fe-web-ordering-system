import { cn } from '@shared/utils/cn';
import type { ButtonHTMLAttributes, FC } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export const Button: FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[44px] px-4 text-[14px]';

  const variants = {
    primary: 'bg-deep-orange text-white hover:bg-deep-orange/90',
    secondary: 'bg-slate-100 text-slate-dark hover:bg-slate-200',
    outline: 'border border-slate-dark/20 text-slate-dark hover:bg-slate-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button className={cn(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};
