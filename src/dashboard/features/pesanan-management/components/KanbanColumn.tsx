import { cn } from '@shared/utils/cn';
import type { FC } from 'react';

interface KanbanColumnProps {
  title: string;
  count: number;
  colorHex: string;
  bgColorClass: string;
  children: React.ReactNode;
}

const KanbanColumn: FC<KanbanColumnProps> = ({
  title,
  count,
  colorHex,
  bgColorClass,
  children,
}) => {
  return (
    <div
      className={cn(
        'flex h-full min-w-[320px] max-w-[360px] flex-col gap-4 rounded-2xl border p-4',
        bgColorClass,
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colorHex }} />
          <h3 className="font-sans text-[20px] font-semibold text-slate-dark">{title}</h3>
        </div>
        <div
          className="flex h-[20px] items-center justify-center rounded-full px-2 text-[10px] font-bold text-white"
          style={{ backgroundColor: colorHex }}
        >
          {count}
        </div>
      </div>

      {/* Column Content */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4 pr-1 scrollbar-hide">
        {children}
        {count === 0 && (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-dark/20 text-[14px] text-slate-dark/50">
            Tidak ada pesanan
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
