import "dotenv/config";
import { createServer } from "http";
import { config } from "./config.js";
import { createApp } from "./app.js";
import { createWsServer } from "./realtime/ws-server.js";
import { startHeartbeatScheduler } from "./services/heartbeat.js";

const app = createApp();
const httpServer = createServer(app);

// WebSocket server (shares the HTTP server)
createWsServer(httpServer);

// Start heartbeat scheduler
const scheduler = startHeartbeatScheduler();

httpServer.listen(config.port, () => {
  console.log(`Forge server running on http://localhost:${config.port}`);
  console.log(`  API: http://localhost:${config.port}/api/health`);
  console.log(`  Env: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down");
  clearInterval(scheduler);
  httpServer.close(() => process.exit(0));
});
