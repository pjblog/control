import { useRequestParam, RequestContext, RequestState } from '@codixjs/codix';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const WebSocketContext = createContext<Socket>(null);
export function WebSocket(props: React.PropsWithChildren<{ room: string | ((req: RequestState) => string) }>) {
  const [socket, setSocket] = useState<Socket>(null);
  const request = useContext(RequestContext);
  const id = useMemo(() => {
    if (typeof props.room === 'string') return props.room;
    return props.room(request);
  }, [props.room, request]);
  useEffect(() => {
    if (id) {
      const sock = io(id, {
        withCredentials: true,
        autoConnect: true
      });
      sock.on('connect', () => setSocket(sock));
      return () => {
        if (sock) {
          sock.disconnect();
        }
      }
    }
  }, [id]);
  return <WebSocketContext.Provider value={socket}>
    {props.children}
  </WebSocketContext.Provider>
}

export function useSocket() {
  return useContext(WebSocketContext);
}