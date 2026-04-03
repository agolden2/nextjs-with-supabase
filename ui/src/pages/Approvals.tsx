import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompanyContext } from "../context/CompanyContext.js";
import { apiFetch } from "../api/client.js";
import type { Approval } from "@forge/shared/types";

export default function Approvals() {
  const { activeCompany } = useCompanyContext();
  const qc = useQueryClient();

  const { data: approvals = [], isLoading } = useQuery({
    queryKey: ["approvals", activeCompany?.id],
    queryFn: () =>
      apiFetch<Approval[]>(`/api/approvals?status=pending${activeCompany ? `&companyId=${activeCompany.id}` : ""}`),
    enabled: !!activeCompany,
  });

  const approve = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/approvals/${id}/approve`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["approvals"] }),
  });

  const reject = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/api/approvals/${id}/reject`, { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["approvals"] }),
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600 }}>
        Approvals
        {approvals.length > 0 && (
          <span
            style={{
              marginLeft: 8,
              background: "#ef4444",
              color: "#fff",
              borderRadius: 10,
              padding: "1px 7px",
              fontSize: 12,
            }}
          >
            {approvals.length}
          </span>
        )}
      </h1>

      {isLoading ? (
        <div style={{ color: "var(--color-muted)" }}>Loading…</div>
      ) : approvals.length === 0 ? (
        <div style={{ color: "var(--color-muted)", textAlign: "center", padding: 48 }}>
          No pending approvals.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 600 }}>
          {approvals.map((approval) => (
            <div
              key={approval.id}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                {approval.title}
              </div>
              <div style={{ color: "var(--color-muted)", fontSize: 12, marginBottom: 12 }}>
                {approval.type} · {new Date(approval.createdAt).toLocaleDateString()}
              </div>
              {approval.description && (
                <div style={{ fontSize: 13, marginBottom: 12 }}>{approval.description}</div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => approve.mutate(approval.id)}
                  style={{
                    background: "#22c55e",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "5px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => reject.mutate(approval.id)}
                  style={{
                    background: "transparent",
                    color: "#ef4444",
                    border: "1px solid #ef4444",
                    borderRadius: 6,
                    padding: "5px 14px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
