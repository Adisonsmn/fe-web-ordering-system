import { cn } from '@shared/utils/cn';
import type { FC } from 'react';

type PromoStatus = 'Aktif' | 'Terjadwal' | 'Selesai';

interface PromoStatusBadgeProps {
  status: PromoStatus;
  className?: string;
}

export const PromoStatusBadge: FC<PromoStatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Aktif':
        return 'bg-teal-muted/15 text-teal-muted';
      case 'Terjadwal':
        return 'bg-slate-dark/10 text-slate-dark';
      case 'Selesai':
        return 'bg-[#E2E2E2] text-[#5B4039]';
      default:
        return 'bg-slate-dark/10 text-slate-dark';
    }
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap',
        getStatusStyles(),
        className,
      )}
    >
      {status}
    </span>
  );
};
