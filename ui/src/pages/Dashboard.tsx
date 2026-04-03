import { useCompanyContext } from "../context/CompanyContext.js";
import { useIssues } from "../api/issues.js";
import { useAgents } from "../api/agents.js";

export default function Dashboard() {
  const { activeCompany } = useCompanyContext();
  const { data: issues = [] } = useIssues(
    activeCompany ? { companyId: activeCompany.id } : undefined
  );
  const { data: agents = [] } = useAgents(activeCompany?.id);

  const inProgress = issues.filter((i) => i.status === "in_progress").length;
  const done = issues.filter((i) => i.status === "done").length;
  const activeAgents = agents.filter((a) => a.status === "active").length;

  const stats = [
    { label: "Total issues", value: issues.length },
    { label: "In progress", value: inProgress },
    { label: "Completed", value: done },
    { label: "Active agents", value: activeAgents },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 600 }}>
        {activeCompany?.name ?? "Dashboard"}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text)" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {activeCompany?.missionStatement && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "16px 20px",
          }}
        >
          <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Mission
          </div>
          <div style={{ fontSize: 14, color: "var(--color-text)" }}>
            {activeCompany.missionStatement}
          </div>
        </div>
      )}
    </div>
  );
}
