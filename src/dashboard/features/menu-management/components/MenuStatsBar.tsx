import type { FC } from 'react';

interface MenuStatsBarProps {
  stats: {
    total: number;
    tersedia: number;
    habis: number;
    promoAktif: number;
  };
}

export const MenuStatsBar: FC<MenuStatsBarProps> = ({ stats }) => {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-2 lg:grid-cols-4 relative shrink-0 w-full">
      {/* Total Item */}
      <div className="bg-white border border-deep-orange/20 border-solid drop-shadow-[0px_2px_4px_rgba(0,0,0,0.07)] flex flex-col gap-[4px] items-start p-[25px] relative rounded-[12px]">
        <div className="flex flex-col font-['DM_Sans'] text-slate-dark text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] m-0">TOTAL ITEM</p>
        </div>
        <div className="flex gap-[8px] items-baseline w-full whitespace-nowrap mt-1">
          <div className="font-['Playfair_Display'] font-bold text-slate-dark text-[32px]">
            <p className="leading-[40px] m-0">{stats.total}</p>
          </div>
          <div className="font-['DM_Sans'] text-teal-muted text-[12px]">
            <p className="leading-[16px] m-0">+4 bulan ini</p>
          </div>
        </div>
      </div>

      {/* Tersedia */}
      <div className="bg-white border border-deep-orange/20 border-solid drop-shadow-[0px_2px_4px_rgba(0,0,0,0.07)] flex flex-col gap-[4px] items-start p-[25px] relative rounded-[12px]">
        <div className="flex flex-col font-['DM_Sans'] text-slate-dark text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] m-0">TERSEDIA</p>
        </div>
        <div className="flex gap-[8px] items-baseline w-full whitespace-nowrap mt-1">
          <div className="font-['Playfair_Display'] font-bold text-slate-dark text-[32px]">
            <p className="leading-[40px] m-0">{stats.tersedia}</p>
          </div>
          <div className="font-['DM_Sans'] text-[12px] text-[rgba(91,64,57,0.4)]">
            <p className="leading-[16px] m-0">95% aktif</p>
          </div>
        </div>
      </div>

      {/* Habis */}
      <div className="bg-white border border-deep-orange/20 border-solid drop-shadow-[0px_2px_4px_rgba(0,0,0,0.07)] flex flex-col gap-[4px] items-start p-[25px] relative rounded-[12px]">
        <div className="flex flex-col font-['DM_Sans'] text-slate-dark text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] m-0">HABIS</p>
        </div>
        <div className="flex gap-[8px] items-baseline w-full whitespace-nowrap mt-1">
          <div className="font-['Playfair_Display'] font-bold text-slate-dark text-[32px]">
            <p className="leading-[40px] m-0">{stats.habis}</p>
          </div>
          <div className="font-['DM_Sans'] text-red-600 text-[12px]">
            <p className="leading-[16px] m-0">Perlu restock</p>
          </div>
        </div>
      </div>

      {/* Promo Aktif */}
      <div className="bg-white border border-deep-orange/20 border-solid drop-shadow-[0px_2px_4px_rgba(0,0,0,0.07)] flex flex-col gap-[4px] items-start p-[25px] relative rounded-[12px]">
        <div className="flex flex-col font-['DM_Sans'] text-slate-dark text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] m-0">PROMO AKTIF</p>
        </div>
        <div className="flex gap-[8px] items-baseline w-full whitespace-nowrap mt-1">
          <div className="font-['Playfair_Display'] font-bold text-slate-dark text-[32px]">
            <p className="leading-[40px] m-0">{stats.promoAktif}</p>
          </div>
          <div className="font-['DM_Sans'] text-deep-orange text-[12px]">
            <p className="leading-[16px] m-0">Seasonal</p>
          </div>
        </div>
      </div>
    </div>
  );
};
