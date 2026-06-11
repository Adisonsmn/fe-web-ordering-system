import type { PoinPromoStatsResponse } from '@shared/types';
import { formatRupiah } from '@shared/utils/currency';
import { Coins, Ticket } from 'lucide-react';
import type { FC } from 'react';

interface PromoReportWidgetProps {
  data?: PoinPromoStatsResponse;
  isLoading?: boolean;
}

export const PromoReportWidget: FC<PromoReportWidgetProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 animate-pulse min-h-[300px]">
        <div className="h-6 bg-slate-dark/10 rounded w-1/3 mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-dark/10 rounded" />
          <div className="h-24 bg-slate-dark/10 rounded" />
          <div className="h-24 bg-slate-dark/10 rounded" />
          <div className="h-24 bg-slate-dark/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 flex flex-col min-h-[300px]">
      <h3 className="text-[16px] font-serif font-semibold text-slate-dark mb-6 flex items-center gap-2">
        <Ticket className="text-teal-muted" size={20} />
        Performa Loyalti & Promosi
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Poin Section */}
        <div className="flex flex-col gap-4 p-4 bg-off-white rounded-lg border border-slate-dark/5">
          <h4 className="text-[13px] font-bold text-[#5b4039] uppercase tracking-wider flex items-center gap-1.5">
            <Coins size={14} />
            Statistik Loyalti Poin
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-slate-dark/60">Poin Diterbitkan</span>
              <span className="font-bold text-slate-dark">{data.totalPoinDiterbitkan} pts</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-slate-dark/60">Poin Digunakan</span>
              <span className="font-bold text-teal-muted">{data.totalPoinDigunakan} pts</span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-slate-dark/60">Poin Hangus</span>
              <span className="font-bold text-deep-orange">{data.totalPoinHangus} pts</span>
            </div>
          </div>
        </div>

        {/* Promo Section */}
        <div className="flex flex-col gap-4 p-4 bg-off-white rounded-lg border border-slate-dark/5">
          <h4 className="text-[13px] font-bold text-[#5b4039] uppercase tracking-wider flex items-center gap-1.5">
            <Ticket size={14} />
            Efektivitas Promo
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-slate-dark/60">Total Diskon Promo</span>
              <span className="font-bold text-deep-orange">
                {formatRupiah(data.totalDiskonPromo)}
              </span>
            </div>
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-slate-dark/60">Pesanan Pakai Promo</span>
              <span className="font-bold text-slate-dark">{data.totalPesananPromo} pesanan</span>
            </div>
            {/* Simple efficiency indicator */}
            <div className="flex justify-between items-center text-[14px] pt-1 border-t border-slate-dark/10">
              <span className="text-slate-dark/60">Rata-rata Diskon</span>
              <span className="font-bold text-slate-dark">
                {data.totalPesananPromo > 0
                  ? formatRupiah(data.totalDiskonPromo / data.totalPesananPromo)
                  : 'Rp 0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
