import { useNavigate } from "react-router-dom";
import type { Issue } from "@forge/shared/types";
import StatusIcon from "./StatusIcon.js";
import PriorityIcon from "./PriorityIcon.js";

interface IssueRowProps {
  issue: Issue;
  selected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
}

export default function IssueRow({ issue, selected, onSelect }: IssueRowProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/issues/${issue.id}`)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 16px",
        borderBottom: "1px solid var(--color-border)",
        cursor: "pointer",
        background: selected ? "rgba(99,102,241,0.06)" : "transparent",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = selected
          ? "rgba(99,102,241,0.1)"
          : "rgba(255,255,255,0.02)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = selected
          ? "rgba(99,102,241,0.06)"
          : "transparent")
      }
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={selected ?? false}
        onChange={(e) => {
          e.stopPropagation();
          onSelect?.(issue.id, e.target.checked);
        }}
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: "pointer", flexShrink: 0 }}
      />

      {/* Priority */}
      <PriorityIcon priority={issue.priority as any} />

      {/* Status */}
      <StatusIcon status={issue.status as any} />

      {/* Issue number */}
      <span
        style={{
          color: "var(--color-muted)",
          fontSize: 12,
          minWidth: 40,
          flexShrink: 0,
        }}
      >
        #{issue.number}
      </span>

      {/* Title */}
      <span
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: 13,
          color: issue.status === "done" || issue.status === "cancelled"
            ? "var(--color-muted)"
            : "var(--color-text)",
          textDecoration:
            issue.status === "cancelled" ? "line-through" : "none",
        }}
      >
        {issue.title}
      </span>

      {/* Due date */}
      {issue.dueDate && (
        <span style={{ color: "var(--color-muted)", fontSize: 11, flexShrink: 0 }}>
          {new Date(issue.dueDate).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}
