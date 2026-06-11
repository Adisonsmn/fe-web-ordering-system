import { AlertCircle, RefreshCw } from 'lucide-react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const BlockedPage: FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // Navigate back to splash/welcome screen to recheck
    navigate('/customer/welcome', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F5F5F5] px-[20px] select-none font-sans">
      {/* Decorative Blur Background Element */}
      <div
        className="absolute w-[200px] h-[200px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          backgroundColor: '#FF5722',
          top: '30%',
        }}
      />

      {/* Main Card Container */}
      <div className="bg-white border border-[#303841]/5 shadow-[0_4px_20px_rgba(48,56,65,0.08)] rounded-2xl p-[30px] w-full max-w-[350px] flex flex-col items-center text-center z-10 animate-fade-in">
        {/* Warning Icon Container with Pulsing Effect */}
        <div className="w-[64px] h-[64px] rounded-full bg-[#FF5722]/10 border border-[#FF5722]/20 flex items-center justify-center text-[#FF5722] mb-6 animate-pulse">
          <AlertCircle className="w-[32px] h-[32px] stroke-[2]" />
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-serif font-bold text-[#303841] mb-3 leading-tight">
          Meja Sedang Digunakan
        </h2>

        {/* Description */}
        <p className="text-[14px] font-sans font-normal text-[#303841]/60 leading-[22px] mb-8">
          Sesi meja ini sedang aktif pada perangkat lain untuk menghindari kesalahan pemesanan.
          Silakan hubungi kasir atau pelayan jika Anda berhak atas meja ini.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleRetry}
          className="w-full bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-sans font-semibold text-[14px] h-[52px] rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-md shadow-[#FF5722]/25 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Muat Ulang Halaman</span>
        </button>
      </div>
    </div>
  );
};

export default BlockedPage;
