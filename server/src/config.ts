import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT ?? "3100", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: (process.env.NODE_ENV ?? "development") === "development",
  sessionSecret: process.env.SESSION_SECRET ?? "dev-secret-change-in-prod",
  databaseUrl: process.env.DATABASE_URL,
  pgliteDir: process.env.PGLITE_DIR ?? "./.forge/db",
  uiDistPath: process.env.UI_DIST_PATH ?? "../ui/dist",
} as const;
