import { useQuery } from "@tanstack/react-query";
import { useCompanyContext } from "../context/CompanyContext.js";
import { apiFetch } from "../api/client.js";

interface CostSummaryRow {
  agentId: string;
  totalCents: number;
  eventCount: number;
}

export default function Costs() {
  const { activeCompany } = useCompanyContext();
  const { data: summary = [], isLoading } = useQuery({
    queryKey: ["costs", "summary", activeCompany?.id],
    queryFn: () =>
      apiFetch<CostSummaryRow[]>(
        `/api/costs/summary${activeCompany ? `?companyId=${activeCompany.id}` : ""}`
      ),
    enabled: !!activeCompany,
  });

  const total = summary.reduce((sum, row) => sum + row.totalCents, 0);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600 }}>Costs</h1>
      <div style={{ color: "var(--color-muted)", fontSize: 13, marginBottom: 24 }}>
        Total: ${(total / 100).toFixed(2)} this month
      </div>

      {isLoading ? (
        <div style={{ color: "var(--color-muted)" }}>Loading…</div>
      ) : summary.length === 0 ? (
        <div style={{ color: "var(--color-muted)", textAlign: "center", padding: 48 }}>
          No cost events yet.
        </div>
      ) : (
        <div style={{ maxWidth: 500 }}>
          {summary.map((row) => (
            <div
              key={row.agentId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 14px",
                marginBottom: 4,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              <span style={{ color: "var(--color-muted)" }}>{row.agentId.slice(0, 8)}…</span>
              <span>${(row.totalCents / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
