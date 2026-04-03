import { NavLink } from "react-router-dom";
import { useCompanyContext } from "../context/CompanyContext.js";

const navItems = [
  { to: "/issues", label: "Issues", icon: "⬜" },
  { to: "/projects", label: "Projects", icon: "📁" },
  { to: "/goals", label: "Goals", icon: "🎯" },
  { to: "/agents", label: "Agents", icon: "🤖" },
  { to: "/org", label: "Org Chart", icon: "🌳" },
  { to: "/approvals", label: "Approvals", icon: "✅" },
  { to: "/costs", label: "Costs", icon: "💰" },
  { to: "/activity", label: "Activity", icon: "📋" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const { companies, activeCompany, setActiveCompany } = useCompanyContext();

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Company switcher */}
      <div
        style={{
          padding: "16px 12px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: 6,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {activeCompany?.name[0]?.toUpperCase() ?? "F"}
          </span>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 13,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "var(--color-text)",
              }}
            >
              {activeCompany?.name ?? "Select company"}
            </div>
          </div>
        </div>

        {companies.length > 1 && (
          <select
            value={activeCompany?.id ?? ""}
            onChange={(e) => {
              const c = companies.find((co) => co.id === e.target.value);
              if (c) setActiveCompany(c);
            }}
            style={{
              marginTop: 4,
              width: "100%",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: 4,
              padding: "2px 4px",
              fontSize: 12,
            }}
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 0" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              textDecoration: "none",
              color: isActive ? "var(--color-text)" : "var(--color-muted)",
              background: isActive ? "rgba(99,102,241,0.1)" : "transparent",
              borderLeft: isActive ? "2px solid var(--color-accent)" : "2px solid transparent",
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              transition: "all 0.1s",
            })}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--color-border)",
          fontSize: 11,
          color: "var(--color-muted)",
        }}
      >
        Forge v0.1.0
      </div>
    </aside>
  );
}
