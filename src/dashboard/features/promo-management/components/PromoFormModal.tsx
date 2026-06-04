import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { Modal } from '@shared/components/ui/Modal';
import type { CreatePromoRequest, PromoResponse } from '@shared/types';
import { type FC, useEffect, useState } from 'react';

interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePromoRequest) => void;
  isLoading: boolean;
  initialData?: PromoResponse | null;
}

export const PromoFormModal: FC<PromoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}) => {
  const [formData, setFormData] = useState<CreatePromoRequest>({
    namaPromo: '',
    tipeDiskon: 'PERSEN',
    nilaiDiskon: 0,
    tanggalMulai: '',
    tanggalSelesai: '',
    targetCategory: '',
    maxUsage: undefined,
    tag: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          namaPromo: initialData.namaPromo,
          tipeDiskon: initialData.tipeDiskon,
          nilaiDiskon: initialData.nilaiDiskon,
          tanggalMulai: initialData.tanggalMulai,
          tanggalSelesai: initialData.tanggalSelesai,
          targetCategory: initialData.targetCategory || '',
          maxUsage: initialData.maxUsage || undefined,
          tag: initialData.tag || '',
          description: initialData.description || '',
        });
      } else {
        setFormData({
          namaPromo: '',
          tipeDiskon: 'PERSEN',
          nilaiDiskon: 0,
          tanggalMulai: '',
          tanggalSelesai: '',
          targetCategory: '',
          maxUsage: undefined,
          tag: '',
          description: '',
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEdit = !!initialData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Promo' : 'Buat Promo Baru'}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="namaPromo" className="text-[13px] font-semibold text-slate-dark/80">
            Nama Promo
          </label>
          <Input
            id="namaPromo"
            value={formData.namaPromo}
            onChange={(e) => setFormData({ ...formData, namaPromo: e.target.value })}
            placeholder="Contoh: Diskon Kemerdekaan"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="tipeDiskon" className="text-[13px] font-semibold text-slate-dark/80">
              Tipe Diskon
            </label>
            <select
              id="tipeDiskon"
              value={formData.tipeDiskon}
              onChange={(e) =>
                setFormData({ ...formData, tipeDiskon: e.target.value as 'PERSEN' | 'NOMINAL' })
              }
              className="w-full min-h-[48px] bg-white border border-slate-dark/20 rounded-lg px-4 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted"
            >
              <option value="PERSEN">Persen (%)</option>
              <option value="NOMINAL">Nominal (Rp)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="nilaiDiskon" className="text-[13px] font-semibold text-slate-dark/80">
              Nilai Diskon
            </label>
            <Input
              id="nilaiDiskon"
              type="number"
              value={formData.nilaiDiskon || ''}
              onChange={(e) => setFormData({ ...formData, nilaiDiskon: Number(e.target.value) })}
              placeholder={formData.tipeDiskon === 'PERSEN' ? 'Maks 100' : 'Contoh: 20000'}
              required
              min={1}
              max={formData.tipeDiskon === 'PERSEN' ? 100 : undefined}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="tanggalMulai" className="text-[13px] font-semibold text-slate-dark/80">
              Tanggal Mulai
            </label>
            <Input
              id="tanggalMulai"
              type="date"
              value={formData.tanggalMulai}
              onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="tanggalSelesai"
              className="text-[13px] font-semibold text-slate-dark/80"
            >
              Tanggal Selesai
            </label>
            <Input
              id="tanggalSelesai"
              type="date"
              value={formData.tanggalSelesai}
              onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="maxUsage" className="text-[13px] font-semibold text-slate-dark/80">
              Batas Penggunaan (Opsional)
            </label>
            <Input
              id="maxUsage"
              type="number"
              value={formData.maxUsage || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxUsage: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Biarkan kosong jika tidak terbatas"
              min={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="tag" className="text-[13px] font-semibold text-slate-dark/80">
              Kode Promo / Tag (Opsional)
            </label>
            <Input
              id="tag"
              value={formData.tag || ''}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })}
              placeholder="Contoh: MERDEKA17"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="targetCategory" className="text-[13px] font-semibold text-slate-dark/80">
            Target Kategori (Opsional)
          </label>
          <Input
            id="targetCategory"
            value={formData.targetCategory || ''}
            onChange={(e) => setFormData({ ...formData, targetCategory: e.target.value })}
            placeholder="Contoh: Kopi (Kosong = Semua Menu)"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-[13px] font-semibold text-slate-dark/80">
            Deskripsi (Opsional)
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white border border-slate-dark/20 rounded-lg p-4 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted resize-none h-24"
            placeholder="Masukkan syarat dan ketentuan..."
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan Promo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
