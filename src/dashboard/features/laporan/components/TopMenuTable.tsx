import type { MenuTerlarisResponse } from '@shared/types';
import { formatRupiah } from '@shared/utils/currency';
import { Medal } from 'lucide-react';
import type { FC } from 'react';

interface TopMenuTableProps {
  data?: MenuTerlarisResponse[];
  isLoading?: boolean;
}

export const TopMenuTable: FC<TopMenuTableProps> = ({ data = [], isLoading }) => {
  const renderMedal = (rank: number) => {
    if (rank === 1) return <Medal className="text-yellow-500 fill-yellow-500" size={16} />;
    if (rank === 2) return <Medal className="text-slate-400 fill-slate-400" size={16} />;
    if (rank === 3) return <Medal className="text-amber-600 fill-amber-600" size={16} />;
    return <span className="text-slate-dark/40 font-mono text-[12px]">{rank}</span>;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 animate-pulse min-h-[300px]">
        <div className="h-6 bg-slate-dark/10 rounded w-1/4 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-dark/10 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 flex flex-col min-h-[300px]">
      <h3 className="text-[16px] font-serif font-semibold text-slate-dark mb-6">
        Menu Terlaris (Top Selling)
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-dark/10 text-[12px] font-sans font-bold text-[#5b4039] uppercase tracking-wider">
              <th className="pb-3 pl-2 w-16">Rank</th>
              <th className="pb-3">Nama Menu</th>
              <th className="pb-3 text-right">Porsi Terjual</th>
              <th className="pb-3 pr-2 text-right">Total Pendapatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-dark/5 text-[14px]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-dark/40">
                  Belum ada data penjualan menu
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.menuId} className="hover:bg-off-white/50 transition-colors">
                  <td className="py-3.5 pl-2 flex items-center justify-start h-full">
                    {renderMedal(index + 1)}
                  </td>
                  <td className="py-3.5 font-semibold text-slate-dark">{item.menuName}</td>
                  <td className="py-3.5 text-right font-mono font-semibold text-slate-dark/80">
                    {item.totalTerjual}
                  </td>
                  <td className="py-3.5 pr-2 text-right font-mono font-bold text-deep-orange">
                    {formatRupiah(item.totalPendapatan)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
