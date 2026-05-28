import { Sparkles } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const UlasanSuksesPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col w-full relative h-[calc(100vh-100px)] min-h-[600px] justify-center">
      {/* Sparkles background could be added here using CSS animations if needed */}

      {/* Main Content container */}
      <div className="flex flex-col items-center justify-center w-full z-10 -mt-20">
        {/* Central Success Indicator */}
        <div className="relative mb-10">
          <div className="w-32 h-32 rounded-full bg-deep-orange shadow-[0_8px_15px_rgba(255,87,34,0.4)] flex items-center justify-center relative z-10">
            <span className="text-5xl text-white">👍</span>
          </div>
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 text-[#9ad0d3] text-3xl animate-pulse">
            <Sparkles size={36} />
          </div>
        </div>

        {/* Typography Branding */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="font-serif font-bold text-[24px] text-slate-dark text-center">
            Terima Kasih!
          </h1>
          <p className="font-sans text-[16px] text-slate-dark/70 text-center px-4 max-w-[320px]">
            Ulasanmu sangat berarti bagi kami dan membantu pelanggan lain.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-xl p-4 w-full max-w-[320px] flex flex-col items-center gap-2 mb-6">
          <div className="flex gap-1 text-[#ffdba0]">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="text-xl">
                ★
              </span>
            ))}
          </div>
          <h2 className="font-serif font-semibold text-[20px] text-slate-dark text-center">
            Luar Biasa!
          </h2>
        </div>

        {/* Points Badge */}
        <div className="bg-teal-muted/20 border border-teal-muted/30 rounded-full px-4 py-3 flex items-center gap-2 mb-12">
          <div className="w-6 h-6 rounded-full bg-teal-muted flex items-center justify-center">
            <span className="text-white text-[10px]">✨</span>
          </div>
          <p className="font-sans font-bold text-[12px] text-teal-muted tracking-wider uppercase">
            600 POIN TOTAL SEKARANG
          </p>
        </div>

        {/* Action Area */}
        <div className="flex flex-col gap-4 w-full mt-auto absolute bottom-8 left-0 right-0 px-4">
          <button
            onClick={() => navigate('/customer/katalog')}
            className="w-full bg-deep-orange text-white font-sans font-bold text-[16px] h-[56px] rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center shadow-[0_4px_12px_rgba(255,87,34,0.3)]"
          >
            Kembali ke Menu Utama
          </button>

          <button
            onClick={() => navigate('/customer/katalog')}
            className="w-full bg-transparent text-slate-dark/60 font-sans font-medium text-[14px] h-[56px] rounded-xl active:scale-[0.98] transition-transform flex items-center justify-center"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

export default UlasanSuksesPage;
