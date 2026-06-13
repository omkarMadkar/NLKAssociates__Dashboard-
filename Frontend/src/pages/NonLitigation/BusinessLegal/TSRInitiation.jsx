// TSRInitiation.jsx
// Main orchestrator: holds all form state, API calls (create/list/delete, excel upload,
// OCR upload, title-flow save, other-provisions save) and renders the 3 section
// components in tabs + the records table.
//
// Sections split into: src/components/tsr/TSRBasicInfo.jsx,
// src/components/tsr/TSRDocumentsUpload.jsx, src/components/tsr/TSROtherProvisions.jsx
// Shared styles: src/components/tsr/tsrShared.jsx

import { useState, useEffect } from "react";
import API from "../../../api/axios";
import { StatusBadge } from "../../../components/TSRShared";
import TSRBasicInfo from "../../../models/TSRBasicInfo";
import TSRDocumentsUpload from "../../../models/TSRDocumentsUpload";
import TSROtherProvisions from "../../../models/TSROtherProvision";
import TSRWaitingReport from "../../../models/TSRWaitingReport";

const INITIAL = {
  author: "Narayan",
  appId: "",
  refNo: "",
  branch: "Main",
  initiationDate: "",
  applicant: "",
  coApplicant: "",
  existingOwner: "",
  transactionType: "",
  bankBranch: "Hadapsar Branch, Pune",
  municipalPropertyNo: "",
  rccConstructionArea: "",
  village: "",
  taluka: "",
  district: "",
  municipalCouncil: "",
  landParcels: [
    {
      surveyNo: "",
      hissaNo: "",
      area: "",
      unit: "",
      remarks: "",
    },
  ],
  boundaryEast: "",
  boundaryWest: "",
  boundarySouth: "",
  boundaryNorth: "",
  executiveMobile: "",
  executiveEmail: "",
};

const INITIAL_OTHER_PROVISIONS = [
  {
    code: "5.1",
    question: "Whether provisions of urban land ceiling act are applicable?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.2",
    question:
      "Whether any property/ies intend to be given as security to any minor claim/share?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.3",
    question: "Whether property affected by revenue and tenancy regulations?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.4",
    question: "Whether user land converted into non-agricultural use?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.5",
    question: "Whether up to date tax/land revenue has been paid?",
    answer: "Not Known",
    remarks: "",
  },
  {
    code: "5.6",
    question: "Whether all original documents scrutinized?",
    answer: "Yes",
    remarks: "",
  },
  {
    code: "5.7",
    question: "Whether required documents available for creating mortgage?",
    answer: "Yes",
    remarks: "",
  },
  {
    code: "5.8",
    question: "Whether previous owners had competency to transfer property?",
    answer: "Yes",
    remarks: "",
  },
  {
    code: "5.9",
    question: "Whether proposed owners had competency to transfer property?",
    answer: "Yes",
    remarks: "",
  },
  {
    code: "5.10",
    question: "What is tenure of land?",
    answer: "NA",
    remarks: "",
  },
  {
    code: "5.11",
    question: "Whether land is Adivasi (Tribal) Land?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.12",
    question: "Whether property is joint family property?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.13",
    question: "Whether SARFAESI Act applicable?",
    answer: "Yes",
    remarks: "",
  },
  {
    code: "5.14",
    question: "Whether property subject to reservation/acquisition?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.15",
    question: "Whether property transferred through POA holder?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.16",
    question: "Whether POA holder had authority to sell?",
    answer: "NA",
    remarks: "",
  },
  {
    code: "5.17",
    question: "Whether POA registered?",
    answer: "NA",
    remarks: "",
  },
  {
    code: "5.18",
    question: "Whether NOC required for mortgage?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.19",
    question: "Whether permission required upon invocation of mortgage?",
    answer: "No",
    remarks: "",
  },
  {
    code: "5.20",
    question: "Whether Search Report obtained?",
    answer: "Yes",
    remarks: "",
  },
  { code: "5.21", question: "Whether EC obtained?", answer: "No", remarks: "" },
];

