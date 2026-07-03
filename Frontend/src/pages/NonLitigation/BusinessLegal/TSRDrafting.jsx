import { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  Sparkles,
  Save,
  Send,
  Download,
  Trash2,
  Edit2,
  Eye,
  FileEdit,
  ClipboardList,
} from "lucide-react";
import API from "../../../api/axios";
import {
  generateEnglishTSR,
  generateMarathiTSR,
  generateEnglishWaitingReport,
  generateMarathiWaitingReport,
} from "../../../utils/tsrTemplateEngine";
import { HEADER_IMAGE_B64, FOOTER_IMAGE_B64, STAMP_IMAGE_B64, SIG_IMAGE_B64 } from "../../../utils/letterheadImages";

const STATUS_STYLES = {
  draft: { bg: "#f1f5f9", color: "#475569", label: "Draft" },
  submitted: { bg: "#e0f2fe", color: "#0369a1", label: "Submitted" },
  approved: { bg: "#dcfce7", color: "#15803d", label: "Approved" },
  rejected: { bg: "#fee2e2", color: "#b91c1c", label: "Rejected" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.draft;
  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {s.label}
    </span>
  );
}

export default function TSRDrafting() {
  const [draftType, setDraftType] = useState("tsr"); // 'tsr' or 'waiting'
  const [initiations, setInitiations] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [templateType, setTemplateType] = useState("English Format");
  const [draftContent, setDraftContent] = useState("");
  const [draftData, setDraftData] = useState(null);
  const [applyDigitalSignature, setApplyDigitalSignature] = useState(true);

  // Persist drafts to localStorage to preserve across page reloads
  const [drafts, setDrafts] = useState(() => {
    try {
      const saved = localStorage.getItem("nlk_tsr_drafts");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("nlk_tsr_drafts", JSON.stringify(drafts));
  }, [drafts]);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitiations();
  }, []);

  const fetchInitiations = async () => {
    try {
      const { data } = await API.get("/tsr-initiation/list", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (data.success) {
        setInitiations(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch TSR Initiations", err);
    }
  };

  const selectedOpt = initiations.find((i) => i._id === selectedCase);
  const refNo = selectedOpt?.refNo || "Auto-generated";

  const handleDraftTypeChange = (type) => {
    setDraftType(type);
    setDraftContent("");
    setSelectedCase("");
  };

  const handleGenerate = async () => {
    if (!selectedCase) {
      alert("Please select a TSR");
      return;
    }

    try {
      setGenerating(true);

      const { data } = await API.get(`/tsr-draft/generate/${selectedCase}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!data.success) {
        throw new Error("Failed to generate draft");
      }

      setDraftData(data.data);

      let content = "";

      if (draftType === "tsr") {
        content =
          templateType === "English Format"
            ? generateEnglishTSR(data.data)
            : generateMarathiTSR(data.data);
      } else {
        content =
          templateType === "English Format"
            ? generateEnglishWaitingReport(data.data)
            : generateMarathiWaitingReport(data.data);
      }

      setDraftContent(content);
      console.log("DOCUMENT LIST:", data.data.documentList);
      console.log("TITLE FLOW:", data.data.titleFlow);
      console.log("TITLE EVIDENCE:", data.data.titleEvidence);
      console.log("WAITING REPORT:", data.data.waitingReport);
      console.log("OTHER PROVISION:", data.data.otherProvision);
    } catch (error) {
      console.error(error);
      alert("Failed to generate draft");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (!draftContent.trim()) {
      alert("Draft content is empty.");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      const newDraft = {
        _id: `draft_${Date.now()}`,
        tsrRefNo: refNo,
        appId: selectedOpt?.appId || "Manual",
        applicant: selectedOpt?.applicant || "Manual Entry",
        templateType,
        type: draftType,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: draftContent,
      };
      setDrafts((p) => [newDraft, ...p]);
      setSaving(false);
      alert(
        draftType === "tsr"
          ? "✅ TSR Draft saved successfully!"
          : "✅ Waiting Report Draft saved successfully!",
      );
    }, 800);
  };

  const handleSubmit = () => {
    if (!draftContent.trim()) {
      alert("Draft content is empty.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newDraft = {
        _id: `draft_${Date.now()}`,
        tsrRefNo: refNo,
        appId: selectedOpt?.appId || "Manual",
        applicant: selectedOpt?.applicant || "Manual Entry",
        templateType,
        type: draftType,
        status: "submitted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: draftContent,
      };
      setDrafts((p) => [newDraft, ...p]);
      setDraftContent("");
      setSelectedCase("");
      setSubmitting(false);
      alert("📤 Submitted for Approval successfully!");
    }, 1000);
  };

  const handleDeleteDraft = (id) => {
    if (window.confirm("Delete this draft?"))
      setDrafts((p) => p.filter((d) => d._id !== id));
  };

  const handleExportPDF = (contentToExport) => {
    const text = contentToExport || draftContent;
    if (!text.trim()) {
      alert("No content to export.");
      return;
    }

    // Escape basic HTML characters to avoid parsing errors
    let escapedText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    // Parse the escaped text line-by-line to convert List Items into styled tables
    const lines = escapedText.split("\n");
    const parsedLines = [];
    let tableRows = [];

    const flushTable = () => {
      if (tableRows.length > 0) {
        let tableHtml = `
          <table class="provisions-table" style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 11px; font-family: 'Times New Roman', serif;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 2.5px solid #334155;">
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; width: 10%; font-weight: bold; text-transform: uppercase;">Sr. No.</th>
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left; width: 75%; font-weight: bold; text-transform: uppercase;">Particulars / Queries</th>
                <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; width: 15%; font-weight: bold; text-transform: uppercase;">Response</th>
              </tr>
            </thead>
            <tbody>`;
        
        tableRows.forEach(row => {
          const ansStyle = row.answer.toUpperCase() === "YES" ? "color: #15803d; font-weight: bold;" : 
                           row.answer.toUpperCase() === "NO" ? "color: #b91c1c; font-weight: bold;" : "font-weight: bold; color: #475569;";
          tableHtml += `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${row.code}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left; line-height: 1.4;">${row.question}</td>
                <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center; ${ansStyle}">${row.answer}</td>
              </tr>`;
        });

        tableHtml += `
            </tbody>
          </table>`;
        
        // Remove all newlines and collapse multiple spaces to avoid pre-wrap empty-line rendering issues
        tableHtml = tableHtml.replace(/\n/g, "").replace(/\s{2,}/g, " ");
        parsedLines.push(tableHtml);
        tableRows = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(/^(\d+\.\d+)\s+(.+?)\s+(Yes|No|NA|-)$/i);
      
      if (match) {
        tableRows.push({
          code: match[1],
          question: match[2].trim(),
          answer: match[3].trim()
        });
      } else {
        flushTable();
        parsedLines.push(lines[i]);
      }
    }
    flushTable();

    let formattedText = parsedLines.join("\n");

    // Replace contiguous underscores, box-drawing characters, dashes, etc. with responsive HR lines
    formattedText = formattedText.replace(/[━_─-]{10,}/g, '<hr class="section-divider" />');

    // Wrap divider + heading in a page-break-avoid container so they don't get separated
    const dividerHeadingRegex = /<hr class="section-divider" \/>\s*\n\s*(•\s*PART\s+[IVX]+[^\n]+)/gi;
    formattedText = formattedText.replace(dividerHeadingRegex, (match, headingText) => {
      return `<div class="keep-together" style="page-break-inside: avoid; break-inside: avoid; margin: 0;"><hr class="section-divider" />\n${headingText}</div>`;
    });

    // Replace default text signature block with dynamically compiled digital signature block at the bottom
    if (applyDigitalSignature) {
      const signatureMarkerRegex = /(NARAYAN L\. KHAMKAR|नारायण एल\. खामकर)(?:\s+ADVOCATE)?(?:\s+(?:&amp;|&|and)?\s*NOTARY)?/gi;
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, "0");
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const yyyy = now.getFullYear();
      const formattedDate = `${dd}.${mm}.${yyyy}`;

      const signatureBlockHtml = `
        <div class="signature-section" style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 35px; page-break-inside: avoid; break-inside: avoid; border: none; padding: 0;">
          <!-- Left Side: Thanking you, Place, Date -->
          <div style="font-size: 13.5px; line-height: 1.6; font-weight: bold; font-family: 'Times New Roman', serif; text-align: left;">
            Thanking you,<br>
            <table style="border: none; border-collapse: collapse; font-family: 'Times New Roman', serif; font-size: 13.5px; font-weight: bold; width: auto; margin: 8px 0 0 0; padding: 0;">
              <tr style="border: none;"><td style="border: none; padding: 1px 0; width: 60px; text-align: left;">Place</td><td style="border: none; padding: 1px 0; text-align: left;">: Pune.</td></tr>
              <tr style="border: none;"><td style="border: none; padding: 1px 0; width: 60px; text-align: left;">Date</td><td style="border: none; padding: 1px 0; text-align: left;">: ${formattedDate}.</td></tr>
            </table>
          </div>

          <!-- Right Side: Stamp & Digital Signature Card -->
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: -5px; border: none; padding: 0;">
            <!-- Stamp -->
            <div style="width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border: none;">
              <img src="${STAMP_IMAGE_B64}" style="max-width: 100%; max-height: 100%; object-fit: contain; border: none; display: block;" />
            </div>

            <!-- Digital Signature Card -->
            <div style="width: 190px; height: auto; border: none;">
              <img src="${SIG_IMAGE_B64}" style="width: 100%; height: auto; display: block; border: none;" />
            </div>
          </div>
        </div>
      `;
      formattedText = formattedText.replace(signatureMarkerRegex, signatureBlockHtml);
    }

    const docTitle =
      draftType === "tsr"
        ? `TSR Scrutiny Report - ${refNo}`
        : `Waiting Scrutiny Report - ${refNo}`;

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
      <head>
        <title>${docTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800&family=Montserrat:wght@400;500;700&display=swap');
          
          body { 
            margin: 0;
            padding: 0;
            background: #f1f5f9;
            font-family: 'Times New Roman', serif; 
            color: #000;
          }
          
          .page-container {
            background: #fff;
            width: 210mm;
            margin: 30px auto;
            padding: 25.4mm;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            box-sizing: border-box;
            position: relative;
            border: 1px solid #cbd5e1;
          }

          .letterhead-header {
            margin-bottom: 20px;
            width: 100%;
            text-align: center;
          }
          .letterhead-header img {
            max-width: 100%;
            height: auto;
            max-height: 28mm;
            display: inline-block;
          }

          .content { 
            white-space: pre-wrap; 
            font-size: 13.5px; 
            text-align: justify;
            line-height: 1.5;
          }

          .section-divider {
            border: none;
            border-top: 1.5px solid #334155;
            margin: 14px 0;
            width: 100%;
            display: block;
          }
          
          .letterhead-footer-stamp {
            display: none;
          }

          @page {
            size: A4;
            margin: 15mm 25.4mm 32mm 25.4mm;
          }

          @media print {
            body { 
              background: #fff;
            }

            .page-container {
              width: 100%;
              margin: 0;
              padding: 0;
              box-shadow: none;
              border: none;
            }

            .letterhead-header {
              position: relative;
              top: 0;
              left: 0;
              width: 100%;
              text-align: center;
              margin-bottom: 25px;
            }

            .letterhead-header img {
              max-width: 100%;
              height: auto;
              max-height: 28mm;
              display: inline-block;
            }

            .content { 
              margin: 0;
            }

            .no-print { 
              display: none !important; 
            }

            .letterhead-footer-stamp {
              display: block !important;
              position: fixed;
              bottom: 8mm;
              left: 25.4mm;
              right: 25.4mm;
              width: calc(100% - 50.8mm);
              text-align: center;
              z-index: 9999;
              margin: 0;
            }

            .letterhead-footer-stamp img {
              max-width: 100%;
              height: auto;
              max-height: 22mm;
              display: inline-block;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="letterhead-header">
            <img src="${HEADER_IMAGE_B64}" alt="Narayan L. Khamkar Letterhead Header" />
          </div>

          <div class="content">${formattedText}</div>

          <div class="letterhead-footer-stamp">
            <img src="${FOOTER_IMAGE_B64}" alt="Narayan L. Khamkar Letterhead Footer" />
          </div>
        </div>

        <div class="no-print" style="text-align: center; margin-top: 30px; margin-bottom: 50px;">
          <button onclick="window.print()" style="padding: 12px 30px; background: #1e3c72; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Print / Save as PDF</button>
        </div>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div
      className="animate-in"
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "Playfair Display",
              fontSize: 28,
              color: "var(--black)",
              margin: 0,
              fontWeight: 700,
            }}
          >
            {draftType === "tsr"
              ? "TSR Legal Scrutiny Drafting"
              : "Waiting Report Drafting"}
          </h1>
          <p style={{ color: "var(--muted)", margin: "6px 0 0", fontSize: 14 }}>
            {draftType === "tsr"
              ? "Create, edit, and export high-fidelity Advocate Scrutiny Reports"
              : "Create, edit, and export high-fidelity Advocate Scrutiny Waiting Reports"}
          </p>
        </div>
        <span
          style={{
            background: "linear-gradient(135deg, #09090b, #27272a)",
            color: "white",
            padding: "6px 16px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Sparkles size={14} />
          AI-Powered
        </span>
      </div>

      {/* Segmented Pill Selector (Toggle) */}
      <div
        style={{
          background: "#f1f5f9",
          padding: "4px",
          borderRadius: "12px",
          display: "inline-flex",
          alignSelf: "flex-start",
          gap: "4px",
          border: "1px solid #e2e8f0",
          marginBottom: "4px",
        }}
      >
        <button
          type="button"
          onClick={() => handleDraftTypeChange("tsr")}
          style={{
            background: draftType === "tsr" ? "white" : "transparent",
            border: "none",
            color: draftType === "tsr" ? "var(--black)" : "#64748b",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow:
              draftType === "tsr"
                ? "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)"
                : "none",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FileText size={16} />
          TSR Draft
        </button>
        <button
          type="button"
          onClick={() => handleDraftTypeChange("waiting")}
          style={{
            background: draftType === "waiting" ? "white" : "transparent",
            border: "none",
            color: draftType === "waiting" ? "var(--black)" : "#64748b",
            padding: "10px 20px",
            borderRadius: "8px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow:
              draftType === "waiting"
                ? "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)"
                : "none",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Clock size={16} />
          Waiting Report Draft
        </button>
      </div>

      {/* Draft Editor Card */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "var(--black)",
            padding: "18px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}
        >
          <h2
            style={{
              color: "white",
              fontFamily: "Playfair Display",
              fontSize: 18,
              fontWeight: 700,
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {draftType === "tsr" ? (
              <FileEdit size={20} />
            ) : (
              <ClipboardList size={20} />
            )}
            {draftType === "tsr"
              ? "Create New TSR Draft"
              : "Create New Waiting Report Draft"}
          </h2>
          <span
            style={{
              background: "linear-gradient(135deg, #09090b, #27272a)",
              color: "white",
              padding: "4px 12px",
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Sparkles size={12} />
            AI-Powered
          </span>
        </div>

        <div style={{ padding: 28 }}>
          {/* Top Controls */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                  display: "block",
                }}
              >
                {draftType === "tsr"
                  ? "Select Case / Initialized TSR"
                  : "Select Case / Waiting Report"}
              </label>
              <select
                className="form-control"
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
              >
                <option value="">-- Select TSR Init --</option>
                {initiations.map((o) => (
                  <option key={o._id} value={o._id}>
                    📋 TSR Init: {o.appId} — {o.applicant}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                  display: "block",
                }}
              >
                {draftType === "tsr"
                  ? "TSR Reference No."
                  : "Waiting Report Reference No."}
              </label>
              <input
                className="form-control"
                readOnly
                value={refNo}
                style={{
                  background: "#f8fafc",
                  color: "var(--muted)",
                  cursor: "not-allowed",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Format Type
              </label>
              <select
                className="form-control"
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
              >
                <option>English Format</option>
                <option>Marathi Format</option>
              </select>
            </div>
          </div>

          {/* Digital Signature & Stamp Toggle Control */}
          <div 
            style={{ 
              marginBottom: 20, 
              display: "flex", 
              alignItems: "center",
              background: "#f8fafc",
              padding: "12px 20px",
              borderRadius: 8,
              border: "1px solid #e2e8f0"
            }}
          >
            <label style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "var(--black)" }}>
              <input
                type="checkbox"
                checked={applyDigitalSignature}
                onChange={(e) => setApplyDigitalSignature(e.target.checked)}
                style={{
                  width: 18,
                  height: 18,
                  cursor: "pointer",
                  accentColor: "var(--black)"
                }}
              />
              🖋️ Enable Advocate Digital Signature & Stamp on PDF Export
            </label>
          </div>

          {/* Draft Textarea */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {draftType === "tsr"
                  ? "TSR Draft Content"
                  : "Waiting Report Draft Content"}
              </label>
              <span style={{ fontSize: 14 }}>📝</span>
            </div>
            <textarea
              className="form-control draft-editor-textarea"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              placeholder={
                draftType === "tsr"
                  ? "Click 'Generate Draft' to compile dynamically..."
                  : "Click 'Generate Waiting Report Draft' to compile dynamically..."
              }
              rows={12}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="action-btn btn-primary"
            >
              <Sparkles size={16} />
              {generating
                ? "Generating Dynamic Draft..."
                : draftType === "tsr"
                  ? "Generate Draft"
                  : "Generate Waiting Report Draft"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="action-btn btn-outline"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save as Draft"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="action-btn btn-accent-outline"
            >
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit for Approval"}
            </button>
            <button
              onClick={() => handleExportPDF(draftContent)}
              className="action-btn btn-outline"
            >
              <Download size={16} />
              Export Advocate PDF
            </button>
          </div>
        </div>
      </div>

      {/* All TSR Drafts Table */}
      <div
        style={{
          background: "white",
          borderRadius: 16,
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Playfair Display",
              fontSize: 18,
              fontWeight: 700,
              color: "var(--black)",
              margin: 0,
            }}
          >
            {draftType === "tsr"
              ? "All TSR Drafts"
              : "All Waiting Report Drafts"}
          </h2>
          <span
            style={{
              background: "#f1f5f9",
              color: "#64748b",
              padding: "4px 12px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {drafts.filter((d) => (d.type || "tsr") === draftType).length}{" "}
            drafts
          </span>
        </div>

        {drafts.filter((d) => (d.type || "tsr") === draftType).length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✍️</div>
            <div
              style={{
                fontFamily: "Playfair Display",
                fontSize: 18,
                color: "var(--black)",
                fontWeight: 600,
              }}
            >
              {draftType === "tsr"
                ? "No TSR drafts yet"
                : "No waiting report drafts yet"}
            </div>
            <div style={{ color: "var(--muted)", marginTop: 8, fontSize: 14 }}>
              {draftType === "tsr"
                ? "Create your first TSR draft above."
                : "Create your first waiting report draft above."}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              className="drafts-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "ID",
                    "App No.",
                    "Applicant",
                    "Status",
                    "Created",
                    "Updated",
                    "Actions",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {drafts
                  .filter((d) => (d.type || "tsr") === draftType)
                  .map((d, i) => (
                    <tr
                      key={d._id}
                      className="table-row"
                      style={{
                        animation: `fadeSlideUp 0.3s ease forwards`,
                        animationDelay: `${i * 0.04}s`,
                        opacity: 0,
                      }}
                    >
                      <td
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color: "var(--black)",
                        }}
                      >
                        {d.tsrRefNo}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                        {d.appId}
                      </td>
                      <td style={{ fontWeight: 600, color: "#334155" }}>
                        {d.applicant}
                      </td>
                      <td>
                        <StatusBadge status={d.status} />
                      </td>
                      <td style={{ color: "#64748b", fontSize: 12 }}>
                        {new Date(d.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td style={{ color: "#64748b", fontSize: 12 }}>
                        {new Date(d.updatedAt).toLocaleDateString("en-IN")}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            onClick={() => {
                              setDraftContent(d.content);
                              setSelectedCase("");
                            }}
                            className="icon-action-btn edit"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => alert("Previewing: " + d.tsrRefNo)}
                            className="icon-action-btn view"
                            title="Preview"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => handleExportPDF(d.content)}
                            className="icon-action-btn pdf"
                            title="Export PDF"
                          >
                            <Download size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteDraft(d._id)}
                            className="icon-action-btn delete"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .form-control {
            border: 1px solid #cbd5e1;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            background: white;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.2s ease;
            color: #1e293b;
          }
          .form-control:focus {
            border-color: #000000;
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
          }
          .draft-editor-textarea {
            resize: vertical;
            font-family: 'Courier New', Courier, monospace;
            line-height: 1.6;
            min-height: 400px;
            background: #fafafa;
          }
          .action-btn {
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
          }
          .action-btn:active {
            transform: translateY(0);
          }
          .btn-primary {
            background: #000000 !important;
            color: #ffffff !important;
            border: 1px solid #000000 !important;
          }
          .btn-primary:hover {
            background: #1e293b !important;
            border-color: #1e293b !important;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            transform: translateY(-1px);
          }
          .btn-primary:disabled {
            background: #cbd5e1 !important;
            border-color: #cbd5e1 !important;
            color: #94a3b8 !important;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
          }
          .btn-outline {
            background: #ffffff !important;
            color: #334155 !important;
            border: 1px solid #cbd5e1 !important;
          }
          .btn-outline:hover {
            background: #f8fafc !important;
            border-color: #94a3b8 !important;
            color: #0f172a !important;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
            transform: translateY(-1px);
          }
          .btn-outline:disabled {
            background: #f1f5f9 !important;
            border-color: #e2e8f0 !important;
            color: #cbd5e1 !important;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
          }
          .btn-accent-outline {
            background: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #000000 !important;
          }
          .btn-accent-outline:hover {
            background: #fafafa !important;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
            transform: translateY(-1px);
          }
          .btn-accent-outline:disabled {
            background: #f1f5f9 !important;
            border-color: #e2e8f0 !important;
            color: #cbd5e1 !important;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
          }
          .drafts-table th {
            padding: 12px 16px;
            text-align: left;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #e2e8f0;
          }
          .drafts-table td {
            padding: 14px 16px;
            border-bottom: 1px solid #e2e8f0;
          }
          .table-row {
            transition: background-color 0.2s ease;
          }
          .table-row:hover {
            background-color: #f8fafc;
          }
          .icon-action-btn {
            border: 1px solid #e2e8f0;
            background: white;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
          .icon-action-btn.edit { color: #059669; }
          .icon-action-btn.edit:hover { background: #ecfdf5; border-color: #a7f3d0; }
          
          .icon-action-btn.view { color: #2563eb; }
          .icon-action-btn.view:hover { background: #eff6ff; border-color: #bfdbfe; }
          
          .icon-action-btn.pdf { color: #d97706; }
          .icon-action-btn.pdf:hover { background: #fffbeb; border-color: #fde68a; }
          
          .icon-action-btn.delete { color: #dc2626; }
          .icon-action-btn.delete:hover { background: #fef2f2; border-color: #fecaca; }
          
          @keyframes fadeSlideUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `,
        }}
      />
    </div>
  );
}
