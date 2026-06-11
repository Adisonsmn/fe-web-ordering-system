import { Button } from '@shared/components/ui/Button';
import type { PromoHistoryResponse, PromoResponse } from '@shared/types';
import { formatRupiah } from '@shared/utils/currency';
import { Calendar, ChevronLeft, Eye, Search, Ticket, X } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromoHistory, usePromoList } from './hooks/usePromoManagement';

export const RiwayatPromoPage: FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromoForDetail, setSelectedPromoForDetail] = useState<PromoResponse | null>(null);

  // State for transaction history pagination
  const [historyPage, setHistoryPage] = useState(0);
  const historyPageSize = 5;

  // Load finished promos
  const { data: promos = [], isLoading } = usePromoList('selesai');

  // Filter list by search term
  const filteredPromos = useMemo(() => {
    return promos.filter(
      (p) =>
        p.namaPromo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tag?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [promos, searchTerm]);

  // Load history if a promo is selected
  const { data: historyData, isLoading: isLoadingHistory } = usePromoHistory(
    selectedPromoForDetail?.promoId || '',
    historyPage,
    historyPageSize,
  );

  const handleOpenDetail = (promo: PromoResponse) => {
    setSelectedPromoForDetail(promo);
    setHistoryPage(0);
  };

  const handleCloseDetail = () => {
    setSelectedPromoForDetail(null);
  };

  return (
    <div className="flex flex-col gap-8 pb-12 relative min-h-screen">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard/promo')}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-dark/60 hover:text-slate-dark transition-colors self-start"
        >
          <ChevronLeft size={16} />
          Kembali ke Kelola Penawaran
        </button>
        <div>
          <h1 className="text-[22px] font-serif font-bold text-slate-dark mb-1">Riwayat Promosi</h1>
          <p className="text-[14px] text-slate-dark/60">
            Lihat performa dan total diskon yang diberikan pada promosi yang sudah berakhir.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E4BEB4]/50">
        <div className="relative w-[320px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-dark/40"
            size={16}
          />
          <input
            type="text"
            placeholder="Cari riwayat promo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-dark/20 rounded-lg text-[13px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted placeholder:text-slate-dark/40 bg-[#f9f9f9]"
          />
        </div>
      </div>

      {/* Promo Table */}
      <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[#E4BEB4]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f3f3] border-b border-[#E4BEB4]/50">
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#5b4039]">
                  Nama Promo
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#5b4039]">
                  Periode
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#5b4039] text-center">
                  Penggunaan
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#5b4039] text-right">
                  Total Diskon
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#5b4039]">
                  Status
                </th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#5b4039] text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4BEB4]/20 text-[14px] text-slate-dark">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-dark/60">
                    Memuat data riwayat promosi...
                  </td>
                </tr>
              ) : filteredPromos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-dark/60">
                    Tidak ada riwayat promosi yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredPromos.map((promo) => {
                  const usagePercent = promo.maxUsage
                    ? Math.min(100, Math.round((promo.usageCount / promo.maxUsage) * 100))
                    : 100;

                  // Estimate total discount for display
                  const estimatedDiscount =
                    promo.tipeDiskon === 'NOMINAL' ? promo.nilaiDiskon * promo.usageCount : 0;

                  return (
                    <tr key={promo.promoId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-dark">{promo.namaPromo}</span>
                          {promo.tag && (
                            <span className="inline-flex self-start px-2 py-0.5 rounded text-[11px] bg-slate-100 text-[#5b4039] font-medium border border-slate-200">
                              {promo.tag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-dark/80 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-slate-dark/40" />
                          <span>
                            {new Date(promo.tanggalMulai).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                            })}{' '}
                            -{' '}
                            {new Date(promo.tanggalSelesai).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[12px] font-medium">
                            {promo.usageCount} {promo.maxUsage ? `/ ${promo.maxUsage}` : ''}
                          </span>
                          {promo.maxUsage ? (
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-teal-muted h-full rounded-full"
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                          ) : (
                            <span className="text-[11px] text-teal-muted font-medium">
                              Tanpa batas
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold whitespace-nowrap">
                        {estimatedDiscount > 0 ? (
                          formatRupiah(estimatedDiscount)
                        ) : (
                          <span className="text-slate-dark/40 font-normal italic text-[13px]">
                            Buka detail
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {promo.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#76abae]/10 text-[#76abae]">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-slate-100 text-slate-dark/60">
                            Selesai
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(promo)}
                          className="p-1.5 hover:bg-slate-100 text-slate-dark/60 hover:text-teal-muted rounded-lg transition-all"
                          title="Lihat Detail Transaksi"
                        >
                          <Eye size={18} />
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

      {/* Sliding Drawer/Modal for Promo Transaction History */}
      {selectedPromoForDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
          <div className="w-full max-w-[640px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="p-6 border-b border-[#E4BEB4]/50 flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Ticket size={20} className="text-deep-orange" />
                  <h2 className="text-[18px] font-serif font-bold text-slate-dark">
                    Detail Penggunaan Promo
                  </h2>
                </div>
                <span className="text-[15px] font-semibold text-slate-dark mt-1">
                  {selectedPromoForDetail.namaPromo}
                </span>
                {selectedPromoForDetail.tag && (
                  <span className="inline-flex self-start px-2 py-0.5 rounded text-[11px] bg-slate-100 text-[#5b4039] font-medium border border-slate-200 mt-1">
                    Kode: {selectedPromoForDetail.tag}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleCloseDetail}
                className="p-1.5 hover:bg-slate-100 text-slate-dark/60 hover:text-slate-dark rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* KPI Cards Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f9f9f9] border border-[#E4BEB4]/30 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[12px] font-semibold text-slate-dark/60 uppercase tracking-wider">
                    Total Penggunaan
                  </span>
                  <span className="text-[20px] font-serif font-bold text-[#316669]">
                    {selectedPromoForDetail.usageCount} Kali
                  </span>
                </div>
                <div className="bg-[#f9f9f9] border border-[#E4BEB4]/30 rounded-xl p-4 flex flex-col gap-1">
                  <span className="text-[12px] font-semibold text-slate-dark/60 uppercase tracking-wider">
                    Tipe & Nilai Diskon
                  </span>
                  <span className="text-[20px] font-serif font-bold text-deep-orange">
                    {selectedPromoForDetail.tipeDiskon === 'NOMINAL'
                      ? formatRupiah(selectedPromoForDetail.nilaiDiskon)
                      : `${selectedPromoForDetail.nilaiDiskon}%`}
                  </span>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[14px] font-bold text-slate-dark uppercase tracking-wider">
                  Daftar Transaksi Pelanggan
                </h3>
                <div className="border border-[#E4BEB4]/30 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9f9f9] border-b border-[#E4BEB4]/30 text-[11px] font-bold uppercase tracking-wider text-slate-dark/60">
                        <th className="px-4 py-3">Kode Order</th>
                        <th className="px-4 py-3">Pelanggan</th>
                        <th className="px-4 py-3 text-center">Meja</th>
                        <th className="px-4 py-3 text-right">Potongan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4BEB4]/20 text-[13px] text-slate-dark">
                      {isLoadingHistory ? (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-slate-dark/60">
                            Memuat data transaksi...
                          </td>
                        </tr>
                      ) : !historyData || historyData.content.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-slate-dark/60">
                            Belum ada transaksi terekam untuk promo ini.
                          </td>
                        </tr>
                      ) : (
                        historyData.content.map((item: PromoHistoryResponse) => (
                          <tr key={item.pesananId} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-mono font-medium text-teal-muted whitespace-nowrap">
                              {item.kodePesanan}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-semibold">{item.clientName}</span>
                                <span className="text-[10px] text-slate-dark/40">
                                  {new Date(item.tanggalPesanan).toLocaleString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center font-medium">
                              {item.nomorMeja ? `Meja ${item.nomorMeja}` : '-'}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-deep-orange whitespace-nowrap">
                              -{formatRupiah(item.totalPotongan)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* History Pagination */}
                {historyData && historyData.totalPages > 1 && (
                  <div className="flex justify-between items-center mt-2 px-1">
                    <span className="text-[12px] text-slate-dark/60">
                      Hal. {historyData.page + 1} dari {historyData.totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setHistoryPage((prev) => Math.max(0, prev - 1))}
                        disabled={historyPage === 0}
                        className="h-8 px-3 text-[12px] rounded-lg"
                      >
                        Prev
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setHistoryPage((prev) => Math.min(historyData.totalPages - 1, prev + 1))
                        }
                        disabled={historyPage >= historyData.totalPages - 1}
                        className="h-8 px-3 text-[12px] rounded-lg"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RiwayatPromoPage;
