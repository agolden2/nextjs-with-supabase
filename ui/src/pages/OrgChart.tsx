import { useNavigate } from "react-router-dom";
import { useCompanyContext } from "../context/CompanyContext.js";
import { useOrgChart } from "../api/agents.js";
import type { OrgNode } from "@forge/shared/types";

function OrgNodeCard({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const navigate = useNavigate();
  const spentPct =
    node.agent.budgetMonthlyCents > 0
      ? Math.min(100, (node.agent.spentMonthlyCents / node.agent.budgetMonthlyCents) * 100)
      : 0;

  return (
    <div style={{ marginLeft: depth * 32 }}>
      <div
        onClick={() => navigate(`/agents/${node.agent.id}`)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          margin: "4px 0",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          cursor: "pointer",
          maxWidth: 360,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {node.agent.name[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{node.agent.name}</div>
          <div style={{ color: "var(--color-muted)", fontSize: 11 }}>{node.agent.role}</div>
          <div
            style={{
              height: 2,
              background: "var(--color-border)",
              borderRadius: 1,
              marginTop: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${spentPct}%`,
                background: spentPct > 80 ? "#ef4444" : "var(--color-accent)",
              }}
            />
          </div>
        </div>
        {node.issueCount > 0 && (
          <span
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              borderRadius: 10,
              padding: "1px 7px",
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            {node.issueCount}
          </span>
        )}
      </div>
      {node.children.map((child) => (
        <OrgNodeCard key={child.agent.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function OrgChart() {
  const { activeCompany } = useCompanyContext();
  const { data: tree = [], isLoading } = useOrgChart(activeCompany?.id ?? "");

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600 }}>Org Chart</h1>
      {isLoading ? (
        <div style={{ color: "var(--color-muted)" }}>Loading…</div>
      ) : tree.length === 0 ? (
        <div style={{ color: "var(--color-muted)", textAlign: "center", padding: 48 }}>
          No agents yet.
        </div>
      ) : (
        tree.map((node) => <OrgNodeCard key={node.agent.id} node={node} />)
      )}
    </div>
  );
}
