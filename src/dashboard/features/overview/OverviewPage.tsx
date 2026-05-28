import type { FC } from 'react';

const OverviewPage: FC = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div>
        <h1 className="text-[26px] font-serif font-bold text-slate-dark">Overview Dasbor</h1>
        <p className="text-[14px] text-slate-dark/60 mt-1">
          Pantau status pemesanan, meja aktif, dan statistik harian restoran Aroma Senja secara
          real-time.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Pendapatan Hari Ini',
            value: 'Rp 1.840.000',
            change: '+12% dibanding kemarin',
            color: 'border-l-deep-orange',
          },
          {
            label: 'Pesanan Aktif',
            value: '14 Pesanan',
            change: '4 sedang diproses koki',
            color: 'border-l-teal-muted',
          },
          {
            label: 'Okupansi Meja',
            value: '75%',
            change: '15 dari 20 meja terisi',
            color: 'border-l-slate-dark',
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-6 border-l-4 ${card.color} flex flex-col gap-2 border border-slate-dark/5`}
          >
            <span className="text-[13px] font-semibold text-slate-dark/60 uppercase tracking-wider">
              {card.label}
            </span>
            <span className="text-[28px] font-bold text-slate-dark font-serif tracking-tight">
              {card.value}
            </span>
            <span className="text-[12px] text-teal-muted font-semibold">{card.change}</span>
          </div>
        ))}
      </div>

      {/* Table Status Section */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] p-6 border border-slate-dark/5 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] font-serif font-semibold text-slate-dark">
            Denah & Status Meja
          </h2>
          <span className="text-[12px] bg-teal-muted/10 text-teal-muted px-3 py-1 rounded-full font-semibold">
            Status Terkini
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, idx) => {
            const isOccupied = idx % 3 === 0;
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: Meja static list layout
                key={`meja-${idx + 1}`}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  isOccupied
                    ? 'bg-deep-orange/5 border-deep-orange/20 text-deep-orange'
                    : 'bg-white border-slate-dark/10 hover:border-teal-muted/30 text-slate-dark/70'
                }`}
              >
                <span className="text-[14px] font-bold font-serif">Meja {idx + 1}</span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isOccupied
                      ? 'bg-deep-orange/10 text-deep-orange'
                      : 'bg-slate-dark/5 text-slate-dark/60'
                  }`}
                >
                  {isOccupied ? 'Terisi' : 'Kosong'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
