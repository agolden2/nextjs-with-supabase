import { useState } from "react";
import { useCompanyContext } from "../context/CompanyContext.js";
import { useUpdateCompany } from "../api/companies.js";
import CreateCompanyModal from "../components/CreateCompanyModal.js";

const fieldStyle = {
  width: "100%",
  background: "var(--color-bg)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
} as const;

export default function Settings() {
  const { activeCompany, companies, setActiveCompany } = useCompanyContext();
  const updateCompany = useUpdateCompany();
  const [showCreateCompany, setShowCreateCompany] = useState(false);

  return (
    <div style={{ padding: "24px 32px", maxWidth: 560 }}>
      <h1 style={{ margin: "0 0 24px", fontSize: 16, fontWeight: 600 }}>Settings</h1>

      {/* Companies section */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 8,
          padding: 20,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14 }}>Companies</div>
          <button
            onClick={() => setShowCreateCompany(true)}
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            + New
          </button>
        </div>

        {companies.map((c) => (
          <div
            key={c.id}
            onClick={() => setActiveCompany(c)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 6,
              marginBottom: 4,
              cursor: "pointer",
              background:
                activeCompany?.id === c.id
                  ? "rgba(99,102,241,0.1)"
                  : "transparent",
              border:
                activeCompany?.id === c.id
                  ? "1px solid rgba(99,102,241,0.3)"
                  : "1px solid transparent",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {c.name[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
              {c.missionStatement && (
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--color-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 320,
                  }}
                >
                  {c.missionStatement}
                </div>
              )}
            </div>
            {activeCompany?.id === c.id && (
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--color-accent)" }}>
                active
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Active company editor */}
      {activeCompany && (
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            padding: 20,
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 14 }}>
            Edit: {activeCompany.name}
          </div>

          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4 }}>Name</div>
            <input
              key={activeCompany.id + "_name"}
              defaultValue={activeCompany.name}
              onBlur={(e) =>
                updateCompany.mutate({ id: activeCompany.id, name: e.target.value })
              }
              style={fieldStyle}
            />
          </label>

          <label style={{ display: "block", marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4 }}>Mission</div>
            <textarea
              key={activeCompany.id + "_mission"}
              defaultValue={activeCompany.missionStatement ?? ""}
              onBlur={(e) =>
                updateCompany.mutate({ id: activeCompany.id, missionStatement: e.target.value })
              }
              style={{ ...fieldStyle, resize: "vertical", minHeight: 72 }}
            />
          </label>

          <label style={{ display: "block" }}>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4 }}>Description</div>
            <textarea
              key={activeCompany.id + "_desc"}
              defaultValue={activeCompany.description ?? ""}
              onBlur={(e) =>
                updateCompany.mutate({ id: activeCompany.id, description: e.target.value })
              }
              style={{ ...fieldStyle, resize: "vertical", minHeight: 60 }}
            />
          </label>
        </div>
      )}

      <div style={{ fontSize: 12, color: "var(--color-muted)" }}>
        Forge v0.1.0 · MIT License
      </div>

      {showCreateCompany && (
        <CreateCompanyModal onClose={() => setShowCreateCompany(false)} />
      )}
    </div>
  );
}
