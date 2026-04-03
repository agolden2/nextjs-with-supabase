import type { IssueStatus } from "@forge/shared/types";

const STATUS_CONFIG: Record<IssueStatus, { color: string; label: string; symbol: string }> = {
  backlog: { color: "#71717a", label: "Backlog", symbol: "○" },
  todo: { color: "#a1a1aa", label: "Todo", symbol: "◌" },
  in_progress: { color: "#6366f1", label: "In Progress", symbol: "◑" },
  in_review: { color: "#f59e0b", label: "In Review", symbol: "◕" },
  done: { color: "#22c55e", label: "Done", symbol: "●" },
  cancelled: { color: "#52525b", label: "Cancelled", symbol: "⊘" },
};

export default function StatusIcon({
  status,
  size = 16,
}: {
  status: IssueStatus;
  size?: number;
}) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.backlog;
  return (
    <span
      title={config.label}
      style={{
        fontSize: size,
        color: config.color,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {config.symbol}
    </span>
  );
}
