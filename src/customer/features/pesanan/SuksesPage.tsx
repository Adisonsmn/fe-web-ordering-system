import { formatRupiah } from '@shared/utils/currency';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusTimeline from './components/StatusTimeline';
import { usePesananStatus } from './hooks/usePesananStatus';

const SuksesPage = () => {
  const { pesananId } = useParams<{ pesananId: string }>();
  const navigate = useNavigate();
  const { data: pesanan, isLoading, isError, error } = usePesananStatus(pesananId || '');

  useEffect(() => {
    if (pesanan && pesanan.status !== 'NEW' && pesanan.status !== 'CONFIRMED') {
      navigate(`/customer/pesanan/tracking/${pesananId}`, { replace: true });
    }
  }, [pesanan?.status, navigate, pesananId]);

  useEffect(() => {
    if (pesananId) {
      localStorage.setItem('activePesananId', pesananId);
    }
  }, [pesananId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-dark">
        <div className="w-8 h-8 border-4 border-deep-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !pesanan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-off-white px-4 text-center">
        <h2 className="font-serif font-bold text-[20px] text-slate-dark mb-2">
          Gagal Memuat Pesanan
        </h2>
        <p className="font-sans text-[14px] text-slate-dark/60 mb-6">
          {(error as any)?.response?.data?.message ||
            'Pesanan tidak ditemukan atau Anda tidak memiliki akses.'}
        </p>
        <button
          onClick={() => navigate('/customer/katalog')}
          className="bg-deep-orange text-white px-6 py-3 rounded-xl font-semibold"
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-off-white relative">
      {/* Header — sesuai Figma Frame 10 */}
      <header className="absolute top-0 left-0 right-0 z-50 h-[64px] px-[20px] flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-[16px] pointer-events-auto">
          <button
            onClick={() => navigate('/customer/katalog')}
            className="flex items-center justify-center text-white active:opacity-70 transition-opacity"
            aria-label="Kembali ke Katalog"
          >
            <ChevronLeft size={24} className="stroke-[2.5]" />
          </button>
          <h1 className="font-serif font-semibold text-[20px] text-white leading-[28px] whitespace-nowrap">
            Aroma Senja
          </h1>
        </div>
      </header>

      {/* Dark Hero Section */}
      <div className="bg-slate-dark pt-[76px] pb-[40px] px-[20px] rounded-bl-[40px] rounded-br-[40px] flex flex-col items-center relative overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute bg-[#b02f00] blur-[32px] right-[-39px] rounded-full w-[256px] h-[256px] -top-[32px]" />
          <div className="absolute bg-[#659a9d] blur-[32px] bottom-[-32px] left-[-39px] rounded-full w-[192px] h-[192px]" />
        </div>

        <div className="w-[80px] h-[80px] bg-deep-orange rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,87,34,0.4)] mb-4 z-10 relative">
          <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
        </div>

        <h1 className="font-sans font-bold text-[20px] text-white z-10 relative mb-1 leading-[28px] text-center">
          Pesanan Berhasil!
        </h1>
        <p className="font-sans text-[16px] text-white/80 z-10 relative text-center max-w-[280px] leading-[24px]">
          Pesananmu sedang menunggu konfirmasi dari kasir kami.
        </p>
      </div>

      <main className="flex-1 px-4 -mt-6 relative z-20 pb-8">
        {/* Order Info Card */}
        <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.95)] rounded-[12px] p-[24px] shadow-[0px_4px_20px_0px_rgba(48,56,65,0.08)] mb-6">
          <div className="flex flex-col items-center gap-[4px] mb-4">
            <p className="font-sans font-normal text-[16px] text-[#5b4039] text-center uppercase tracking-wider">
              KODE PESANAN
            </p>
            <h2 className="font-mono font-bold text-[24px] text-[#303841] text-center leading-[32px]">
              #{pesanan.kodePesanan}
            </h2>
          </div>

          <div className="bg-[rgba(228,190,180,0.3)] h-px w-full my-4" />

          <div className="flex justify-between items-center px-2">
            <div className="flex gap-[8px] items-center">
              <div className="h-[16px] w-[20px] shrink-0 text-[#303841] flex items-center justify-center">
                <span className="text-[16px]">📍</span>
              </div>
              <p className="font-sans font-bold text-[16px] text-[#1a1c1c]">
                Meja {pesanan.nomorMeja || '-'}
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <p className="font-sans text-[16px] text-[#5b4039] uppercase tracking-wider">
                TOTAL PEMBAYARAN
              </p>
              <p className="font-sans font-normal text-[16px] text-[#b02f00]">
                {formatRupiah(pesanan.jumlahDibayar || pesanan.totalHarga)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Timeline Card */}
        <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.95)] rounded-[12px] p-[24px] shadow-[0px_4px_20px_0px_rgba(48,56,65,0.08)] mb-6 flex flex-col gap-[24px]">
          <div className="flex flex-col items-center">
            <h3 className="font-sans font-normal text-[16px] text-[#5b4039] tracking-wider">
              STATUS PESANAN
            </h3>
          </div>

          <StatusTimeline status={pesanan.status} />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 mb-8 pt-[16px]">
          <button
            onClick={() => navigate(`/customer/pesanan/tracking/${pesananId}`)}
            className="w-full bg-[#ff5722] text-white font-sans font-bold text-[16px] py-[16px] rounded-[12px] active:scale-[0.98] transition-transform drop-shadow-[0px_4px_10px_rgba(255,87,34,0.3)]"
          >
            Pantau Status Pesanan
          </button>
          <button
            onClick={() => navigate('/customer/katalog')}
            className="w-full bg-transparent border-2 border-[#303841] border-solid text-[#303841] font-sans font-bold text-[16px] py-[16px] rounded-[12px] active:scale-[0.98] transition-transform"
          >
            Kembali ke Menu
          </button>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col items-start px-1">
            <h3 className="font-sans font-normal text-[16px] text-[#5b4039] uppercase tracking-wider">
              RINGKASAN PESANAN
            </h3>
          </div>
          <div className="flex flex-col gap-[16px]">
            {pesanan.detailPesanan.map((item) => (
              <div
                key={item.detailPesananId}
                className="bg-white flex items-center justify-between p-[16px] rounded-[8px] w-full shadow-[0px_2px_8px_rgba(48,56,65,0.04)]"
              >
                <div className="flex gap-[16px] items-center">
                  <div className="w-[48px] h-[48px] rounded-[8px] bg-slate-200 shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.menuName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#f3f4f6]" />
                    )}
                  </div>
                  <div className="flex flex-col items-start min-w-0">
                    <h4 className="font-sans font-bold text-[16px] text-[#1a1c1c] truncate">
                      {item.menuName}
                    </h4>
                    <p className="font-sans font-normal text-[12px] text-[#5b4039] mt-0.5">
                      {item.quantity}x
                      {item.catatan && (
                        <span className="text-[#b02f00] ml-1">• "{item.catatan}"</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className="font-sans font-normal text-[16px] text-[#1a1c1c]">
                  {formatRupiah(item.subTotal)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuksesPage;
