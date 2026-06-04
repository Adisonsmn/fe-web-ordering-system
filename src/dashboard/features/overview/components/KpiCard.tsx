import { cn } from '@shared/utils/cn';
import type { FC, ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subValue?: string | ReactNode;
  icon: ReactNode;
  className?: string;
  isPositive?: boolean;
}

export const KpiCard: FC<KpiCardProps> = ({
  label,
  value,
  subValue,
  icon,
  className,
  isPositive = true,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-between border border-slate-dark/5',
        className,
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[14px] font-sans font-semibold text-slate-dark/70">{label}</h3>
        <div className="text-teal-muted/20 opacity-80 w-10 h-10 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[26px] font-serif font-bold text-slate-dark mb-1">{value}</p>
        {subValue && (
          <p
            className={cn(
              'text-[12px] font-sans font-medium flex items-center gap-1',
              isPositive ? 'text-teal-muted' : 'text-slate-dark/60',
            )}
          >
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};
