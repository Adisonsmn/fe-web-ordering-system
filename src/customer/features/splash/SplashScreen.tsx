import { type FC, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useRestoConfig } from './hooks/useRestoConfig';

const SplashScreen: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Ambil data konfigurasi operasional restoran
  const { data, isLoading } = useRestoConfig();

  const [minimumDelayPassed, setMinimumDelayPassed] = useState(false);

  useEffect(() => {
    // Ekstraksi parameter nomor meja (meja / table)
    const tableParam = searchParams.get('meja') || searchParams.get('table');
    if (tableParam) {
      localStorage.setItem('nomorMeja', tableParam);
    }

    // Durasi minimal splash screen ditampilkan (2.5 detik)
    const timer = setTimeout(() => {
      setMinimumDelayPassed(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    // Alihkan rute jika durasi minimal sudah terlewati dan pemanggilan REST API selesai
    if (minimumDelayPassed && !isLoading) {
      if (data && !data.isOpen) {
        // Do not redirect, stay on splash screen to show closed message
      } else {
        navigate('/customer/welcome', { replace: true });
      }
    }
  }, [minimumDelayPassed, isLoading, navigate, data]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-dark relative overflow-hidden px-[20px]">
      {/* Atmospheric Radial Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255, 87, 34, 0.15) 0%, rgba(255, 87, 34, 0) 70%)',
        }}
      />

      {/* Center Identity Cluster */}
      <div className="flex flex-col items-center gap-4 z-10 animate-fade-in">
        {/* Decorative Coffee Cup Vector Logo */}
        <div className="w-[36px] h-[44px] transition-transform hover:scale-105 duration-300">
          <svg
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            viewBox="0 0 36 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Logo Aroma Senja"
          >
            <path
              d="M14 30C10.1 30 6.79167 28.6417 4.075 25.925C1.35833 23.2083 0 19.9 0 16V4C0 2.9 0.391667 1.95833 1.175 1.175C1.95833 0.391667 2.9 0 4 0H29C30.9333 0 32.5833 0.683333 33.95 2.05C35.3167 3.41667 36 5.06667 36 7C36 8.93333 35.3167 10.5833 33.95 11.95C32.5833 13.3167 30.9333 14 29 14H28V16C28 19.9 26.6417 23.2083 23.925 25.925C21.2083 28.6417 17.9 30 14 30V30M4 10H24V4H4V10V10M28 10H29C29.8333 10 30.5417 9.70833 31.125 9.125C31.7083 8.54167 32 7.83333 32 7C32 6.16667 31.7083 5.45833 31.125 4.875C30.5417 4.29167 29.8333 4 29 4H28V10V10M0 36V32H32V36H0V36"
              fill="#FF5722"
            />
          </svg>
        </div>

        {/* Heading 1 - Brand Logo */}
        <div className="flex flex-col items-center">
          <h1 className="text-[42px] font-serif font-normal text-off-white tracking-[-1.05px] leading-[52.5px] text-center">
            Aroma Senja
          </h1>
        </div>
      </div>

      {/* Bottom Content Container */}
      <div className="absolute bottom-[64px] left-0 right-0 flex flex-col items-center px-[20px] gap-6 z-10">
        {minimumDelayPassed && data && !data.isOpen ? (
          <div className="bg-deep-orange/10 px-6 py-4 rounded-xl border border-deep-orange/20 animate-fade-in-up text-center backdrop-blur-sm">
            <h3 className="text-deep-orange font-bold text-[18px] mb-1">Restoran Sedang Tutup</h3>
            <p className="text-off-white/80 text-[14px]">
              Mohon maaf, kami tidak menerima pesanan saat ini.
            </p>
          </div>
        ) : (
          <>
            {/* Loading Indicator */}
            <div className="flex items-center justify-center gap-2.5">
              <div className="bg-[#76abae] opacity-35 rounded-full size-[8px] animate-pulse" />
              <div className="bg-[#76abae] opacity-35 rounded-full size-[8px] animate-pulse [animation-delay:0.2s]" />
              <div className="bg-[#76abae] opacity-35 rounded-full size-[8px] animate-pulse [animation-delay:0.4s]" />
            </div>

            {/* Tagline */}
            <div className="max-w-[240px] opacity-90">
              <p className="text-[16px] font-sans italic text-teal-muted text-center leading-[24px]">
                Nikmati setiap momen tanpa
                <br />
                antre
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
