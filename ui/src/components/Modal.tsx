import { useEffect, type ReactNode } from "react";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

export default function Modal({ title, onClose, children, width = 480 }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width,
          maxWidth: "90vw",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 10,
          padding: "20px 24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--color-muted)",
              fontSize: 18,
              cursor: "pointer",
              lineHeight: 1,
              padding: "0 4px",
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Shared form field styles
export const fieldStyle = {
  width: "100%",
  background: "var(--color-bg)",
  color: "var(--color-text)",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  padding: "7px 10px",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
} as const;

export const labelStyle = {
  display: "block",
  marginBottom: 12,
} as const;

export const labelTextStyle = {
  fontSize: 12,
  color: "var(--color-muted)",
  marginBottom: 4,
  display: "block",
} as const;

export const btnPrimary = {
  background: "var(--color-accent)",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "7px 16px",
  fontSize: 13,
  cursor: "pointer",
  fontWeight: 500,
} as const;

export const btnSecondary = {
  background: "transparent",
  color: "var(--color-muted)",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  padding: "7px 14px",
  fontSize: 13,
  cursor: "pointer",
} as const;
