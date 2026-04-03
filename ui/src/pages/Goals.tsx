import { useQuery } from "@tanstack/react-query";
import { useCompanyContext } from "../context/CompanyContext.js";
import { apiFetch } from "../api/client.js";
import type { Goal } from "@forge/shared/types";

function GoalTree({ goals, parentId = null, depth = 0 }: { goals: Goal[]; parentId?: string | null; depth?: number }) {
  const children = goals.filter((g) => (g.parentId ?? null) === parentId);
  if (children.length === 0) return null;

  return (
    <div style={{ marginLeft: depth * 24 }}>
      {children.map((goal) => (
        <div key={goal.id}>
          <div
            style={{
              padding: "10px 14px",
              margin: "4px 0",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{goal.title}</div>
                <div style={{ color: "var(--color-muted)", fontSize: 11 }}>
                  {goal.level} · {goal.status}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 80,
                    height: 4,
                    background: "var(--color-border)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${goal.progress}%`,
                      background: "var(--color-accent)",
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: "var(--color-muted)", minWidth: 28 }}>
                  {goal.progress}%
                </span>
              </div>
            </div>
          </div>
          <GoalTree goals={goals} parentId={goal.id} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

export default function Goals() {
  const { activeCompany } = useCompanyContext();
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals", activeCompany?.id],
    queryFn: () =>
      apiFetch<Goal[]>(`/api/goals${activeCompany ? `?companyId=${activeCompany.id}` : ""}`),
    enabled: !!activeCompany,
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600 }}>Goals</h1>
      {isLoading ? (
        <div style={{ color: "var(--color-muted)" }}>Loading…</div>
      ) : goals.length === 0 ? (
        <div style={{ color: "var(--color-muted)", textAlign: "center", padding: 48 }}>
          No goals yet.
        </div>
      ) : (
        <GoalTree goals={goals} />
      )}
    </div>
  );
}
