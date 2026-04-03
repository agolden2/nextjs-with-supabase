import { useNavigate } from "react-router-dom";
import { useCompanyContext } from "../context/CompanyContext.js";
import { useAgents, usePauseAgent, useResumeAgent } from "../api/agents.js";
import type { Agent } from "@forge/shared/types";

const STATUS_COLORS: Record<string, string> = {
  active: "#22c55e",
  paused: "#f59e0b",
  error: "#ef4444",
  provisioning: "#6366f1",
};

export default function Agents() {
  const navigate = useNavigate();
  const { activeCompany } = useCompanyContext();
  const { data: agents = [], isLoading } = useAgents(activeCompany?.id);
  const pauseAgent = usePauseAgent();
  const resumeAgent = useResumeAgent();

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Agents</h1>
        <span style={{ color: "var(--color-muted)", fontSize: 13 }}>{agents.length}</span>
      </div>

      {isLoading ? (
        <div style={{ color: "var(--color-muted)" }}>Loading…</div>
      ) : agents.length === 0 ? (
        <div style={{ color: "var(--color-muted)", textAlign: "center", padding: 48 }}>
          No agents yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => navigate(`/agents/${agent.id}`)}
              onPause={() => pauseAgent.mutate(agent.id)}
              onResume={() => resumeAgent.mutate(agent.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AgentCard({
  agent,
  onClick,
  onPause,
  onResume,
}: {
  agent: Agent;
  onClick: () => void;
  onPause: () => void;
  onResume: () => void;
}) {
  const spentPct = agent.budgetMonthlyCents > 0
    ? Math.min(100, (agent.spentMonthlyCents / agent.budgetMonthlyCents) * 100)
    : 0;

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: 16,
        cursor: "pointer",
        transition: "border-color 0.1s",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {agent.name[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{agent.name}</div>
          <div style={{ color: "var(--color-muted)", fontSize: 12 }}>{agent.role}</div>
        </div>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: STATUS_COLORS[agent.status] ?? "#71717a",
            flexShrink: 0,
            marginTop: 4,
          }}
          title={agent.status}
        />
      </div>

      {/* Budget bar */}
      <div style={{ marginBottom: 8 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "var(--color-muted)",
            marginBottom: 3,
          }}
        >
          <span>Budget</span>
          <span>
            ${(agent.spentMonthlyCents / 100).toFixed(0)} / $
            {(agent.budgetMonthlyCents / 100).toFixed(0)}
          </span>
        </div>
        <div
          style={{
            height: 3,
            background: "var(--color-border)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${spentPct}%`,
              background: spentPct > 80 ? "#ef4444" : "var(--color-accent)",
              borderRadius: 2,
              transition: "width 0.3s",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--color-muted)",
          }}
        >
          {agent.adapterType}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            agent.status === "active" ? onPause() : onResume();
          }}
          style={{
            background: "transparent",
            border: "1px solid var(--color-border)",
            borderRadius: 4,
            color: "var(--color-muted)",
            padding: "2px 8px",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          {agent.status === "active" ? "Pause" : "Resume"}
        </button>
      </div>
    </div>
  );
}
