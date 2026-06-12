import { Spinner } from '@shared/components/ui/Spinner';
import type { PromoResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { Edit2, Trash2 } from 'lucide-react';
import type { FC } from 'react';
import { PromoProgressBar } from './PromoProgressBar';
import { PromoStatusBadge } from './PromoStatusBadge';

interface PromoTableProps {
  promos: PromoResponse[];
  isLoading: boolean;
  onEdit: (promo: PromoResponse) => void;
  onDelete: (promo: PromoResponse) => void;
}

export const PromoTable: FC<PromoTableProps> = ({ promos, isLoading, onEdit, onDelete }) => {
  const calculateStatus = (promo: PromoResponse): 'Aktif' | 'Terjadwal' | 'Selesai' => {
    if (!promo.isActive) return 'Selesai';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Append T00:00:00 agar diparsing sebagai local timezone, bukan UTC midnight
    // Tanpa ini: new Date("2026-06-12") = UTC 00:00 = WIB 07:00 → jam 01:00 WIB masih "Terjadwal"
    const startDate = new Date(promo.tanggalMulai + 'T00:00:00');
    const endDate = new Date(promo.tanggalSelesai + 'T00:00:00');

    if (today < startDate) return 'Terjadwal';
    if (today > endDate) return 'Selesai';

    return 'Aktif';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E4BEB4]/50 overflow-hidden">
        <div className="p-8 flex justify-center">
          <Spinner className="w-8 h-8 text-teal-muted" />
        </div>
      </div>
    );
  }

  if (promos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E4BEB4]/50 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-teal-muted/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🎫</span>
        </div>
        <h3 className="text-[18px] font-serif font-bold text-slate-dark mb-2">Belum ada promosi</h3>
        <p className="text-[14px] text-slate-dark/60 max-w-sm">
          Buat promosi pertama Anda untuk meningkatkan penjualan dan menarik lebih banyak pelanggan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E4BEB4]/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F3F3F3] border-b border-slate-dark/5">
              <th className="px-6 py-4 text-[13px] font-semibold text-[#5B4039] uppercase tracking-wider">
                Nama Promosi
              </th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#5B4039] uppercase tracking-wider">
                Nilai Diskon
              </th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#5B4039] uppercase tracking-wider">
                Target
              </th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#5B4039] uppercase tracking-wider">
                Periode
              </th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#5B4039] uppercase tracking-wider">
                Penggunaan
              </th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#5B4039] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#5B4039] uppercase tracking-wider text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-dark/5">
            {promos.map((promo, index) => (
              <tr
                key={promo.promoId}
                className={cn(
                  'transition-colors hover:bg-slate-dark/5',
                  index % 2 === 1 ? 'bg-teal-muted/[0.02]' : 'bg-white',
                )}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-semibold text-slate-dark">
                      {promo.namaPromo}
                    </span>
                    {promo.tag && (
                      <span className="inline-block px-2 py-0.5 bg-slate-dark/5 rounded text-[11px] font-mono text-slate-dark/60 w-fit">
                        {promo.tag}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] font-medium text-[#1A1C1C]">
                    {promo.tipeDiskon === 'PERSEN'
                      ? `${promo.nilaiDiskon}%`
                      : formatRupiah(promo.nilaiDiskon)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[14px] text-slate-dark/70">
                    {promo.targetCategory || 'Semua Menu'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-[13px] text-slate-dark/70">
                    <span>{promo.tanggalMulai}</span>
                    <span className="text-[11px] text-slate-dark/40">s/d</span>
                    <span>{promo.tanggalSelesai}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <PromoProgressBar current={promo.usageCount} max={promo.maxUsage} />
                </td>
                <td className="px-6 py-4">
                  <PromoStatusBadge status={calculateStatus(promo)} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(promo)}
                      className="p-2 text-slate-dark/50 hover:text-teal-muted hover:bg-teal-muted/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(promo)}
                      className="p-2 text-slate-dark/50 hover:text-deep-orange hover:bg-deep-orange/10 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
