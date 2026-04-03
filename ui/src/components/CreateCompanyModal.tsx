import { useState } from "react";
import Modal, { fieldStyle, labelStyle, labelTextStyle, btnPrimary, btnSecondary } from "./Modal.js";
import { useCreateCompany } from "../api/companies.js";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

export default function CreateCompanyModal({ onClose, onCreated }: Props) {
  const createCompany = useCreateCompany();
  const [name, setName] = useState("");
  const [mission, setMission] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      await createCompany.mutateAsync({ name: name.trim(), description: description || undefined, missionStatement: mission || undefined });
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create company");
    }
  };

  return (
    <Modal title="New Company" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>
          <span style={labelTextStyle}>Company name *</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            style={fieldStyle}
          />
        </label>

        <label style={labelStyle}>
          <span style={labelTextStyle}>Mission statement</span>
          <input
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Build great software with AI"
            style={fieldStyle}
          />
        </label>

        <label style={labelStyle}>
          <span style={labelTextStyle}>Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this company do?"
            style={{ ...fieldStyle, minHeight: 72, resize: "vertical" }}
          />
        </label>

        {error && (
          <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} style={btnSecondary}>
            Cancel
          </button>
          <button type="submit" disabled={createCompany.isPending} style={btnPrimary}>
            {createCompany.isPending ? "Creating…" : "Create company"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
