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

  return (
    <div
      className={cn(
        'relative bg-white rounded-xl flex flex-col p-5 border transition-all hover:shadow-md h-[180px]',
        isOccupied ? 'border-teal-muted bg-teal-muted/5' : 'border-slate-dark/10',
      )}
    >
      {/* Top Section: Zone & Toggle */}
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-semibold tracking-wider text-slate-dark/50 uppercase">
          {meja.zone}
        </span>

        {/* Toggle Status (Switch) */}
        <label
          className="relative inline-flex items-center cursor-pointer group"
          title="Toggle Status Meja"
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isOccupied}
            onChange={(e) => onToggleStatus(meja, e.target.checked)}
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-muted"></div>
        </label>
      </div>

      {/* Main content: Number */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <span
          className={cn(
            'text-[42px] font-serif font-bold leading-none mb-2',
            isOccupied ? 'text-teal-muted' : 'text-slate-dark',
          )}
        >
          {String(meja.nomorMeja).padStart(2, '0')}
        </span>

        <div className="flex items-center gap-1.5 mt-1">
          <div
            className={cn(
              'w-2.5 h-2.5 rounded-full',
              isOccupied ? 'bg-teal-muted' : 'bg-slate-dark/20',
            )}
          ></div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-slate-dark/70">
            {isOccupied ? 'Terisi' : 'Kosong'}
          </span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-dark/5">
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
  );
};
