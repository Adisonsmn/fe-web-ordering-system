import { apiClient } from '@shared/lib/axios';
import type { PesananResponse } from '@shared/types/pesanan.types';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Search, Globe } from 'lucide-react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RatingPerItem from './components/RatingPerItem';
import StarRating from './components/StarRating';
import { useSubmitUlasan } from './hooks/useSubmitUlasan';

const getPesananDetail = async (id: string): Promise<PesananResponse> => {
  const data = await apiClient.get<unknown, PesananResponse>(`/pesanan/${id}`);
  return data;
};

const UlasanPage: FC = () => {
  const { pesananId } = useParams<{ pesananId: string }>();
  const navigate = useNavigate();

  const {
    data: pesanan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['pesanan', pesananId],
    queryFn: () => getPesananDetail(pesananId || ''),
    enabled: !!pesananId,
  });

  const submitMutation = useSubmitUlasan();

  const [ratingOverall, setRatingOverall] = useState<number>(0);
  const [ulasanOverall, setUlasanOverall] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // itemRatings is a map from menuId to rating
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    if (pesanan?.detailPesanan) {
      const initialRatings: Record<string, number> = {};
      pesanan.detailPesanan.forEach((item) => {
        if (!initialRatings[item.menuId]) {
          initialRatings[item.menuId] = 0; // 0 means not rated yet
        }
      });
      setItemRatings(initialRatings);
    }
  }, [pesanan]);

  const handleItemRatingChange = (menuId: string, rating: number) => {
    setItemRatings((prev) => ({
      ...prev,
      [menuId]: rating,
    }));
  };

  const handleSubmit = () => {
    if (!pesananId) return;

    // Only submit items that have been rated (rating > 0)
    const items = Object.entries(itemRatings)
      .filter(([_, rating]) => rating > 0)
      .map(([menuId, rating]) => ({
        menuId,
        bintang: rating,
      }));

    submitMutation.mutate({
      pesananId,
      ratingOverall,
      ulasanOverall: ulasanOverall.trim() || undefined,
      isPublic,
      items,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-muted border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !pesanan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <p className="text-slate-dark text-lg font-medium mb-2">Gagal memuat data pesanan.</p>
        <button
          className="bg-transparent border-2 border-slate-dark text-slate-dark px-6 py-2 rounded-xl font-semibold mt-4"
          onClick={() => navigate('/customer/katalog')}
        >
          Kembali ke Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top App Bar — sesuai Figma Frame 16: bg #f9f9f9, border #e4beb4 */}
      <div className="h-[64px] bg-[#f9f9f9] border-b border-[#e4beb4] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-between px-[20px]">
        {/* Kiri: Back button */}
        <button
          onClick={() => navigate(-1)}
          className="w-[16px] h-[16px] flex items-center justify-center text-[#b02f00] active:opacity-70"
          aria-label="Kembali"
        >
          <ChevronLeft size={16} />
        </button>
        {/* Tengah: Brand */}
        <h1 className="font-serif font-bold text-[20px] text-[#b02f00] leading-[28px]">Aroma Senja</h1>
        {/* Kanan: Search icon */}
        <button aria-label="Cari" className="w-[18px] h-[18px] flex items-center justify-center text-[#b02f00] active:opacity-70">
          <Search size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-6 w-full px-5 pt-6">
        {/* Hero Rating Section */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#3f4851] flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] mb-2">
            <span className="text-3xl">🍲</span>
          </div>
          <h2 className="font-sans font-bold text-[20px] text-slate-dark text-center leading-tight">
            Bagaimana pengalaman makanmu
            <br />
            hari ini?
          </h2>
          <p className="font-sans text-[16px] text-slate-dark/80 text-center leading-tight mt-1">
            Kehadiranmu di Aroma Senja sangat berarti
            <br />
            bagi kami.
          </p>
        </div>

        {/* Overall Rating Card */}
        <div className="bg-white rounded-xl shadow-[0_4px_10px_rgba(48,56,65,0.08)] border border-slate-dark/10 p-6 flex flex-col items-center">
          <div className="mb-4">
            <StarRating value={ratingOverall} onChange={setRatingOverall} size="lg" />
          </div>
          <p className="font-serif text-[16px] text-slate-dark">
            {ratingOverall === 0 ? 'Pilih Rating' : `Kamu memberi ${ratingOverall} Bintang`}
          </p>
        </div>

        {/* Item Ratings Section */}
        <div className="flex flex-col gap-4">
          <h3 className="font-sans font-bold text-[12px] text-slate-dark/60 tracking-wider uppercase">
            Rating Menu
          </h3>
          <div className="flex flex-col gap-4 w-full">
            {pesanan.detailPesanan.map((item) => (
              <RatingPerItem
                key={item.detailPesananId}
                menuId={item.menuId}
                menuName={item.menuName}
                price={item.hargaSetelahDiskon}
                imageUrl={item.imageUrl}
                rating={itemRatings[item.menuId] || 0}
                onChangeRating={handleItemRatingChange}
              />
            ))}
          </div>
        </div>

        {/* Text Review Section */}
        <div className="flex flex-col gap-2">
          <h3 className="font-sans font-bold text-[12px] text-slate-dark/60 tracking-wider uppercase">
            Ceritakan Pengalamanmu
          </h3>
          <div className="relative w-full">
            <textarea
              value={ulasanOverall}
              onChange={(e) => setUlasanOverall(e.target.value)}
              placeholder="Makanan enak, pelayanan cepat..."
              maxLength={300}
              className="w-full h-32 bg-white border border-deep-orange/20 rounded-xl p-4 font-sans text-[16px] text-slate-dark placeholder:text-slate-dark/40 resize-none focus:outline-none focus:border-deep-orange focus:ring-1 focus:ring-deep-orange"
            />
            <p className="absolute bottom-3 right-3 font-sans font-bold text-[12px] text-slate-dark/60 tracking-wider">
              {ulasanOverall.length}/300
            </p>
          </div>
        </div>

        {/* Toggle Section */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-dark/60" />
            <p className="font-sans text-[16px] text-slate-dark">Tampilkan ulasan secara publik</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPublic(!isPublic)}
            className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${
              isPublic ? 'bg-[#659a9d]' : 'bg-slate-dark/20'
            }`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                isPublic ? 'transform translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        {/* Error Message */}
        {submitMutation.isError && (
          <div className="text-red-500 text-[14px] font-sans bg-red-50 p-3 rounded-xl border border-red-100 animate-fade-in -mt-2">
            {submitMutation.error?.response?.data?.message || submitMutation.error?.message || 'Gagal mengirim ulasan.'}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={ratingOverall === 0 || submitMutation.isPending}
          className="w-full bg-deep-orange text-white font-sans font-bold text-[16px] h-[56px] rounded-xl shadow-[0_4px_6px_rgba(255,87,34,0.3)] disabled:bg-slate-dark/30 disabled:shadow-none active:scale-[0.98] transition-transform flex justify-center items-center mt-2"
        >
          {submitMutation.isPending ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </div>
    </div>
  );
};

export default UlasanPage;
