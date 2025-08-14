'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export const useWebSocket = (url: string, onMessage?: (message: WebSocketMessage) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const websocket = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      websocket.current = new WebSocket(url);

      websocket.current.onopen = () => {
        setIsConnected(true);
        console.log('🔌 WebSocket connected to production backend');
      };

      websocket.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setLastMessage(message);
        onMessage?.(message);
      };

      websocket.current.onclose = () => {
        setIsConnected(false);
        console.log('❌ WebSocket disconnected - attempting reconnect...');
        
        // Longer reconnect delay for production
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      };

      websocket.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      // Retry connection for production
      setTimeout(connect, 5000);
    }
  }, [url, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    websocket.current?.close();
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (websocket.current?.readyState === WebSocket.OPEN) {
      websocket.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    disconnect
  };
};