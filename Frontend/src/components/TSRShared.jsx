// tsrShared.jsx
// Shared style objects, status badge, and constants used across all TSR section components.

export const STATUS_STYLES = {
  initiated: { bg: "#e5e7eb", color: "#111111", label: "Initiated" },
  in_progress: { bg: "#f3f4f6", color: "#374151", label: "In Progress" },
  completed: { bg: "#111111", color: "#ffffff", label: "Completed" },
  cancelled: { bg: "#f3f4f6", color: "#6b7280", label: "Cancelled" },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.initiated;
  return (
    <span
      style={{
        padding: "3px 12px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: "1px solid var(--border)",
      }}
    >
      {s.label}
    </span>
  );
}

// Shared input style
export const inp = {
  border: "1px solid var(--border)",
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  background: "white",
  color: "var(--black)",
};

// Shared label style
export const lbl = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--muted)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  marginBottom: 6,
  display: "block",
};

// Shared error text style
export const errTxt = {
  color: "#dc2626",
  fontSize: 11,
  display: "block",
  marginTop: 4,
};

// 3-column grid wrapper
export const grid3 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 20,
};

// Box / card wrapper used for grouped sections
export const sectionBox = {
  background: "#fafafa",
  border: "1px solid var(--border)",
  borderRadius: 12,
  padding: 20,
};