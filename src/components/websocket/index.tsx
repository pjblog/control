import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const WebSocketContext = createContext<Socket>(null);
export function WebSocket(props: React.PropsWithChildren<{ room: string }>) {
  const [socket, setSocket] = useState<Socket>(null);
  useEffect(() => {
    const sock = io(props.room, {
      withCredentials: true,
      autoConnect: true
    });
    sock.on('connect', () => setSocket(sock));
    return () => {
      if (sock) {
        sock.disconnect();
      }
    }
  }, [props.room]);
  return <WebSocketContext.Provider value={socket}>
    {props.children}
  </WebSocketContext.Provider>
}

export function useSocket() {
  return useContext(WebSocketContext);
}