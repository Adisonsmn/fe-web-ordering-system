import { Button } from '@shared/components/ui/Button';
import { Spinner } from '@shared/components/ui/Spinner';
import { cn } from '@shared/utils/cn';
import { type FC, useEffect, useState } from 'react';
import { useRestoConfigAdmin, useUpdateRestoConfig } from '../hooks/useRestoConfigAdmin';

// Helper local to normalize time array [hour, minute] to HH:mm
const getNormalizedTimeString = (timeValue: unknown): string => {
  if (!timeValue) return '08:00';
  if (Array.isArray(timeValue)) {
    const hh = String(timeValue[0]).padStart(2, '0');
    const mm = String(timeValue[1] ?? 0).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return String(timeValue);
};

export const OperationalHoursForm: FC = () => {
  const { data: config, isLoading, isError } = useRestoConfigAdmin();
  const updateConfigMutation = useUpdateRestoConfig();

  const [isOpen, setIsOpen] = useState(false);
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');

  useEffect(() => {
    if (config) {
      setIsOpen(config.isOpen);
      setOpenTime(getNormalizedTimeString(config.openTime));
      setCloseTime(getNormalizedTimeString(config.closeTime));
    }
  }, [config]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
        <Spinner />
      </div>
    );
  }

  if (isError || !config) {
    return (
      <div className="text-center p-6 text-red-500 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        Gagal memuat jam operasional. Silakan coba lagi.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateConfigMutation.mutateAsync({
        isOpen,
        openTime,
        closeTime,
        nama: config.namaRestoran || 'Aroma Senja',
        tagline: config.tagline || 'Cita Rasa Nusantara',
        alamat: config.alamat,
        telepon: config.telepon,
        email: config.email,
        instagram: config.instagram,
      });
      alert('Status operasional berhasil diperbarui!');
    } catch (_err) {
      alert('Gagal memperbarui status operasional.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
      <h3 className="font-serif text-[18px] font-semibold text-slate-dark border-b border-slate-dark/10 pb-4 mb-6">
        Status & Jam Operasional
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Restaurant Open Toggle */}
        <div className="space-y-2">
          <span className="text-[13px] font-semibold text-slate-dark/70 block">
            Status Operasional Restoran
          </span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              disabled={updateConfigMutation.isPending}
              className={cn(
                'flex-1 py-3.5 px-4 rounded-xl border font-semibold text-[14px] transition-all duration-200 active:scale-[0.98]',
                isOpen
                  ? 'bg-teal-muted text-white border-teal-muted shadow-sm'
                  : 'bg-white text-slate-dark/60 border-slate-dark/20 hover:bg-slate-50',
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-current" />
                Buka (Open)
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={updateConfigMutation.isPending}
              className={cn(
                'flex-1 py-3.5 px-4 rounded-xl border font-semibold text-[14px] transition-all duration-200 active:scale-[0.98]',
                !isOpen
                  ? 'bg-red-500 text-white border-red-500 shadow-sm'
                  : 'bg-white text-slate-dark/60 border-slate-dark/20 hover:bg-slate-50',
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-current" />
                Tutup (Closed)
              </div>
            </button>
          </div>
        </div>

        {/* Operating Hours Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="openTime" className="text-[13px] font-semibold text-slate-dark/70">
              Jam Buka
            </label>
            <input
              id="openTime"
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              disabled={updateConfigMutation.isPending}
              className="w-full min-h-[48px] bg-white border border-slate-dark/20 rounded-lg px-4 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted disabled:bg-slate-100 disabled:text-slate-dark/50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="closeTime" className="text-[13px] font-semibold text-slate-dark/70">
              Jam Tutup
            </label>
            <input
              id="closeTime"
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              disabled={updateConfigMutation.isPending}
              className="w-full min-h-[48px] bg-white border border-slate-dark/20 rounded-lg px-4 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted disabled:bg-slate-100 disabled:text-slate-dark/50 disabled:cursor-not-allowed transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-dark/10">
          <Button
            type="submit"
            variant="primary"
            disabled={updateConfigMutation.isPending}
            className="px-8"
          >
            {updateConfigMutation.isPending ? 'Menyimpan...' : 'Simpan Status Operasional'}
          </Button>
        </div>
      </form>
    </div>
  );
};
