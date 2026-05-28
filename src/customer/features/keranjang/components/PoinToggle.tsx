import { useAuthStore } from '@shared/stores/authStore';
import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { Star } from 'lucide-react';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useKalkulasiPoin, usePoinBalance } from '../../poin/hooks/usePoin';
import { useKeranjangStore } from '../store/keranjangStore';

interface PoinToggleProps {
  subtotal: number;
}

const PoinToggle: FC<PoinToggleProps> = ({ subtotal }) => {
  const { data: balanceData, isLoading: isLoadingBalance } = usePoinBalance();
  const {
    mutate: hitungKalkulasi,
    data: kalkulasiData,
    isPending: isCalculating,
  } = useKalkulasiPoin();

  const { gunakanPoin, setGunakanPoin, setPoinDigunakan } = useKeranjangStore();
  const isGuest = useAuthStore((state) => state.isGuest);

  useEffect(() => {
    if (gunakanPoin && balanceData && subtotal > 0) {
      hitungKalkulasi(
        {
          pesananSubtotal: subtotal,
          poinDigunakan: balanceData.totalPoint,
        },
        {
          onSuccess: () => {
            // Asumsi bahwa poin yang digunakan bisa jadi semua poin atau sebagian, backend mereturn total diskon
            // Poin yang digunakan disimpan di state untuk nanti disubmit ke CreatePesananRequest
            // karena API kalkulasiPoin mungkin ga return poin yang terpakai, kita set max
            setPoinDigunakan(balanceData.totalPoint);
          },
        },
      );
    } else if (!gunakanPoin) {
      setPoinDigunakan(0);
    }
  }, [gunakanPoin, balanceData, subtotal, hitungKalkulasi, setPoinDigunakan]);

  if (isGuest) return null;

  return (
    <div className="mt-6 border border-teal-muted rounded-xl bg-[rgba(101,154,157,0.05)] p-4 relative overflow-hidden">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-teal-muted flex items-center justify-center shrink-0 text-white">
          <Star size={20} fill="currentColor" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-sans font-bold text-[12px] text-teal-muted tracking-wide uppercase">
            Member Aroma Senja
          </p>

          <div className="mt-1 flex items-center justify-between">
            <div>
              {isLoadingBalance ? (
                <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
              ) : (
                <p className="font-sans text-[14px] text-slate-dark font-medium">
                  Tersedia: {balanceData?.totalPoint || 0} Poin
                </p>
              )}

              {gunakanPoin && kalkulasiData && (
                <p className="font-sans text-[13px] text-deep-orange mt-0.5">
                  Potongan: -{formatRupiah(kalkulasiData.diskonRupiah)}
                </p>
              )}
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={gunakanPoin}
              onClick={() => setGunakanPoin(!gunakanPoin)}
              disabled={
                isLoadingBalance || !balanceData || balanceData.totalPoint === 0 || isCalculating
              }
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 disabled:opacity-50 disabled:cursor-not-allowed',
                gunakanPoin ? 'bg-teal-muted' : 'bg-slate-300',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                  gunakanPoin ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoinToggle;
