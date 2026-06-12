import { formatRupiah } from '@shared/utils/currency';
import { Calendar, DollarSign, ShoppingBag, Star, Users } from 'lucide-react';
import { type FC, useState } from 'react';
import { ExportButton } from './components/ExportButton';
import { KpiReportCard } from './components/KpiReportCard';
import { LaporanRevenueChart } from './components/LaporanRevenueChart';
import { PromoReportWidget } from './components/PromoReportWidget';
import { RatingChart } from './components/RatingChart';
import { TopMenuTable } from './components/TopMenuTable';
import {
  useLaporanDelta,
  useMenuTerlaris,
  usePendapatanTrend,
  usePoinPromoStats,
  useRatingSentimen,
} from './hooks/useLaporan';

const LaporanPage: FC = () => {
  // Initialize date to today's local date (YYYY-MM-DD)
  const today = new Date().toLocaleDateString('sv-SE'); // sv-SE format is YYYY-MM-DD
  const [tanggal, setTanggal] = useState(today);
  const [period, setPeriod] = useState<'bulanan' | 'tahunan'>('bulanan');

  // Fetch data
  const { data: deltaData } = useLaporanDelta(tanggal);
  const { data: trendData, isLoading: isTrendLoading } = usePendapatanTrend(period);
  const { data: menuData, isLoading: isMenuLoading } = useMenuTerlaris(period);
  const { data: ratingData, isLoading: isRatingLoading } = useRatingSentimen();
  const { data: promoData, isLoading: isPromoLoading } = usePoinPromoStats();

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-serif font-bold text-slate-dark">Analitik & Laporan</h2>
          <p className="text-[14px] text-slate-dark/50">
            Pantau performa penjualan, ulasan pelanggan, serta efektivitas promosi.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Period Toggle */}
          <div className="flex bg-white rounded-lg border border-slate-dark/10 p-1">
            <button
              type="button"
              onClick={() => setPeriod('bulanan')}
              className={`px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
                period === 'bulanan'
                  ? 'bg-teal-muted text-white shadow-sm'
                  : 'text-slate-dark/70 hover:bg-off-white'
              }`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setPeriod('tahunan')}
              className={`px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
                period === 'tahunan'
                  ? 'bg-teal-muted text-white shadow-sm'
                  : 'text-slate-dark/70 hover:bg-off-white'
              }`}
            >
              Tahunan
            </button>
          </div>

          <ExportButton period={period} />
        </div>
      </div>

      {/* Date filter & KPI Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-dark/5 shadow-sm">
          <Calendar size={18} className="text-slate-dark/50" />
          <span className="text-[14px] font-bold text-[#5b4039]">Pilih Tanggal KPI:</span>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="border border-slate-dark/15 rounded-lg px-3 py-1.5 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted"
          />
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiReportCard
            label="Pendapatan Harian"
            delta={deltaData?.pendapatan}
            formatter={formatRupiah}
            decorIcon={<DollarSign size={80} />}
          />
          <KpiReportCard
            label="Total Pesanan"
            delta={deltaData?.totalPesanan}
            decorIcon={<ShoppingBag size={80} />}
          />
          <KpiReportCard
            label="Meja Terisi"
            delta={deltaData?.mejaAktif}
            decorIcon={<Users size={80} />}
          />
          <KpiReportCard
            label="Rating Rata-rata"
            delta={deltaData?.ratingRata}
            formatter={(val) => val.toFixed(1)}
            decorIcon={<Star size={80} />}
          />
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <LaporanRevenueChart data={trendData} isLoading={isTrendLoading} period={period} />

      {/* Sentiment & Promos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingChart data={ratingData} isLoading={isRatingLoading} />
        <PromoReportWidget data={promoData} isLoading={isPromoLoading} />
      </div>

      {/* Top Menu Table */}
      <TopMenuTable data={menuData} isLoading={isMenuLoading} />
    </div>
  );
};

export default LaporanPage;
