import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Modal, { fieldStyle, labelStyle, labelTextStyle, btnPrimary, btnSecondary } from "./Modal.js";
import { apiFetch } from "../api/client.js";
import { useAgents } from "../api/agents.js";
import type { Agent } from "@forge/shared/types";
import { AGENT_ROLES, AGENT_ADAPTER_TYPES } from "@forge/shared/constants";

interface Props {
  companyId: string;
  onClose: () => void;
  onCreated?: (agent: Agent) => void;
}

export default function CreateAgentModal({ companyId, onClose, onCreated }: Props) {
  const qc = useQueryClient();
  const { data: existingAgents = [] } = useAgents(companyId);

  const [name, setName] = useState("");
  const [role, setRole] = useState<string>("engineer");
  const [adapterType, setAdapterType] = useState<string>("claude_local");
  const [reportsTo, setReportsTo] = useState<string>("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [budgetDollars, setBudgetDollars] = useState("100");
  const [heartbeatSec, setHeartbeatSec] = useState("300");
  const [error, setError] = useState("");

  const createAgent = useMutation({
    mutationFn: (body: object) => apiFetch<Agent>("/api/agents", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["agents"] }),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      const agent = await createAgent.mutateAsync({
        companyId,
        name: name.trim(),
        role,
        adapterType,
        reportsTo: reportsTo || undefined,
        systemPrompt: systemPrompt || undefined,
        budgetMonthlyCents: Math.round(parseFloat(budgetDollars || "0") * 100),
        heartbeatIntervalSeconds: parseInt(heartbeatSec || "300", 10),
      });
      onCreated?.(agent);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create agent");
    }
  };

  return (
    <Modal title="New Agent" onClose={onClose} width={520}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <label style={labelStyle}>
            <span style={labelTextStyle}>Name *</span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alice (Engineer)"
              style={fieldStyle}
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={fieldStyle}>
              {AGENT_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Adapter</span>
            <select value={adapterType} onChange={(e) => setAdapterType(e.target.value)} style={fieldStyle}>
              {AGENT_ADAPTER_TYPES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Reports to</span>
            <select value={reportsTo} onChange={(e) => setReportsTo(e.target.value)} style={fieldStyle}>
              <option value="">— nobody —</option>
              {existingAgents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Monthly budget ($)</span>
            <input
              type="number"
              min="0"
              step="10"
              value={budgetDollars}
              onChange={(e) => setBudgetDollars(e.target.value)}
              style={fieldStyle}
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>Heartbeat interval (s)</span>
            <input
              type="number"
              min="30"
              step="30"
              value={heartbeatSec}
              onChange={(e) => setHeartbeatSec(e.target.value)}
              style={fieldStyle}
            />
          </label>
        </div>

        <label style={labelStyle}>
          <span style={labelTextStyle}>System prompt</span>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="You are a software engineer at…"
            style={{ ...fieldStyle, minHeight: 88, resize: "vertical" }}
          />
        </label>

        {error && (
          <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={btnSecondary}>
            Cancel
          </button>
          <button type="submit" disabled={createAgent.isPending} style={btnPrimary}>
            {createAgent.isPending ? "Creating…" : "Create agent"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
