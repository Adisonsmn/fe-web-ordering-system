import { stompClient } from '@shared/lib/websocket';
import type { IMessage } from '@stomp/stompjs';
import { useCallback, useEffect } from 'react';

export const useWebSocket = () => {
  useEffect(() => {
    if (!stompClient.active) {
      stompClient.activate();
    }
  }, []);

  const subscribe = useCallback(
    <T>(topic: string, callback: (payload: T) => void): (() => void) => {
      const messageHandler = (message: IMessage) => {
        try {
          const payload = JSON.parse(message.body) as T;
          callback(payload);
        } catch (error) {
          console.error(`[WS Error] Gagal memproses data dari topik ${topic}:`, error);
        }
      };

      let subscription: { unsubscribe: () => void } | null = null;
      let interval: ReturnType<typeof setInterval> | null = null;

      if (stompClient.connected) {
        subscription = stompClient.subscribe(topic, messageHandler);
      } else {
        // Polling berkala (setiap 100ms) untuk memeriksa koneksi
        // dan mendaftarkan subskripsi setelah tersambung.
        interval = setInterval(() => {
          if (stompClient.connected) {
            subscription = stompClient.subscribe(topic, messageHandler);
            if (interval) {
              clearInterval(interval);
              interval = null;
            }
          }
        }, 100);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    },
    [],
  );

  return { subscribe };
};
