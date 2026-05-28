import { ChevronLeft, MessageSquareHeart } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StrukCard from './components/StrukCard';
import { useStruk } from './hooks/useStruk';

const StrukPage: FC = () => {
  const { pesananId } = useParams<{ pesananId: string }>();
  const navigate = useNavigate();

  const { data: strukData, isLoading, isError } = useStruk(pesananId || '');

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
        <p className="text-sm text-red-500 mb-4">{(error as any)?.response?.data?.message || (error as Error)?.message || 'Unknown error'}</p>
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
    <div className="flex flex-col min-h-full">
      {/* Top App Bar */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-5 h-5 text-slate-dark" />
        </button>
        <h1 className="font-serif font-semibold text-[20px] text-slate-dark">Aroma Senja</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 flex flex-col w-full relative z-10 px-2 pb-8">
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
            className="w-full bg-transparent border-2 border-slate-dark/20 text-slate-dark font-sans font-medium text-[16px] h-[56px] rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center"
          >
            Kembali ke Menu Utama
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrukPage;
