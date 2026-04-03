import { spawn } from "child_process";
import type { AgentAdapter, InvocationContext, InvokeResult } from "./types.js";
import type { Agent } from "@forge/shared/types";

export class ProcessAdapter implements AgentAdapter {
  async invoke(agent: Agent, context: InvocationContext): Promise<InvokeResult> {
    const config = (agent.adapterConfig ?? {}) as {
      command?: string;
      args?: string[];
      cwd?: string;
      timeoutSec?: number;
    };

    if (!config.command) {
      throw new Error("ProcessAdapter requires adapterConfig.command");
    }

    const prompt = this.buildPrompt(agent, context);

    return new Promise((resolve, reject) => {
      const child = spawn(config.command!, [...(config.args ?? []), prompt], {
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
          reject(new Error(`Process exited with code ${code}: ${stderr}`));
        } else {
          resolve({ costCents: 0, output: stdout });
        }
      });

      child.on("error", reject);
    });
  }

  private buildPrompt(agent: Agent, context: InvocationContext): string {
    const issueList = context.issues
      .map((i) => `- #${i.number} [${i.priority}] ${i.title}: ${i.description ?? ""}`)
      .join("\n");
    return [
      agent.systemPrompt ?? "",
      "",
      "Your current issues:",
      issueList,
    ].join("\n");
  }
}
