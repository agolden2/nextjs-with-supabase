import type { AgentAdapter, InvocationContext, InvokeResult } from "./types.js";
import type { Agent } from "@forge/shared/types";

// Posts to a webhook URL and awaits a JSON response
export class HttpAdapter implements AgentAdapter {
  async invoke(agent: Agent, context: InvocationContext): Promise<InvokeResult> {
    const config = (agent.adapterConfig ?? {}) as {
      webhookUrl?: string;
      headers?: Record<string, string>;
      timeoutMs?: number;
    };

    if (!config.webhookUrl) {
      throw new Error("HttpAdapter requires adapterConfig.webhookUrl");
    }

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      config.timeoutMs ?? 300_000
    );

    try {
      const response = await fetch(config.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config.headers ?? {}),
        },
        body: JSON.stringify({ agentId: agent.id, runId: context.runId, issues: context.issues }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      const result = (await response.json()) as Partial<InvokeResult>;
      return {
        costCents: result.costCents ?? 0,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        model: result.model,
        output: result.output,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
