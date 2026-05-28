import { ArrowLeft, Edit3, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKalkulasiPoin, usePoinBalance } from '../poin/hooks/usePoin';
import KeranjangItem from './components/KeranjangItem';
import PoinToggle from './components/PoinToggle';
import RingkasanBiaya from './components/RingkasanBiaya';
import { useKeranjang } from './hooks/useKeranjang';
import { useKeranjangStore } from './store/keranjangStore';

const KeranjangPage = () => {
  const navigate = useNavigate();
  const { data: keranjang, isLoading } = useKeranjang();
  const { catatanPesanan, setCatatanPesanan, gunakanPoin } = useKeranjangStore();

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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-off-white/80 backdrop-blur-md px-4 py-4 flex items-center">
        <button
          onClick={() => navigate('/customer/katalog')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} className="text-slate-dark" />
        </button>
        <h1 className="font-serif font-bold text-[20px] text-slate-dark flex-1 text-center pr-10">
          Keranjang
        </h1>
      </header>

      <main className="flex-1 px-4 pb-[100px]">
        {/* Table Chip */}
        <div className="flex justify-center mt-2 mb-6">
          <div className="bg-teal-muted/10 border border-teal-muted/20 px-4 py-1.5 rounded-full flex items-center gap-2">
            <span className="font-sans font-semibold text-[12px] text-teal-muted uppercase tracking-wide">
              🍽 APP DEMO QR BLM DARI MEJA
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
