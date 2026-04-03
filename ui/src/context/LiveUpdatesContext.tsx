import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
interface ForgeEvent {
  type: string;
  companyId: string;
  payload: unknown;
  timestamp: string;
}

interface LiveUpdatesContextValue {
  connected: boolean;
}

const LiveUpdatesContext = createContext<LiveUpdatesContextValue>({ connected: false });

export function LiveUpdatesProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const connectedRef = useRef(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `ws://${window.location.host}/api`;
    let ws: WebSocket;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        connectedRef.current = true;
        console.log("[WS] Connected");
      };

      ws.onmessage = (msg) => {
        try {
          const event = JSON.parse(msg.data) as ForgeEvent;
          handleEvent(event);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        connectedRef.current = false;
        // Reconnect after 3 seconds
        reconnectTimeout = setTimeout(connect, 3_000);
      };
    }

    function handleEvent(event: ForgeEvent) {
      const type = event.type;
      if (type.startsWith("issue:")) {
        qc.invalidateQueries({ queryKey: ["issues"] });
      } else if (type.startsWith("agent:")) {
        qc.invalidateQueries({ queryKey: ["agents"] });
      } else if (type.startsWith("heartbeat:")) {
        qc.invalidateQueries({ queryKey: ["heartbeatRuns"] });
      } else if (type.startsWith("approval:")) {
        qc.invalidateQueries({ queryKey: ["approvals"] });
      }
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      ws?.close();
    };
  }, [qc]);

  return (
    <LiveUpdatesContext.Provider value={{ connected: connectedRef.current }}>
      {children}
    </LiveUpdatesContext.Provider>
  );
}

export function useLiveUpdates() {
  return useContext(LiveUpdatesContext);
}
