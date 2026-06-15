import { useState } from "react";
import { inp, lbl, sectionBox } from "../components/TSRShared";

export default function TSRTitleEvidence({
  titleEvidence,
  setTitleEvidence,
}) {
  const addDocument = () => {
    setTitleEvidence((prev) => [
      ...prev,
      {
        documentType: "",
        executionDate: "",
        executedBy: "",
        executedInFavourOf: "",
        registrationOffice: "",
        registrationNumber: "",
        remarks: "",
      },
    ]);
  };

  const removeDocument = (index) => {
    setTitleEvidence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setTitleEvidence((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          PART IV : EVIDENCE OF TITLE OF PROPERTY
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={addDocument}
            style={{
              background: "var(--black)",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            + Add New Entry
          </button>
        </div>
      </div>

      {titleEvidence.map((doc, index) => (
        <div key={index} className="border rounded-lg p-4 bg-white shadow">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <strong style={{ fontSize: 13 }}>Document #{index + 1}</strong>

            {titleEvidence.length > 1 && (
              <button
                type="button"
                onClick={() => removeDocument(index)}
                style={{
                  background: "#f3f4f6",
                  color: "var(--black)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Remove
              </button>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <input
              style={inp}
              type="text"
              placeholder="Document Type"
              value={doc.documentType}
              onChange={(e) =>
                handleChange(index, "documentType", e.target.value)
              }
            />

            <input
              style={inp}
              type="date"
              value={doc.executionDate}
              onChange={(e) =>
                handleChange(index, "executionDate", e.target.value)
              }
            />

            <input
              style={inp}
              type="text"
              placeholder="Executed By"
              value={doc.executedBy}
              onChange={(e) =>
                handleChange(index, "executedBy", e.target.value)
              }
            />

            <input
              style={inp}
              type="text"
              placeholder="Executed In Favour Of"
              value={doc.executedInFavourOf}
              onChange={(e) =>
                handleChange(index, "executedInFavourOf", e.target.value)
              }
            />

            <input
              style={inp}
              type="text"
              placeholder="Registration Office"
              value={doc.registrationOffice}
              onChange={(e) =>
                handleChange(index, "registrationOffice", e.target.value)
              }
            />

            <input
              style={inp}
              type="text"
              placeholder="Registration Number"
              value={doc.registrationNumber}
              onChange={(e) =>
                handleChange(index, "registrationNumber", e.target.value)
              }
            />

            <textarea
              style={inp}
              placeholder="Remarks"
              className="col-span-2"
              value={doc.remarks}
              onChange={(e) => handleChange(index, "remarks", e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
