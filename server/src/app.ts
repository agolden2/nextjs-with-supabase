import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.js";

import healthRouter from "./routes/health.js";
import companiesRouter from "./routes/companies.js";
import agentsRouter from "./routes/agents.js";
import issuesRouter from "./routes/issues.js";
import projectsRouter from "./routes/projects.js";
import goalsRouter from "./routes/goals.js";
import approvalsRouter from "./routes/approvals.js";
import orgRouter from "./routes/org.js";
import activityRouter from "./routes/activity.js";
import costsRouter from "./routes/costs.js";
import heartbeatRouter from "./routes/heartbeat.js";
import labelsRouter from "./routes/labels.js";
import commentsRouter from "./routes/comments.js";

export function createApp() {
  const app = express();

  // Security & parsing
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: "1mb" }));

  // Routes
  app.use("/api/health", healthRouter);
  app.use("/api/companies", companiesRouter);
  app.use("/api/agents", agentsRouter);
  app.use("/api/issues", issuesRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/goals", goalsRouter);
  app.use("/api/approvals", approvalsRouter);
  app.use("/api/org", orgRouter);
  app.use("/api/activity", activityRouter);
  app.use("/api/costs", costsRouter);
  app.use("/api/heartbeat", heartbeatRouter);
  app.use("/api/labels", labelsRouter);
  app.use("/api/comments", commentsRouter);

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
