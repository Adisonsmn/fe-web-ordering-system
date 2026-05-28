import type { StatusPesanan } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { formatJam } from '@shared/utils/date';
import { Check } from 'lucide-react';
import type { FC } from 'react';

interface TrackingTimelineProps {
  status: StatusPesanan;
  updatedAt: string; // ISO string
  estimasiMenit: number | null;
}

const STEPS = [
  {
    key: 'NEW',
    label: 'Menunggu Konfirmasi',
    descActive: 'Sekarang',
    descDone: 'Diterima oleh restoran',
    activeStatuses: ['NEW', 'CONFIRMED'],
  },
  {
    key: 'PREPARING',
    label: 'Sedang Diproses',
    descInactive: 'Estimasi 10-15 menit',
    descActive: 'Pesanan sedang dalam antrean masak',
    descDone: 'Chef telah selesai memasak',
    activeStatuses: ['PREPARING'],
  },
  {
    key: 'READY',
    label: 'Siap Diantar',
    descInactive: 'Ke Meja',
    descActive: 'Pelayan kami sedang membawa pesanan',
    descDone: 'Pesanan telah diantar ke meja',
    activeStatuses: ['READY'],
  },
  {
    key: 'SERVED',
    label: 'Selesai',
    descInactive: 'Selesai',
    descActive: 'Pesanan selesai disajikan',
    descDone: 'Selesai',
    activeStatuses: ['SERVED', 'PAID'],
  },
];

const TrackingTimeline: FC<TrackingTimelineProps> = ({ status, updatedAt, estimasiMenit }) => {
  const currentStepIndex =
    status === 'CANCELLED' ? -1 : STEPS.findIndex((step) => step.activeStatuses.includes(status));
  const activeIndex = currentStepIndex === -1 && status !== 'CANCELLED' ? 0 : currentStepIndex;

  const timeFormatted = formatJam(updatedAt);

  return (
    <div className="flex flex-col w-full pl-2">
      {STEPS.map((step, index) => {
        const isCompleted = index < activeIndex || status === 'SERVED' || status === 'PAID';
        const isActive = index === activeIndex && status !== 'SERVED' && status !== 'PAID';
        const isInactive = index > activeIndex && status !== 'SERVED' && status !== 'PAID';
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step.key} className="flex gap-4 relative w-full pb-8">
            {/* Left side (Indicators & Line) */}
            <div className="flex flex-col items-center shrink-0 w-10">
              {isCompleted ? (
                // Completed State (Brown with check)
                <div className="w-8 h-8 rounded-full bg-[#b02f00] flex items-center justify-center z-10 shrink-0 mt-1">
                  <Check className="text-white w-5 h-5" strokeWidth={3} />
                </div>
              ) : isActive ? (
                // Active State (Orange pulsing)
                <div className="relative w-8 h-8 flex items-center justify-center z-10 shrink-0 mt-1">
                  <div className="absolute inset-0 bg-deep-orange/20 rounded-full animate-ping" />
                  <div className="absolute inset-[-4px] border-4 border-deep-orange/30 rounded-full" />
                  <div className="w-4 h-4 bg-deep-orange rounded-full relative z-10" />
                </div>
              ) : (
                // Inactive State (Grey dot)
                <div className="w-3 h-3 rounded-full bg-slate-300 z-10 shrink-0 mt-2.5" />
              )}

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute top-10 bottom-[-10px] w-0.5',
                    isCompleted ? 'bg-[#b02f00]' : 'bg-[#e2e2e2]',
                    isActive ? 'left-[19px]' : isCompleted ? 'left-[19px]' : 'left-[19px]', // Adjust based on circle size
                  )}
                />
              )}
            </div>

            {/* Right side (Text Content) */}
            <div className={cn('flex flex-col flex-1 pt-1', isInactive && 'opacity-50')}>
              {isCompleted && (
                <p className="font-sans font-bold text-[#b02f00] text-[12px] uppercase tracking-wider mb-1">
                  Selesai • {timeFormatted}
                </p>
              )}
              {isActive && (
                <p className="font-sans font-bold text-deep-orange text-[12px] uppercase tracking-wider mb-1">
                  Sedang Berlangsung
                </p>
              )}

              <h4
                className={cn(
                  'font-sans font-bold text-[16px] mb-1',
                  isActive ? 'text-deep-orange' : 'text-slate-dark',
                )}
              >
                {step.label}
              </h4>

              <p className="font-sans text-[#5b4039] text-[14px]">
                {isCompleted
                  ? step.descDone
                  : isActive
                    ? step.descActive
                    : step.descInactive === 'Estimasi 10-15 menit' && estimasiMenit
                      ? `Estimasi ${estimasiMenit} menit`
                      : step.descInactive}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackingTimeline;
