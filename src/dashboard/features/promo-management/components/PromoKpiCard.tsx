import { cn } from '@shared/utils/cn';
import type { FC, ReactNode } from 'react';

interface PromoKpiCardProps {
  label: string;
  value: string | number;
  subValue?: string | ReactNode;
  icon: ReactNode;
  className?: string;
  isPositive?: boolean;
}

export const PromoKpiCard: FC<PromoKpiCardProps> = ({
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
        'bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-between border border-[#E4BEB4]/50',
        className,
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[14px] font-sans font-semibold text-[#5B4039] uppercase tracking-wider">
          {label}
        </h3>
        <div className="text-teal-muted w-10 h-10 flex items-center justify-center bg-teal-muted/10 rounded-full">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[26px] font-serif font-bold text-[#1A1C1C] mb-1">{value}</p>
        {subValue && (
          <p
            className={cn(
              'text-[13px] font-sans font-medium flex items-center gap-1 mt-2',
              isPositive ? 'text-[#316669]' : 'text-deep-orange',
            )}
          >
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};
