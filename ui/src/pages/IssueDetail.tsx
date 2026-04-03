import { useParams, useNavigate } from "react-router-dom";
import { useIssue, useUpdateIssue } from "../api/issues.js";
import StatusIcon from "../components/StatusIcon.js";
import PriorityIcon from "../components/PriorityIcon.js";
import type { IssueStatus, IssuePriority } from "@forge/shared/types";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "@forge/shared/constants";

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: issue, isLoading } = useIssue(id!);
  const updateIssue = useUpdateIssue();

  if (isLoading)
    return (
      <div style={{ padding: 32, color: "var(--color-muted)" }}>Loading…</div>
    );
  if (!issue)
    return (
      <div style={{ padding: 32, color: "var(--color-muted)" }}>Not found</div>
    );

  const update = (changes: Partial<typeof issue>) =>
    updateIssue.mutate({ id: issue.id, ...changes } as any);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 32px" }}>
      {/* Back */}
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

      {/* Title */}
      <h1
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => update({ title: e.currentTarget.textContent ?? "" })}
        style={{
          fontSize: 22,
          fontWeight: 600,
          margin: "0 0 16px",
          outline: "none",
          cursor: "text",
        }}
      >
        {issue.title}
      </h1>

      {/* Properties */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr",
          gap: "8px 16px",
          marginBottom: 24,
          fontSize: 13,
        }}
      >
        <span style={{ color: "var(--color-muted)" }}>Status</span>
        <select
          value={issue.status}
          onChange={(e) => update({ status: e.target.value as IssueStatus })}
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: 4,
            padding: "2px 6px",
            fontSize: 13,
          }}
        >
          {ISSUE_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <span style={{ color: "var(--color-muted)" }}>Priority</span>
        <select
          value={issue.priority}
          onChange={(e) => update({ priority: e.target.value as IssuePriority })}
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: 4,
            padding: "2px 6px",
            fontSize: 13,
          }}
        >
          {ISSUE_PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <span style={{ color: "var(--color-muted)" }}>Issue #</span>
        <span>{issue.number}</span>

        <span style={{ color: "var(--color-muted)" }}>Created</span>
        <span>{new Date(issue.createdAt).toLocaleString()}</span>
      </div>

      {/* Description */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 8,
          }}
        >
          Description
        </div>
        <textarea
          defaultValue={issue.description ?? ""}
          onBlur={(e) => update({ description: e.target.value })}
          placeholder="Add a description…"
          style={{
            width: "100%",
            minHeight: 120,
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: 6,
            padding: "10px 12px",
            fontSize: 13,
            lineHeight: 1.6,
            resize: "vertical",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
      </div>
    </div>
  );
}
