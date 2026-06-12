import { formatRupiah } from '@shared/utils/currency';
// Icons
import { Banknote, ReceiptText, Star, Users } from 'lucide-react';
import { type FC, useState } from 'react';
import { ActivityFeed } from './components/ActivityFeed';

// Components
import { KpiCard } from './components/KpiCard';
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
  const { data: trendData, isLoading: isLoadingTrend } = usePendapatanTrend({
    period: 'bulanan',
  });
  const { data: topMenuData, isLoading: isLoadingTopMenu } = useMenuTerlaris({ limit: 5 });
  const { data: mejaData, isLoading: isLoadingMeja } = useMejaList();

  const [chartView, setChartView] = useState<'weekly' | 'monthly'>('weekly');

  const chartData = (() => {
    if (chartView === 'weekly') {
      // Ambil 7 hari terakhir berdasarkan tanggal hari ini
      // trendData adalah array per hari dalam bulan (index 0 = hari ke-1)
      const today = new Date();
      const todayDay = today.getDate(); // 1-31
      const endIdx = todayDay;          // exclusive — sampai hari ini
      const startIdx = Math.max(0, todayDay - 7); // mulai 7 hari sebelum hari ini
      return trendData?.slice(startIdx, endIdx) ?? [];
    }
    return trendData ?? [];
  })();

  const mejaTotal = mejaData?.length || 0;
  // Hitung dari data meja aktual (sama dengan Dashboard Meja) agar selalu sinkron
  const mejaOkupansi = mejaData?.filter((m) => m.isOccupied).length || 0;
  const progressPct = mejaTotal > 0 ? Math.round((mejaOkupansi / mejaTotal) * 100) : 0;



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
                ? `${deltaData?.pendapatan.deltaArah === 'naik' ? '+' : ''}${deltaData?.pendapatan.deltaPersen}% vs Kemarin`
                : undefined
            }
            subValueColor={
              deltaData?.pendapatan.deltaArah === 'naik'
                ? 'positive'
                : deltaData?.pendapatan.deltaArah === 'turun'
                  ? 'negative'
                  : undefined
            }
            decorIcon={<Banknote size={80} />}
          />
          <KpiCard
            label="Total Pesanan"
            value={isLoadingStats ? '...' : `${statsData?.totalPesananHariIni || 0} Pesanan`}
            subValue={isLoadingStats ? '...' : `${statsData?.totalPesananSelesai || 0} Selesai`}
            subValueColor="positive"
            decorIcon={<ReceiptText size={80} />}
          />
          <KpiCard
            label="Meja Terisi"
            value={isLoadingStats ? '...' : `${statsData?.totalMejaAktif || 0} / ${mejaTotal} Meja`}
            showProgressBar
            progressValue={progressPct}
            decorIcon={<Users size={80} />}
          />
          <KpiCard
            label="Rating Kepuasan"
            value={
              isLoadingStats ? '...' : `${(statsData?.avgRatingHariIni || 0).toFixed(1)} / 5.0`
            }
            subValue={isLoadingStats ? '...' : `${statsData?.totalUlasanHariIni || 0} Ulasan Baru`}
            subValueColor="orange"
            decorIcon={<Star size={80} />}
          />
        </div>
      )}

      {/* Chart & Top Items Row */}
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <RevenueChart
            data={chartData}
            isLoading={isLoadingTrend}
            view={chartView}
            onViewChange={setChartView}
          />
        </div>
        <div className="col-span-2">
          <TopMenuList data={topMenuData} isLoading={isLoadingTopMenu} />
        </div>
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
