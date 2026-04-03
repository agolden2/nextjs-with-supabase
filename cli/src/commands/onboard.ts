import * as fs from "fs";
import * as path from "path";
import { getDb } from "@forge/db/client";
import { companies, agents } from "@forge/db/schema";

interface OnboardOptions {
  yes?: boolean;
  companyName?: string;
  port?: string;
}

export async function onboard(options: OnboardOptions) {
  console.log("\n🔨 Welcome to Forge!\n");

  const companyName = options.companyName ?? "My Company";
  const port = options.port ?? "3100";

  // Ensure data directory exists
  const dataDir = path.resolve(process.cwd(), ".forge");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`✓ Created data directory: ${dataDir}`);
  }

  // Write .env if it doesn't exist
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(
      envPath,
      `PORT=${port}\nPGLITE_DIR=${path.join(dataDir, "db")}\n`
    );
    console.log("✓ Created .env");
  }

  console.log("✓ Initializing database…");
  const db = getDb();

  // Check if already seeded
  const existingCompanies = await db.select().from(companies);
  if (existingCompanies.length > 0) {
    console.log(`✓ Database already initialized (${existingCompanies.length} companies found)`);
  } else {
    // Create seed data
    const slug = companyName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const [company] = await db
      .insert(companies)
      .values({ name: companyName, slug, missionStatement: "Build great software with AI" })
      .returning();

    await db.insert(agents).values({
      companyId: company.id,
      name: "CEO",
      role: "ceo",
      adapterType: "claude_local",
      systemPrompt: `You are the CEO of ${companyName}. Your job is to manage the team and deliver results.`,
    });

    console.log(`✓ Created company: ${companyName}`);
    console.log("✓ Created CEO agent");
  }

  console.log(`\n✅ Forge is ready!\n`);
  console.log(`   Start the server:  forge run`);
  console.log(`   API:               http://localhost:${port}/api/health`);
  console.log(`   UI:                http://localhost:5173 (run: pnpm dev:ui)\n`);
}
