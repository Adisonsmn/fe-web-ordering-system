import type { StatusPesanan } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { CheckCircle, ClipboardList, Truck, Utensils } from 'lucide-react';
import type { FC } from 'react';

interface StatusTimelineProps {
  status: StatusPesanan;
}

const STEPS = [
  { key: 'NEW', label: 'Menunggu', icon: ClipboardList, activeStatuses: ['NEW', 'CONFIRMED'] },
  { key: 'PREPARING', label: 'Dimasak', icon: Utensils, activeStatuses: ['PREPARING'] },
  { key: 'READY', label: 'Diantar', icon: Truck, activeStatuses: ['READY'] }, // asumsikan "diantar" atau "siap diambil" tergantung tipe pesanan
  { key: 'SERVED', label: 'Selesai', icon: CheckCircle, activeStatuses: ['SERVED', 'PAID'] },
];

const StatusTimeline: FC<StatusTimelineProps> = ({ status }) => {
  // Find current step index based on status
  // Jika status dicancel, kita tampilkan semua inactive (atau custom logic)
  const currentStepIndex =
    status === 'CANCELLED' ? -1 : STEPS.findIndex((step) => step.activeStatuses.includes(status));

  // Jika tidak ketemu (misal gara2 status lain), fallback ke 0 (NEW)
  const activeIndex = currentStepIndex === -1 && status !== 'CANCELLED' ? 0 : currentStepIndex;

  return (
    <div className="flex items-center justify-between relative mt-4 mb-2 px-2">
      {/* Background Line */}
      <div className="absolute top-6 left-8 right-8 h-1 bg-[#e2e2e2] z-0" />

      {/* Active Line */}
      {activeIndex > 0 && (
        <div
          className="absolute top-6 left-8 h-1 bg-deep-orange z-0 transition-all duration-500 ease-in-out"
          style={{ width: `calc(${(activeIndex / (STEPS.length - 1)) * 100}% - 4rem)` }}
        />
      )}

      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= activeIndex;
        const isCurrent = index === activeIndex;

        return (
          <div key={step.key} className="flex flex-col items-center relative z-10 w-16">
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors duration-300',
                isActive
                  ? 'bg-deep-orange text-white shadow-md'
                  : 'bg-[#e2e2e2] text-slate-dark/50',
              )}
            >
              <Icon size={24} />
            </div>
            <span
              className={cn(
                'font-sans text-[11px] text-center',
                isCurrent
                  ? 'font-bold text-[#b02f00]'
                  : isActive
                    ? 'font-semibold text-deep-orange'
                    : 'font-medium text-[#5b4039]',
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
