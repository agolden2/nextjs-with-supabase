import { getDb } from "./client.js";

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;
  const migrationsFolder = new URL("../drizzle", import.meta.url).pathname;

  if (databaseUrl) {
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    await migrate(getDb() as any, { migrationsFolder });
  } else {
    const { migrate } = await import("drizzle-orm/pglite/migrator");
    await migrate(getDb() as any, { migrationsFolder });
  }

  console.log("Migrations complete");
}

runMigrations().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
