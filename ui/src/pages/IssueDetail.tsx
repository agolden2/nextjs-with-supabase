import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useIssue, useUpdateIssue } from "../api/issues.js";
import { useAgents } from "../api/agents.js";
import { apiFetch } from "../api/client.js";
import { useCompanyContext } from "../context/CompanyContext.js";
import StatusIcon from "../components/StatusIcon.js";
import PriorityIcon from "../components/PriorityIcon.js";
import type { IssueStatus, IssuePriority } from "@forge/shared/types";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "@forge/shared/constants";

// ─── select style ────────────────────────────────────────────────────────────
const selectStyle = {
  background: "var(--color-surface)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border)",
  borderRadius: 4,
  padding: "3px 6px",
  fontSize: 13,
} as const;

// ─── Comments ─────────────────────────────────────────────────────────────────
interface Comment {
  id: string;
  body: string;
  authorAgentId: string | null;
  authorUserId: string | null;
  createdAt: string;
}

function CommentThread({ issueId, companyId }: { issueId: string; companyId: string }) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", issueId],
    queryFn: () => apiFetch<Comment[]>(`/api/comments?issueId=${issueId}`),
  });

  const postComment = useMutation({
    mutationFn: (body: string) =>
      apiFetch<Comment>("/api/comments", {
        method: "POST",
        body: JSON.stringify({ companyId, issueId, body, authorUserId: "user" }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", issueId] });
      setDraft("");
    },
  });

  const handlePost = () => {
    if (!draft.trim()) return;
    postComment.mutate(draft.trim());
  };

  return (
    <div style={{ marginTop: 32 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 12,
        }}
      >
        Comments ({comments.length})
      </div>

      {isLoading ? (
        <div style={{ color: "var(--color-muted)", fontSize: 13 }}>Loading…</div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: "10px 12px",
                marginBottom: 8,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                  fontSize: 11,
                  color: "var(--color-muted)",
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {c.authorAgentId ? "🤖 Agent" : c.authorUserId ?? "User"}
                </span>
                <span>·</span>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {c.body}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New comment input */}
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handlePost();
        }}
        placeholder="Leave a comment… (⌘Enter to post)"
        style={{
          width: "100%",
          minHeight: 80,
          background: "var(--color-surface)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
          borderRadius: 6,
          padding: "8px 10px",
          fontSize: 13,
          lineHeight: 1.6,
          resize: "vertical",
          outline: "none",
          fontFamily: "inherit",
          marginBottom: 8,
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handlePost}
          disabled={!draft.trim() || postComment.isPending}
          style={{
            background: "var(--color-accent)",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "5px 14px",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {postComment.isPending ? "Posting…" : "Post comment"}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeCompany } = useCompanyContext();
  const { data: issue, isLoading } = useIssue(id!);
  const { data: agents = [] } = useAgents(activeCompany?.id);
  const updateIssue = useUpdateIssue();

  if (isLoading)
    return <div style={{ padding: 32, color: "var(--color-muted)" }}>Loading…</div>;
  if (!issue)
    return <div style={{ padding: 32, color: "var(--color-muted)" }}>Not found</div>;

  const update = (changes: Record<string, unknown>) =>
    updateIssue.mutate({ id: issue.id, ...changes } as any);

  const assigneeName =
    agents.find((a) => a.id === issue.assigneeId)?.name ?? null;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 32px", display: "flex", gap: 32 }}>
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
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

        {/* Issue identifier */}
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 6 }}>
          <StatusIcon status={issue.status as IssueStatus} size={12} />
          {" "}#{issue.number}
        </div>

        {/* Title */}
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const t = e.currentTarget.textContent?.trim();
            if (t && t !== issue.title) update({ title: t });
          }}
          style={{
            fontSize: 20,
            fontWeight: 600,
            margin: "0 0 24px",
            outline: "none",
            cursor: "text",
            lineHeight: 1.4,
          }}
        >
          {issue.title}
        </h1>

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
            key={issue.id}
            defaultValue={issue.description ?? ""}
            onBlur={(e) => {
              if (e.target.value !== (issue.description ?? ""))
                update({ description: e.target.value });
            }}
            placeholder="Add a description…"
            style={{
              width: "100%",
              minHeight: 140,
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

        {/* Comments */}
        <CommentThread issueId={issue.id} companyId={issue.companyId} />
      </div>

      {/* Properties sidebar */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          paddingTop: 44, // align with title area
        }}
      >
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            fontSize: 12,
          }}
        >
          {/* Status */}
          <div>
            <div style={{ color: "var(--color-muted)", marginBottom: 4 }}>Status</div>
            <select
              value={issue.status}
              onChange={(e) => update({ status: e.target.value })}
              style={{ ...selectStyle, width: "100%" }}
            >
              {ISSUE_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <div style={{ color: "var(--color-muted)", marginBottom: 4 }}>Priority</div>
            <select
              value={issue.priority}
              onChange={(e) => update({ priority: e.target.value })}
              style={{ ...selectStyle, width: "100%" }}
            >
              {ISSUE_PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div>
            <div style={{ color: "var(--color-muted)", marginBottom: 4 }}>Assignee</div>
            <select
              value={issue.assigneeId ?? ""}
              onChange={(e) =>
                update({ assigneeId: e.target.value || null })
              }
              style={{ ...selectStyle, width: "100%" }}
            >
              <option value="">— unassigned —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Due date */}
          <div>
            <div style={{ color: "var(--color-muted)", marginBottom: 4 }}>Due date</div>
            <input
              type="date"
              defaultValue={
                issue.dueDate
                  ? new Date(issue.dueDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                update({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })
              }
              style={{ ...selectStyle, width: "100%" }}
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid var(--color-border)" }} />

          {/* Metadata */}
          <div style={{ color: "var(--color-muted)", fontSize: 11 }}>
            <div>#{issue.number}</div>
            <div style={{ marginTop: 2 }}>
              Created {new Date(issue.createdAt).toLocaleDateString()}
            </div>
            {issue.checkoutRunId && (
              <div style={{ marginTop: 4, color: "#6366f1" }}>🔒 Checked out</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
