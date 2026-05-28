import { useDebounce } from '@shared/hooks/useDebounce';
import { ShoppingCart } from 'lucide-react';
import { type FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeranjang, useTambahItem } from '../keranjang/hooks/useKeranjang';
import CartMiniBar from './components/CartMiniBar';
import HeroBanner from './components/HeroBanner';
import KategoriTab from './components/KategoriTab';
import MenuCard from './components/MenuCard';
import PromoCarousel from './components/PromoCarousel';
import SearchBar from './components/SearchBar';
import { useMenuList } from './hooks/useMenuList';
import { usePromoList } from './hooks/usePromo';

const KatalogPage: FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchValue, setSearchValue] = useState<string>('');

  const debouncedSearch = useDebounce(searchValue, 300);

  // Queries
  const { data: menuList, isLoading: isMenuLoading } = useMenuList({
    category: selectedCategory === 'Semua' ? undefined : selectedCategory,
    search: debouncedSearch || undefined,
  });

  const { data: promos } = usePromoList();
  const { data: keranjang } = useKeranjang();

  // Mutations
  const { mutate: addToCart, isPending: isAddingToCart } = useTambahItem();

  // Extract unique categories for tabs
  const categories = useMemo(() => {
    // Usually backend should provide categories, but we derive it from menuList if not
    const baseCategories = ['Semua', 'Makanan', 'Minuman', 'Camilan', 'Dessert'];
    return baseCategories;
  }, []);

  const handleAddToCart = (menuId: string) => {
    addToCart({ menuId, quantity: 1 });
  };

  const cartItemCount = keranjang?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="relative w-full h-full bg-[#f5f5f5] min-h-[844px] overflow-x-hidden pb-[100px]">
      {/* TopBar */}
      <div className="absolute bg-[#303841] h-[64px] left-0 right-0 top-0 z-20 px-[20px] flex items-center justify-between">
        <h1 className="font-serif font-semibold text-[20px] text-white">Aroma Senja</h1>

        <div className="flex items-center gap-4">
          {/* Table Badge */}
          <div className="border border-[#76abae] rounded-full px-3 py-1 flex items-center justify-center bg-black/20">
            <span className="font-sans font-bold text-[12px] text-[#76abae]">Meja 7</span>
          </div>

          {/* Cart Icon */}
          <button
            type="button"
            className="relative"
            onClick={() => navigate('/customer/keranjang')}
          >
            <ShoppingCart className="text-white" size={24} />
            {cartItemCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#ff5722] text-white text-[10px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center">
                {cartItemCount}
              </div>
            )}
          </button>
        </div>
      </div>

      <HeroBanner />

      <SearchBar value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />

      <KategoriTab
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="absolute top-[360px] left-0 right-0 bottom-0 overflow-y-auto">
        <PromoCarousel promos={promos || []} />

        <div className="px-[20px] pb-[40px] flex flex-col gap-4">
          <h2 className="text-[18px] font-serif font-bold text-[#303841] mb-2">Menu Populer</h2>

          {isMenuLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-[12px] h-[102px] animate-pulse" />
              ))}
            </div>
          ) : menuList && menuList.length > 0 ? (
            <div className="flex flex-col gap-[15px]">
              {menuList.map((menu) => (
                <MenuCard
                  key={menu.menuId}
                  menu={menu}
                  onAddToCart={handleAddToCart}
                  isAddingToCart={isAddingToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <span className="font-sans text-[14px] text-[#5b4039]">
                Tidak ada menu yang ditemukan
              </span>
            </div>
          )}
        </div>
      </div>

      <CartMiniBar keranjang={keranjang} />
    </div>
  );
};

export default KatalogPage;
