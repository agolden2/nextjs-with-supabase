import { spawn } from "child_process";
import * as path from "path";

interface RunOptions {
  port?: string;
}

export function run(options: RunOptions) {
  const port = options.port ?? process.env.PORT ?? "3100";
  const serverEntry = path.resolve(import.meta.dirname, "../../server/dist/index.js");

  console.log(`Starting Forge server on port ${port}…`);

  const child = spawn("node", [serverEntry], {
    env: { ...process.env, PORT: port },
    stdio: "inherit",
  });

  child.on("error", (err) => {
    console.error("Failed to start server:", err.message);
    console.error("Make sure you've run: pnpm build");
    process.exit(1);
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}
