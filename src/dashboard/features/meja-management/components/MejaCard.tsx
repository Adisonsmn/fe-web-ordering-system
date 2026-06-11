import type { MejaResponse } from '@shared/types';
import { cn } from '@shared/utils/cn';
import { QrCode, Trash2 } from 'lucide-react';
import type { FC } from 'react';

interface MejaCardProps {
  meja: MejaResponse;
  onDelete: (meja: MejaResponse) => void;
  onPreviewQr: (meja: MejaResponse) => void;
  onToggleStatus: (meja: MejaResponse, newStatus: boolean) => void;
}

export const MejaCard: FC<MejaCardProps> = ({ meja, onDelete, onPreviewQr, onToggleStatus }) => {
  const isOccupied = meja.isOccupied;

  const cardBg = isOccupied ? 'border-teal-muted bg-teal-muted/5' : 'border-slate-dark/10';

  const numberColor = isOccupied ? 'text-teal-muted' : 'text-slate-dark';

  const dotColor = isOccupied ? 'bg-teal-muted' : 'bg-slate-dark/20';

  const statusLabel = isOccupied ? 'Terisi' : 'Kosong';

  return (
    <div
      className={cn(
        'relative bg-white rounded-xl flex flex-col p-5 border transition-all hover:shadow-md h-[180px]',
        cardBg,
      )}
    >
      {/* Top Section: Zone */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-semibold tracking-wider text-slate-dark/50 uppercase">
          {meja.zone}
        </span>
      </div>

      {/* Main content: Number */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className={cn('text-[42px] font-serif font-bold leading-none mb-2', numberColor)}>
          {String(meja.nomorMeja).padStart(2, '0')}
        </span>

        <div className="flex items-center gap-1.5 mt-1">
          <div className={cn('w-2.5 h-2.5 rounded-full', dotColor)} />
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-dark/70">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-dark/5">
        <select
          value={isOccupied ? 'TERISI' : 'KOSONG'}
          onChange={(e) => onToggleStatus(meja, e.target.value === 'TERISI')}
          className="text-[11px] font-semibold rounded-md border border-slate-dark/20 px-2 py-1 bg-white text-slate-dark cursor-pointer hover:border-teal-muted focus:outline-none focus:border-teal-muted focus:ring-1 focus:ring-teal-muted transition-colors"
        >
          <option value="TERISI">● Terisi</option>
          <option value="KOSONG">○ Kosong</option>
        </select>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPreviewQr(meja)}
            className="p-1.5 text-slate-dark/50 hover:text-teal-muted hover:bg-teal-muted/10 rounded-md transition-colors"
            title="Download QR Code"
          >
            <QrCode size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(meja)}
            className="p-1.5 text-slate-dark/50 hover:text-deep-orange hover:bg-deep-orange/10 rounded-md transition-colors"
            title="Hapus Meja"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
