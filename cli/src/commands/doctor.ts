import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

export function doctor() {
  console.log("\n🩺 Forge Doctor\n");

  const checks = [
    {
      name: "Node.js version",
      check: () => {
        const version = process.version;
        const major = parseInt(version.slice(1));
        if (major < 20) throw new Error(`Node.js 20+ required, found ${version}`);
        return version;
      },
    },
    {
      name: "pnpm",
      check: () => {
        const out = execSync("pnpm --version", { encoding: "utf8" }).trim();
        return out;
      },
    },
    {
      name: "claude CLI",
      check: () => {
        try {
          const out = execSync("claude --version", { encoding: "utf8" }).trim();
          return out;
        } catch {
          throw new Error("Not installed. Run: npm install -g @anthropic-ai/claude-code");
        }
      },
    },
    {
      name: ".env file",
      check: () => {
        const envPath = path.resolve(process.cwd(), ".env");
        if (!fs.existsSync(envPath)) throw new Error("Missing. Run: forge onboard");
        return "present";
      },
    },
    {
      name: "data directory",
      check: () => {
        const dataDir = path.resolve(process.cwd(), ".forge");
        if (!fs.existsSync(dataDir)) throw new Error("Missing. Run: forge onboard");
        return dataDir;
      },
    },
  ];

  let allPassed = true;
  for (const { name, check } of checks) {
    try {
      const result = check();
      console.log(`  ✓ ${name}: ${result}`);
    } catch (err) {
      allPassed = false;
      console.log(`  ✗ ${name}: ${(err as Error).message}`);
    }
  }

  console.log(allPassed ? "\n✅ All checks passed!\n" : "\n⚠️  Some checks failed.\n");
}
