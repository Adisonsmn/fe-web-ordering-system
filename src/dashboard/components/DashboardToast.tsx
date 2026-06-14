import { cn } from '@shared/utils/cn';
import type { LucideIcon } from 'lucide-react';
import { ReceiptText, Star, Table2, X } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';

export type ToastType = 'order' | 'table' | 'rating';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description: string;
}

interface DashboardToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const TOAST_CONFIG: Record<
  ToastType,
  { icon: LucideIcon; color: string; bg: string; border: string }
> = {
  order: {
    icon: ReceiptText,
    color: 'text-deep-orange',
    bg: 'bg-deep-orange/5',
    border: 'border-deep-orange/20',
  },
  table: {
    icon: Table2,
    color: 'text-teal-muted',
    bg: 'bg-teal-muted/5',
    border: 'border-teal-muted/20',
  },
  rating: {
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
};

const SingleToast: FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);
  const config = TOAST_CONFIG[toast.type];
  const Icon = config.icon;


  useEffect(() => {
    // Trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss setelah 5 detik
    const dismissTimer = setTimeout(() => {
      setVisible(false);
      // Delay actual removal agar animasi exit selesai
      setTimeout(() => onDismiss(toast.id), 300);
    }, 5000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 w-[320px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.12)] border p-4',
        'transition-all duration-300 ease-out',
        config.border,
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Icon */}
      <div className={cn('flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center', config.bg)}>
        <Icon size={18} className={config.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-slate-dark leading-tight">{toast.title}</p>
        <p className="text-[12px] text-slate-dark/60 mt-0.5 leading-snug">{toast.description}</p>
      </div>

      {/* Dismiss */}
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="flex-shrink-0 text-slate-dark/30 hover:text-slate-dark/70 transition-colors p-0.5"
        aria-label="Tutup notifikasi"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      <div
        className={cn('absolute bottom-0 left-0 h-[3px] rounded-b-xl', config.color, 'bg-current opacity-30')}
        style={{
          width: visible ? '0%' : '100%',
          transition: 'width 5s linear',
        }}
      />
    </div>
  );
};

/**
 * Container toast notifikasi — ditempatkan fixed bottom-right di DashboardApp.
 * Menampilkan maks 5 notifikasi sekaligus, yang paling baru di atas.
 */
export const DashboardToast: FC<DashboardToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-[74px] right-8 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-label="Notifikasi dashboard"
    >
      {toasts.slice(-5).map((toast) => (
        <div key={toast.id} className="pointer-events-auto relative animate-fade-in">
          <SingleToast toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};
