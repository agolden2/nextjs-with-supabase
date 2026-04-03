import type { Agent } from "@forge/shared/types";

export interface InvocationContext {
  runId: string;
  issues: Array<{
    id: string;
    number: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
  }>;
  companyMission?: string;
  projectContext?: string;
}

export interface InvokeResult {
  costCents: number;
  inputTokens?: number;
  outputTokens?: number;
  model?: string;
  output?: string;
  toolCalls?: Array<{ name: string; args: unknown; result?: unknown }>;
}

export interface AgentAdapter {
  invoke(agent: Agent, context: InvocationContext): Promise<InvokeResult>;
  cancel?(runId: string): Promise<void>;
}
