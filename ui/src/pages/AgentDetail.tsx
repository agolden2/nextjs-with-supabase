import { useParams, useNavigate } from "react-router-dom";
import { useAgent } from "../api/agents.js";
import { useIssues } from "../api/issues.js";

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: agent, isLoading } = useAgent(id!);
  const { data: issues = [] } = useIssues(id ? { assigneeId: id } : undefined);

  if (isLoading)
    return <div style={{ padding: 32, color: "var(--color-muted)" }}>Loading…</div>;
  if (!agent)
    return <div style={{ padding: 32, color: "var(--color-muted)" }}>Not found</div>;

  return (
    <div style={{ padding: "24px 32px", maxWidth: 900 }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--color-muted)",
          cursor: "pointer",
          fontSize: 13,
          padding: 0,
          marginBottom: 16,
        }}
      >
        ← Back
      </button>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {agent.name[0]?.toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{agent.name}</h1>
          <div style={{ color: "var(--color-muted)", fontSize: 13 }}>
            {agent.role} · {agent.adapterType} · {agent.status}
          </div>
        </div>
      </div>

      {/* Issues assigned to this agent */}
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          Assigned Issues ({issues.length})
        </h2>
        {issues.length === 0 ? (
          <div style={{ color: "var(--color-muted)", fontSize: 13 }}>No issues assigned.</div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => navigate(`/issues/${issue.id}`)}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid var(--color-border)",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              #{issue.number} — {issue.title}
              <span style={{ marginLeft: 8, color: "var(--color-muted)", fontSize: 11 }}>
                [{issue.status}]
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
