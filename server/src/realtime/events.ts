export type ForgeEventType =
  | "issue:created"
  | "issue:updated"
  | "issue:deleted"
  | "agent:updated"
  | "heartbeat:started"
  | "heartbeat:completed"
  | "approval:created"
  | "approval:resolved";

export interface ForgeEvent {
  type: ForgeEventType;
  companyId: string;
  payload: unknown;
  timestamp: string;
}

export function makeEvent(
  type: ForgeEventType,
  companyId: string,
  payload: unknown
): ForgeEvent {
  return { type, companyId, payload, timestamp: new Date().toISOString() };
}
