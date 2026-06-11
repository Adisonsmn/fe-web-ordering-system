import BottomNav from '@shared/components/layout/BottomNav';
import { formatJam } from '@shared/utils/date';
import { CheckCircle2, ChevronLeft, HelpCircle, Receipt, Search, Star } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EstimasiBanner from './components/EstimasiBanner';
import OrderItemList from './components/OrderItemList';
import TrackingStatusCard from './components/TrackingStatusCard';
import TrackingTimeline from './components/TrackingTimeline';
import { usePesananStatus } from './hooks/usePesananStatus';

const TrackingPage = () => {
  const { pesananId } = useParams<{ pesananId: string }>();
  const navigate = useNavigate();
  const { data: pesanan, isLoading, isError } = usePesananStatus(pesananId || '');

  useEffect(() => {
    if (pesananId) {
      localStorage.setItem('activePesananId', pesananId);
    }
  }, [pesananId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-off-white">
        <div className="w-8 h-8 border-4 border-deep-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !pesanan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-off-white px-4 text-center">
        <h2 className="font-serif font-bold text-slate-dark text-[20px] mb-2">
          Pesanan Tidak Ditemukan
        </h2>
        <button
          type="button"
          onClick={() => navigate('/customer/katalog')}
          className="bg-deep-orange text-white px-6 py-3 rounded-xl font-semibold mt-4"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  const isCompleted = pesanan.status === 'SERVED' || pesanan.status === 'PAID';

  return (
    <div className="flex flex-col min-h-screen bg-off-white max-w-[390px] mx-auto w-full relative pb-[120px]">
      {/* Top App Bar — sesuai Figma Frame 11: bg #f9f9f9, border #e4beb4 */}
      <header className="h-[64px] bg-[#f9f9f9] border-b border-[#e4beb4] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between px-[20px] sticky top-0 z-50">
        <button
          type="button"
          onClick={() => navigate('/customer/katalog')}
          className="w-[16px] h-[16px] flex items-center justify-center text-[#b02f00] active:opacity-70"
        >
          <ChevronLeft className="w-[16px] h-[16px]" />
        </button>
        <h1 className="font-serif font-bold text-[20px] text-[#b02f00] leading-[28px]">
          Aroma Senja
        </h1>
        <button
          type="button"
          aria-label="Cari"
          className="w-[18px] h-[18px] flex items-center justify-center text-[#b02f00] active:opacity-70"
        >
          <Search className="w-[18px] h-[18px]" />
        </button>
      </header>

      {isCompleted ? (
        // ================= Selesai (SERVED) Layout ================= //
        <div className="flex flex-col w-full">
          {/* Dark Hero Header */}
          <div className="bg-gradient-to-b from-[#303841] to-[#3f4851] h-[220px] w-full flex flex-col items-center justify-center px-5 relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-teal-muted/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="w-20 h-20 bg-deep-orange/20 rounded-full flex items-center justify-center mb-4 relative z-10 border border-deep-orange/30">
              <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>

            <h2 className="font-serif font-bold text-[24px] text-white mb-2 z-10 text-center">
              Selamat Menikmati!
            </h2>
            <p className="font-sans text-[16px] text-white/90 z-10 text-center">
              Pesanan #{pesanan.kodePesanan} telah selesai
            </p>
          </div>

          {/* Loyalty Card Teaser (Overlaying Hero) */}
          <div className="px-5 -mt-8 relative z-20 w-full mb-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-lg bg-teal-muted/20 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-teal-muted" fill="currentColor" />
                </div>
                <div>
                  <p className="font-sans text-[12px] text-slate-dark/60 font-semibold tracking-wide mb-1">
                    POIN LOYALITAS
                  </p>
                  <p className="font-sans font-bold text-slate-dark text-[15px]">
                    +{pesanan.totalHarga / 1000} poin dikreditkan 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-5 flex flex-col gap-4 w-full mb-8">
            <button
              type="button"
              onClick={() => navigate(`/customer/struk/${pesananId}`)}
              className="w-full bg-deep-orange text-white h-[52px] rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md shadow-deep-orange/30"
            >
              <Receipt className="w-5 h-5" />
              Lihat Struk Digital
            </button>
            <button
              type="button"
              onClick={() => navigate(`/customer/ulasan/${pesananId}`)}
              className="w-full border-2 border-slate-dark text-slate-dark h-[52px] rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Star className="w-5 h-5" />
              Beri Ulasan
            </button>

            <div className="mt-4 flex flex-col items-center">
              <p className="font-sans text-slate-dark/60 text-[15px] mb-1">Masih lapar?</p>
              <button
                type="button"
                onClick={() => navigate('/customer/katalog')}
                className="font-sans font-bold text-deep-orange text-[16px] underline decoration-2 underline-offset-4 active:opacity-70"
              >
                Pesan lagi?
              </button>
            </div>
          </div>

          {/* Mungkin Anda Suka Placeholder */}
          <div className="px-5 pb-8 w-full">
            <h3 className="font-sans font-bold text-slate-dark/80 text-[14px] tracking-wide mb-4 uppercase">
              Mungkin Anda Suka
            </h3>
            <OrderItemList
              items={pesanan.detailPesanan}
              totalHarga={pesanan.totalHarga}
              isCompleted={true}
            />
          </div>
        </div>
      ) : (
        // ================= Tracking (NEW/PREPARING/READY) Layout ================= //
        <div className="flex flex-col gap-6 px-5 pt-6 w-full">
          {/* Header Info (Menunggu/Diproses) */}
          <div className="flex justify-between items-end w-full">
            {pesanan.status === 'NEW' || pesanan.status === 'CONFIRMED' ? (
              <div className="flex flex-col gap-1 w-full">
                <h2 className="font-serif font-bold text-slate-dark text-[20px]">Pesanan Anda</h2>
                <p className="font-sans font-bold text-[#5b4039] text-[12px] tracking-wider uppercase">
                  ID: #{pesanan.kodePesanan} · Meja {pesanan.nomorMeja || '-'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <p className="font-sans font-bold text-slate-dark/60 text-[11px] tracking-wider uppercase">
                    Nomor Pesanan
                  </p>
                  <p className="font-sans font-bold text-slate-dark text-[18px]">
                    #{pesanan.kodePesanan}
                  </p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <p className="font-sans font-bold text-slate-dark/60 text-[11px] tracking-wider uppercase">
                    Waktu Pemesanan
                  </p>
                  <p className="font-sans font-medium text-slate-dark text-[15px]">
                    {formatJam(pesanan.tanggalPesanan)} WIB
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Floating Notification untuk status READY */}
          {pesanan.status === 'READY' && (
            <div className="bg-deep-orange text-white px-4 py-3 rounded-xl shadow-md font-sans font-bold text-[13px] tracking-wide w-full flex items-center gap-3">
              <span>🔔</span> Pesanan dalam perjalanan ke Meja {pesanan.nomorMeja || '-'}
            </div>
          )}

          {/* Main Status Card */}
          <TrackingStatusCard status={pesanan.status} />

          {/* Estimasi Banner (Hanya PREPARING) */}
          {pesanan.status === 'PREPARING' && (
            <EstimasiBanner estimasiMenit={pesanan.estimasiMenit} />
          )}

          {/* Vertical Progress Tracker */}
          <div className="w-full flex flex-col gap-2 bg-white p-5 rounded-xl shadow-sm mt-2">
            <h3 className="font-serif font-bold text-slate-dark text-[18px] mb-4">Status Proses</h3>
            <TrackingTimeline
              status={pesanan.status}
              updatedAt={pesanan.tanggalPesanan} // Using tanggalPesanan as proxy for now since backend WS might not provide specific step times
              estimasiMenit={pesanan.estimasiMenit}
            />
          </div>

          {/* Order Details Teaser or Full List */}
          {pesanan.status === 'READY' ? (
            // Mini Teaser (Frame 13)
            <div className="bg-[#f9f9f9] border border-[#e4beb4] rounded-lg p-4 flex justify-between items-center w-full mb-6">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-slate-200 rounded shrink-0 overflow-hidden">
                  {pesanan.detailPesanan[0]?.imageUrl && (
                    <img
                      src={pesanan.detailPesanan[0].imageUrl}
                      alt="Menu"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-sans font-bold text-slate-dark text-[15px]">
                    #{pesanan.kodePesanan}
                  </p>
                  <p className="font-sans text-slate-dark/70 text-[14px]">
                    {pesanan.detailPesanan.length} Items • Rp{' '}
                    {pesanan.totalHarga.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                }
                className="font-sans font-bold text-deep-orange text-[15px]"
              >
                Detail
              </button>
            </div>
          ) : (
            // Full List (Frame 11 & 12)
            <div className="w-full bg-white p-5 rounded-xl shadow-sm mb-6 flex flex-col gap-4">
              <h3 className="font-serif font-bold text-slate-dark text-[18px]">Rincian Pesanan</h3>
              <OrderItemList
                items={pesanan.detailPesanan}
                totalHarga={pesanan.totalHarga}
                showPriceBreakdown={true}
              />
            </div>
          )}

          {/* Help Action Button */}
          <div className="w-full mb-8">
            {pesanan.status === 'PREPARING' || pesanan.status === 'READY' ? (
              <button
                type="button"
                className="w-full border border-slate-dark text-slate-dark h-12 rounded-xl flex items-center justify-center gap-2 font-sans font-bold text-[15px] active:bg-slate-100 transition-colors"
              >
                <HelpCircle className="w-5 h-5" /> Butuh Bantuan?
              </button>
            ) : (
              <div className="bg-teal-muted/10 border border-teal-muted/20 p-4 rounded-xl flex items-center gap-4 w-full">
                <HelpCircle className="w-6 h-6 text-teal-muted shrink-0" />
                <div className="flex flex-col">
                  <p className="font-sans font-bold text-[#003032] text-[15px] mb-0.5">
                    Butuh Bantuan?
                  </p>
                  <p className="font-sans text-[#144e51] text-[13px] leading-tight">
                    Hubungi pramusaji untuk bantuan pesanan Anda.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default TrackingPage;
