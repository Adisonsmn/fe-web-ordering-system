import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createStompClient = (): Client => {
  const wsUrl = import.meta.env.VITE_WS_URL;

  const client = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => {
      if (import.meta.env.DEV) {
        console.log('[STOMP Debug]', str);
      }
    },
  });

  return client;
};

// Export singleton instance
export const stompClient = createStompClient();