export default function TSRInitiation() {
  const [form, setForm] = useState(INITIAL);
  const [records, setRecords] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");

  // OCR / document upload state
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrStatus, setOcrStatus] = useState("");
  const [fileUploadedName, setFileUploadedName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Title flow excel state
  const [titleFlowFile, setTitleFlowFile] = useState(null);
  const [titleFlowUploading, setTitleFlowUploading] = useState(false);
  const [titleFlowData, setTitleFlowData] = useState(null);

  // Other provisions state
  const [otherProvisions, setOtherProvisions] = useState(
    INITIAL_OTHER_PROVISIONS,
  );

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // ---------- FETCH RECORDS ----------
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await API.get("/tsr-initiation/list", {
        headers: authHeader(),
      });
      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch TSR Initiations", err);
    }
  };

  // ---------- OCR DOCUMENT UPLOAD (Part I auto-fill) ----------
  const handleFileDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (!file) return;

    setFileUploadedName(file.name);
    setOcrScanning(true);
    setOcrStatus("Uploading and analyzing document...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await API.post(
        "/tsr-initiation/upload-extract",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...authHeader(),
          },
        },
      );

      if (data.success) {
        setForm((prev) => {
          const newForm = { ...prev };
          Object.keys(data.extractedFields).forEach((key) => {
            if (data.extractedFields[key]) {
              newForm[key] = data.extractedFields[key];
            }
          });
          return newForm;
        });

        alert(
          `Analysis Complete.\n\nDetected: ${data.documentType}\n${data.message}`,
        );
      }
    } catch (err) {
      console.error("OCR Extraction Error", err);
      if (err.response?.status === 401) {
        alert(
          "Authentication Error: Your session has expired or is invalid. Please log out and log in again.",
        );
      } else {
        alert(
          "Failed to extract document: " +
            (err.response?.data?.message || err.message),
        );
      }
    } finally {
      setOcrScanning(false);
    }
  };

  // ---------- TITLE FLOW EXCEL UPLOAD (Part III preview) ----------
  const handleTitleFlowExcel = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setTitleFlowUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post(
        "/tsr-title-flow/upload-excel",
        formData,
        {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setTitleFlowFile(file);
      setTitleFlowData(response.data.rows);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Excel Upload Failed");
    } finally {
      setTitleFlowUploading(false);
    }
  };

  // ---------- BASIC FORM HANDLERS ----------
  const validate = () => {
    const e = {};
    if (!form.appId.trim()) e.appId = "Required";
    if (!form.applicant.trim()) e.applicant = "Required";
    if (!form.initiationDate) e.initiationDate = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const addParcel = () => {
    setForm((prev) => ({
      ...prev,
      landParcels: [
        ...prev.landParcels,
        { surveyNo: "", hissaNo: "", area: "", unit: "", remarks: "" },
      ],
    }));
  };

  const removeParcel = (index) => {
    setForm((prev) => ({
      ...prev,
      landParcels: prev.landParcels.filter((_, i) => i !== index),
    }));
  };

  const handleParcelChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.landParcels];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, landParcels: updated };
    });
  };

  // ---------- OTHER PROVISIONS HANDLER ----------
  const handleProvisionChange = (index, field, value) => {
    setOtherProvisions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // ---------- SUBMIT (saves all 3 parts) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      // STEP 1 - SAVE PART I (Basic Info)
      const tsrResponse = await API.post("/tsr-initiation/create", form, {
        headers: authHeader(),
      });

      const tsrId = tsrResponse.data.data._id;

      // STEP 2 - SAVE PART V (Other Provisions)
      await API.post(
        "/tsr-other-provisions/create",
        {
          tsrInitiationId: tsrId,
          answers: otherProvisions,
        },
        { headers: authHeader() },
      );

      // STEP 3 - SAVE PART III (Title Flow Excel, if uploaded)
      if (titleFlowFile) {
        const formData = new FormData();
        formData.append("file", titleFlowFile);
        formData.append("tsrInitiationId", tsrId);

        await API.post("/tsr-title-flow/upload-and-save", formData, {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("TSR Initiated Successfully");

      // Reset everything for a fresh entry
      setForm(INITIAL);
      setOtherProvisions(INITIAL_OTHER_PROVISIONS);
      setTitleFlowFile(null);
      setTitleFlowData(null);
      setActiveTab("basic");

      fetchRecords();
    } catch (err) {
      console.error(err);
      alert("Failed to save TSR");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this TSR Initiation record?")) return;
    try {
      await API.delete(`/tsr-initiation/${id}`, { headers: authHeader() });
      fetchRecords();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div
      className="animate-in"
      style={{ display: "flex", flexDirection: "column", gap: 28 }}
    >
      {/* Page Header */}
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
              fontSize: 26,
              color: "var(--black)",
              margin: 0,
              fontWeight: 700,
            }}
          >
            TSR Scrutiny &amp; Initiation
          </h1>
          <p style={{ color: "var(--muted)", margin: "6px 0 0", fontSize: 14 }}>
            Start a new Title Search Report using legal details, Excel upload,
            or AI OCR scan
          </p>
        </div>
        <span
          style={{
            background: "var(--black)",
            color: "white",
            padding: "6px 16px",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          BUSINESS LEGAL
        </span>
      </div>

      {/* Tabbed Form Panel */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Tab Header */}
        <div
          style={{
            background: "var(--black)",
            padding: "16px 28px",
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          {[
            { key: "basic", label: "I. Basic Info" },
            { key: "documents", label: "III. Title Flow" },
            { key: "otherProvisions", label: "V. Other Provisions" },
            { key: "waitingReport", label: "VI. Waiting Report" },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              style={{
                background: "transparent",
                border: "none",
                color: activeTab === t.key ? "white" : "rgba(255,255,255,0.5)",
                fontSize: 14,
                fontWeight: activeTab === t.key ? 700 : 500,
                cursor: "pointer",
                padding: "6px 0",
                borderBottom:
                  activeTab === t.key
                    ? "2px solid white"
                    : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 28 }}>
          {activeTab === "basic" && (
            <TSRBasicInfo
              form={form}
              errors={errors}
              handleChange={handleChange}
              addParcel={addParcel}
              removeParcel={removeParcel}
              handleParcelChange={handleParcelChange}
            />
          )}

          {activeTab === "documents" && (
            <TSRDocumentsUpload
              dragActive={dragActive}
              setDragActive={setDragActive}
              ocrScanning={ocrScanning}
              ocrStatus={ocrStatus}
              fileUploadedName={fileUploadedName}
              handleFileDrop={handleFileDrop}
              handleTitleFlowExcel={handleTitleFlowExcel}
              titleFlowData={titleFlowData}
            />
          )}

          {activeTab === "otherProvisions" && (
            <TSROtherProvisions
              otherProvisions={otherProvisions}
              handleProvisionChange={handleProvisionChange}
            />
          )}

          {activeTab === "waitingReport" && <TSRWaitingReport />}

          {/* Navigation / Submit Bar */}
          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 12,
              justifyContent: "space-between",
            }}
          >
            {activeTab !== "basic" && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === "documents") {
                    setActiveTab("basic");
                  } else if (activeTab === "otherProvisions") {
                    setActiveTab("documents");
                  } else if (activeTab === "waitingReport") {
                    setActiveTab("otherProvisions");
                  }
                }}
                style={{
                  background: "white",
                  color: "var(--black)",
                  border: "1px solid var(--border)",
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Back
              </button>
            )}

            <div style={{ marginLeft: "auto" }}>
              {activeTab === "basic" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("documents");
                  }}
                  style={{
                    background: "white",
                    color: "var(--black)",
                    border: "1px solid var(--black)",
                    padding: "12px 36px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Next Section
                </button>
              )}

              {activeTab === "documents" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("otherProvisions");
                  }}
                  style={{
                    background: "white",
                    color: "var(--black)",
                    border: "1px solid var(--black)",
                    padding: "12px 36px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Next Section
                </button>
              )}

              {activeTab === "otherProvisions" && (
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "var(--black)",
                    color: "white",
                    border: "none",
                    padding: "12px 36px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Initiating..." : "Initiate TSR Report"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Records Table */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 28px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              color: "var(--black)",
              margin: 0,
              fontWeight: 700,
            }}
          >
            TSR Initiation Records
          </h2>
          <span
            style={{
              background: "#f3f4f6",
              color: "var(--muted)",
              padding: "4px 12px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {records.length} records
          </span>
        </div>

        {records.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 16, color: "var(--muted)" }}>
              No records yet
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  {[
                    "ID",
                    "App ID",
                    "Applicant",
                    "Branch",
                    "Initiation Date",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: 700,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        fontSize: 11,
                        letterSpacing: 0.8,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={r._id}
                    style={{
                      borderTop: "1px solid var(--border)",
                      animation: `fadeSlideUp 0.3s ease forwards`,
                      animationDelay: `${i * 0.04}s`,
                      opacity: 0,
                    }}
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: "var(--black)",
                        fontSize: 12,
                      }}
                    >
                      INIT-{String(i + 1).padStart(3, "0")}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "monospace",
                        fontSize: 12,
                      }}
                    >
                      {r.appId}
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 600 }}>
                      {r.applicant}
                      {r.coApplicant && (
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--muted)",
                            marginTop: 2,
                          }}
                        >
                          + {r.coApplicant}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--muted)" }}>
                      {r.branch}
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--muted)" }}>
                      {r.initiationDate}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={r.status} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => {
                            alert(
                              `App ID: ${r.appId}\nApplicant: ${r.applicant}\nBoundaries:\n- East: ${r.boundaryEast || "N/A"}\n- West: ${r.boundaryWest || "N/A"}\n- South: ${r.boundarySouth || "N/A"}\n- North: ${r.boundaryNorth || "N/A"}`,
                            );
                          }}
                          style={{
                            background: "white",
                            border: "1px solid var(--border)",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                          title="View Details"
                        >
                          View
                        </button>
                        <button
                          onClick={() => alert("Edit - Phase 2 feature")}
                          style={{
                            background: "white",
                            border: "1px solid var(--border)",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(r._id)}
                          style={{
                            background: "var(--black)",
                            color: "white",
                            border: "1px solid var(--black)",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                          title="Delete"
                        >
                          Delete
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </div>
  );
}
