import type { PendapatanTrendResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { formatRupiah } from '@shared/utils/currency';
import { ChevronDown } from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RevenueChartProps {
  data?: PendapatanTrendResponse[];
  isLoading?: boolean;
  view: 'weekly' | 'monthly';
  onViewChange: (view: 'weekly' | 'monthly') => void;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
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

// Format X-axis label based on period (weekly/monthly)
const formatXAxisLabel = (label: string, view: 'weekly' | 'monthly') => {
  try {
    const date = new Date(label);
    if (Number.isNaN(date.getTime())) return label;
    if (view === 'weekly') {
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      return days[date.getDay()];
    } else {
      return date.getDate().toString();
    }
  } catch {
    return label;
  }
};

export const RevenueChart: FC<RevenueChartProps> = ({
  data = [],
  isLoading,
  view,
  onViewChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format data for Recharts
  const chartData = data.map((item) => ({
    ...item,
    shortLabel: formatXAxisLabel(item.label, view),
  }));

  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6 border border-slate-dark/5 flex flex-col h-[380px]">
      <div className="flex justify-between items-center mb-6 relative">
        <h3 className="text-[16px] font-serif font-semibold text-slate-dark">
          {view === 'weekly' ? 'Tren Pendapatan Mingguan' : 'Tren Pendapatan Bulanan'}
        </h3>
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-dark/10 text-[13px] text-slate-dark/70 hover:bg-off-white transition-colors"
          >
            {view === 'weekly' ? '7 Hari Terakhir' : 'Bulan Ini'}
            <ChevronDown
              size={14}
              className={cn('transition-transform duration-200', isDropdownOpen && 'rotate-180')}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-dark/5 py-1 z-20">
              <button
                type="button"
                onClick={() => {
                  onViewChange('weekly');
                  setIsDropdownOpen(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-2 text-[13px] hover:bg-slate-dark/5 transition-colors',
                  view === 'weekly'
                    ? 'text-teal-muted font-semibold bg-teal-muted/5'
                    : 'text-slate-dark',
                )}
              >
                7 Hari Terakhir
              </button>
              <button
                type="button"
                onClick={() => {
                  onViewChange('monthly');
                  setIsDropdownOpen(false);
                }}
                className={cn(
                  'w-full text-left px-4 py-2 text-[13px] hover:bg-slate-dark/5 transition-colors',
                  view === 'monthly'
                    ? 'text-teal-muted font-semibold bg-teal-muted/5'
                    : 'text-slate-dark',
                )}
              >
                Bulan Ini
              </button>
            </div>
          )}
        </div>
      </div>

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
              data={chartData}
              margin={{
                top: 5,
                right: 0,
                left: -20, // Negative left margin to pull Y-axis closer
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
                dataKey="shortLabel"
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
                  return `${value / 1000000}jt`;
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
