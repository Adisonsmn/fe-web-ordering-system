import { formatRupiah } from '@shared/utils/currency';
import { ChevronLeft, ChevronRight, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@shared/stores/authStore';
import { useKeranjang } from '../keranjang/hooks/useKeranjang';
import { useKeranjangStore } from '../keranjang/store/keranjangStore';
import { useEstimasiPoin, useKalkulasiPoin, usePoinBalance } from '../poin/hooks/usePoin';
import { useScanMeja } from '../onboarding/hooks/useScanMeja';
import { useBuatPesanan } from './hooks/useBuatPesanan';

const KonfirmasiPage = () => {
  const navigate = useNavigate();
  const { data: keranjang, isLoading: isLoadingKeranjang } = useKeranjang();
  const { mutate: buatPesanan, isPending: isSubmitting } = useBuatPesanan();

  const isGuest = useAuthStore((state) => state.isGuest);
  const { catatanPesanan, gunakanPoin } = useKeranjangStore();
  const [isChecked, setIsChecked] = useState(false);

  // Data poin
  const { data: balanceData } = usePoinBalance();
  const { mutate: kalkulasiPoin } = useKalkulasiPoin();
  const [diskonPoin, setDiskonPoin] = useState(0);

  // Estimasi Poin Earning
  const subtotal = keranjang?.totalHarga ?? 0;
  const { data: estimasiData } = useEstimasiPoin(subtotal);
  const estimatedPoints = estimasiData?.estimatedPoints ?? 0;

  useEffect(() => {
    if (keranjang && keranjang.totalHarga > 0 && gunakanPoin && balanceData) {
      kalkulasiPoin(
        {
          pesananSubtotal: keranjang.totalHarga,
          poinDigunakan: balanceData.totalPoint,
        },
        {
          onSuccess: (data) => setDiskonPoin(data.diskonRupiah),
          onError: () => setDiskonPoin(0),
        },
      );
    } else {
      setDiskonPoin(0);
    }
  }, [keranjang, gunakanPoin, balanceData, kalkulasiPoin]);

  // Ambil mejaId dari localStorage, fallback ke dummy UUID jika kosong
  const rawTableParam = localStorage.getItem('nomorMeja') ?? '';
  const DUMMY_MEJA_ID = '00000000-0000-0000-0000-000000000000';
  const mejaIdToUse = rawTableParam || DUMMY_MEJA_ID;

  // Fetch scan/meja detail jika ada mejaId
  const { data: scanData } = useScanMeja(rawTableParam);
  const nomorMeja = scanData?.nomorMeja ?? (rawTableParam ? '...' : '7');
  const zoneMeja = scanData?.zone ?? 'Area Indoor';

  const handleBuatPesanan = () => {
    if (!keranjang) return;

    buatPesanan(
      {
        mejaId: mejaIdToUse,
        catatanDapur: catatanPesanan,
        gunakanPoin: gunakanPoin,
      },
      {
        onSuccess: (data) => {
          // Pindah ke halaman sukses setelah berhasil
          navigate(`/customer/pesanan-sukses/${data.pesananId}`, { replace: true });
        },
      },
    );
  };

  if (isLoadingKeranjang) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-off-white">
        <div className="w-8 h-8 border-4 border-teal-muted border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!keranjang || keranjang.items.length === 0) {
    // Jika keranjang kosong, kembali ke katalog
    navigate('/customer/katalog', { replace: true });
    return null;
  }

  const pajak = keranjang.totalHarga * 0.1;
  const totalAkhir = keranjang.totalHarga + pajak - diskonPoin;

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9f9] relative">
      {/* Header — sesuai Figma Frame 09: bg #f9f9f9, border bawah #e4beb4 */}
      <header className="sticky top-0 z-50 h-[64px] bg-[#f9f9f9] border-b border-[#e4beb4] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] px-[20px] flex items-center justify-between">
        {/* Kiri: Back button & Judul (Sejajar sesuai Figma) */}
        <div className="flex items-center gap-[16px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center text-[#b02f00] active:opacity-70 transition-opacity"
            aria-label="Kembali"
          >
            <ChevronLeft size={24} className="stroke-[2.5]" />
          </button>
          <h1 className="font-serif font-bold text-[20px] text-[#b02f00] leading-[28px] whitespace-nowrap">
            Konfirmasi Pesanan
          </h1>
        </div>
        {/* Kanan: Search icon */}
        <button aria-label="Cari" className="w-[18px] h-[18px] flex items-center justify-center text-[#b02f00]">
          <Search size={18} />
        </button>
      </header>

      <main className="flex-1 px-4 py-6 pb-[160px]">
        {/* Table Info Card */}
        <div className="bg-white border border-[#e2e2e2] rounded-[12px] p-[17px] shadow-[0_4px_10px_rgba(48,56,65,0.08)] flex items-center justify-between mb-8">
          <div className="flex items-center gap-[16px]">
            <div className="w-[48px] h-[48px] bg-[#dbe3ef] rounded-[8px] flex items-center justify-center text-[#5b4039]">
              <MapPin size={20} />
            </div>
            <div>
              <p className="font-serif font-normal text-[16px] text-[#1a1c1c] leading-[24px]">
                Meja {nomorMeja}
              </p>
              <p className="font-sans font-normal text-[16px] text-[#5b4039] leading-[24px] mt-0.5">
                {zoneMeja}
              </p>
            </div>
          </div>
        </div>

        {/* Detail Pesanan List */}
        <section className="mb-8">
          <div className="pt-[12px] mb-4">
            <h2 className="font-serif font-normal text-[16px] text-[#1a1c1c] leading-[24px]">
              Detail Pesanan
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {keranjang.items.map((item) => (
              <div
                key={item.detailKeranjangId}
                className="bg-white border border-[rgba(0,0,0,0)] rounded-[12px] shadow-[0_4px_10px_rgba(48,56,65,0.08)] flex gap-[16px] items-center p-[17px]"
              >
                <div className="w-[80px] h-[80px] rounded-[8px] bg-slate-200 shrink-0 overflow-hidden">
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
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-sans font-bold text-[16px] text-[#1a1c1c] leading-[24px] truncate pr-2">
                      {item.menuName}
                    </h3>
                    <p className="font-sans font-normal text-[16px] text-[#b02f00] leading-[24px] shrink-0">
                      {formatRupiah(item.subtotal)}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="font-sans font-normal text-[14px] text-[#5b4039] leading-[20px]">
                      {item.quantity}x
                      {item.catatan && (
                        <span className="text-[#b02f00] ml-1">
                          • "{item.catatan}"
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Loyalty Info Badge */}
        {gunakanPoin && balanceData ? (
          <div className="bg-[#e0f2f1] border border-[#9ad0d3] rounded-[12px] p-[17px] flex gap-[16px] items-center mb-8">
            <div className="shrink-0 size-[20px] flex items-center justify-center">
              <span className="text-[14px] leading-none">📍</span>
            </div>
            <div>
              <p className="font-sans font-bold text-[16px] text-[#316669] leading-[24px]">
                Pesanan ini menggunakan {balanceData.totalPoint} poin (-{formatRupiah(diskonPoin)})
              </p>
            </div>
          </div>
        ) : (
          !isGuest && estimatedPoints > 0 && (
            <div className="bg-[#e0f2f1] border border-[#9ad0d3] rounded-[12px] p-[17px] flex gap-[16px] items-center mb-8">
              <div className="shrink-0 size-[20px] flex items-center justify-center">
                <span className="text-[14px] leading-none">📍</span>
              </div>
              <div>
                <p className="font-sans font-bold text-[16px] text-[#316669] leading-[24px]">
                  Beli pesanan ini untuk mendapatkan {estimatedPoints} loyalty point
                </p>
              </div>
            </div>
          )
        )}

        {/* Summary Card */}
        <div className="bg-[#eee] rounded-[12px] p-[16px] flex flex-col gap-[12px] mb-4">
          <div className="flex justify-between items-center h-[24px]">
            <span className="font-sans font-normal text-[16px] text-[#5b4039] leading-[24px]">Subtotal</span>
            <span className="font-sans font-normal text-[16px] text-[#5b4039] leading-[24px]">
              {formatRupiah(keranjang.totalHarga)}
            </span>
          </div>
          {diskonPoin > 0 && (
            <div className="flex justify-between items-center h-[24px]">
              <span className="font-sans font-normal text-[16px] text-[#316669] leading-[24px]">Loyalty Points</span>
              <span className="font-sans font-normal text-[16px] text-[#316669] leading-[24px]">
                -{formatRupiah(diskonPoin)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center h-[24px]">
            <span className="font-sans font-normal text-[16px] text-[#5b4039] leading-[24px]">Pajak & Layanan (10%)</span>
            <span className="font-sans font-normal text-[16px] text-[#5b4039] leading-[24px]">
              {formatRupiah(pajak)}
            </span>
          </div>
          <div className="border-[#e4beb4] border-t h-px my-1" />
          <div className="flex justify-between items-center h-[24px]">
            <span className="font-serif font-normal text-[16px] text-[#1a1c1c] leading-[24px]">Total Bayar</span>
            <span className="font-serif font-normal text-[16px] text-[#b02f00] leading-[24px]">
              {formatRupiah(totalAkhir > 0 ? totalAkhir : 0)}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex flex-col items-center px-[16px] mt-6">
          <p className="font-sans italic font-normal text-[16px] text-center text-[#5b4039] leading-[24px]">
            "Pesanan tidak dapat dibatalkan setelah<br />diproses oleh tim dapur kami."
          </p>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white border-t border-[#e2e2e2] p-[20px] pb-[32px] pt-[21px] z-40">
        <label className="flex items-start gap-[16px] mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 w-[20px] h-[20px] rounded-[4px] border-[#907067] text-deep-orange focus:ring-deep-orange"
          />
          <div className="font-sans font-normal text-[16px] text-[#1a1c1c] leading-[24px]">
            <p>Saya sudah memeriksa pesanan dan siap</p>
            <p>memesan</p>
          </div>
        </label>

        <button
          disabled={!isChecked || isSubmitting}
          onClick={handleBuatPesanan}
          className="w-full bg-[#ff5722] text-white font-sans font-bold text-[16px] py-[16px] rounded-[12px] active:scale-[0.98] transition-all disabled:bg-slate-dark/30 disabled:cursor-not-allowed disabled:active:scale-100 shadow-[0_8px_8px_rgba(255,87,34,0.3)] disabled:shadow-none flex items-center justify-center gap-[8px]"
        >
          <span>{isSubmitting ? 'Memproses...' : 'Buat Pesanan Sekarang'}</span>
          {!isSubmitting && (
            <ChevronRight size={18} className="stroke-[2.5]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default KonfirmasiPage;
