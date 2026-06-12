import BottomNav from '@shared/components/layout/BottomNav';
import { Award, Receipt, RotateCcw } from 'lucide-react';
import { type FC } from 'react';
import { usePoinBalance } from './hooks/usePoinBalance';
import { usePoinRiwayat } from './hooks/usePoinRiwayat';

/* ─── Helpers ───────────────────────────────────────────── */
const formatBulanTahun = (iso: string): string => {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

const formatTanggalJam = (iso: string): string => {
  if (!iso) return '-';
  const d = new Date(iso);
  const tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${tgl} • ${jam}`;
};

/* ─── Sub-components ─────────────────────────────────────── */
const SkeletonCard: FC = () => (
  <div className="mx-[20px] h-[180px] rounded-[20px] bg-slate-300/40 animate-pulse" />
);

const SkeletonRow: FC = () => (
  <div className="flex items-center gap-3 p-[16px] bg-white rounded-[14px] animate-pulse">
    <div className="w-[44px] h-[44px] rounded-[12px] bg-slate-200" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-[14px] bg-slate-200 rounded w-2/3" />
      <div className="h-[12px] bg-slate-200 rounded w-1/2" />
    </div>
    <div className="flex flex-col items-end gap-2">
      <div className="h-[14px] bg-slate-200 rounded w-[60px]" />
      <div className="h-[10px] bg-slate-200 rounded w-[40px]" />
    </div>
  </div>
);

/* ─── Main Page ──────────────────────────────────────────── */
const LoyaltiPage: FC = () => {
  const { data: balance, isLoading: balanceLoading } = usePoinBalance();
  const { data: riwayatPage, isLoading: riwayatLoading } = usePoinRiwayat(0);

  const riwayat = riwayatPage?.content ?? [];

  return (
    <div className="relative w-full min-h-screen bg-[#f5f5f5] font-sans pb-[100px]">
      {/* ── Top Bar ─────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#f5f5f5] pt-[52px] pb-[4px] px-[20px] border-b border-[#e4beb4]/30">
        <span className="font-serif font-semibold text-[18px] text-[#303841]">Aroma Senja</span>
      </div>

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="px-[20px] pt-[24px] pb-[20px]">
        <h1 className="font-serif font-bold text-[28px] text-[#303841] leading-[36px]">
          Loyalty &amp; Poin
        </h1>
        <p className="font-sans font-normal text-[14px] text-[#5b4039]/70 mt-[4px] leading-[22px]">
          Nikmati keuntungan eksklusif di setiap kunjungan.
        </p>
      </div>

      {/* ── Poin Card ───────────────────────────────────── */}
      {balanceLoading ? (
        <SkeletonCard />
      ) : balance ? (
        <div className="mx-[20px] rounded-[20px] bg-[#303841] px-[24px] py-[24px] shadow-[0_8px_32px_rgba(48,56,65,0.25)]">
          {/* User name */}
          <p className="font-serif font-bold text-[20px] text-white leading-[28px]">
            {balance.namaClient}
          </p>

          {/* Member sejak */}
          <p className="font-sans font-normal text-[13px] text-white/50 mt-[2px]">
            Member sejak {formatBulanTahun(balance.memberSejak)}
          </p>

          {/* Divider */}
          <div className="h-px bg-white/10 my-[20px]" />

          {/* Total saldo */}
          <p className="font-sans font-bold text-[11px] text-white/50 tracking-[1px] uppercase">
            Total Saldo
          </p>
          <div className="flex items-baseline gap-[8px] mt-[4px]">
            <span className="font-serif font-bold text-[48px] text-[#ff5722] leading-none">
              {balance.totalPoint.toLocaleString('id-ID')}
            </span>
            <span className="font-sans font-bold text-[16px] text-white/70 uppercase tracking-wide">
              Poin
            </span>
          </div>

          {/* Info row */}
          <div className="flex items-center justify-between mt-[20px]">
            <span className="font-sans font-normal text-[12px] text-white/50">
              1 Poin = Rp {balance.rupiahPerPoin.toLocaleString('id-ID')}
            </span>
            <div className="flex items-center gap-[6px] bg-[#76abae]/20 rounded-full px-[12px] py-[4px]">
              <Award size={12} className="text-[#76abae]" />
              <span className="font-sans font-semibold text-[12px] text-[#76abae]">
                {balance.totalPoinDiperoleh.toLocaleString('id-ID')} diperoleh
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-[20px] rounded-[20px] bg-[#303841] px-[24px] py-[24px] flex items-center justify-center h-[160px]">
          <p className="text-white/50 text-[14px]">Gagal memuat data poin</p>
        </div>
      )}

      {/* ── Riwayat Poin ────────────────────────────────── */}
      <div className="px-[20px] mt-[32px]">
        <h2 className="font-serif font-bold text-[20px] text-[#303841] mb-[16px]">
          Riwayat Poin
        </h2>

        {riwayatLoading ? (
          <div className="flex flex-col gap-[12px]">
            {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
          </div>
        ) : riwayat.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[48px] opacity-50">
            <Award size={40} className="text-[#5b4039] mb-[12px]" />
            <p className="font-sans text-[14px] text-[#5b4039]">Belum ada riwayat poin</p>
            <p className="font-sans text-[12px] text-[#5b4039]/70 mt-[4px]">
              Mulai pesan dan kumpulkan poin!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[10px]">
            {riwayat.map((item) => {
              const isEarn = item.tipe === 'earn' || item.tipe === 'refund';
              const labelTipe = item.tipe === 'earn'
                ? 'SELESAI'
                : item.tipe === 'refund'
                ? 'REFUND'
                : 'TUKAR';

              const judulTransaksi = item.kodePesanan
                ? `Pesanan ${item.kodePesanan}`
                : item.tipe === 'redeem'
                ? 'Penukaran Poin'
                : 'Transaksi Poin';

              return (
                <div
                  key={item.poinTransaksiId}
                  className="flex items-center gap-[14px] bg-white rounded-[14px] px-[16px] py-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                >
                  {/* Icon */}
                  <div
                    className={`w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0 ${
                      isEarn
                        ? 'bg-[#76abae]/10'
                        : 'bg-[#ff5722]/10'
                    }`}
                  >
                    {isEarn ? (
                      <Receipt size={20} className="text-[#76abae]" />
                    ) : (
                      <RotateCcw size={20} className="text-[#ff5722]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-[14px] text-[#303841] truncate">
                      {judulTransaksi}
                    </p>
                    <p className="font-sans font-normal text-[12px] text-[#5b4039]/60 mt-[2px]">
                      {formatTanggalJam(item.createdAt)}
                    </p>
                  </div>

                  {/* Poin + Label */}
                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`font-sans font-bold text-[15px] ${
                        isEarn ? 'text-[#76abae]' : 'text-[#ff5722]'
                      }`}
                    >
                      {isEarn ? '+' : '-'}{Math.abs(item.jumlahPoin)} Poin
                    </span>
                    <span
                      className={`font-sans font-bold text-[10px] tracking-[0.5px] mt-[2px] ${
                        isEarn ? 'text-[#76abae]/70' : 'text-[#ff5722]/70'
                      }`}
                    >
                      {labelTipe}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default LoyaltiPage;
