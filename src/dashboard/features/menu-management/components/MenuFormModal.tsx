import { Button, Input, Modal } from '@shared/components/ui';
import type { CreateMenuRequest, MenuDetailResponse, MenuResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { ChevronDown, Plus, Upload, X } from 'lucide-react';
import { type ChangeEvent, type FC, useEffect, useState } from 'react';
import { uploadImage } from '../api/upload.api';
import { useCreateMenu, useUpdateMenu } from '../hooks/useMenuAdmin';

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MenuResponse | MenuDetailResponse | null;
  onDelete?: (menu: MenuResponse) => void;
}

const CATEGORIES = ['Makanan', 'Minuman', 'Dessert'];

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
  const [activeTab, setActiveTab] = useState<'dasar' | 'detail'>('dasar');

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createMenu, isPending: isCreating } = useCreateMenu();
  const { mutate: updateMenu, isPending: isUpdating } = useUpdateMenu();
  const isPending = isCreating || isUpdating || isUploading;

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
    setThumbnailFile(null);
    setHeroFile(null);
    setThumbnailPreview(null);
    setHeroPreview(null);
  }, [menu]);

  // Clean up previews
  useEffect(() => {
    return () => {
      if (thumbnailPreview && !thumbnailPreview.startsWith('http')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      if (heroPreview && !heroPreview.startsWith('http')) {
        URL.revokeObjectURL(heroPreview);
      }
    };
  }, [thumbnailPreview, heroPreview]);

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

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

  const handleSubmit = async () => {
    setIsUploading(true);
    let uploadedThumbnailUrl = form.imageUrl;
    let uploadedHeroUrl = form.heroImageUrl;

    try {
      if (thumbnailFile) {
        uploadedThumbnailUrl = await uploadImage(thumbnailFile);
      }
      if (heroFile) {
        uploadedHeroUrl = await uploadImage(heroFile);
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Gagal mengunggah gambar. Silakan coba lagi.');
      setIsUploading(false);
      return;
    }

    const payload: CreateMenuRequest = {
      ...form,
      price: Number(form.price),
      description: form.description || '',
      imageUrl: uploadedThumbnailUrl || null,
      heroImageUrl: uploadedHeroUrl || null,
      titleLine1: form.titleLine1 || null,
      titleLine2: form.titleLine2 || null,
      longDescription: form.longDescription || null,
      donenessOptions:
        form.donenessOptions && form.donenessOptions.length > 0 ? form.donenessOptions : null,
      spiceOptions: form.spiceOptions && form.spiceOptions.length > 0 ? form.spiceOptions : null,
      promoId: form.promoId || null,
    };

    const handleSuccess = () => {
      setIsUploading(false);
      onClose();
    };

    if (isEditing && menu) {
      updateMenu(
        { menuId: menu.menuId, request: payload },
        {
          onSuccess: handleSuccess,
          onError: () => setIsUploading(false),
        },
      );
    } else {
      createMenu(payload, {
        onSuccess: handleSuccess,
        onError: () => setIsUploading(false),
      });
    }
  };

  const TABS = [
    { id: 'dasar' as const, label: 'Info Umum' },
    { id: 'detail' as const, label: 'Detail Menu' },
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

            {/* Deskripsi */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="menu-description"
                className="text-[13px] font-semibold text-slate-dark"
              >
                Deskripsi
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

            {/* Gambar Thumbnail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-dark">Gambar Thumbnail</label>
              <div className="flex items-start gap-4">
                {(thumbnailPreview || form.imageUrl) && (
                  <div className="rounded-xl overflow-hidden w-24 h-24 shrink-0 border border-slate-dark/10 bg-slate-50 relative group">
                    <img
                      src={thumbnailPreview || form.imageUrl || ''}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnailFile(null);
                          setThumbnailPreview(null);
                          handleChange('imageUrl', null);
                        }}
                        className="text-white bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <label
                    htmlFor="menu-thumbnail-file"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-dark/20 rounded-xl cursor-pointer hover:border-teal-muted hover:bg-teal-muted/5 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 text-slate-dark/40 mb-2" />
                      <p className="text-xs text-slate-dark/60">
                        <span className="font-semibold text-teal-muted">Klik untuk unggah</span>
                      </p>
                    </div>
                    <input
                      id="menu-thumbnail-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* === TAB: Detail Menu === */}
        {activeTab === 'detail' && (
          <>
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
            {isUploading
              ? 'Mengunggah...'
              : isPending
                ? 'Menyimpan...'
                : isEditing
                  ? 'Simpan Perubahan'
                  : 'Tambah Menu'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
