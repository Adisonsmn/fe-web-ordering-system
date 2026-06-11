import { ChevronLeft, MessageSquareHeart, Share2, Utensils } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StrukCard from './components/StrukCard';
import { useStruk } from './hooks/useStruk';

const StrukPage: FC = () => {
  const { pesananId } = useParams<{ pesananId: string }>();
  const navigate = useNavigate();

  const { data: strukData, isLoading, isError, error } = useStruk(pesananId || '');

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-muted border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !strukData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <p className="text-slate-dark text-lg font-medium mb-2">Gagal memuat struk pesanan.</p>
        <p className="text-sm text-red-500 mb-4">
          {(error as any)?.response?.data?.message || (error as Error)?.message || 'Unknown error'}
        </p>
        <button
          className="bg-transparent border-2 border-slate-dark text-slate-dark px-6 py-2 rounded-xl font-semibold mt-4"
          onClick={() => navigate('/customer/katalog')}
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-dark text-white">
      {/* Top App Bar — sesuai Figma Frame 15: dark bg #303841, Aroma Senja putih */}
      <div className="h-[64px] bg-slate-dark shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between px-[20px] shrink-0">
        {/* Kiri: Back + Brand */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-[8px] active:opacity-70 transition-opacity"
          aria-label="Kembali"
        >
          <ChevronLeft size={16} className="text-[#f9f9f9]" />
          <span className="font-serif font-semibold text-[20px] text-[#f9f9f9] leading-[28px] whitespace-nowrap">
            Aroma Senja
          </span>
        </button>
        {/* Kanan: Share icon */}
        <button
          aria-label="Bagikan"
          className="w-[18px] h-[20px] flex items-center justify-center text-[#f9f9f9] active:opacity-70"
        >
          <Share2 size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col w-full relative z-10 px-[20px] pt-6 pb-8">
        <StrukCard data={strukData} />

        {/* External Action Buttons */}
        <div className="mt-8 flex flex-col gap-4 w-full">
          <button
            onClick={() => navigate(`/customer/ulasan/${pesananId}`)}
            className="w-full bg-deep-orange text-white font-sans font-bold text-[16px] h-[56px] rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(255,87,34,0.3)]"
          >
            <MessageSquareHeart className="w-5 h-5" />
            Beri Ulasan Pesanan
          </button>

          <button
            onClick={() => navigate('/customer/katalog')}
            className="w-full bg-transparent border-2 border-off-white/35 text-off-white font-sans font-medium text-[16px] h-[56px] rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
          >
            <Utensils className="w-[18px] h-[18px]" />
            Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrukPage;
