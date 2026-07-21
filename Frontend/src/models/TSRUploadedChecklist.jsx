import React from "react";

// These 4 documents are always required for every TSR case, in this order.
// Rows matching these names are locked (name can't be edited/removed) so
// users can't accidentally rename or delete a standard checklist item —
// they just upload the file against it.
export const FIXED_DOCUMENT_NAMES = [
  "E Challan",
  "E Search Receipt",
  "All Search Receipt",
  "Final Search",
];

export const getDefaultUploadedChecklist = () => [
  ...FIXED_DOCUMENT_NAMES.map((name) => ({ name, fileName: "", filePath: "", remarks: "" })),
  { name: "", fileName: "", filePath: "", remarks: "" },
];

export default function TSRUploadedChecklist({
  documents = [],
  setDocuments,
  handleFileUpload,
  handleViewFile,
  uploadStatus = {},
}) {
  const inputStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    background: "#f8fafc",
    transition: "all 0.2s ease",
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#cbd5e1";
    e.target.style.background = "#ffffff";
    e.target.style.boxShadow = "0 0 0 2px rgba(203,213,225,0.2)";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#e2e8f0";
    e.target.style.background = "#f8fafc";
    e.target.style.boxShadow = "none";
  };

  const handleAddRow = () => {
    setDocuments([
      ...documents,
      {
        name: "",
        fileName: "",
        filePath: "",
        remarks: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    if (FIXED_DOCUMENT_NAMES.includes(documents[index]?.name)) return; // fixed rows can't be removed
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleDocChange = (index, field, value) => {
    const updated = [...documents];
    updated[index] = { ...updated[index], [field]: value };
    setDocuments(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "16px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 20, fontFamily: "Playfair Display", fontWeight: 700, color: "var(--navy)", margin: 0 }}>
            Uploaded Documents List (1.5)
          </h2>
          <p style={{ fontSize: 14, color: "var(--muted)", margin: "6px 0 0" }}>
            Add and upload documents relevant to this report
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          style={{
            background: "#000000",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1e293b")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#000000")}
        >
          + Add Row
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", background: "white", borderRadius: 8, border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed", minWidth: 900 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 50, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Sr.</th>
              <th style={{ padding: "12px 10px", textAlign: "left", width: 320, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Document Name</th>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 140, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Upload</th>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 90, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>View</th>
              <th style={{ padding: "12px 10px", textAlign: "left", width: 250, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Remarks</th>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 50, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Act</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "24px 10px", textAlign: "center", color: "var(--muted)", fontSize: 13 }}>
                  No documents added yet. Click "+ Add Row" to begin.
                </td>
              </tr>
            ) : (
              documents.map((doc, index) => {
                const isFixed = FIXED_DOCUMENT_NAMES.includes(doc.name);
                const rowUpload = uploadStatus[index]; // { percent, status: 'uploading' } | undefined
                const isUploading = rowUpload?.status === "uploading";

                return (
                <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px", textAlign: "center", color: "#64748b", fontWeight: 500 }}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {isFixed ? (
                      <div
                        style={{
                          ...inputStyle,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "#f1f5f9",
                          color: "#334155",
                          fontWeight: 600,
                          cursor: "not-allowed",
                        }}
                        title="This is a required standard document — name is fixed"
                      >
                        <span>{doc.name}</span>
                        <span
                          style={{
                            fontSize: 9,
                            color: "#64748b",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            background: "#e2e8f0",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          Fixed
                        </span>
                      </div>
                    ) : (
                      <input
                        style={inputStyle}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        value={doc.name}
                        onChange={(e) => handleDocChange(index, "name", e.target.value)}
                        placeholder="e.g. Sale Deed, Mutation Copy..."
                      />
                    )}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {isUploading ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, minWidth: 110 }}>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: 10,
                              height: 10,
                              border: "2px solid #bfdbfe",
                              borderTopColor: "#2563eb",
                              borderRadius: "50%",
                              animation: "checklist-spin 0.7s linear infinite",
                            }}
                          />
                          Uploading… {rowUpload.percent}%
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: 6,
                            background: "#e2e8f0",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${rowUpload.percent}%`,
                              height: "100%",
                              background: "#2563eb",
                              borderRadius: 4,
                              transition: "width 0.2s ease",
                            }}
                          />
                        </div>
                        <style>{`@keyframes checklist-spin { to { transform: rotate(360deg); } }`}</style>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <label
                          htmlFor={`file-upload-checklist-${index}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            background: doc.fileName ? "#ecfdf5" : "white",
                            color: doc.fileName ? "#047857" : "#475569",
                            border: doc.fileName ? "1px solid #a7f3d0" : "1px solid #cbd5e1",
                            padding: "5px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                            transition: "all 0.15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = doc.fileName ? "#d1fae5" : "#f1f5f9";
                            e.currentTarget.style.borderColor = doc.fileName ? "#6ee7b7" : "#94a3b8";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = doc.fileName ? "#ecfdf5" : "white";
                            e.currentTarget.style.borderColor = doc.fileName ? "#a7f3d0" : "#cbd5e1";
                          }}
                        >
                          {doc.fileName ? "✓ Selected" : "📎 Upload"}
                        </label>
                        <input
                          id={`file-upload-checklist-${index}`}
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                          style={{ display: "none" }}
                          onChange={(e) => handleFileUpload(index, e.target.files[0])}
                        />
                        {doc.fileName && (
                          <div
                            style={{
                              fontSize: 9,
                              color: "#64748b",
                              maxWidth: 120,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={doc.fileName}
                          >
                            {doc.fileName}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {doc.filePath ? (
                      <button
                        type="button"
                        onClick={() => handleViewFile(doc.filePath)}
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          border: "1px solid #bfdbfe",
                          padding: "5px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 11,
                          fontWeight: 600,
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#dbeafe";
                          e.currentTarget.style.borderColor = "#93c5fd";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#eff6ff";
                          e.currentTarget.style.borderColor = "#bfdbfe";
                        }}
                      >
                        👁 View
                      </button>
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: 14 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <input
                      style={inputStyle}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      value={doc.remarks}
                      onChange={(e) => handleDocChange(index, "remarks", e.target.value)}
                      placeholder="Remarks..."
                    />
                  </td>
                  <td style={{ padding: "10px", textAlign: "center" }}>
                    {isFixed ? (
                      <span
                        style={{ color: "#cbd5e1", fontSize: 12, cursor: "not-allowed" }}
                        title="Required document — can't be removed"
                      >
                        🔒
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(index)}
                        style={{
                          background: "transparent",
                          color: "#94a3b8",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 14,
                          padding: "4px 8px",
                          transition: "color 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
