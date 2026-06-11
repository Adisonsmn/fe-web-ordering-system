import type { PendapatanTrendResponse } from '@shared/types';
import { formatRupiah } from '@shared/utils/currency';
import type { FC } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface LaporanRevenueChartProps {
  data?: PendapatanTrendResponse[];
  isLoading?: boolean;
  period: string;
}

interface TooltipPayloadItem {
  value: number;
  payload: {
    totalPesanan: number;
  };
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-3 border border-slate-dark/10 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-lg">
        <p className="text-[12px] text-slate-dark/70 mb-1">{label}</p>
        <p className="text-[14px] font-bold text-slate-dark">{formatRupiah(payload[0].value)}</p>
        <p className="text-[12px] text-slate-dark/50 mt-1">
          {payload[0].payload.totalPesanan} Pesanan
        </p>
      </div>
    );
  }
  return null;
};

export const LaporanRevenueChart: FC<LaporanRevenueChartProps> = ({
  data = [],
  isLoading,
  period,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 flex flex-col h-[380px]">
      <h3 className="text-[16px] font-serif font-semibold text-slate-dark mb-6">
        Tren Pendapatan ({period === 'bulanan' ? 'Bulan Ini' : 'Tahun Ini'})
      </h3>

      <div className="flex-1 w-full h-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4 items-end h-full w-full px-4 pb-8 pt-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="bg-deep-orange/20 rounded-t-sm w-full"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                ></div>
              ))}
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-slate-dark/50 text-[14px]">
            Belum ada data pendapatan
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 0,
                left: -10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#303841"
                strokeOpacity={0.1}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#303841', fontSize: 11, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#303841', opacity: 0.4, fontSize: 11 }}
                tickFormatter={(value) => {
                  if (value === 0) return '0';
                  return `${(value / 1000000).toFixed(0)}jt`;
                }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#303841', opacity: 0.05 }} />
              <Bar
                dataKey="totalPendapatan"
                fill="#FF5722"
                fillOpacity={0.3}
                radius={[4, 4, 0, 0]}
                activeBar={{ fillOpacity: 0.5 }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
