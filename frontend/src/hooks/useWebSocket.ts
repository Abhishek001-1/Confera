import { useEffect, useRef, useCallback } from 'react';
import type { Signal } from '@/types';
import { WS_BASE } from '@/lib/constants';

export function useWebSocket(
  roomId: string | null,
  userId: string | null,
  onSignal: (signal: Signal) => void
) {
  const wsRef = useRef<WebSocket | null>(null);
  const onSignalRef = useRef(onSignal);
  onSignalRef.current = onSignal;

  useEffect(() => {
    if (!roomId || !userId) return;

    // Drogon endpoint is /ws
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    ws.onopen = () => {
      // Send join-room as required by Drogon SignalingController
      ws.send(JSON.stringify({
        type: 'join-room',
        roomId,
        userId,
      }));
    };

    ws.onmessage = (event) => {
      try {
        const signal: Signal = JSON.parse(event.data);
        onSignalRef.current(signal);
      } catch {
        console.error('Failed to parse WebSocket message');
      }
    };

    ws.onerror = (e) => console.error('WebSocket error', e);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'leave-room', roomId, userId }));
      }
      ws.close();
      wsRef.current = null;
    };
  }, [roomId, userId]);

  const send = useCallback((signal: Signal) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        ...signal,
        roomId: signal.roomId || roomId,
        userId: signal.userId || userId,
        target: signal.target || signal.to,
        from: signal.from || userId,
      };
      wsRef.current.send(JSON.stringify(payload));
    }
  }, [roomId, userId]);

  return { send };
}
