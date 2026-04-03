import { useQuery } from "@tanstack/react-query";
import { useCompanyContext } from "../context/CompanyContext.js";
import { apiFetch } from "../api/client.js";
import type { Project } from "@forge/shared/types";

export default function Projects() {
  const { activeCompany } = useCompanyContext();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects", activeCompany?.id],
    queryFn: () =>
      apiFetch<Project[]>(`/api/projects${activeCompany ? `?companyId=${activeCompany.id}` : ""}`),
    enabled: !!activeCompany,
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600 }}>Projects</h1>
      {isLoading ? (
        <div style={{ color: "var(--color-muted)" }}>Loading…</div>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
              <div style={{ color: "var(--color-muted)", fontSize: 12 }}>{p.status}</div>
              {p.description && (
                <div style={{ color: "var(--color-muted)", fontSize: 12, marginTop: 8 }}>
                  {p.description}
                </div>
              )}
            </div>
          ))}
          {projects.length === 0 && (
            <div style={{ color: "var(--color-muted)", gridColumn: "1/-1", textAlign: "center", padding: 48 }}>
              No projects yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
