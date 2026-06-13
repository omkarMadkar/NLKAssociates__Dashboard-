// TSROtherProvisions.jsx
// PART V - Other Provisions (5.1 - 5.21).
// Props:
//   otherProvisions       - array of {code, question, answer, remarks}
//   handleProvisionChange - (index, field, value) => void

import { inp } from "../components/TSRShared";

export default function TSROtherProvisions({ otherProvisions, handleProvisionChange }) {
  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "var(--black)" }}>
        PART V : OTHER PROVISIONS
      </h3>

      {otherProvisions.map((item, index) => (
        <div
          key={item.code}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            background: "white",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 14, color: "var(--black)" }}>
            {item.code} {item.question}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 12 }}>
            <select
              value={item.answer}
              onChange={(e) => handleProvisionChange(index, "answer", e.target.value)}
              style={inp}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="NA">NA</option>
              <option value="Not Known">Not Known</option>
            </select>

            <input
              placeholder="Remarks (optional)"
              value={item.remarks}
              onChange={(e) => handleProvisionChange(index, "remarks", e.target.value)}
              style={inp}
            />
          </div>
        </div>
      ))}
    </div>
  );
}