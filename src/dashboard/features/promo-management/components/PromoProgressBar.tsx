import { cn } from '@shared/utils/cn';
import type { FC } from 'react';

interface PromoProgressBarProps {
  current: number;
  max: number | null;
  className?: string;
}

export const PromoProgressBar: FC<PromoProgressBarProps> = ({ current, max, className }) => {
  const percentage = max ? Math.min(100, Math.round((current / max) * 100)) : 100;

  return (
    <div className={cn('w-full max-w-[120px]', className)}>
      <div className="w-full h-2 bg-slate-dark/10 rounded-full overflow-hidden mb-1">
        <div
          className={cn('h-full bg-[#316669] transition-all duration-300')}
          style={{ width: `${max ? percentage : 100}%` }}
        />
      </div>
      <p className="text-[11px] text-slate-dark/60 text-right">
        {current} / {max ? max : '∞'}
      </p>
    </div>
  );
};
