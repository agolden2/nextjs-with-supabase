import type { IssuePriority } from "@forge/shared/types";

const PRIORITY_CONFIG: Record<IssuePriority, { color: string; label: string; symbol: string }> = {
  urgent: { color: "#ef4444", label: "Urgent", symbol: "⚡" },
  high: { color: "#f97316", label: "High", symbol: "↑" },
  medium: { color: "#eab308", label: "Medium", symbol: "→" },
  low: { color: "#71717a", label: "Low", symbol: "↓" },
  none: { color: "#3f3f46", label: "No priority", symbol: "–" },
};

export default function PriorityIcon({
  priority,
  size = 14,
}: {
  priority: IssuePriority;
  size?: number;
}) {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.none;
  return (
    <span
      title={config.label}
      style={{
        fontSize: size,
        color: config.color,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        fontWeight: 700,
      }}
    >
      {config.symbol}
    </span>
  );
}
