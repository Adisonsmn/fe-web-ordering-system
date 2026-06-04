import { Button, Input, Modal } from '@shared/components/ui';
import type { FC, FormEvent } from 'react';
import { useState } from 'react';

interface MejaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nomorMeja: number; zone: 'INDOOR' | 'OUTDOOR' }) => void;
  isLoading?: boolean;
}

export const MejaFormModal: FC<MejaFormModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [nomorMeja, setNomorMeja] = useState<string>('');
  const [zone, setZone] = useState<'INDOOR' | 'OUTDOOR'>('INDOOR');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nomorMeja) return;

    onSubmit({
      nomorMeja: parseInt(nomorMeja, 10),
      zone,
    });

    // Reset form
    setNomorMeja('');
    setZone('INDOOR');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Meja Baru" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: explanation */}
          <label className="text-[13px] font-bold text-slate-dark block">Nomor Meja</label>
          <Input
            type="number"
            min={1}
            value={nomorMeja}
            onChange={(e) => setNomorMeja(e.target.value)}
            placeholder="Contoh: 5"
            required
          />
        </div>

        <div className="space-y-2">
          {/* biome-ignore lint/a11y/noLabelWithoutControl: explanation */}
          <label className="text-[13px] font-bold text-slate-dark block">Zona Penempatan</label>
          <div className="grid grid-cols-2 gap-3">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="zone"
                value="INDOOR"
                className="peer sr-only"
                checked={zone === 'INDOOR'}
                onChange={() => setZone('INDOOR')}
              />
              <div className="px-4 py-3 border border-slate-dark/20 rounded-xl text-center peer-checked:bg-teal-muted/10 peer-checked:border-teal-muted peer-checked:text-teal-muted font-medium transition-colors">
                Indoor
              </div>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="zone"
                value="OUTDOOR"
                className="peer sr-only"
                checked={zone === 'OUTDOOR'}
                onChange={() => setZone('OUTDOOR')}
              />
              <div className="px-4 py-3 border border-slate-dark/20 rounded-xl text-center peer-checked:bg-teal-muted/10 peer-checked:border-teal-muted peer-checked:text-teal-muted font-medium transition-colors">
                Outdoor
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 flex gap-3 justify-end border-t border-slate-dark/5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!nomorMeja || isLoading}
            className="flex-1 bg-teal-muted hover:bg-teal-muted/90"
          >
            {isLoading ? 'Menambahkan...' : 'Tambah Meja'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
