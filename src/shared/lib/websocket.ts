import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// ── Subscription Registry ─────────────────────────────────────────────────────
// @stomp/stompjs v7 mensyaratkan subscription dilakukan di dalam onConnect.
// Registry ini menyimpan semua subscription aktif dan me-recreate mereka
// setiap kali koneksi STOMP terbentuk (connect/reconnect).

interface RegistryEntry {
  topic: string;
  callback: (message: IMessage) => void;
  activeSubscription: { unsubscribe: () => void } | null;
}

const registry = new Map<string, RegistryEntry>();

// ── URL resolving ─────────────────────────────────────────────────────────────
let wsUrl = import.meta.env.VITE_WS_URL as string;
// SockJS requires http/https scheme, not ws/wss
if (wsUrl?.startsWith('wss://')) {
  wsUrl = wsUrl.replace('wss://', 'https://');
} else if (wsUrl?.startsWith('ws://')) {
  wsUrl = wsUrl.replace('ws://', 'http://');
}

// ── STOMP Singleton ───────────────────────────────────────────────────────────
export const stompClient = new Client({
  webSocketFactory: () => new SockJS(wsUrl),
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,

  // Setiap kali koneksi STOMP berhasil (termasuk reconnect), activate semua
  // subscription yang terdaftar di registry.
  onConnect: () => {
    registry.forEach((entry) => {
      // Jangan subscribe ganda jika sudah ada subscription aktif
      if (!entry.activeSubscription) {
        entry.activeSubscription = stompClient.subscribe(entry.topic, entry.callback);
      }
    });
  },

  // Saat disconnect, tandai semua subscription sebagai tidak aktif.
  // Mereka akan di-recreate di onConnect berikutnya.
  onDisconnect: () => {
    registry.forEach((entry) => {
      entry.activeSubscription = null;
    });
  },

  debug: (str) => {
    if (import.meta.env.DEV) {
      console.log('[STOMP Debug]', str);
    }
  },
});

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Daftarkan subscription ke sebuah STOMP topic.
 * - Jika client sudah connected: subscribe langsung sekarang.
 * - Jika belum connected: catat di registry, akan diaktifkan saat onConnect.
 * - Jika client reconnect: subscription otomatis di-recreate.
 *
 * @returns fungsi unsubscribe — HARUS dipanggil saat komponen unmount
 */
export const registerTopicSubscription = (
  id: string,
  topic: string,
  callback: (message: IMessage) => void,
): (() => void) => {
  const entry: RegistryEntry = {
    topic,
    callback,
    activeSubscription: null,
  };

  // Jika sudah connected, langsung subscribe
  if (stompClient.connected) {
    entry.activeSubscription = stompClient.subscribe(topic, callback);
  }

  registry.set(id, entry);

  // Return cleanup function
  return () => {
    entry.activeSubscription?.unsubscribe();
    registry.delete(id);
  };
};
