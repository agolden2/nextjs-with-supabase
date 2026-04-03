#!/usr/bin/env node
import { Command } from "commander";
import { onboard } from "./commands/onboard.js";
import { run } from "./commands/run.js";
import { doctor } from "./commands/doctor.js";

const program = new Command();

program
  .name("forge")
  .description("Forge CLI — AI agent orchestration platform")
  .version("0.1.0");

program
  .command("onboard")
  .description("Interactive setup wizard — creates your first company + agent")
  .option("-y, --yes", "Accept all defaults without prompting")
  .option("--company-name <name>", "Company name", "My Company")
  .option("--port <port>", "Server port", "3100")
  .action(onboard);

program
  .command("run")
  .description("Start the Forge server")
  .option("-p, --port <port>", "Port to listen on", "3100")
  .action(run);

program
  .command("doctor")
  .description("Check environment and diagnose issues")
  .action(doctor);

program.parseAsync(process.argv).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
