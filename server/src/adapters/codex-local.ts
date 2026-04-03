import { spawn } from "child_process";
import type { AgentAdapter, InvocationContext, InvokeResult } from "./types.js";
import type { Agent } from "@forge/shared/types";

// Spawns the `codex` CLI (OpenAI Codex / codex-cli)
export class CodexLocalAdapter implements AgentAdapter {
  async invoke(agent: Agent, context: InvocationContext): Promise<InvokeResult> {
    const config = (agent.adapterConfig ?? {}) as {
      cwd?: string;
      model?: string;
      timeoutSec?: number;
    };

    const prompt = this.buildPrompt(agent, context);

    return new Promise((resolve, reject) => {
      const args: string[] = [];
      if (config.model) args.push("--model", config.model);
      // codex-cli uses positional prompt argument
      args.push(prompt);

      const child = spawn("codex", args, {
        cwd: config.cwd,
        env: { ...process.env },
        timeout: (config.timeoutSec ?? 300) * 1000,
      });

      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (d) => (stdout += d));
      child.stderr.on("data", (d) => (stderr += d));

      child.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`codex exited ${code}: ${stderr}`));
        } else {
          resolve({ costCents: 0, output: stdout, model: config.model ?? "codex" });
        }
      });

      child.on("error", (err) => {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
          resolve({
            costCents: 0,
            output: "[codex CLI not found — install @openai/codex]",
          });
        } else {
          reject(err);
        }
      });
    });
  }

  private buildPrompt(agent: Agent, context: InvocationContext): string {
    const issueList = context.issues
      .map((i) => `#${i.number} [${i.priority}/${i.status}] ${i.title}\n  ${i.description ?? ""}`)
      .join("\n\n");

    return [
      agent.systemPrompt ?? "You are an AI coding assistant. Complete your assigned tasks.",
      "",
      `Run ID: ${context.runId}`,
      "",
      context.issues.length > 0
        ? `Your assigned issues:\n\n${issueList}`
        : "You have no assigned issues at this time.",
    ].join("\n");
  }
}
