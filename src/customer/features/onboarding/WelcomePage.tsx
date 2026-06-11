import { useRestoStore } from '@shared/stores/restoStore';
import { ArrowRight, CheckCircle2, TableProperties } from 'lucide-react';
import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestoConfig } from '../splash/hooks/useRestoConfig';
import { useScanMeja } from './hooks/useScanMeja';
import { useMejaStore } from './store/mejaStore';

// Helper to validate UUID structure
const isUuid = (val: string | null): boolean => {
  if (!val) return false;
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(val);
};

const WelcomePage: FC = () => {
  const navigate = useNavigate();

  // Fetch Resto Config (cached or fetched dynamically)
  useRestoConfig();
  const restoName = useRestoStore((state) => state.restoName);
  const restoAlamat = useRestoStore((state) => state.alamat);

  // Retrieve table parameter from localStorage
  const rawTableParam = localStorage.getItem('nomorMeja');
  const hasValidUuid = isUuid(rawTableParam);

  // Gunakan mutation agar POST selalu dipanggil setiap kali halaman dibuka
  const setScanData = useMejaStore((s) => s.setScanData);
  const {
    mutate: scanMeja,
    data: scanData,
    isPending: isScanLoading,
    isError,
    error,
  } = useScanMeja();

  // Panggil scan saat komponen mount — memastikan backend mencatat device & update isOccupied
  useEffect(() => {
    if (hasValidUuid && rawTableParam) {
      scanMeja(rawTableParam, {
        onSuccess: (data) => {
          // Simpan ke store agar halaman lain bisa baca tanpa POST ulang
          setScanData(data);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // hanya saat mount

  // Derive Table Number and Zone (dynamic database values with Figma fallback)
  const nomorMeja = scanData?.nomorMeja ?? (hasValidUuid ? '...' : rawTableParam || '7');
  const zoneMeja = scanData?.zone ?? 'Area Indoor';

  useEffect(() => {
    // If the table parameter is available but we scanned successfully and database says not active or closed
    if (scanData && !scanData.isActive) {
      console.warn('Meja sedang dinonaktifkan.');
    }
  }, [scanData]);

  useEffect(() => {
    if (isError) {
      const axiosError = error as any;
      if (axiosError?.response?.status === 409) {
        navigate('/customer/blocked', { replace: true });
      }
    }
  }, [isError, error, navigate]);

  return (
    <div className="relative w-full min-h-screen bg-off-white select-none animate-fade-in flex flex-col font-sans">
      {/* 1. Top Area (Header Section) */}
      <div className="relative h-[200px] w-full bg-slate-dark flex flex-col items-center justify-center overflow-hidden">
        {/* Sleek radial gradient background overlay for luxury tone */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(255, 87, 34, 0.25) 0%, rgba(48, 56, 65, 0) 80%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-3">
          {/* Circular Checkmark Icon container */}
          <div className="w-[52px] h-[52px] rounded-full bg-deep-orange/10 border border-deep-orange/20 flex items-center justify-center text-deep-orange animate-pulse">
            <CheckCircle2 className="w-[28px] h-[28px] stroke-[2.5]" />
          </div>

          <h2 className="text-[20px] font-sans font-bold text-white tracking-tight text-center">
            QR Code Berhasil Dipindai
          </h2>
        </div>
      </div>

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 px-[20px] -mt-[32px] pb-[40px] relative z-20 flex flex-col gap-6">
        {/* White Info Card */}
        <div className="bg-white border border-teal-muted/10 drop-shadow-[0_4px_10px_rgba(48,56,65,0.06)] rounded-[12px] p-[25px] flex flex-col gap-[24px] w-full">
          {/* Table Assignment Section */}
          <div className="flex items-center justify-between w-full">
            {/* Left: Table details */}
            <div className="flex items-center gap-3.5">
              <div className="w-[48px] h-[48px] rounded-full bg-teal-muted/10 flex items-center justify-center text-teal-muted">
                <TableProperties className="w-[22px] h-[22px]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[24px] font-serif font-bold text-slate-dark leading-tight">
                  {isScanLoading ? 'Memuat...' : `Meja ${nomorMeja}`}
                </h3>
                <span className="text-[12px] font-sans font-bold text-teal-muted tracking-[0.6px] uppercase leading-none mt-1">
                  {zoneMeja}
                </span>
              </div>
            </div>

            {/* Middle: Vertical Divider */}
            <div className="w-[1px] h-[40px] bg-slate-dark/10" />

            {/* Right: Resto branding */}
            <div className="flex flex-col items-end text-right max-w-[130px]">
              <span className="text-[18px] font-serif font-bold text-deep-orange leading-tight">
                {restoName}
              </span>
              <p className="text-[10px] font-sans font-normal text-slate-dark/60 leading-normal mt-0.5 whitespace-pre-line">
                {restoAlamat}
              </p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-[15px] font-sans font-normal text-slate-dark/70 leading-[26px]">
            <p>
              Selamat datang! Silakan mulai memesan langsung dari sini. Nikmati pengalaman kuliner
              nusantara yang autentik.
            </p>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => navigate('/customer/auth-choice')}
            disabled={isScanLoading || isError}
            className="w-full bg-deep-orange text-white font-sans font-bold text-[14px] py-[16px] rounded-[12px] active:scale-[0.98] transition-all duration-200 tracking-[1.4px] uppercase text-center cursor-pointer shadow-lg shadow-deep-orange/25 hover:bg-deep-orange/95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mulai Pesan
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Login Link */}
          <div className="pt-2 text-center w-full flex items-center justify-center gap-1.5 text-[12px] tracking-[0.6px]">
            <span className="font-sans font-bold text-slate-dark/50">Sudah punya akun?</span>
            <button
              type="button"
              onClick={() => navigate('/customer/login')}
              className="font-sans font-bold text-teal-muted underline decoration-teal-muted/30 hover:text-teal-muted/80 transition-colors"
            >
              Masuk di sini
            </button>
          </div>
        </div>

        {/* 3. Atmospheric Food Image Decor Card */}
        <div className="relative h-[160px] w-full rounded-[12px] overflow-hidden drop-shadow-[0_2px_5px_rgba(0,0,0,0.03)] border border-slate-dark/5">
          {/* Food image overlayed with shadow gradient */}
          <img
            alt="Sajian Spesial Nasi Campur"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=600&auto=format&fit=crop"
          />
          {/* Gradient tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Special menu badge description */}
          <div className="absolute bottom-0 left-0 p-[16px]">
            <span className="text-[10px] font-sans font-medium text-white/80 tracking-[1px] uppercase">
              Sajian Spesial Hari Ini: Nasi Campur Bali
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
