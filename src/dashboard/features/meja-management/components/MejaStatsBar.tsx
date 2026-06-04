import type { FC } from 'react';

interface MejaStatsBarProps {
  stats: {
    total: number;
    terisi: number;
    kosong: number;
    outdoor: number;
  };
}

export const MejaStatsBar: FC<MejaStatsBarProps> = ({ stats }) => {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-2 lg:grid-cols-4 relative shrink-0 w-full">
      {/* Total Meja */}
      <div className="bg-white border border-[#e4beb4] border-solid drop-shadow-[0px_2px_4px_rgba(0,0,0,0.07)] flex flex-col gap-[4px] items-start p-[25px] relative rounded-[12px]">
        <div className="flex flex-col font-['DM_Sans'] text-[#5b4039] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] m-0">TOTAL MEJA</p>
        </div>
        <div className="flex gap-[8px] items-baseline w-full whitespace-nowrap mt-1">
          <div className="font-['Playfair_Display'] font-bold text-[#1a1c1c] text-[32px]">
            <p className="leading-[40px] m-0">{stats.total}</p>
          </div>
          <div className="font-['DM_Sans'] text-[#76abae] text-[12px]">
            <p className="leading-[16px] m-0">Keseluruhan</p>
          </div>
        </div>
      </div>

      {/* Terisi */}
      <div className="bg-white border border-[#e4beb4] border-solid drop-shadow-[0px_2px_4px_rgba(0,0,0,0.07)] flex flex-col gap-[4px] items-start p-[25px] relative rounded-[12px]">
        <div className="flex flex-col font-['DM_Sans'] text-[#5b4039] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] m-0">TERISI</p>
        </div>
        <div className="flex gap-[8px] items-baseline w-full whitespace-nowrap mt-1">
          <div className="font-['Playfair_Display'] font-bold text-[#1a1c1c] text-[32px]">
            <p className="leading-[40px] m-0">{stats.terisi}</p>
          </div>
          <div className="font-['DM_Sans'] text-[#76abae] text-[12px]">
            <p className="leading-[16px] m-0">Sedang makan</p>
          </div>
        </div>
      </div>

      {/* Kosong */}
      <div className="bg-white border border-[#e4beb4] border-solid drop-shadow-[0px_2px_4px_rgba(0,0,0,0.07)] flex flex-col gap-[4px] items-start p-[25px] relative rounded-[12px]">
        <div className="flex flex-col font-['DM_Sans'] text-[#5b4039] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] m-0">KOSONG</p>
        </div>
        <div className="flex gap-[8px] items-baseline w-full whitespace-nowrap mt-1">
          <div className="font-['Playfair_Display'] font-bold text-[#1a1c1c] text-[32px]">
            <p className="leading-[40px] m-0">{stats.kosong}</p>
          </div>
          <div className="font-['DM_Sans'] text-[rgba(91,64,57,0.4)] text-[12px]">
            <p className="leading-[16px] m-0">Tersedia</p>
          </div>
        </div>
      </div>

      {/* Outdoor */}
      <div className="bg-white border border-[#e4beb4] border-solid drop-shadow-[0px_2px_4px_rgba(0,0,0,0.07)] flex flex-col gap-[4px] items-start p-[25px] relative rounded-[12px]">
        <div className="flex flex-col font-['DM_Sans'] text-[#5b4039] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] m-0">ZONA OUTDOOR</p>
        </div>
        <div className="flex gap-[8px] items-baseline w-full whitespace-nowrap mt-1">
          <div className="font-['Playfair_Display'] font-bold text-[#1a1c1c] text-[32px]">
            <p className="leading-[40px] m-0">{stats.outdoor}</p>
          </div>
          <div className="font-['DM_Sans'] text-[rgba(91,64,57,0.4)] text-[12px]">
            <p className="leading-[16px] m-0">Meja di luar</p>
          </div>
        </div>
      </div>
    </div>
  );
};
