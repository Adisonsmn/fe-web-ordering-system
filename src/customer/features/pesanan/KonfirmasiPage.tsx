import { formatRupiah } from '@shared/utils/currency';
import { ArrowLeft, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeranjang } from '../keranjang/hooks/useKeranjang';
import { useKeranjangStore } from '../keranjang/store/keranjangStore';
import { useKalkulasiPoin, usePoinBalance } from '../poin/hooks/usePoin';
import { useBuatPesanan } from './hooks/useBuatPesanan';

const KonfirmasiPage = () => {
  const navigate = useNavigate();
  const { data: keranjang, isLoading: isLoadingKeranjang } = useKeranjang();
  const { mutate: buatPesanan, isPending: isSubmitting } = useBuatPesanan();

  const { catatanPesanan, gunakanPoin } = useKeranjangStore();
  const [isChecked, setIsChecked] = useState(false);

  // Data poin
  const { data: balanceData } = usePoinBalance();
  const { mutate: kalkulasiPoin } = useKalkulasiPoin();
  const [diskonPoin, setDiskonPoin] = useState(0);

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

  // Fallback mejaId for now as instructed (Opsi C)
  // In a real app, this should come from a store populated by QR scan
  const DUMMY_MEJA_ID = '00000000-0000-0000-0000-000000000000'; // Akan error FK jika DUMMY tidak ada di DB, tapi cukup untuk UI

  const handleBuatPesanan = () => {
    if (!keranjang) return;

    buatPesanan(
      {
        mejaId: DUMMY_MEJA_ID,
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
    <div className="flex flex-col min-h-screen bg-off-white relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-off-white px-4 py-4 flex items-center justify-between border-b border-slate-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-serif font-bold text-[18px] text-[#b02f00]"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
          Konfirmasi Pesanan
        </button>
        <button aria-label="Cari" className="text-slate-dark p-2">
          <Search size={24} />
        </button>
      </header>

      <main className="flex-1 px-4 py-6 pb-[140px]">
        {/* Table Info Card */}
        <div className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#fef2f2] rounded-full flex items-center justify-center text-[#b02f00]">
              <MapPin size={20} />
            </div>
            <div>
              <p className="font-sans font-bold text-[14px] text-slate-dark">
                Meja 7 / Area Indoor
              </p>
              <p className="font-sans text-[12px] text-slate-dark/60 mt-0.5">
                app demo qr blm dari meja
              </p>
            </div>
          </div>
          <button className="font-sans font-bold text-[12px] text-teal-muted uppercase tracking-wider">
            Ubah
          </button>
        </div>

        {/* Detail Pesanan List */}
        <section className="mb-8">
          <h2 className="font-serif font-bold text-[18px] text-slate-dark mb-4">Detail Pesanan</h2>
          <div className="flex flex-col gap-4">
            {keranjang.items.map((item) => (
              <div key={item.detailKeranjangId} className="flex gap-4 items-center">
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
                  <h3 className="font-sans font-bold text-[15px] text-slate-dark truncate">
                    {item.menuName}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-sans text-[13px] text-slate-dark/60">{item.quantity}x</p>
                    <p className="font-sans font-bold text-[15px] text-[#b02f00]">
                      {formatRupiah(item.subtotal)}
                    </p>
                  </div>
                  {item.catatan && (
                    <p className="font-sans italic text-[12px] text-[#5d656f] mt-1 line-clamp-1">
                      "{item.catatan}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Loyalty Info Badge */}
        {gunakanPoin && balanceData && (
          <div className="bg-teal-muted/10 border border-teal-muted/30 rounded-lg p-3 flex items-center justify-center mb-8">
            <p className="font-sans font-medium text-[13px] text-teal-muted text-center">
              Pesanan ini menggunakan {balanceData.totalPoint} poin (-{formatRupiah(diskonPoin)})
            </p>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-[#eeeeee] rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-sans text-[14px] text-slate-dark">Subtotal</span>
            <span className="font-sans font-medium text-[14px] text-slate-dark">
              {formatRupiah(keranjang.totalHarga)}
            </span>
          </div>
          {diskonPoin > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="font-sans text-[14px] text-teal-muted">Loyalty Points</span>
              <span className="font-sans font-medium text-[14px] text-teal-muted">
                -{formatRupiah(diskonPoin)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center mb-3">
            <span className="font-sans text-[14px] text-slate-dark">Pajak & Layanan (10%)</span>
            <span className="font-sans font-medium text-[14px] text-slate-dark">
              {formatRupiah(pajak)}
            </span>
          </div>
          <div className="border-t border-slate-300 pt-3 flex justify-between items-center">
            <span className="font-sans font-bold text-[16px] text-slate-dark">Total Bayar</span>
            <span className="font-sans font-bold text-[18px] text-[#b02f00]">
              {formatRupiah(totalAkhir > 0 ? totalAkhir : 0)}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="font-sans italic text-[12px] text-center text-slate-dark/60 max-w-[280px] mx-auto mt-6">
          *Pesanan tidak dapat dibatalkan setelah diproses oleh tim dapur kami.
        </p>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white border-t border-slate-200 p-4 pb-8 z-40">
        <label className="flex items-start gap-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-deep-orange focus:ring-deep-orange"
          />
          <span className="font-sans text-[13px] text-slate-dark leading-tight">
            Saya sudah memeriksa pesanan dan siap memesan
          </span>
        </label>

        <button
          disabled={!isChecked || isSubmitting}
          onClick={handleBuatPesanan}
          className="w-full bg-deep-orange text-white font-semibold text-[15px] h-[52px] rounded-xl active:scale-[0.98] transition-all disabled:bg-slate-dark/30 disabled:cursor-not-allowed disabled:active:scale-100 shadow-[0_4px_14px_rgba(255,87,34,0.3)] disabled:shadow-none"
        >
          {isSubmitting ? 'Memproses...' : 'Buat Pesanan Sekarang >'}
        </button>
      </div>
    </div>
  );
};

export default KonfirmasiPage;
