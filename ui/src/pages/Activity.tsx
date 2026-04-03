import { useQuery } from "@tanstack/react-query";
import { useCompanyContext } from "../context/CompanyContext.js";
import { apiFetch } from "../api/client.js";
import type { ActivityLog } from "@forge/shared/types";

export default function Activity() {
  const { activeCompany } = useCompanyContext();
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["activity", activeCompany?.id],
    queryFn: () =>
      apiFetch<ActivityLog[]>(
        `/api/activity${activeCompany ? `?companyId=${activeCompany.id}` : ""}`
      ),
    enabled: !!activeCompany,
  });

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600 }}>Activity</h1>

      {isLoading ? (
        <div style={{ color: "var(--color-muted)" }}>Loading…</div>
      ) : events.length === 0 ? (
        <div style={{ color: "var(--color-muted)", textAlign: "center", padding: 48 }}>
          No activity yet.
        </div>
      ) : (
        <div style={{ maxWidth: 640 }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                display: "flex",
                gap: 12,
                padding: "8px 0",
                borderBottom: "1px solid var(--color-border)",
                fontSize: 13,
              }}
            >
              <div style={{ color: "var(--color-muted)", fontSize: 11, minWidth: 120, flexShrink: 0 }}>
                {new Date(event.createdAt).toLocaleString()}
              </div>
              <div>
                <span style={{ fontWeight: 500 }}>{event.action}</span>
                {" "}
                <span style={{ color: "var(--color-muted)" }}>
                  {event.entityType} {event.entityId.slice(0, 8)}…
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
