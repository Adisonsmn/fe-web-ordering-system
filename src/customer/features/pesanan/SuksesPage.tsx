import { formatRupiah } from '@shared/utils/currency';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusTimeline from './components/StatusTimeline';
import { usePesananDetail } from './hooks/useBuatPesanan';

const SuksesPage = () => {
  const { pesananId } = useParams<{ pesananId: string }>();
  const navigate = useNavigate();
  const { data: pesanan, isLoading, isError, error } = usePesananDetail(pesananId || '');

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
      {/* Dark Hero Section */}
      <div className="bg-slate-dark pt-[60px] pb-[40px] px-4 rounded-b-[40px] flex flex-col items-center relative overflow-hidden shrink-0">
        {/* Decorative blur elements can go here if needed */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-teal-muted/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[100px] h-[100px] bg-deep-orange/20 blur-[40px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="w-[80px] h-[80px] bg-deep-orange rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,87,34,0.4)] mb-4 z-10 relative">
          <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
        </div>

        <h1 className="font-serif font-bold text-[24px] text-white z-10 relative mb-1">
          Pesanan Berhasil!
        </h1>
        <p className="font-sans text-[15px] text-white/80 z-10 relative text-center">
          Duduk santai, pesananmu sedang kami siapkan
        </p>
      </div>

      <main className="flex-1 px-4 -mt-6 relative z-20 pb-8">
        {/* Order Info Card (Glassmorphism-like) */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-white mb-6">
          <p className="font-sans text-[12px] text-slate-dark/60 text-center uppercase tracking-widest mb-1">
            KODE PESANAN
          </p>
          <h2 className="font-mono font-bold text-[24px] text-slate-dark text-center mb-4">
            #{pesanan.kodePesanan}
          </h2>

          <div className="border-t border-dashed border-slate-200 my-4" />

          <div className="flex justify-between items-center px-2">
            <div>
              <p className="font-sans text-[11px] text-slate-dark/60 uppercase">MEJA</p>
              <p className="font-sans font-bold text-[16px] text-slate-dark">
                {pesanan.nomorMeja || '-'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-[11px] text-slate-dark/60 uppercase">TOTAL</p>
              <p className="font-sans font-bold text-[18px] text-deep-orange">
                {formatRupiah(pesanan.jumlahDibayar || pesanan.totalHarga)}
              </p>
            </div>
          </div>
        </div>

        {/* Status Timeline Card */}
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-serif font-bold text-[16px] text-slate-dark">Status Pesanan</h3>
            <span className="font-sans font-semibold text-[11px] text-teal-muted bg-teal-muted/10 px-2 py-1 rounded-full uppercase">
              {pesanan.status}
            </span>
          </div>

          <StatusTimeline status={pesanan.status} />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <button
            onClick={() => navigate(`/customer/pesanan/tracking/${pesananId}`)} // Future tracking page
            className="w-full bg-deep-orange text-white font-semibold text-[15px] h-[52px] rounded-xl active:scale-[0.98] transition-transform shadow-[0_4px_14px_rgba(255,87,34,0.2)]"
          >
            Pantau Status Pesanan
          </button>
          <button
            onClick={() => navigate('/customer/katalog')}
            className="w-full bg-transparent border-2 border-slate-dark text-slate-dark font-semibold text-[15px] h-[52px] rounded-xl active:scale-[0.98] transition-transform"
          >
            Kembali ke Menu
          </button>
        </div>

        {/* Ringkasan Pesanan */}
        <div>
          <h3 className="font-serif font-bold text-[16px] text-slate-dark mb-4 px-1">
            Ringkasan Pesanan
          </h3>
          <div className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col gap-4">
            {pesanan.detailPesanan.map((item) => (
              <div key={item.detailPesananId} className="flex gap-3 items-center">
                <div className="w-[48px] h-[48px] rounded-[6px] bg-slate-200 shrink-0 overflow-hidden">
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
                  <h4 className="font-sans font-bold text-[14px] text-slate-dark truncate">
                    {item.menuName}
                  </h4>
                  <p className="font-sans text-[12px] text-slate-dark/60 mt-0.5">
                    {item.quantity}x {item.catatan ? `• "${item.catatan}"` : ''}
                  </p>
                </div>
                <span className="font-sans font-semibold text-[14px] text-slate-dark">
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
