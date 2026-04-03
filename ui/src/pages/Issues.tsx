import { useState } from "react";
import { useCompanyContext } from "../context/CompanyContext.js";
import { useIssues, useCreateIssue } from "../api/issues.js";
import IssueRow from "../components/IssueRow.js";
import type { IssueStatus } from "@forge/shared/types";

const STATUS_GROUPS: IssueStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
  "cancelled",
];

const STATUS_LABELS: Record<IssueStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In Progress",
  in_review: "In Review",
  done: "Done",
  cancelled: "Cancelled",
};

export default function Issues() {
  const { activeCompany } = useCompanyContext();
  const { data: issues = [], isLoading } = useIssues(
    activeCompany ? { companyId: activeCompany.id } : undefined
  );
  const createIssue = useCreateIssue();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newTitle, setNewTitle] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState<IssueStatus | "all">("all");

  const filtered =
    filterStatus === "all"
      ? issues
      : issues.filter((i) => i.status === filterStatus);

  const grouped = STATUS_GROUPS.reduce<Record<IssueStatus, typeof issues>>(
    (acc, s) => {
      acc[s] = filtered.filter((i) => i.status === s);
      return acc;
    },
    {} as any
  );

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !activeCompany) return;
    await createIssue.mutateAsync({ companyId: activeCompany.id, title: newTitle.trim() });
    setNewTitle("");
    setShowCreate(false);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Issues</h1>
        <span style={{ color: "var(--color-muted)", fontSize: 13 }}>
          {issues.length}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 12,
            }}
          >
            <option value="all">All statuses</option>
            {STATUS_GROUPS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>

          {/* Create button */}
          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 13,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            + New issue
          </button>
        </div>
      </div>

      {/* Inline create */}
      {showCreate && (
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(99,102,241,0.05)",
          }}
        >
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
              if (e.key === "Escape") setShowCreate(false);
            }}
            placeholder="Issue title…"
            style={{
              flex: 1,
              background: "var(--color-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-accent)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            onClick={handleCreate}
            disabled={!newTitle.trim() || createIssue.isPending}
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Create
          </button>
          <button
            onClick={() => setShowCreate(false)}
            style={{
              background: "transparent",
              color: "var(--color-muted)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Issue list */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {isLoading ? (
          <div style={{ padding: 32, color: "var(--color-muted)", textAlign: "center" }}>
            Loading…
          </div>
        ) : issues.length === 0 ? (
          <div style={{ padding: 64, color: "var(--color-muted)", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⬜</div>
            <div>No issues yet.</div>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                marginTop: 12,
                background: "var(--color-accent)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "7px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Create your first issue
            </button>
          </div>
        ) : (
          STATUS_GROUPS.map((status) => {
            const group = grouped[status];
            if (group.length === 0) return null;
            return (
              <div key={status}>
                <div
                  style={{
                    padding: "8px 16px 4px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--color-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: "var(--color-bg)",
                    borderBottom: "1px solid var(--color-border)",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  {STATUS_LABELS[status]}
                  <span
                    style={{
                      marginLeft: 6,
                      background: "var(--color-border)",
                      borderRadius: 10,
                      padding: "1px 6px",
                      fontSize: 10,
                    }}
                  >
                    {group.length}
                  </span>
                </div>
                {group.map((issue) => (
                  <IssueRow
                    key={issue.id}
                    issue={issue}
                    selected={selectedIds.has(issue.id)}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{
              background: "transparent",
              color: "var(--color-muted)",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
