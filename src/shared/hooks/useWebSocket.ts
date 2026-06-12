import { registerTopicSubscription, stompClient } from '@shared/lib/websocket';
import type { IMessage } from '@stomp/stompjs';
import { useCallback, useEffect } from 'react';

export const useWebSocket = () => {
  // Aktifkan koneksi STOMP saat pertama kali hook ini digunakan.
  // Singleton stompClient memastikan hanya ada satu koneksi meskipun
  // hook ini dipanggil dari banyak komponen.
  useEffect(() => {
    if (!stompClient.active) {
      stompClient.activate();
    }
  }, []);

  const subscribe = useCallback(
    <T>(topic: string, callback: (payload: T) => void): (() => void) => {
      // ID unik per subscription untuk registry management
      const id = crypto.randomUUID();

      // Wrap callback ke STOMP message handler
      const messageHandler = (message: IMessage) => {
        try {
          const payload = JSON.parse(message.body) as T;
          callback(payload);
        } catch (error) {
          console.error(`[WS Error] Gagal memproses data dari topik ${topic}:`, error);
        }
      };

      // Daftarkan ke registry — subscription akan aktif saat connected
      // dan otomatis di-recreate saat reconnect
      return registerTopicSubscription(id, topic, messageHandler);
    },
    [],
  );

  return { subscribe };
};
