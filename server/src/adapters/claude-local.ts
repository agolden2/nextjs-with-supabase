import { spawn } from "child_process";
import type { AgentAdapter, InvocationContext, InvokeResult } from "./types.js";
import type { Agent } from "@forge/shared/types";

// Spawns the `claude` CLI with --print flag
export class ClaudeLocalAdapter implements AgentAdapter {
  async invoke(agent: Agent, context: InvocationContext): Promise<InvokeResult> {
    const config = (agent.adapterConfig ?? {}) as {
      cwd?: string;
      model?: string;
      timeoutSec?: number;
    };

    const prompt = this.buildPrompt(agent, context);

    return new Promise((resolve, reject) => {
      const args = ["--print"];
      if (config.model) args.push("--model", config.model);
      args.push(prompt);

      const child = spawn("claude", args, {
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
          reject(new Error(`claude exited ${code}: ${stderr}`));
        } else {
          // Try to extract cost from stderr (claude CLI outputs this)
          const costMatch = stderr.match(/cost:\s*\$?([\d.]+)/i);
          const costCents = costMatch
            ? Math.round(parseFloat(costMatch[1]) * 100)
            : 0;
          resolve({ costCents, output: stdout, model: config.model ?? "claude" });
        }
      });

      child.on("error", (err) => {
        // If claude is not installed, return a no-op result
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
          resolve({
            costCents: 0,
            output: "[claude CLI not found — install @anthropic-ai/claude-code]",
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
      agent.systemPrompt ?? "You are an AI agent. Complete your assigned tasks.",
      "",
      `Run ID: ${context.runId}`,
      "",
      context.issues.length > 0
        ? `Your assigned issues:\n\n${issueList}`
        : "You have no assigned issues at this time.",
    ].join("\n");
  }
}
