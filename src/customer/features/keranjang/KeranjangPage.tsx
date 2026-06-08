import { ChevronLeft, Edit3, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKalkulasiPoin, usePoinBalance } from '../poin/hooks/usePoin';
import KeranjangItem from './components/KeranjangItem';
import PoinToggle from './components/PoinToggle';
import RingkasanBiaya from './components/RingkasanBiaya';
import { useKeranjang } from './hooks/useKeranjang';
import { useKeranjangStore } from './store/keranjangStore';
import { useScanMeja } from '../onboarding/hooks/useScanMeja';

const KeranjangPage = () => {
  const navigate = useNavigate();
  const { data: keranjang, isLoading } = useKeranjang();
  const { catatanPesanan, setCatatanPesanan, gunakanPoin } = useKeranjangStore();

  // Ambil data meja dari localStorage + API
  const rawMejaId = localStorage.getItem('nomorMeja') ?? '';
  const { data: scanData } = useScanMeja(rawMejaId);
  const nomorMejaDisplay = scanData?.nomorMeja ?? (rawMejaId ? '...' : '-');

  // Data diskon dari API jika toggle poin menyala
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-teal-muted border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isEmpty = !keranjang || keranjang.items.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-off-white relative">
      {/* Header — sesuai Figma Frame 08: bg #f9f9f9, border bawah #e4beb4 */}
      <header className="sticky top-0 z-50 h-[64px] bg-[#f9f9f9] border-b border-[#e4beb4] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] px-[20px] flex items-center justify-between">
        {/* Kiri: Kembali */}
        <button
          onClick={() => navigate('/customer/katalog')}
          className="flex items-center gap-[8px] active:opacity-70 transition-opacity"
          aria-label="Kembali"
        >
          <ChevronLeft size={16} className="text-[#5b4039]" />
          <span className="font-sans font-normal text-[16px] text-[#5b4039] leading-[24px]">Kembali</span>
        </button>
        {/* Tengah: Judul */}
        <h1 className="absolute left-1/2 -translate-x-1/2 font-sans font-bold text-[20px] text-[#1a1c1c] leading-[28px] whitespace-nowrap">
          Keranjang
        </h1>
        {/* Kanan: spacer (simetris dengan tombol kembali) */}
        <div className="w-[82px]" />
      </header>

      <main className="flex-1 px-4 pb-[100px]">
        {/* Table Information Chip — sesuai Figma Frame 08 */}
        <div className="flex justify-center mt-2 mb-6">
          <div className="bg-teal-muted/10 border border-teal-muted/20 px-4 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-[11px]">📍</span>
            <span className="font-sans font-semibold text-[12px] text-teal-muted uppercase tracking-wide">
              Pemesanan untuk Meja {nomorMejaDisplay}
            </span>
          </div>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-slate-400" />
            </div>
            <h2 className="font-serif font-bold text-[22px] text-slate-dark mb-2">
              Keranjang masih kosong
            </h2>
            <p className="font-sans text-[14px] text-slate-dark/60 mb-8 max-w-[250px]">
              Yuk, lihat menu-menu menarik kami dan temukan favoritmu!
            </p>
            <button
              onClick={() => navigate('/customer/katalog')}
              className="bg-deep-orange text-white font-semibold text-[15px] h-[52px] rounded-xl px-8 active:scale-95 transition-transform"
            >
              Lihat Menu
            </button>
          </div>
        ) : (
          <>
            {/* Item List */}
            <div className="flex flex-col">
              {keranjang.items.map((item) => (
                <KeranjangItem key={item.detailKeranjangId} item={item} />
              ))}
            </div>

            {/* Catatan Pesanan */}
            <div className="mt-6">
              <label
                htmlFor="catatan"
                className="flex items-center gap-2 font-sans font-bold text-[12px] text-slate-dark uppercase tracking-wide mb-3"
              >
                <Edit3 size={16} /> Catatan Tambahan (Opsional)
              </label>
              <textarea
                id="catatan"
                value={catatanPesanan}
                onChange={(e) => setCatatanPesanan(e.target.value)}
                placeholder="Misal: Kurangi es, banyakin sambal..."
                className="w-full min-h-[100px] bg-white border border-slate-200 rounded-xl p-4 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted placeholder:text-slate-dark/40 resize-none shadow-sm"
              />
            </div>

            {/* Poin Toggle */}
            <PoinToggle subtotal={keranjang.totalHarga} />

            {/* Ringkasan Biaya */}
            <RingkasanBiaya subtotal={keranjang.totalHarga} diskonPoin={diskonPoin} />
          </>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      {!isEmpty && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white border-t border-slate-200 p-4 pb-8 z-40">
          <button
            onClick={() => navigate('/customer/konfirmasi')}
            className="w-full bg-deep-orange text-white font-semibold text-[15px] h-[52px] rounded-xl active:scale-[0.98] transition-transform shadow-[0_4px_14px_rgba(255,87,34,0.3)]"
          >
            Lanjut ke Konfirmasi &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default KeranjangPage;
