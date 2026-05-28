import type { StatusPesanan } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { BellRing, ChefHat, Clock } from 'lucide-react';
import type { FC } from 'react';

interface TrackingStatusCardProps {
  status: StatusPesanan;
}

const TrackingStatusCard: FC<TrackingStatusCardProps> = ({ status }) => {
  const getCardContent = () => {
    switch (status) {
      case 'NEW':
      case 'CONFIRMED':
        return {
          bg: 'bg-white',
          border: 'border border-[#e2e2e2]',
          iconBg: 'bg-[#ffdbd1]',
          iconColor: 'text-[#ff5722]',
          Icon: Clock,
          title: 'Menunggu Konfirmasi Dapur',
          titleColor: 'text-deep-orange',
          desc: 'Sesaat lagi tim kami akan memproses pesanan Anda. Mohon tunggu sebentar.',
        };
      case 'PREPARING':
        return {
          bg: 'bg-white',
          border: 'border border-[rgba(226,226,226,0.5)]',
          iconBg: 'bg-deep-orange/10',
          iconColor: 'text-deep-orange',
          Icon: ChefHat,
          title: 'Pesanan Sedang Dimasak',
          titleColor: 'text-slate-dark',
          desc: 'Koki kami sedang menyiapkan hidangan autentik Anda dengan penuh ketelitian.',
        };
      case 'READY':
        return {
          bg: 'bg-[#fff9e6]',
          border: 'border-2 border-deep-orange',
          iconBg: 'bg-white border-2 border-deep-orange',
          iconColor: 'text-deep-orange',
          Icon: BellRing,
          title: 'Pesananmu Siap!',
          titleColor: 'text-slate-dark',
          desc: 'Tim kami sedang mengantarkan hidangan hangatmu ke meja.',
        };
      default:
        return null;
    }
  };

  const content = getCardContent();

  if (!content) return null;
  const { bg, border, iconBg, iconColor, Icon, title, titleColor, desc } = content;

  return (
    <div
      className={cn(
        'rounded-xl p-6 flex flex-col items-center text-center shadow-sm w-full relative overflow-hidden',
        bg,
        border,
      )}
    >
      {status === 'READY' && (
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-deep-orange/10 rounded-full blur-xl pointer-events-none" />
      )}

      <div
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mb-4 shrink-0',
          iconBg,
        )}
      >
        <Icon className={cn('w-8 h-8', iconColor)} strokeWidth={2} />
      </div>

      <h2 className={cn('font-serif font-bold text-[22px] mb-2', titleColor)}>{title}</h2>

      <p className="font-sans text-[15px] text-[#5b4039] leading-relaxed max-w-[280px]">{desc}</p>
    </div>
  );
};

export default TrackingStatusCard;
