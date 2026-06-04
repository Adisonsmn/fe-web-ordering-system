import type { PesananResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { Loader2, MoreVertical } from 'lucide-react';
import { forwardRef } from 'react';
import { useUpdatePesananStatus } from '../hooks/usePesananAction';

interface LiveOrderScrollProps {
  orders?: PesananResponse[];
  isLoading?: boolean;
}

// Helper to get relative time string (e.g., "12 Menit Lalu", "Baru Saja")
const getRelativeTime = (isoString: string) => {
  const diffInMinutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
  if (diffInMinutes < 1) return 'Baru Saja';
  return `${diffInMinutes} Menit Lalu`;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'NEW':
      return (
        <span className="px-2 py-0.5 rounded bg-deep-orange/10 text-deep-orange text-[10px] font-bold uppercase tracking-wider">
          PENTING
        </span>
      );
    case 'PREPARING':
      return (
        <span className="px-2 py-0.5 rounded bg-teal-muted/10 text-teal-muted text-[10px] font-bold uppercase tracking-wider">
          DIPROSES
        </span>
      );
    case 'READY':
      return (
        <span className="px-2 py-0.5 rounded bg-slate-dark/10 text-slate-dark/80 text-[10px] font-bold uppercase tracking-wider">
          MENUNGGU
        </span>
      );
    default:
      return null;
  }
};

const getCtaButton = (
  status: string,
  pesananId: string,
  updateStatus: ReturnType<typeof useUpdatePesananStatus>['mutate'],
  isPending: boolean,
) => {
  switch (status) {
    case 'NEW':
      return (
        <button
          type="button"
          disabled={isPending}
          onClick={() => updateStatus({ pesananId, status: 'PREPARING' })}
          className="flex-1 bg-deep-orange text-white text-[13px] font-semibold py-2 rounded-lg hover:bg-deep-orange/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          Terima
        </button>
      );
    case 'PREPARING':
      return (
        <button
          type="button"
          disabled={isPending}
          onClick={() => updateStatus({ pesananId, status: 'READY' })}
          className="flex-1 bg-teal-muted text-white text-[13px] font-semibold py-2 rounded-lg hover:bg-teal-muted/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          Selesaikan
        </button>
      );
    case 'READY':
      return (
        <button
          type="button"
          disabled={isPending}
          onClick={() => updateStatus({ pesananId, status: 'SERVED' })}
          className="flex-1 bg-slate-dark text-white text-[13px] font-semibold py-2 rounded-lg hover:bg-slate-dark/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          Konfirmasi
        </button>
      );
    default:
      return null;
  }
};

export const LiveOrderScroll = forwardRef<HTMLDivElement, LiveOrderScrollProps>(
  ({ orders = [], isLoading }, ref) => {
    const { mutate: updateStatus, isPending } = useUpdatePesananStatus();

    // Only show active orders in the live scroll
    const activeOrders = orders.filter((o) => ['NEW', 'PREPARING', 'READY'].includes(o.status));

    if (isLoading) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="min-w-[300px] w-[300px] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5 border-l-4 border-slate-dark/10 animate-pulse snap-start shrink-0"
            >
              <div className="flex gap-2 mb-3">
                <div className="h-4 w-16 bg-slate-dark/10 rounded"></div>
                <div className="h-4 w-24 bg-slate-dark/10 rounded"></div>
              </div>
              <div className="h-5 w-20 bg-slate-dark/10 rounded mb-4"></div>
              <div className="space-y-2 mb-6">
                <div className="h-3 w-3/4 bg-slate-dark/10 rounded"></div>
                <div className="h-3 w-2/3 bg-slate-dark/10 rounded"></div>
              </div>
              <div className="h-9 w-full bg-slate-dark/10 rounded-lg"></div>
            </div>
          ))}
        </div>
      );
    }

    if (activeOrders.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-dark/50 border border-slate-dark/5">
          <p className="text-[15px]">Tidak ada pesanan aktif saat ini.</p>
        </div>
      );
    }

    return (
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar">
        {activeOrders.map((order) => {
          // Different border color based on status
          const borderColor =
            order.status === 'NEW'
              ? 'border-l-deep-orange'
              : order.status === 'PREPARING'
                ? 'border-l-teal-muted'
                : 'border-l-slate-dark';

          return (
            <div
              key={order.pesananId}
              className={cn(
                'min-w-[300px] w-[300px] bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-5 border-y border-r border-slate-dark/5 border-l-4 snap-start shrink-0 flex flex-col',
                borderColor,
              )}
            >
              <div className="flex items-center gap-3 mb-3">
                {getStatusBadge(order.status)}
                <span className="text-[11px] text-slate-dark/50 font-medium">
                  {getRelativeTime(order.tanggalPesanan)}
                </span>
              </div>

              <h4 className="text-[15px] font-semibold text-slate-dark mb-4">
                {order.nomorMeja ? `Meja ${String(order.nomorMeja).padStart(2, '0')}` : 'Takeaway'}
                {order.kodePesanan && (
                  <span className="text-slate-dark/50 ml-2 font-normal text-[13px]">
                    #{order.kodePesanan.split('-')[1] || order.kodePesanan}
                  </span>
                )}
              </h4>

              {/* Order Items Summary */}
              <div className="flex-1 space-y-1.5 mb-6">
                {order.detailPesanan.slice(0, 3).map((detail, idx) => (
                  <div
                    key={`skel-live-${idx}`}
                    className="text-[13px] text-slate-dark/80 flex gap-2"
                  >
                    <span className="font-semibold min-w-[20px]">{detail.quantity}x</span>
                    <span className="line-clamp-1">{detail.menuName}</span>
                  </div>
                ))}
                {order.detailPesanan.length > 3 && (
                  <div className="text-[12px] text-slate-dark/50 italic mt-1">
                    +{order.detailPesanan.length - 3} item lainnya...
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center mt-auto">
                {getCtaButton(order.status, order.pesananId, updateStatus, isPending)}
                <button
                  type="button"
                  disabled
                  className="p-2 border border-slate-dark/10 rounded-lg text-slate-dark/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

LiveOrderScroll.displayName = 'LiveOrderScroll';
