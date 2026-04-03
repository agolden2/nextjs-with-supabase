import type { AgentAdapter } from "./types.js";
import { ClaudeLocalAdapter } from "./claude-local.js";
import { ProcessAdapter } from "./process.js";
import { HttpAdapter } from "./http.js";

const registry: Record<string, AgentAdapter> = {
  claude_local: new ClaudeLocalAdapter(),
  process: new ProcessAdapter(),
  http: new HttpAdapter(),
};

export function getAdapter(adapterType: string): AgentAdapter {
  const adapter = registry[adapterType];
  if (!adapter) {
    throw new Error(`Unknown adapter type: ${adapterType}`);
  }
  return adapter;
}

export * from "./types.js";
