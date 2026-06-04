import { Button, Input, Modal } from '@shared/components/ui';
import type { CreateMenuRequest, MenuDetailResponse, MenuResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { ChevronDown, Plus, X } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { useCreateMenu, useUpdateMenu } from '../hooks/useMenuAdmin';
import { usePromoList } from '../hooks/usePromoList';

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuResponse | MenuDetailResponse | null;
  onDelete?: (menu: MenuResponse) => void;
}

const CATEGORIES = ['Makanan', 'Minuman', 'Dessert', 'Paket Hemat'];

const EMPTY_FORM: CreateMenuRequest = {
  menuName: '',
  price: 0,
  description: '',
  category: 'Makanan',
  imageUrl: null,
  heroImageUrl: null,
  titleLine1: null,
  titleLine2: null,
  longDescription: null,
  showDoneness: false,
  donenessOptions: null,
  spiceOptions: null,
  promoId: null,
};

// Type guard for detail response
const isMenuDetail = (menu: MenuResponse | MenuDetailResponse): menu is MenuDetailResponse => {
  return 'heroImageUrl' in menu;
};

export const MenuFormModal: FC<MenuFormModalProps> = ({ isOpen, onClose, menu, onDelete }) => {
  const isEditing = menu !== null;
  const [form, setForm] = useState<CreateMenuRequest>(EMPTY_FORM);
  const [donenessInput, setDonenessInput] = useState('');
  const [spiceInput, setSpiceInput] = useState('');
  const [activeTab, setActiveTab] = useState<'dasar' | 'detail' | 'promo'>('dasar');

  const { mutate: createMenu, isPending: isCreating } = useCreateMenu();
  const { mutate: updateMenu, isPending: isUpdating } = useUpdateMenu();
  const { data: promos } = usePromoList();
  const isPending = isCreating || isUpdating;

  // Populate form when editing
  useEffect(() => {
    if (menu) {
      const base: CreateMenuRequest = {
        menuName: menu.menuName,
        price: menu.price,
        description: menu.description ?? '',
        category: menu.category,
        imageUrl: menu.imageUrl ?? null,
        heroImageUrl: isMenuDetail(menu) ? (menu.heroImageUrl ?? null) : null,
        titleLine1: isMenuDetail(menu) ? (menu.titleLine1 ?? null) : null,
        titleLine2: isMenuDetail(menu) ? (menu.titleLine2 ?? null) : null,
        longDescription: isMenuDetail(menu) ? (menu.longDescription ?? null) : null,
        showDoneness: isMenuDetail(menu) ? (menu.showDoneness ?? false) : false,
        donenessOptions: isMenuDetail(menu) ? (menu.donenessOptions ?? null) : null,
        spiceOptions: isMenuDetail(menu) ? (menu.spiceOptions ?? null) : null,
        promoId: menu.promo?.promoId ?? null,
      };
      setForm(base);
    } else {
      setForm(EMPTY_FORM);
    }
    setActiveTab('dasar');
    setDonenessInput('');
    setSpiceInput('');
  }, [menu]);

  const handleChange = (field: keyof CreateMenuRequest, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addDoneness = () => {
    const trimmed = donenessInput.trim();
    if (!trimmed) return;
    const current = form.donenessOptions ?? [];
    if (!current.includes(trimmed)) {
      handleChange('donenessOptions', [...current, trimmed]);
    }
    setDonenessInput('');
  };

  const removeDoneness = (val: string) => {
    const current = form.donenessOptions ?? [];
    handleChange(
      'donenessOptions',
      current.filter((v) => v !== val),
    );
  };

  const addSpice = () => {
    const trimmed = spiceInput.trim();
    if (!trimmed) return;
    const current = form.spiceOptions ?? [];
    if (!current.includes(trimmed)) {
      handleChange('spiceOptions', [...current, trimmed]);
    }
    setSpiceInput('');
  };

  const removeSpice = (val: string) => {
    const current = form.spiceOptions ?? [];
    handleChange(
      'spiceOptions',
      current.filter((v) => v !== val),
    );
  };

  const handleSubmit = () => {
    const payload: CreateMenuRequest = {
      ...form,
      price: Number(form.price),
      description: form.description || '',
      imageUrl: form.imageUrl || null,
      heroImageUrl: form.heroImageUrl || null,
      titleLine1: form.titleLine1 || null,
      titleLine2: form.titleLine2 || null,
      longDescription: form.longDescription || null,
      donenessOptions:
        form.donenessOptions && form.donenessOptions.length > 0 ? form.donenessOptions : null,
      spiceOptions: form.spiceOptions && form.spiceOptions.length > 0 ? form.spiceOptions : null,
      promoId: form.promoId || null,
    };

    if (isEditing && menu) {
      updateMenu(
        { menuId: menu.menuId, request: payload },
        {
          onSuccess: () => onClose(),
        },
      );
    } else {
      createMenu(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  const TABS = [
    { id: 'dasar' as const, label: 'Info Dasar' },
    { id: 'detail' as const, label: 'Detail Tampilan' },
    { id: 'promo' as const, label: 'Promo' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Item Menu' : 'Tambah Item Menu Baru'}
      maxWidth="lg"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-dark/10 mb-6 -mt-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-[14px] font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-deep-orange text-deep-orange'
                : 'border-transparent text-slate-dark/60 hover:text-slate-dark',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {/* === TAB: Info Dasar === */}
        {activeTab === 'dasar' && (
          <>
            {/* Nama Menu */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="menu-name" className="text-[13px] font-semibold text-slate-dark">
                Nama Menu <span className="text-deep-orange">*</span>
              </label>
              <Input
                id="menu-name"
                placeholder="Contoh: Nasi Goreng Spesial"
                value={form.menuName}
                onChange={(e) => handleChange('menuName', e.target.value)}
              />
            </div>

            {/* Harga */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="menu-price" className="text-[13px] font-semibold text-slate-dark">
                Harga (Rp) <span className="text-deep-orange">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-slate-dark/60 font-medium">
                  Rp
                </span>
                <Input
                  id="menu-price"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.price === 0 ? '' : form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Kategori */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="menu-category" className="text-[13px] font-semibold text-slate-dark">
                Kategori <span className="text-deep-orange">*</span>
              </label>
              <div className="relative">
                <select
                  id="menu-category"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full min-h-[48px] bg-white border border-slate-dark/20 rounded-lg px-4 pr-10 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted appearance-none transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-dark/40 pointer-events-none"
                />
              </div>
            </div>

            {/* Deskripsi Singkat */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="menu-description"
                className="text-[13px] font-semibold text-slate-dark"
              >
                Deskripsi Singkat
              </label>
              <textarea
                id="menu-description"
                placeholder="Deskripsi singkat yang muncul di kartu menu..."
                value={form.description ?? ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full bg-white border border-slate-dark/20 rounded-lg px-4 py-3 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted placeholder:text-slate-dark/40 resize-none transition-colors"
              />
            </div>

            {/* URL Gambar Thumbnail */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="menu-image-url" className="text-[13px] font-semibold text-slate-dark">
                URL Gambar Thumbnail
              </label>
              <Input
                id="menu-image-url"
                placeholder="https://example.com/gambar.jpg"
                value={form.imageUrl ?? ''}
                onChange={(e) => handleChange('imageUrl', e.target.value || null)}
              />
              {form.imageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden w-24 h-24 border border-slate-dark/10 bg-slate-50">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* === TAB: Detail Tampilan === */}
        {activeTab === 'detail' && (
          <>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="menu-title-line1"
                className="text-[13px] font-semibold text-slate-dark"
              >
                Judul Baris 1 (Hero)
              </label>
              <Input
                id="menu-title-line1"
                placeholder="Contoh: Nasi Goreng"
                value={form.titleLine1 ?? ''}
                onChange={(e) => handleChange('titleLine1', e.target.value || null)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="menu-title-line2"
                className="text-[13px] font-semibold text-slate-dark"
              >
                Judul Baris 2 (Hero)
              </label>
              <Input
                id="menu-title-line2"
                placeholder="Contoh: Spesial"
                value={form.titleLine2 ?? ''}
                onChange={(e) => handleChange('titleLine2', e.target.value || null)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="menu-hero-image-url"
                className="text-[13px] font-semibold text-slate-dark"
              >
                URL Gambar Hero (Detail Page)
              </label>
              <Input
                id="menu-hero-image-url"
                placeholder="https://example.com/hero.jpg"
                value={form.heroImageUrl ?? ''}
                onChange={(e) => handleChange('heroImageUrl', e.target.value || null)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="menu-long-description"
                className="text-[13px] font-semibold text-slate-dark"
              >
                Deskripsi Panjang (Detail Page)
              </label>
              <textarea
                id="menu-long-description"
                placeholder="Deskripsi lengkap yang muncul di halaman detail menu..."
                value={form.longDescription ?? ''}
                onChange={(e) => handleChange('longDescription', e.target.value || null)}
                rows={4}
                className="w-full bg-white border border-slate-dark/20 rounded-lg px-4 py-3 text-[14px] text-slate-dark focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted placeholder:text-slate-dark/40 resize-none transition-colors"
              />
            </div>

            {/* Doneness Options */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-dark">
                  Opsi Kematangan (Doneness)
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.showDoneness ?? false}
                    onChange={(e) => handleChange('showDoneness', e.target.checked)}
                    className="w-4 h-4 accent-teal-muted"
                  />
                  <span className="text-[12px] text-slate-dark/70">Tampilkan di detail</span>
                </label>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Contoh: Medium, Well Done..."
                  value={donenessInput}
                  onChange={(e) => setDonenessInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addDoneness();
                    }
                  }}
                  className="flex-1 min-h-[40px]"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addDoneness}
                  className="h-[40px] px-3"
                >
                  <Plus size={16} />
                </Button>
              </div>
              {form.donenessOptions && form.donenessOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.donenessOptions.map((opt) => (
                    <span
                      key={opt}
                      className="flex items-center gap-1.5 bg-slate-100 text-slate-dark text-[12px] px-3 py-1.5 rounded-full"
                    >
                      {opt}
                      <button
                        type="button"
                        onClick={() => removeDoneness(opt)}
                        className="text-slate-dark/50 hover:text-deep-orange transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Spice Options */}
            <div className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold text-slate-dark">
                Opsi Tingkat Kepedasan
              </span>
              <div className="flex gap-2">
                <Input
                  placeholder="Contoh: Tidak Pedas, Pedas, Sangat Pedas..."
                  value={spiceInput}
                  onChange={(e) => setSpiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpice();
                    }
                  }}
                  className="flex-1 min-h-[40px]"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addSpice}
                  className="h-[40px] px-3"
                >
                  <Plus size={16} />
                </Button>
              </div>
              {form.spiceOptions && form.spiceOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.spiceOptions.map((opt) => (
                    <span
                      key={opt}
                      className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[12px] px-3 py-1.5 rounded-full border border-amber-200"
                    >
                      🌶️ {opt}
                      <button
                        type="button"
                        onClick={() => removeSpice(opt)}
                        className="text-amber-600/60 hover:text-deep-orange transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* === TAB: Promo === */}
        {activeTab === 'promo' && (
          <div className="flex flex-col gap-4">
            <p className="text-[13px] text-slate-dark/60">
              Pilih promo yang akan diterapkan pada menu ini. Harga efektif akan dihitung secara
              otomatis berdasarkan tipe dan nilai diskon.
            </p>

            {/* No promo option */}
            <label
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors',
                !form.promoId
                  ? 'border-teal-muted bg-teal-muted/5'
                  : 'border-slate-dark/10 hover:border-slate-dark/20',
              )}
            >
              <input
                type="radio"
                name="promo-select"
                checked={!form.promoId}
                onChange={() => handleChange('promoId', null)}
                className="accent-teal-muted"
              />
              <div>
                <p className="text-[14px] font-semibold text-slate-dark">Tanpa Promo</p>
                <p className="text-[12px] text-slate-dark/50">Harga normal berlaku</p>
              </div>
            </label>

            {/* Promo list */}
            {promos && promos.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                {promos
                  .filter((p) => p.isActive)
                  .map((promo) => (
                    <label
                      key={promo.promoId}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors',
                        form.promoId === promo.promoId
                          ? 'border-deep-orange bg-deep-orange/5'
                          : 'border-slate-dark/10 hover:border-slate-dark/20',
                      )}
                    >
                      <input
                        type="radio"
                        name="promo-select"
                        checked={form.promoId === promo.promoId}
                        onChange={() => handleChange('promoId', promo.promoId)}
                        className="accent-deep-orange mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[14px] font-semibold text-slate-dark truncate">
                            {promo.namaPromo}
                          </p>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-deep-orange/10 text-deep-orange shrink-0">
                            {promo.tipeDiskon === 'PERSEN'
                              ? `${promo.nilaiDiskon}%`
                              : `Rp ${promo.nilaiDiskon.toLocaleString('id-ID')}`}
                          </span>
                        </div>
                        {promo.description && (
                          <p className="text-[12px] text-slate-dark/50 mt-0.5 line-clamp-1">
                            {promo.description}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-dark/40 text-[14px]">
                Tidak ada promo aktif yang tersedia.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-8 pt-5 border-t border-slate-dark/10">
        <div>
          {isEditing && menu && onDelete && (
            <Button
              type="button"
              variant="danger"
              className="bg-transparent text-deep-orange border border-deep-orange/30 hover:bg-deep-orange/10"
              onClick={() => {
                onClose();
                onDelete(menu as MenuResponse);
              }}
              disabled={isPending}
            >
              Hapus Item
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button
            id="submit-menu-form"
            onClick={handleSubmit}
            disabled={isPending || !form.menuName || !form.price || !form.category}
          >
            {isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Tambah Menu'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
