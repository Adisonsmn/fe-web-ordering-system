import type { FC } from 'react';

/** Pool foto makanan untuk dipilih secara random setiap sesi */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80', // food spread top view
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=700&q=80', // burger & fries
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80', // plated restaurant food
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80', // food variety
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=80', // overhead food photo
];

// Pilih satu foto secara acak saat module dimuat (tidak berubah per render)
const heroImage = HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)];

const HeroBanner: FC = () => {
  return (
    <div className="absolute left-0 right-0 top-[64px] h-[220px] overflow-hidden">
      {/* Food photo */}
      <img
        src={heroImage}
        alt="Hero banner makanan"
        className="w-full h-full object-cover object-center"
        loading="eager"
      />

      {/* Dark gradient overlay — lebih pekat di bawah agar teks terbaca */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#303841]/90 via-[#303841]/30 to-transparent" />

      {/* Text overlay di bagian bawah kiri */}
      <div className="absolute bottom-0 left-0 right-0 px-[20px] pb-[44px] flex flex-col gap-[2px]">
        <p className="font-sans font-normal text-[14px] text-white/80 leading-[22px]">
          Selamat datang, selamat menikmati!
        </p>
        <p className="font-serif font-bold text-[24px] text-white leading-[32px]">
          Pilih menu favoritmu
        </p>
      </div>
    </div>
  );
};

export default HeroBanner;
