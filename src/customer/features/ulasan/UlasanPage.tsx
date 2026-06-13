import { apiClient } from '@shared/lib/axios';
import type { PesananResponse } from '@shared/types/pesanan.types';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
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

  // itemRatings is a map from menuId to rating
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    if (pesanan?.detailPesanan) {
      const initialRatings: Record<string, number> = {};
      pesanan.detailPesanan.forEach((item) => {
        if (!initialRatings[item.menuId]) {
          initialRatings[item.menuId] = 0;
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
      isPublic: true,
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

  const ratingLabel = ['', 'Kurang Memuaskan', 'Cukup Baik', 'Lumayan', 'Memuaskan', 'Luar Biasa!'];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f5f5f5] pb-10">
      {/* Top App Bar */}
      <header className="h-[64px] bg-[#f9f9f9] border-b border-[#e4beb4] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center px-[20px] sticky top-0 z-50">
        <div className="flex items-center gap-[10px]">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center text-[#b02f00] active:opacity-70"
            aria-label="Kembali"
          >
            <ChevronLeft className="w-[20px] h-[20px]" />
          </button>
          <h1 className="font-serif font-bold text-[20px] text-[#b02f00] leading-[28px]">
            Aroma Senja
          </h1>
        </div>
      </header>

      <div className="flex flex-col gap-5 w-full px-5 pt-6">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <div className="w-[72px] h-[72px] rounded-full bg-[#303841] flex items-center justify-center shadow-[0_8px_20px_rgba(48,56,65,0.25)] mb-1">
            <span className="text-[32px]">🍲</span>
          </div>
          <h2 className="font-serif font-bold text-[22px] text-[#303841] text-center leading-tight">
            Bagaimana pengalaman
            <br />
            makanmu hari ini?
          </h2>
          <p className="font-sans text-[14px] text-[#5b4039]/70 text-center leading-snug">
            Kehadiranmu di Aroma Senja sangat berarti bagi kami.
          </p>
        </div>

        {/* Overall Rating Card */}
        <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(48,56,65,0.08)] border border-[#e4beb4]/40 p-6 flex flex-col items-center gap-3">
          <StarRating value={ratingOverall} onChange={setRatingOverall} size="lg" />
          <p
            className={`font-serif text-[16px] transition-colors ${ratingOverall > 0 ? 'text-[#b02f00] font-bold' : 'text-[#303841]/40'}`}
          >
            {ratingOverall === 0 ? 'Pilih Rating' : ratingLabel[ratingOverall]}
          </p>
        </div>

        {/* Item Ratings Section */}
        {pesanan.detailPesanan.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-sans font-bold text-[11px] text-[#303841]/50 tracking-[1.2px] uppercase px-1">
              Rating Menu
            </h3>
            <div className="flex flex-col gap-3 w-full">
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
        )}

        {/* Text Review Section */}
        <div className="flex flex-col gap-2">
          <h3 className="font-sans font-bold text-[11px] text-[#303841]/50 tracking-[1.2px] uppercase px-1">
            Ceritakan Pengalamanmu
          </h3>
          <div className="relative w-full">
            <textarea
              value={ulasanOverall}
              onChange={(e) => setUlasanOverall(e.target.value)}
              placeholder="Makanan enak, pelayanan cepat..."
              maxLength={300}
              rows={4}
              className="w-full bg-white border border-[#e4beb4]/60 rounded-[14px] px-4 pt-4 pb-8 font-sans text-[15px] text-[#303841] placeholder:text-[#303841]/30 resize-none focus:outline-none focus:border-[#76ABAE] focus:ring-1 focus:ring-[#76ABAE] shadow-[0_1px_4px_rgba(48,56,65,0.06)] transition-colors"
            />
            <p className="absolute bottom-3 right-4 font-sans text-[11px] text-[#303841]/40 tracking-wide">
              {ulasanOverall.length}/300
            </p>
          </div>
        </div>

        {/* Error Message */}
        {submitMutation.isError && (
          <div className="text-red-500 text-[13px] font-sans bg-red-50 px-4 py-3 rounded-[12px] border border-red-100">
            {submitMutation.error?.response?.data?.message ||
              submitMutation.error?.message ||
              'Gagal mengirim ulasan.'}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={ratingOverall === 0 || submitMutation.isPending}
          className="w-full bg-[#FF5722] text-white font-sans font-bold text-[16px] h-[54px] rounded-[14px] shadow-[0_4px_12px_rgba(255,87,34,0.3)] disabled:bg-[#303841]/20 disabled:shadow-none active:scale-[0.98] transition-all flex justify-center items-center"
        >
          {submitMutation.isPending ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mengirim...
            </span>
          ) : (
            'Kirim Ulasan'
          )}
        </button>
      </div>
    </div>
  );
};

export default UlasanPage;
