import { cn } from '@shared/utils/cn';
import type { FC, InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input: FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        'w-full min-h-[48px] bg-white border border-slate-dark/20 rounded-lg px-4 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted placeholder:text-slate-dark/40 disabled:bg-slate-100 disabled:text-slate-dark/50 disabled:cursor-not-allowed transition-colors',
        className,
      )}
      {...props}
    />
  );
};
