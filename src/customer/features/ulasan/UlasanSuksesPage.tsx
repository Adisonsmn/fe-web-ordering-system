import { useAuthStore } from '@shared/stores/authStore';
import { Sparkles, Star } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const UlasanSuksesPage: FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuthStore();

  return (
    <div className="absolute inset-0 bg-slate-dark text-off-white z-20 flex flex-col justify-between px-5 pt-20 pb-10 overflow-y-auto">
      {/* Central Success Content */}
      <div className="flex flex-col items-center justify-center w-full my-auto">
        {/* Central Success Indicator */}
        <div className="relative mb-10">
          <div className="w-32 h-32 rounded-full bg-deep-orange shadow-[0_8px_15px_rgba(255,87,34,0.4)] flex items-center justify-center relative z-10">
            <Star size={54} className="text-white fill-white" />
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 text-[#9ad0d3] text-3xl animate-pulse">
            <Sparkles size={36} />
          </div>
        </div>

        {/* Typography Branding */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="font-serif font-bold text-[24px] text-[#f5f5f5] text-center">
            Terima Kasih!
          </h1>
          <p className="font-sans text-[16px] text-[#bfc7d3] text-center px-4 max-w-[320px]">
            Ulasanmu sangat berarti bagi kami dan membantu pelanggan lain.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white shadow-[0px_1px_1px_rgba(0,0,0,0.05)] rounded-[12px] p-[16px] w-full max-w-[320px] flex flex-col items-center gap-[8px] mb-6">
          <div className="flex gap-[4px] text-[#ffdba0] text-xl">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <h2 className="font-serif font-semibold text-[20px] text-[#1a1c1c] text-center">
            Luar Biasa!
          </h2>
        </div>

        {/* Points Badge */}
        {!isGuest && user && user.totalPoint !== null && (
          <div className="bg-[#659a9d]/20 border border-[#659a9d]/30 rounded-[9999px] px-[17px] py-[13px] flex items-center gap-[8px] mb-6">
            <div className="w-[24px] h-[24px] rounded-[9999px] bg-[#659a9d] flex items-center justify-center">
              <span className="text-white text-[10px]">✨</span>
            </div>
            <p className="font-sans font-bold text-[12px] text-[#9ad0d3] tracking-[0.6px] uppercase">
              {user.totalPoint} POIN TOTAL SEKARANG
            </p>
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="flex flex-col gap-[16px] w-full px-[20px] mt-auto">
        <button
          onClick={() => navigate('/customer/katalog')}
          className="w-full bg-[#ff5722] hover:bg-[#ff5722]/90 text-white font-sans font-bold text-[16px] h-[56px] rounded-[12px] active:scale-[0.98] transition-transform flex items-center justify-center shadow-[0_4px_12px_rgba(255,87,34,0.3)]"
        >
          Kembali ke Menu Utama
        </button>

        <button
          onClick={() => navigate('/customer/katalog')}
          className="w-full bg-transparent text-[#bfc7d3] hover:text-white font-sans font-medium text-[14px] h-[40px] rounded-[12px] active:scale-[0.98] transition-transform flex items-center justify-center"
        >
          Selesai
        </button>
      </div>
    </div>
  );
};

export default UlasanSuksesPage;
