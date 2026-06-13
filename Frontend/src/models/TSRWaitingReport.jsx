import React from "react";

export default function TSRWaitingReport({
  waitingReport,
  setWaitingReport,
  handleAddDoc,
  handleDocChange,
  handleRemoveDoc,
  handleFileUpload,
  handleViewFile,
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "16px 0" }}>
      {/* Top Fields */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Chalan No.</label>
          <input 
            style={inputStyle} 
            value={waitingReport.chalanNo} 
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={(e) => setWaitingReport({ ...waitingReport, chalanNo: e.target.value })} 
            placeholder="e.g. CH-9901" 
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Date</label>
          <input 
            type="date" 
            style={inputStyle} 
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={waitingReport.date} 
            onChange={(e) => setWaitingReport({ ...waitingReport, date: e.target.value })} 
          />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>Report Sr No.</label>
          <input 
            style={inputStyle} 
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={waitingReport.reportSrNo} 
            onChange={(e) => setWaitingReport({ ...waitingReport, reportSrNo: e.target.value })} 
            placeholder="e.g. SR-2026/05" 
          />
        </div>
      </div>

      {/* Checklist Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <label style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>Documents Checklist</label>
        <button 
          type="button" 
          onClick={handleAddDoc} 
          style={{ 
            background: "#000000", 
            color: "white", 
            border: "none", 
            padding: "8px 16px", 
            borderRadius: 6, 
            cursor: "pointer", 
            fontSize: 12, 
            fontWeight: 600,
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#1e293b"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#000000"}
        >
          + Add Row
        </button>
      </div>

      {/* Checklist Table */}
      <div style={{ overflowX: "auto", background: "white", borderRadius: 8, border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed", minWidth: 1040 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 50, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Sr.</th>
              <th style={{ padding: "12px 10px", textAlign: "left", width: 380, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Document No. / Name</th>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 120, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Available</th>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 140, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Upload</th>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 90, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>View</th>
              <th style={{ padding: "12px 10px", textAlign: "left", width: 210, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Remarks</th>
              <th style={{ padding: "12px 10px", textAlign: "center", width: 50, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", fontSize: 10, letterSpacing: 0.5 }}>Act</th>
            </tr>
          </thead>
          <tbody>
            {waitingReport.documents.map((doc, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px", textAlign: "center", color: "#64748b", fontWeight: 500 }}>{doc.srNo}</td>
                <td style={{ padding: "10px" }}>
                  <input 
                    style={inputStyle} 
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    value={doc.name} 
                    onChange={(e) => handleDocChange(index, "name", e.target.value)} 
                    placeholder="Doc name..." 
                  />
                </td>
                <td style={{ padding: "10px" }}>
                  <select 
                    style={inputStyle} 
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    value={doc.available} 
                    onChange={(e) => handleDocChange(index, "available", e.target.value)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <label 
                      htmlFor={`file-upload-${index}`}
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
                        transition: "all 0.15s ease"
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
                      id={`file-upload-${index}`}
                      type="file" 
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
                          whiteSpace: "nowrap" 
                        }}
                        title={doc.fileName}
                      >
                        {doc.fileName}
                      </div>
                    )}
                  </div>
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
                        transition: "all 0.15s ease"
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
                    placeholder="Reason pending..." 
                  />
                </td>
                <td style={{ padding: "10px", textAlign: "center" }}>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveDoc(index)} 
                    style={{ 
                      background: "transparent", 
                      color: "#94a3b8", 
                      border: "none", 
                      cursor: "pointer",
                      fontSize: 14,
                      padding: "4px 8px",
                      transition: "color 0.15s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#ef4444"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
