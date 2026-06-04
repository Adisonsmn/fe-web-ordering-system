import { Button } from '@shared/components/ui';
import { cn } from '@shared/utils/cn';
import { type FC, useState } from 'react';

interface EstimasiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (estimasiMenit: number) => void;
  kodePesanan: string;
}

const EstimasiModal: FC<EstimasiModalProps> = ({ isOpen, onClose, onSubmit, kodePesanan }) => {
  const [estimasi, setEstimasi] = useState<number>(15);

  if (!isOpen) return null;

  const presetTimes = [15, 30, 45, 60];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="font-serif text-[22px] text-slate-dark">Terima Pesanan {kodePesanan}</h3>
        <p className="mt-2 text-[14px] text-slate-dark/70">
          Tentukan estimasi waktu memasak untuk pesanan ini. Pelanggan akan melihat waktu ini di
          halaman pelacakan pesanan mereka.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {presetTimes.map((time) => (
              <button
                type="button"
                key={time}
                onClick={() => setEstimasi(time)}
                className={cn(
                  'flex h-10 flex-shrink-0 items-center justify-center rounded-lg border px-4 font-sans text-[14px] font-semibold transition-colors',
                  estimasi === time
                    ? 'border-teal-muted bg-teal-muted/10 text-teal-muted'
                    : 'border-slate-dark/20 text-slate-dark/70 hover:border-teal-muted/50',
                )}
              >
                {time} Menit
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[14px] text-slate-dark/70">Custom:</span>
            <input
              type="number"
              min="1"
              max="180"
              value={estimasi}
              onChange={(e) => setEstimasi(Number(e.target.value) || 15)}
              className="w-24 rounded-lg border border-slate-dark/20 px-3 py-2 text-[14px] focus:border-teal-muted focus:outline-none focus:ring-1 focus:ring-teal-muted"
            />
            <span className="text-[14px] text-slate-dark/70">Menit</span>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-dark hover:bg-slate-200"
          >
            Batal
          </Button>
          <Button
            onClick={() => onSubmit(estimasi)}
            className="flex-1 bg-deep-orange text-white hover:bg-deep-orange/90"
          >
            Mulai Memasak
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EstimasiModal;
