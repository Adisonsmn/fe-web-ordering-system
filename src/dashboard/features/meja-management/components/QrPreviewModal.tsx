import { Button, Modal } from '@shared/components/ui';
import type { MejaResponse } from '@shared/types';
import { Download, Loader2 } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { downloadQrCode } from '../api/meja.api';

interface QrPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  meja: MejaResponse | null;
}

export const QrPreviewModal: FC<QrPreviewModalProps> = ({ isOpen, onClose, meja }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && meja) {
      let objectUrl: string;
      setIsLoading(true);
      setError(null);

      downloadQrCode(meja.mejaId)
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        })
        .catch((err) => {
          console.error('Failed to load QR code:', err);
          setError('Gagal memuat QR Code. Pastikan backend mengembalikan PNG.');
        })
        .finally(() => {
          setIsLoading(false);
        });

      return () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }
  }, [isOpen, meja]);

  const handleDownload = () => {
    if (!imageUrl || !meja) return;

    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `QR_Meja_${String(meja.nomorMeja).padStart(2, '0')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`QR Code Meja ${meja ? String(meja.nomorMeja).padStart(2, '0') : ''}`}
      maxWidth="sm"
    >
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        {/* QR Display Area */}
        <div className="w-64 h-64 bg-slate-50 border border-slate-dark/10 rounded-xl flex items-center justify-center overflow-hidden shadow-inner p-4 relative">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-slate-dark/50">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Memuat QR Code...</span>
            </div>
          ) : error ? (
            <div className="text-deep-orange text-center text-sm font-medium px-4">{error}</div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={`QR Code Meja ${meja?.nomorMeja}`}
              className="w-full h-full object-contain"
            />
          ) : null}
        </div>

        <div className="text-center space-y-1">
          <h4 className="text-[15px] font-bold text-slate-dark">
            Meja {meja?.nomorMeja} — {meja?.zone}
          </h4>
          <p className="text-[13px] text-slate-dark/60">
            Cetak QR Code ini dan tempatkan di meja untuk memudahkan pelanggan memesan.
          </p>
        </div>

        <div className="w-full flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Tutup
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={!imageUrl || isLoading}
            className="flex-1 bg-deep-orange hover:bg-deep-orange/90 flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Download PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
};
