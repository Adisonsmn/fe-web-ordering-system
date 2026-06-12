import { Button } from '@shared/components/ui/Button';
import { Input } from '@shared/components/ui/Input';
import { Modal } from '@shared/components/ui/Modal';
import { cn } from '@shared/utils/cn';
import type { CreatePromoRequest, PromoResponse } from '@shared/types';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { type FC, useEffect, useMemo, useState } from 'react';
import { useMenuAdminList } from '../../menu-management/hooks/useMenuAdmin';

const CATEGORIES = ['Makanan', 'Minuman', 'Dessert'];

interface PromoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** data: form promo | selectedMenuIds: menu yang akan diassign promo ini */
  onSubmit: (data: CreatePromoRequest, selectedMenuIds: string[]) => void;
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
    description: '',
  });

  // State untuk Target Menu
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const [menuSearch, setMenuSearch] = useState('');

  // Target mode: 'category' | 'menu' | 'none'
  // none = berlaku untuk semua menu (tidak ada target spesifik)
  const targetMode: 'category' | 'menu' | 'none' =
    formData.targetCategory ? 'category' : selectedMenuIds.length > 0 ? 'menu' : 'none';

  const { data: allMenus = [] } = useMenuAdminList();

  const filteredMenus = useMemo(() => {
    if (!menuSearch.trim()) return allMenus;
    const q = menuSearch.toLowerCase();
    return allMenus.filter(
      (m) =>
        m.menuName.toLowerCase().includes(q) || m.category.toLowerCase().includes(q),
    );
  }, [allMenus, menuSearch]);

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
          description: '',
        });
      }
      // Reset target menu setiap buka modal
      setSelectedMenuIds([]);
      setMenuSearch('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      {
        ...formData,
        // Jika pakai target menu, kosongkan targetCategory
        targetCategory: selectedMenuIds.length > 0 ? '' : formData.targetCategory,
      },
      selectedMenuIds,
    );
  };

  const toggleMenuSelection = (menuId: string) => {
    // Jika pilih menu, hapus targetCategory
    if (formData.targetCategory) {
      setFormData((prev) => ({ ...prev, targetCategory: '' }));
    }
    setSelectedMenuIds((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId],
    );
  };

  const handleCategoryChange = (category: string) => {
    // Jika pilih kategori, clear target menu
    if (category) {
      setSelectedMenuIds([]);
    }
    setFormData((prev) => ({ ...prev, targetCategory: category }));
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

        {/* Nama Promo */}
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

        {/* Tipe & Nilai Diskon */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="tipeDiskon" className="text-[13px] font-semibold text-slate-dark/80">
              Tipe Diskon
            </label>
            <div className="relative">
              <select
                id="tipeDiskon"
                value={formData.tipeDiskon}
                onChange={(e) =>
                  setFormData({ ...formData, tipeDiskon: e.target.value as 'PERSEN' | 'NOMINAL' })
                }
                className="w-full min-h-[48px] bg-white border border-slate-dark/20 rounded-lg px-4 pr-10 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted appearance-none"
              >
                <option value="PERSEN">Persen (%)</option>
                <option value="NOMINAL">Nominal (Rp)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-dark/40 pointer-events-none" />
            </div>
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

        {/* Tanggal Mulai & Selesai */}
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
            <label htmlFor="tanggalSelesai" className="text-[13px] font-semibold text-slate-dark/80">
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

        {/* Batas Penggunaan */}
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
          <p className="text-[11px] text-slate-dark/40">
            Total berapa kali promo bisa dipakai oleh semua pelanggan
          </p>
        </div>

        {/* Divider + label target */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-dark/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-[11px] text-slate-dark/40 uppercase tracking-wider font-semibold">
              Target Diskon
              {targetMode !== 'none' && (
                <span className="ml-1 text-teal-muted">
                  {targetMode === 'category' ? '(Kategori aktif)' : `(${selectedMenuIds.length} menu dipilih)`}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Target Kategori — dropdown */}
        <div className="flex flex-col gap-2">
          <label htmlFor="targetCategory" className="text-[13px] font-semibold text-slate-dark/80">
            Target Kategori
            <span className="ml-1 font-normal text-slate-dark/40">(Opsional)</span>
          </label>
          <div className="relative">
            <select
              id="targetCategory"
              value={formData.targetCategory || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={selectedMenuIds.length > 0}
              className={cn(
                'w-full min-h-[48px] bg-white border rounded-lg px-4 pr-10 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted appearance-none transition-colors',
                selectedMenuIds.length > 0
                  ? 'border-slate-dark/10 text-slate-dark/30 cursor-not-allowed bg-slate-50'
                  : 'border-slate-dark/20',
              )}
            >
              <option value="">Semua Kategori (tidak spesifik)</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-dark/40 pointer-events-none" />
          </div>
          {selectedMenuIds.length > 0 && (
            <p className="text-[11px] text-slate-dark/40">
              Nonaktif — anda memilih menu spesifik
            </p>
          )}
        </div>

        {/* Target Menu — searchable multi-select */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-slate-dark/80">
              Target Menu Spesifik
              <span className="ml-1 font-normal text-slate-dark/40">(Opsional)</span>
            </label>
            {selectedMenuIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedMenuIds([])}
                className="text-[12px] text-deep-orange hover:underline"
              >
                Hapus semua ({selectedMenuIds.length})
              </button>
            )}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-dark/40" />
            <input
              type="text"
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              placeholder="Cari nama atau kategori menu..."
              disabled={!!formData.targetCategory}
              className={cn(
                'w-full min-h-[40px] border rounded-lg pl-9 pr-4 text-[13px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted transition-colors',
                formData.targetCategory
                  ? 'bg-slate-50 border-slate-dark/10 text-slate-dark/30 cursor-not-allowed'
                  : 'bg-white border-slate-dark/20',
              )}
            />
          </div>
          {formData.targetCategory && (
            <p className="text-[11px] text-slate-dark/40">
              Nonaktif — anda memilih kategori spesifik
            </p>
          )}

          {/* Menu list */}
          {!formData.targetCategory && (
            <div className="max-h-[200px] overflow-y-auto border border-slate-dark/10 rounded-lg divide-y divide-slate-dark/5">
              {filteredMenus.length === 0 ? (
                <p className="text-[13px] text-slate-dark/40 text-center py-6">
                  Menu tidak ditemukan
                </p>
              ) : (
                filteredMenus.map((menu) => {
                  const isSelected = selectedMenuIds.includes(menu.menuId);
                  return (
                    <button
                      key={menu.menuId}
                      type="button"
                      onClick={() => toggleMenuSelection(menu.menuId)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50',
                        isSelected && 'bg-teal-muted/5',
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                          isSelected
                            ? 'bg-teal-muted border-teal-muted'
                            : 'border-slate-dark/20',
                        )}
                      >
                        {isSelected && <Check size={10} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-slate-dark truncate">
                          {menu.menuName}
                        </p>
                        <p className="text-[11px] text-slate-dark/50">{menu.category}</p>
                      </div>
                      {menu.promo && (
                        <span className="text-[10px] bg-deep-orange/10 text-deep-orange px-2 py-0.5 rounded-full shrink-0">
                          Ada promo
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Chips menu terpilih */}
          {selectedMenuIds.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {selectedMenuIds.map((id) => {
                const menu = allMenus.find((m) => m.menuId === id);
                return menu ? (
                  <span
                    key={id}
                    className="flex items-center gap-1 bg-teal-muted/10 text-teal-muted text-[12px] px-2.5 py-1 rounded-full"
                  >
                    {menu.menuName}
                    <button
                      type="button"
                      onClick={() => toggleMenuSelection(id)}
                      className="hover:text-deep-orange transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-[13px] font-semibold text-slate-dark/80">
            Deskripsi
            <span className="ml-1 font-normal text-slate-dark/40">(Opsional)</span>
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white border border-slate-dark/20 rounded-lg p-4 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted resize-none h-24"
            placeholder="Masukkan syarat dan ketentuan..."
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-2">
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
