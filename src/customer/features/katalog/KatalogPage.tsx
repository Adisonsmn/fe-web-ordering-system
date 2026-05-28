import { formatRupiah } from '@shared/utils/currency';
import { type FC, useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
}

const SAMPLE_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Kopi Susu Gula Aren',
    price: 22000,
    category: 'Minuman',
    description: 'Espresso premium dicampur susu segar dan sirup gula aren pilihan aromatis.',
  },
  {
    id: '2',
    name: 'Nasi Goreng Aroma Senja',
    price: 38000,
    category: 'Makanan',
    description: 'Nasi goreng bumbu rempah khas Aroma Senja disajikan dengan telur dan ayam suwir.',
  },
  {
    id: '3',
    name: 'Croissant Butter',
    price: 25000,
    category: 'Cemilan',
    description: 'Pastry renyah dengan rasa mentega premium panggang segar setiap hari.',
  },
];

const KatalogPage: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const filteredMenu =
    selectedCategory === 'Semua'
      ? SAMPLE_MENU
      : SAMPLE_MENU.filter((item) => item.category === selectedCategory);

  return (
    <div className="flex flex-col gap-6">
      {/* Brand Banner */}
      <div className="bg-slate-dark text-white p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-lg">
        <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-teal-muted/20 rounded-full blur-xl" />
        <span className="text-[12px] bg-deep-orange/20 text-deep-orange self-start px-3 py-1 rounded-full font-semibold">
          Restoran Buka
        </span>
        <h1 className="text-[26px] font-serif font-bold tracking-wide mt-2">Selamat Datang</h1>
        <p className="text-[14px] text-white/70">
          Nikmati hidangan lezat dan kopi aromatik terbaik langsung dari meja Anda.
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['Semua', 'Makanan', 'Minuman', 'Cemilan'].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-teal-muted text-white shadow-sm'
                : 'bg-white border border-slate-dark/10 text-slate-dark/70 hover:bg-slate-dark/5'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="flex flex-col gap-4">
        <h2 className="text-[18px] font-serif font-semibold text-slate-dark px-1">Katalog Menu</h2>
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4 flex flex-col gap-2 border border-slate-dark/5 transition-transform active:scale-[0.99]"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[11px] font-semibold text-teal-muted tracking-wider uppercase">
                  {item.category}
                </span>
                <h3 className="text-[15px] font-semibold text-slate-dark mt-0.5">{item.name}</h3>
              </div>
              <span className="text-[15px] font-bold text-deep-orange">
                {formatRupiah(item.price)}
              </span>
            </div>
            <p className="text-[13px] text-slate-dark/60 leading-relaxed">{item.description}</p>
            <button
              type="button"
              className="self-end mt-2 px-4 py-1.5 bg-deep-orange text-white text-[12px] font-semibold rounded-lg hover:bg-deep-orange/90 active:scale-95 transition-all"
            >
              Tambah ke Keranjang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KatalogPage;
