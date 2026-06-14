import { useCallback, useRef } from 'react';

export type NotificationSoundType = 'order' | 'table' | 'rating';

/**
 * Hook untuk memainkan suara notifikasi via Web Audio API.
 *
 * Tidak butuh file audio eksternal — suara di-generate programatik.
 * AudioContext dibuat lazy (saat pertama kali dipakai) untuk bypass
 * browser autoplay policy yang memerlukan user interaction terlebih dahulu.
 */
export const useNotificationSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback((): AudioContext | null => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      // Resume jika suspended (browser policy)
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  /**
   * Mainkan suara notifikasi pendek.
   * - order  : ding ganda naik  (880 Hz → 1100 Hz) — pesanan baru
   * - table  : ding tunggal     (660 Hz)            — meja terscan
   * - rating : ding triple cepat (880 Hz)           — rating masuk
   */
  const play = useCallback(
    (type: NotificationSoundType) => {
      const ctx = getAudioContext();
      if (!ctx) return;

      const playTone = (freq: number, startOffset: number, duration = 0.18) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.value = freq;

        const start = ctx.currentTime + startOffset;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.start(start);
        osc.stop(start + duration);
      };

      switch (type) {
        case 'order':
          // Ding-dong naik: pesanan masuk
          playTone(880, 0, 0.2);
          playTone(1100, 0.22, 0.25);
          break;
        case 'table':
          // Single ding: meja terscan
          playTone(660, 0, 0.3);
          break;
        case 'rating':
          // Triple ding cepat: ulasan masuk
          playTone(880, 0, 0.12);
          playTone(880, 0.14, 0.12);
          playTone(1100, 0.28, 0.2);
          break;
      }
    },
    [getAudioContext],
  );

  return { play };
};
