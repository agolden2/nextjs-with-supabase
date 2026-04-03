import { useCompanyContext } from "../context/CompanyContext.js";
import { useUpdateCompany } from "../api/companies.js";

export default function Settings() {
  const { activeCompany } = useCompanyContext();
  const updateCompany = useUpdateCompany();

  if (!activeCompany) {
    return (
      <div style={{ padding: 32, color: "var(--color-muted)" }}>
        No company selected.
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 32px", maxWidth: 560 }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600 }}>Settings</h1>

      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Company</div>

        <label style={{ display: "block", marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4 }}>Name</div>
          <input
            defaultValue={activeCompany.name}
            onBlur={(e) =>
              updateCompany.mutate({ id: activeCompany.id, name: e.target.value })
            }
            style={{
              width: "100%",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              outline: "none",
            }}
          />
        </label>

        <label style={{ display: "block" }}>
          <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4 }}>Mission</div>
          <textarea
            defaultValue={activeCompany.missionStatement ?? ""}
            onBlur={(e) =>
              updateCompany.mutate({ id: activeCompany.id, missionStatement: e.target.value })
            }
            style={{
              width: "100%",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 13,
              outline: "none",
              resize: "vertical",
              minHeight: 80,
              fontFamily: "inherit",
            }}
          />
        </label>
      </div>

      <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
        Forge v0.1.0 · MIT License
      </div>
    </div>
  );
}
