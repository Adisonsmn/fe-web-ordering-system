import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { Spinner } from '@shared/components/ui/Spinner';
import { type FC, useEffect, useState } from 'react';
import { useRestoConfigAdmin, useUpdateRestoConfig } from '../hooks/useRestoConfigAdmin';

// Local helper to convert time format from API (can be array [hour, minute]) to string "HH:mm"
const getNormalizedTimeString = (timeValue: unknown): string => {
  if (!timeValue) return '08:00';
  if (Array.isArray(timeValue)) {
    const hh = String(timeValue[0]).padStart(2, '0');
    const mm = String(timeValue[1] ?? 0).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return String(timeValue);
};

export const RestoProfileForm: FC = () => {
  const { data: config, isLoading, isError } = useRestoConfigAdmin();
  const updateConfigMutation = useUpdateRestoConfig();

  const [nama, setNama] = useState('');
  const [tagline, setTagline] = useState('');
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');

  useEffect(() => {
    if (config) {
      setNama(config.namaRestoran || '');
      setTagline(config.tagline || '');
      setAlamat(config.alamat || '');
      setTelepon(config.telepon || '');
      setEmail(config.email || '');
      setInstagram(config.instagram || '');
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
        Gagal memuat profil restoran. Silakan coba lagi.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      alert('Nama restoran tidak boleh kosong.');
      return;
    }
    if (!tagline.trim()) {
      alert('Tagline tidak boleh kosong.');
      return;
    }

    try {
      await updateConfigMutation.mutateAsync({
        isOpen: config.isOpen,
        openTime: getNormalizedTimeString(config.openTime),
        closeTime: getNormalizedTimeString(config.closeTime),
        nama: nama.trim(),
        tagline: tagline.trim(),
        alamat: alamat.trim(),
        telepon: telepon.trim(),
        email: email.trim(),
        instagram: instagram.trim(),
      });
      alert('Profil restoran berhasil diperbarui!');
    } catch (_err) {
      alert('Gagal memperbarui profil restoran.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
      <h3 className="font-serif text-[18px] font-semibold text-slate-dark border-b border-slate-dark/10 pb-4 mb-6">
        Profil Restoran
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="namaRestoran" className="text-[13px] font-semibold text-slate-dark/70">
              Nama Restoran
            </label>
            <Input
              id="namaRestoran"
              type="text"
              placeholder="Masukkan nama restoran"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              disabled={updateConfigMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="taglineRestoran"
              className="text-[13px] font-semibold text-slate-dark/70"
            >
              Tagline Restoran
            </label>
            <Input
              id="taglineRestoran"
              type="text"
              placeholder="Contoh: Selera Tradisional Nusantara"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              disabled={updateConfigMutation.isPending}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label
              htmlFor="alamatRestoran"
              className="text-[13px] font-semibold text-slate-dark/70"
            >
              Alamat Restoran
            </label>
            <textarea
              id="alamatRestoran"
              placeholder="Masukkan alamat lengkap"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              disabled={updateConfigMutation.isPending}
              className="w-full min-h-[80px] p-3 text-[14px] text-slate-dark border border-slate-dark/20 rounded-lg focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted disabled:bg-slate-100 disabled:text-slate-dark/50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="teleponRestoran"
              className="text-[13px] font-semibold text-slate-dark/70"
            >
              Nomor Telepon Restoran
            </label>
            <Input
              id="teleponRestoran"
              type="text"
              placeholder="Contoh: (021) 1234567"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              disabled={updateConfigMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="emailRestoran" className="text-[13px] font-semibold text-slate-dark/70">
              Email Restoran
            </label>
            <Input
              id="emailRestoran"
              type="email"
              placeholder="Contoh: info@restoran.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={updateConfigMutation.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="instagramRestoran"
              className="text-[13px] font-semibold text-slate-dark/70"
            >
              Instagram Restoran
            </label>
            <Input
              id="instagramRestoran"
              type="text"
              placeholder="Contoh: @aromasenja.id"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              disabled={updateConfigMutation.isPending}
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
            {updateConfigMutation.isPending ? 'Menyimpan...' : 'Simpan Profil Restoran'}
          </Button>
        </div>
      </form>
    </div>
  );
};
