import { cn } from '@shared/utils/cn';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { FC, ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  subValueColor?: 'positive' | 'negative' | 'orange';
  showProgressBar?: boolean;
  progressValue?: number;
  decorIcon?: ReactNode;
  className?: string;
}

export const KpiCard: FC<KpiCardProps> = ({
  label,
  value,
  subValue,
  subValueColor,
  showProgressBar,
  progressValue,
  decorIcon,
  className,
}) => {
  const renderSubValue = () => {
    if (!subValue) return null;

    let colorClass = 'text-slate-dark/60';
    let ArrowIcon = null;

    if (subValueColor === 'positive') {
      colorClass = 'text-[#316669]';
      ArrowIcon = <TrendingUp size={12} />;
    } else if (subValueColor === 'negative') {
      colorClass = 'text-[#ff5722]';
      ArrowIcon = <TrendingDown size={12} />;
    } else if (subValueColor === 'orange') {
      colorClass = 'text-[#ff5722]';
    }

    return (
      <div className="flex items-center gap-1 mt-2 z-10 relative">
        {ArrowIcon}
        <span className={cn('text-[12px] font-bold', colorClass)}>{subValue}</span>
      </div>
    );
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.07)] p-[25px] flex flex-col gap-2 border border-[#e4beb4] overflow-hidden relative justify-between min-h-[120px]',
        className,
      )}
    >
      {decorIcon && (
        <div className="absolute -top-1 -right-1 opacity-[0.08] pointer-events-none text-[#5b4039] z-0">
          {decorIcon}
        </div>
      )}

      <div className="flex flex-col gap-1 z-10 relative">
        <h3 className="text-[12px] font-sans font-bold text-[#5b4039] tracking-[0.6px] uppercase">
          {label}
        </h3>
        <p className="text-[24px] font-serif font-semibold text-[#1a1c1c] leading-none mt-1">
          {value}
        </p>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {showProgressBar && progressValue !== undefined && (
          <div className="h-[6px] w-full bg-[#e2e2e2] rounded-full mt-2 z-10 relative">
            <div
              className="h-full bg-deep-orange rounded-full transition-all duration-300"
              style={{ width: `${progressValue}%` }}
            />
          </div>
        )}

        {renderSubValue()}
      </div>
    </div>
  );
};
