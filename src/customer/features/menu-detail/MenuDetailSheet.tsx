import { useTambahItem } from '@customer/features/keranjang/hooks/useKeranjang';
import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { Star, X } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import OptionChipGroup from './components/OptionChipGroup';
import PairingSuggestion from './components/PairingSuggestion';
import QuantityStepper from './components/QuantityStepper';
import { useMenuDetail, useMenuPairings } from './hooks/useMenuDetail';

interface MenuDetailSheetProps {
  menuId: string | null;
  open: boolean;
  onClose: () => void;
}

const MenuDetailSheet: FC<MenuDetailSheetProps> = ({ menuId, open, onClose }) => {
  const { data: menu, isLoading } = useMenuDetail(menuId);
  const { data: pairings } = useMenuPairings(menuId);
  const { mutate: addToCart, isPending: isAddingToCart } = useTambahItem();

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState<string | null>(null);
  const [selectedDoneness, setSelectedDoneness] = useState<string | null>(null);
  const [catatan, setCatatan] = useState('');
  const [showSpiceError, setShowSpiceError] = useState(false);

  // Reset state when opening a new menu
  useEffect(() => {
    if (open) {
      setQuantity(1);
      setSelectedSpice(null);
      setSelectedDoneness(null);
      setCatatan('');
      setShowSpiceError(false);
    }
  }, [open, menuId]);

  // Remove error when user selects a spice level
  useEffect(() => {
    if (selectedSpice) {
      setShowSpiceError(false);
    }
  }, [selectedSpice]);

  if (!menuId || isLoading) return null;

  // Validation logic
  const hasSpiceOptions = menu?.spiceOptions && menu.spiceOptions.length > 0;
  const hasDonenessOptions =
    menu?.showDoneness && menu.donenessOptions && menu.donenessOptions.length > 0;

  const isSpiceSelected = selectedSpice !== null;
  const isFormValid = !hasSpiceOptions || isSpiceSelected;

  const handleAddToCart = () => {
    if (!menu) return;

    if (!isFormValid) {
      setShowSpiceError(true);
      return;
    }

    // Gabungkan opsi dan catatan
    const notes = [
      selectedSpice && `Kepedasan: ${selectedSpice}`,
      selectedDoneness && `Kematangan: ${selectedDoneness}`,
      catatan,
    ]
      .filter(Boolean)
      .join(' | ');

    addToCart(
      {
        menuId: menu.menuId,
        quantity,
        // Asumsi API addToCart menerima parameter 'catatan'
        // Jika tidak, Anda perlu menyesuaikannya
        catatan: notes ? notes : undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleAddPairing = (pairingMenuId: string) => {
    addToCart({ menuId: pairingMenuId, quantity: 1 });
  };

  const totalPrice = (menu?.price || 0) * quantity;

  return (
    <Drawer.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-[rgba(48,56,65,0.5)] z-[60]" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col items-center outline-none">
          <div className="bg-[#f5f5f5] w-full max-w-[390px] h-[85vh] rounded-t-[20px] shadow-[0px_-10px_40px_0px_rgba(0,0,0,0.1)] flex flex-col relative overflow-hidden">
            {/* Handle Bar */}
            <div className="w-full flex justify-center pt-[12px] pb-[8px] absolute top-0 left-0 right-0 z-20">
              <div className="w-[48px] h-[6px] bg-[rgba(91,64,57,0.2)] rounded-full" />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-[16px] right-[20px] w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center z-20 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
            >
              <X size={20} className="text-slate-dark" />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto w-full no-scrollbar">
              {/* Hero Image Section */}
              <div className="w-full h-[220px] bg-[#e2e2e2] relative">
                {menu?.heroImageUrl || menu?.imageUrl ? (
                  <img
                    src={menu.heroImageUrl || menu.imageUrl!}
                    alt={menu?.menuName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-dark/30">
                    No Image
                  </div>
                )}
              </div>

              {/* Info Header */}
              <div className="px-[20px] pt-[24px] pb-[8px] flex flex-col gap-[8px]">
                <div className="flex justify-between items-start w-full">
                  <h1 className="font-serif font-bold text-[#1a1c1c] text-[24px] leading-[32px]">
                    {menu?.menuName}
                  </h1>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-[4px] px-[9px] py-[5px] bg-white border border-[rgba(228,190,180,0.3)] rounded-[8px]">
                    <Star size={13} fill="#FFD700" color="#FFD700" />
                    <span className="font-sans font-bold text-[#1a1c1c] text-[12px] leading-[16px] tracking-[0.6px]">
                      {menu?.averageRating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-[12px] w-full">
                  {/* Category Pill */}
                  <div className="bg-teal-muted/20 border border-teal-muted/30 px-[13px] py-[5px] rounded-full">
                    <span className="font-sans font-bold text-teal-muted text-[12px] leading-[16px] tracking-[0.6px]">
                      {menu?.category}
                    </span>
                  </div>

                  {/* Price */}
                  <span className="font-sans font-semibold text-deep-orange text-[18px] leading-[24px]">
                    {formatRupiah(menu?.price || 0)}
                  </span>
                </div>

                {/* Description */}
                <div className="pt-[3px] w-full">
                  <p className="font-sans font-normal text-[14px] leading-[22.75px] text-[rgba(91,64,57,0.8)] whitespace-pre-wrap">
                    {menu?.longDescription || menu?.description}
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-[rgba(228,190,180,0.1)] my-[16px] mx-[20px] max-w-[calc(100%-40px)]" />

              <div className="flex flex-col gap-[24px] pb-[24px]">
                {/* Tingkat Kepedasan (Mandatory if exists) */}
                {hasSpiceOptions && (
                  <OptionChipGroup
                    label="Tingkat Kepedasan"
                    emoji="🌶️"
                    options={menu.spiceOptions!}
                    selected={selectedSpice}
                    onSelect={setSelectedSpice}
                    required={true}
                    hasError={showSpiceError}
                    variant="spice"
                  />
                )}

                {/* Tingkat Kematangan (Optional if exists) */}
                {hasDonenessOptions && (
                  <OptionChipGroup
                    label="Tingkat Kematangan"
                    emoji="🍳"
                    options={menu.donenessOptions!}
                    selected={selectedDoneness}
                    onSelect={setSelectedDoneness}
                    required={false}
                    variant="doneness"
                  />
                )}

                {/* Catatan Khusus */}
                <div className="flex flex-col gap-[16px] px-[20px] w-full">
                  <label
                    htmlFor="catatan-khusus"
                    className="font-serif font-semibold text-[#1a1c1c] text-[18px] leading-[28px]"
                  >
                    Catatan Khusus (opsional)
                  </label>
                  <textarea
                    id="catatan-khusus"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Tanpa bawang goreng, kecap dipisah..."
                    className="w-full min-h-[96px] bg-white border border-slate-dark/20 rounded-lg p-4 font-sans font-normal text-[14px] leading-[22px] text-slate-dark placeholder:text-slate-dark/40 resize-none focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted"
                  />
                </div>

                {/* Sering Dipesan Bersama */}
                {pairings && pairings.length > 0 && (
                  <PairingSuggestion pairings={pairings} onAdd={handleAddPairing} />
                )}
              </div>
            </div>

            {/* Sticky Footer CTA */}
            <div className="bg-white border-t border-[rgba(228,190,180,0.2)] px-[20px] pt-[25px] pb-[24px] w-full flex items-center gap-[16px] shadow-[0px_-5px_20px_-12px_rgba(0,0,0,0.15)] z-20 shrink-0">
              <QuantityStepper
                quantity={quantity}
                onIncrease={() => setQuantity((q) => Math.min(99, q + 1))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              />

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart || (showSpiceError && !isFormValid)}
                className={cn(
                  'flex-1 h-[52px] rounded-xl flex items-center justify-center transition-transform active:scale-[0.98]',
                  !isFormValid
                    ? 'bg-slate-dark/30 text-slate-dark/60 cursor-not-allowed'
                    : 'bg-deep-orange text-white shadow-[0_4px_12px_rgba(255,87,34,0.3)]',
                )}
              >
                <div className="font-sans font-semibold text-[14px] leading-[18px] text-center flex flex-col items-center justify-center">
                  {!isFormValid ? (
                    <>
                      <span>Pilih tingkat</span>
                      <span>kepedasan dulu</span>
                    </>
                  ) : (
                    <>
                      <span>{isAddingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}</span>
                      {!isAddingToCart && <span>— {formatRupiah(totalPrice)}</span>}
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MenuDetailSheet;
