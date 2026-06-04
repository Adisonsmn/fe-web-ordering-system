import { formatRupiah } from '@shared/utils/currency';
// Icons
import { Banknote, ChevronLeft, ChevronRight, ReceiptText, Star, Users } from 'lucide-react';
import { type FC, useRef, useState } from 'react';
import { ActivityFeed } from './components/ActivityFeed';

// Components
import { KpiCard } from './components/KpiCard';
import { LiveOrderScroll } from './components/LiveOrderScroll';
import { MejaGrid } from './components/MejaGrid';
import { RevenueChart } from './components/RevenueChart';
import { TopMenuList } from './components/TopMenuList';
import {
  useDashboardDelta,
  useDashboardStats,
  useMejaList,
  useMenuTerlaris,
  usePendapatanTrend,
} from './hooks/useDashboardStats';

const OverviewPage: FC = () => {
  const { data: statsData, isLoading: isLoadingStats, isError: isErrorStats } = useDashboardStats();
  const { data: deltaData } = useDashboardDelta();
  const [trendPeriod, setTrendPeriod] = useState<'bulanan' | 'tahunan'>('bulanan');
  const { data: trendData, isLoading: isLoadingTrend } = usePendapatanTrend({
    period: trendPeriod,
  });
  const { data: topMenuData, isLoading: isLoadingTopMenu } = useMenuTerlaris({ limit: 5 });
  const { data: mejaData, isLoading: isLoadingMeja } = useMejaList();

  const liveOrderScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    liveOrderScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    liveOrderScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
      {/* KPI Row */}
      {isErrorStats ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
          Gagal memuat ringkasan dashboard. Pastikan backend server berjalan.
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          <KpiCard
            label="Pendapatan Hari Ini"
            value={isLoadingStats ? '...' : formatRupiah(statsData?.pendapatanHariIni || 0)}
            subValue={
              deltaData?.pendapatan.deltaArah !== 'no_data'
                ? `${deltaData?.pendapatan.deltaPersen}% vs Kemarin`
                : undefined
            }
            icon={<Banknote size={24} className="text-teal-muted" />}
            isPositive={deltaData?.pendapatan.deltaArah === 'naik'}
          />
          <KpiCard
            label="Total Pesanan"
            value={isLoadingStats ? '...' : `${statsData?.totalPesananHariIni || 0} Pesanan`}
            subValue={
              deltaData?.totalPesanan.deltaArah !== 'no_data'
                ? `${deltaData?.totalPesanan.deltaPersen}% vs Kemarin`
                : undefined
            }
            icon={<ReceiptText size={24} className="text-teal-muted" />}
            isPositive={deltaData?.totalPesanan.deltaArah === 'naik'}
          />
          <KpiCard
            label="Okupansi Meja"
            value={
              isLoadingStats
                ? '...'
                : `${statsData?.totalMejaAktif || 0} / ${mejaData?.length || 0} Meja`
            }
            subValue={
              deltaData?.mejaAktif.deltaArah !== 'no_data'
                ? `${deltaData?.mejaAktif.deltaPersen}% vs Kemarin`
                : undefined
            }
            icon={<Users size={24} className="text-deep-orange" />}
            isPositive={deltaData?.mejaAktif.deltaArah === 'naik'}
          />
          <KpiCard
            label="Rating Kepuasan"
            value={
              isLoadingStats ? '...' : `${(statsData?.avgRatingHariIni || 0).toFixed(1)} / 5.0`
            }
            subValue={
              deltaData?.ratingRata.deltaArah !== 'no_data'
                ? `${deltaData?.ratingRata.deltaPersen}% vs Kemarin`
                : undefined
            }
            icon={<Star size={24} className="text-[#FFC107]" />}
            isPositive={deltaData?.ratingRata.deltaArah === 'naik'}
          />
        </div>
      )}

      {/* Chart & Top Items Row */}
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <RevenueChart
            data={trendData}
            isLoading={isLoadingTrend}
            period={trendPeriod}
            onPeriodChange={setTrendPeriod}
          />
        </div>
        <div className="col-span-2">
          <TopMenuList data={topMenuData} isLoading={isLoadingTopMenu} />
        </div>
      </div>

      {/* Live Orders Row */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[22px] font-serif font-bold text-slate-dark">Pesanan Langsung</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={scrollLeft}
              className="w-8 h-8 rounded-full border border-slate-dark/10 flex items-center justify-center text-slate-dark/60 hover:bg-slate-dark/5 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              className="w-8 h-8 rounded-full border border-slate-dark/10 flex items-center justify-center text-slate-dark/60 hover:bg-slate-dark/5 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <LiveOrderScroll
          ref={liveOrderScrollRef}
          orders={statsData?.liveOrders}
          isLoading={isLoadingStats}
        />
      </div>

      {/* Table Status & Activity Feed Row */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <div className="col-span-3">
          <MejaGrid mejaList={mejaData} isLoading={isLoadingMeja} />
        </div>
        <div className="col-span-2">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
