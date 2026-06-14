import { type FC } from 'react';
import { cn } from '@shared/utils/cn';
import { ReceiptText, Star, Table2, X, BellOff, type LucideIcon } from 'lucide-react';
import type { ToastItem, ToastType } from './DashboardToast';

interface NotificationPanelProps {
  history: ToastItem[];
  onDismiss: (id: string) => void;
  onClose: () => void;
}

const PANEL_CONFIG: Record<
  ToastType,
  { icon: LucideIcon; color: string; bg: string }
> = {
  order: {
    icon: ReceiptText,
    color: 'text-deep-orange',
    bg: 'bg-deep-orange/5',
  },
  table: {
    icon: Table2,
    color: 'text-teal-muted',
    bg: 'bg-teal-muted/5',
  },
  rating: {
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
};

export const NotificationPanel: FC<NotificationPanelProps> = ({
  history,
  onDismiss,
  onClose,
}) => {
  return (
    <div className="absolute right-0 mt-3 w-[360px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-dark/5 overflow-hidden z-50 animate-fade-in-up">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-slate-dark/5 flex items-center justify-between bg-white">
        <h3 className="text-[14px] font-bold text-slate-dark">Notifikasi Terakhir</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-dark/40 hover:text-slate-dark/70 transition-colors"
          aria-label="Tutup panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* List */}
      <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-dark/5">
        {history.length === 0 ? (
          <div className="py-10 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-dark/5 flex items-center justify-center mb-3 text-slate-dark/30">
              <BellOff size={20} />
            </div>
            <p className="text-[13px] font-semibold text-slate-dark/60">Tidak ada notifikasi</p>
            <p className="text-[11px] text-slate-dark/40 mt-1">Notifikasi pesanan, meja, dan ulasan akan muncul di sini</p>
          </div>
        ) : (
          history.map((item) => {
            const config = PANEL_CONFIG[item.type];
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="p-4 flex items-start gap-3 hover:bg-slate-dark/[0.02] transition-colors group relative"
              >
                {/* Icon */}
                <div className={cn('flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center', config.bg)}>
                  <Icon size={16} className={config.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-[13px] font-bold text-slate-dark leading-tight">{item.title}</p>
                  <p className="text-[12px] text-slate-dark/60 mt-1 leading-snug break-words">{item.description}</p>
                </div>

                {/* Clear individual notification */}
                <button
                  type="button"
                  onClick={() => onDismiss(item.id)}
                  className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 text-slate-dark/30 hover:text-slate-orange hover:text-deep-orange transition-all p-1 rounded-md hover:bg-slate-100"
                  aria-label="Hapus notifikasi"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
