import { Button } from '@shared/components/ui';
import type { PesananResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { CheckCircle2, Clock } from 'lucide-react';
import type { FC } from 'react';

interface PesananCardProps {
  pesanan: PesananResponse;
  onTerima?: (pesananId: string) => void;
  onPerbarui?: (pesananId: string) => void;
  onSelesai?: (pesananId: string) => void;
}

const PesananCard: FC<PesananCardProps> = ({ pesanan, onTerima, onPerbarui, onSelesai }) => {
  const isNew = pesanan.status === 'NEW';
  const isPreparing = pesanan.status === 'PREPARING';
  const isReady = pesanan.status === 'READY';

  // Parse time
  const timeStr = new Date(pesanan.tanggalPesanan).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate remaining time for PREPARING
  let sisaMenit = 0;
  let progress = 0;
  let isLate = false;

  if (isPreparing && pesanan.estimasiMenit) {
    const orderTime = new Date(pesanan.tanggalPesanan).getTime();
    const now = Date.now();
    const elapsedMinutes = Math.floor((now - orderTime) / 60000);
    sisaMenit = pesanan.estimasiMenit - elapsedMinutes;
    isLate = sisaMenit < 0;

    // progress is 0 to 100
    progress = Math.min(100, Math.max(0, (elapsedMinutes / pesanan.estimasiMenit) * 100));
  }

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3 rounded-xl border bg-white p-[17px] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] transition-all',
        isNew && 'border-deep-orange/20',
        isPreparing && (isLate ? 'border-red-500/30 bg-red-50/50' : 'border-teal-muted/30'),
        isReady && 'border-[#144e51]/30 bg-teal-50/30',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span
            className={cn(
              'font-sans text-[12px] font-semibold tracking-wide',
              isNew && 'text-deep-orange',
              isPreparing && 'text-teal-muted',
              isReady && 'text-[#144e51]',
            )}
          >
            {pesanan.kodePesanan}
          </span>
          <h4 className="font-sans text-[18px] font-bold text-slate-dark leading-tight">
            Meja {pesanan.nomorMeja ? String(pesanan.nomorMeja).padStart(2, '0') : '--'}
          </h4>
        </div>

        {isNew && <span className="font-sans text-[12px] text-slate-dark/40">{timeStr}</span>}

        {isPreparing && (
          <div className="flex flex-col items-end">
            {isLate ? (
              <span className="font-sans text-[12px] font-bold tracking-wide text-red-600 uppercase">
                LAMBAT
                <br />
                (+{Math.abs(sisaMenit)}M)
              </span>
            ) : (
              <span className="font-sans text-[12px] font-bold tracking-wide text-teal-muted uppercase">
                SISA {sisaMenit} MNT
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar for PREPARING */}
      {isPreparing && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[12px] text-[#5b4039]">
            <span>Progress Memasak</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isLate ? 'bg-red-500' : 'bg-teal-muted',
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Ready Label */}
      {isReady && (
        <div className="mt-1 flex flex-col gap-1 rounded-lg border border-[#144e51]/10 bg-white/60 p-3">
          <span className="text-[12px] font-bold tracking-wider text-[#144e51] uppercase">
            SEMUA MENU SIAP:
          </span>
          <div className="flex flex-col gap-1">
            {pesanan.detailPesanan.map((item) => (
              <div key={item.detailPesananId} className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-[#144e51]" />
                <span className="text-[14px] text-slate-dark">{item.menuName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items List for NEW / PREPARING */}
      {!isReady && (
        <div className="flex flex-col gap-2">
          {pesanan.detailPesanan.map((item) => (
            <div key={item.detailPesananId} className="flex flex-col">
              <div className="flex justify-between text-[14px] text-slate-dark">
                <span className="font-medium">{item.menuName}</span>
                <span className="font-semibold text-slate-dark/70">x{item.quantity}</span>
              </div>
              {item.catatan && (
                <span className="font-serif text-[12px] italic text-[#5b4039]">
                  "{item.catatan}"
                </span>
              )}
            </div>
          ))}
          {pesanan.catatanDapur && (
            <div className="mt-1 rounded-md bg-yellow-50 p-2 text-[12px] text-yellow-800 border border-yellow-200">
              <span className="font-bold">Catatan Pesanan:</span> {pesanan.catatanDapur}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-2 flex w-full gap-2">
        {isNew && (
          <Button
            className="w-full bg-deep-orange text-white hover:bg-deep-orange/90"
            onClick={() => onTerima?.(pesanan.pesananId)}
          >
            <Clock className="mr-2 h-4 w-4" /> Terima Pesanan
          </Button>
        )}

        {isPreparing && (
          <>
            <Button
              variant="outline"
              className="flex-1 border-[#907067] text-[#5b4039] hover:bg-[#907067]/10"
              onClick={() => alert('Panggil pelayan diproses')}
            >
              Hubungi Pelayan
            </Button>
            <Button
              className="flex-1 bg-teal-muted text-white hover:bg-teal-muted/90"
              onClick={() => onPerbarui?.(pesanan.pesananId)}
            >
              Perbarui Status
            </Button>
          </>
        )}

        {isReady && (
          <Button
            className="w-full bg-[#144e51] text-white hover:bg-[#144e51]/90"
            onClick={() => onSelesai?.(pesanan.pesananId)}
          >
            Selesai & Konfirmasi
          </Button>
        )}
      </div>
    </div>
  );
};

export default PesananCard;
