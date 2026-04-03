import * as schema from "./schema/index.js";

export type DrizzleDb = ReturnType<typeof createDb>;

export function createDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    // Production: external Postgres (node-postgres)
    const { drizzle } = require("drizzle-orm/node-postgres");
    const { Pool } = require("pg");
    const pool = new Pool({ connectionString: databaseUrl });
    return drizzle(pool, { schema });
  }

  // Dev: embedded PGlite — zero config, no Docker needed
  const { drizzle } = require("drizzle-orm/pglite");
  const { PGlite } = require("@electric-sql/pglite");
  const dataDir = process.env.PGLITE_DIR ?? "./.forge/db";
  const client = new PGlite(dataDir);
  return drizzle(client, { schema });
}

// Singleton for server use
let _db: DrizzleDb | null = null;

export function getDb(): DrizzleDb {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}
