import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { formatJam, formatTanggal } from '@shared/utils/date';
import { MoreVertical } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { useRiwayatPesananAdmin } from './hooks/useRiwayatPesananAdmin';

const TIME_FILTERS = ['Semua', 'Hari Ini', 'Minggu Ini', 'Bulan Ini'] as const;
type TimeFilter = (typeof TIME_FILTERS)[number];

const CATEGORIES = ['Semua', 'Makanan', 'Minuman', 'Dessert'] as const;
type Category = (typeof CATEGORIES)[number];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SERVED':
      return (
        <span className="inline-block rounded-full bg-teal-muted/10 px-3 py-1 text-[12px] font-semibold text-teal-muted">
          Selesai
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-block rounded-full bg-deep-orange/10 px-3 py-1 text-[12px] font-semibold text-deep-orange">
          Dibatalkan
        </span>
      );
    default:
      return (
        <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-[12px] font-semibold text-slate-dark">
          {status}
        </span>
      );
  }
};

const RiwayatPesananPage: FC = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('Semua');
  const [category, setCategory] = useState<Category>('Semua');

  // Memoize date range agar tidak berubah setiap render (cegah infinite refetch)
  // Jika 'Semua', startDate/endDate undefined → tidak ada filter tanggal
  const { startDate, endDate } = useMemo(() => {
    if (timeFilter === 'Semua') return { startDate: undefined, endDate: undefined };

    const now = new Date();
    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (timeFilter === 'Minggu Ini') {
      const day = now.getDay() || 7;
      if (day !== 1) start = new Date(start.getTime() - 24 * 60 * 60 * 1000 * (day - 1));
    } else if (timeFilter === 'Bulan Ini') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return {
      startDate: start.toISOString(),
      endDate: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      ).toISOString(),
    };
  }, [timeFilter]);

  // Ambil semua data sekaligus dengan size besar — tidak pakai pagination
  const { data, isLoading, isError } = useRiwayatPesananAdmin({
    statuses: ['SERVED', 'CANCELLED'],
    startDate,
    endDate,
    category: category === 'Semua' ? undefined : category,
    page: 0,
    size: 500, // ambil semua, tabel bisa di-scroll
  });

  const pesananList = data?.content || [];
  const totalElements = data?.totalElements || 0;

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col bg-off-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-[26px] font-bold text-slate-dark">Riwayat Pesanan</h1>
        {!isLoading && totalElements > 0 && (
          <span className="text-[13px] text-slate-dark/50">{totalElements} pesanan</span>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        {/* Time Filter Tabs */}
        <div className="flex w-fit rounded-lg border border-slate-dark/20 bg-slate-50 p-1">
          {TIME_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setTimeFilter(filter)}
              className={cn(
                'rounded-md px-6 py-2 text-[14px] font-semibold transition-colors',
                timeFilter === filter
                  ? 'bg-teal-muted text-white shadow-sm'
                  : 'text-slate-dark/70 hover:bg-slate-200/50',
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                'rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors',
                category === cat
                  ? 'bg-deep-orange text-white'
                  : 'border border-slate-dark/20 bg-white text-slate-dark hover:bg-slate-50',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Area — scrollable, no pagination */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="h-full overflow-y-auto">
          <table className="w-full text-left text-[14px] text-slate-dark">
            {/* Sticky header */}
            <thead className="sticky top-0 z-10 border-b border-slate-dark/10 bg-slate-50 text-[13px] uppercase text-slate-dark/70">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Pesanan</th>
                <th className="px-6 py-4 font-semibold">Meja / Area</th>
                <th className="px-6 py-4 font-semibold">Detail Menu</th>
                <th className="px-6 py-4 font-semibold">Waktu Selesai</th>
                <th className="px-6 py-4 font-semibold">Total Harga</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-dark/10">
              {isLoading ? (
                // Skeleton rows
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-slate-dark/8" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-red-500">
                    Gagal memuat riwayat pesanan.
                  </td>
                </tr>
              ) : pesananList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-dark/50">
                    Tidak ada pesanan pada periode ini.
                  </td>
                </tr>
              ) : (
                pesananList.map((pesanan) => {
                  const itemsCount = pesanan.detailPesanan.length;
                  const firstItem = itemsCount > 0 ? pesanan.detailPesanan[0].menuName : '-';
                  const detailMenuText =
                    itemsCount > 1 ? `${firstItem} + ${itemsCount - 1} item lainnya` : firstItem;

                  return (
                    <tr key={pesanan.pesananId} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-mono font-medium">{pesanan.kodePesanan}</td>
                      <td className="px-6 py-4">
                        <span className="block font-medium">Meja {pesanan.nomorMeja || '-'}</span>
                      </td>
                      <td className="max-w-[200px] truncate px-6 py-4" title={detailMenuText}>
                        {detailMenuText}
                      </td>
                      <td className="px-6 py-4">
                        <span className="block">{formatTanggal(pesanan.tanggalPesanan)}</span>
                        <span className="text-[12px] text-slate-dark/60">
                          {formatJam(pesanan.tanggalPesanan)}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-deep-orange">
                        {formatRupiah(pesanan.totalHarga)}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(pesanan.status)}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="rounded-md p-1.5 text-slate-dark/50 hover:bg-slate-100 hover:text-slate-dark"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiwayatPesananPage;
