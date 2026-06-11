import { Download, Loader2 } from 'lucide-react';
import type { FC } from 'react';
import { useExportLaporan } from '../hooks/useLaporan';

interface ExportButtonProps {
  period: string;
}

export const ExportButton: FC<ExportButtonProps> = ({ period }) => {
  const { mutate: doExport, isPending } = useExportLaporan();

  const handleExport = () => {
    doExport({ period });
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isPending}
      className="flex items-center gap-2 px-4 h-[40px] bg-deep-orange text-white font-semibold text-[14px] rounded-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-deep-orange/90 shadow-sm"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      <span>{isPending ? 'Mengekspor...' : 'Ekspor Laporan'}</span>
    </button>
  );
};
