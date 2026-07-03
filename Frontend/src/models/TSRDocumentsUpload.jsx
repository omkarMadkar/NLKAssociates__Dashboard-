// TSRDocumentsUpload.jsx
// PART III - Title Flow Excel upload + OCR document drag-drop.
// Props passed from parent:
//   dragActive, setDragActive
//   ocrScanning, ocrStatus, fileUploadedName
//   handleFileDrop          - drag/drop OCR upload handler (calls /tsr-initiation/upload-extract)
//   handleTitleFlowExcel    - excel file input handler (calls /tsr-title-flow/upload-excel)
//   titleFlowData           - parsed rows preview after excel upload

import { FolderOpen } from "lucide-react";

export default function TSRDocumentsUpload({
  dragActive,
  setDragActive,
  ocrScanning,
  ocrStatus,
  fileUploadedName,
  handleFileDrop,
  handleTitleFlowExcel,
  titleFlowData,
  handleDownloadTitleFlowTemplate,
}) {
  return (
    <div className="animate-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleFileDrop}
        style={{
          background: "white",
          border: dragActive ? "2px dashed var(--black)" : "2px dashed var(--border)",
          borderRadius: 16,
          padding: "32px 20px",
          textAlign: "center",
          position: "relative",
          transition: "all 0.2s ease",
          overflow: "hidden",
        }}
      >
        {ocrScanning ? (
          <div style={{ padding: "20px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: "3px solid #e5e7eb",
                borderTop: "3px solid var(--black)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <div style={{ fontSize: 16, color: "var(--black)", fontWeight: 600 }}>
              {ocrStatus}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              Processing: <strong>{fileUploadedName}</strong>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}>
              <FolderOpen size={36} color="var(--black)" strokeWidth={1.6} />
            </div>
            <h3 style={{ fontSize: 17, color: "var(--black)", margin: "0 0 6px 0" }}>
              Part III - Title Flow Upload
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                margin: "0 0 16px 0",
                maxWidth: 500,
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.4,
              }}
            >
              Drag &amp; drop title deeds, e-search receipt GRAS PDFs, or 7/12 extracts to scan
              and extract details. Or upload the Title Flow Excel below.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                <input
                  type="file"
                  id="fileInp"
                  onChange={handleTitleFlowExcel}
                  style={{ display: "none" }}
                  accept=".xlsx,.xls"
                />
                <label
                  htmlFor="fileInp"
                  style={{
                    background: "var(--black)",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  Browse Title Flow Excel
                </label>

                <button
                  onClick={handleDownloadTitleFlowTemplate}
                  type="button"
                  style={{
                    background: "none",
                    border: "1px solid var(--black)",
                    color: "var(--black)",
                    padding: "10px 24px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Download Template
                </button>
              </div>

              {titleFlowData && (
                <div
                  style={{
                    padding: 12,
                    background: "#fafafa",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--black)",
                  }}
                >
                  <strong>{titleFlowData.length}</strong> title events loaded successfully
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}