import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import type { ForgeEvent } from "./events.js";

let wss: WebSocketServer | null = null;

export function createWsServer(httpServer: Server): WebSocketServer {
  wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (ws) => {
    console.log("[WS] Client connected");
    ws.on("close", () => console.log("[WS] Client disconnected"));
    ws.on("error", (err) => console.error("[WS] Error:", err.message));
  });

  return wss;
}

// Broadcast an event to all connected clients (optionally filtered by companyId)
export function broadcast(event: ForgeEvent): void {
  if (!wss) return;
  const message = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
