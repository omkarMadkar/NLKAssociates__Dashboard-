import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import API, { BACKEND_URL } from "../../../api/axios";
import { StatusBadge } from "../../../components/TSRShared";
import TSRBasicInfo from "../../../models/TSRBasicInfo";
import TSRDocumentsUpload from "../../../models/TSRDocumentsUpload";
import TSROtherProvisions from "../../../models/TSROtherProvision";
import TSRWaitingReport from "../../../models/TSRWaitingReport";
import TSRDocumentList from "../../../models/TSRDocumentList";
import TSRTitleEvidence from "../../../models/TSRTitleEvidence";
import TSRUploadedChecklist from "../../../models/TSRUploadedChecklist";


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
  entireLandDescription: "",
  subjectPropertyDescription: "",
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
  uploadedDocuments: [],
  uploadedChecklist: [
    { name: "", fileName: "", filePath: "", remarks: "" },
    { name: "", fileName: "", filePath: "", remarks: "" },
    { name: "", fileName: "", filePath: "", remarks: "" },
    { name: "", fileName: "", filePath: "", remarks: "" },
    { name: "", fileName: "", filePath: "", remarks: "" },
  ],
};

const INITIAL_DOCUMENT_LIST = [
  {
    documentType: "",
    executionDate: "",
    executedBy: "",
    executedInFavourOf: "",
    registrationOffice: "",
    registrationNumber: "",
    remarks: "",
  },
];

const INITIAL_WAITING_REPORT = {
  chalanNo: "",
  date: "",
  reportSrNo: "",
  documents: [
    {
      srNo: 1,
      name: "Sale Deed / Conveyance Deed",
      available: "No",
      remarks: "",
      fileName: "",
      filePath: "",
    },
    {
      srNo: 2,
      name: "Index II",
      available: "No",
      remarks: "",
      fileName: "",
      filePath: "",
    },
    {
      srNo: 3,
      name: "7/12 Extract / Property Card",
      available: "No",
      remarks: "",
      fileName: "",
      filePath: "",
    },
    {
      srNo: 4,
      name: "Tax Receipt",
      available: "No",
      remarks: "",
      fileName: "",
      filePath: "",
    },
    {
      srNo: 5,
      name: "Mutation Entry",
      available: "No",
      remarks: "",
      fileName: "",
      filePath: "",
    },
  ],
};

const INITIAL_TITLE_EVIDENCE = [
  {
    documentType: "",
    executionDate: "",
    executedBy: "",
    executedInFavourOf: "",
    registrationOffice: "",
    registrationNumber: "",
    remarks: "",
  },
];

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
  const [activeRecordsTab, setActiveRecordsTab] = useState("records");
  const [viewingRecord, setViewingRecord] = useState(null);
  const [viewingDocs, setViewingDocs] = useState([]);
  const [viewingEvidence, setViewingEvidence] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);

  // ---- Toast notification ----
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };


  const [documentList, setDocumentList] = useState(INITIAL_DOCUMENT_LIST);
  const [titleEvidence, setTitleEvidence] = useState(INITIAL_TITLE_EVIDENCE);

  // OCR / document upload state
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrStatus, setOcrStatus] = useState("");
  const [fileUploadedName, setFileUploadedName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Title flow excel state
  const [titleFlowFile, setTitleFlowFile] = useState(null);
  const [titleFlowUploading, setTitleFlowUploading] = useState(false);
  const [titleFlowData, setTitleFlowData] = useState(null);
  const [titleFlowDescription, setTitleFlowDescription] = useState("");

  // Other provisions state
  const [waitingReport, setWaitingReport] = useState(INITIAL_WAITING_REPORT);

  const handleAddDoc = () => {
    setWaitingReport((prev) => ({
      ...prev,
      documents: [
        ...prev.documents,
        {
          srNo: prev.documents.length + 1,
          name: "",
          available: "No",
          remarks: "",
          fileName: "",
          filePath: "",
        },
      ],
    }));
  };
  const handleDocChange = (index, field, value) => {
    setWaitingReport((prev) => {
      const updated = [...prev.documents];
      updated[index][field] = value;
      return { ...prev, documents: updated };
    });
  };
  const handleRemoveDoc = (index) => {
    setWaitingReport((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };
  const handleWaitingReportFileUpload = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await API.post("/tsr-waiting-report/upload", formData, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setWaitingReport((prev) => {
          const updated = [...prev.documents];
          updated[index] = {
            ...updated[index],
            fileName: response.data.fileName,
            filePath: response.data.filePath,
          };
          return { ...prev, documents: updated };
        });
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "File Upload Failed");
    }
  };

  const [selectedRecordForDocs, setSelectedRecordForDocs] = useState(null);
  const [viewingUploadedRecord, setViewingUploadedRecord] = useState(null);

  const handleUploadedChecklistFileUpload = async (index, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await API.post("/tsr-uploaded-checklist/upload", formData, {
        headers: {
          ...authHeader(),
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        setForm((prev) => {
          const updated = [...(prev.uploadedChecklist || [])];
          updated[index] = {
            ...updated[index],
            fileName: response.data.fileName,
            filePath: response.data.filePath,
          };
          return { ...prev, uploadedChecklist: updated };
        });
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "File Upload Failed");
    }
  };

  const [previewFile, setPreviewFile] = useState(null);

  const handleViewFile = (filePath, originalName = "") => {
    if (!filePath) return;
    const cleanPath = filePath.replace(/\\/g, "/");
    const url = cleanPath.startsWith("http")
      ? cleanPath
      : `${BACKEND_URL}/${cleanPath}`;

    const ext = cleanPath.split(".").pop().toLowerCase();
    const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
    const isPdf = ext === "pdf";

    setPreviewFile({
      url,
      name: originalName || cleanPath.split("/").pop(),
      isImage,
      isPdf,
    });
  };

  const [otherProvisions, setOtherProvisions] = useState(
    INITIAL_OTHER_PROVISIONS,
  );

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Section 1.5 documents now live in their own linked collection (uploadedChecklistId).
  // Fall back to the old embedded field for any records saved before this change.
  const getChecklistDocs = (record) => {
    if (record?.uploadedChecklistId?.documents?.length > 0) {
      return record.uploadedChecklistId.documents;
    }
    return record?.uploadedChecklist || [];
  };

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
        if (selectedRecordForDocs) {
          const updated = data.data.find((r) => r._id === selectedRecordForDocs._id);
          setSelectedRecordForDocs(updated || null);
        }
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
          if (data.fileInfo) {
            newForm.uploadedDocuments = [
              ...(prev.uploadedDocuments || []),
              {
                originalName: data.fileInfo.originalName,
                filePath: data.fileInfo.filePath,
                fileSize: data.fileInfo.fileSize,
                extractedFields: Object.keys(data.extractedFields).filter(
                  (k) => data.extractedFields[k],
                ),
                uploadedAt: new Date(),
              },
            ];
          }
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

  const handleDownloadTitleFlowTemplate = async () => {
    try {
      const response = await API.get("/tsr-title-flow/template", {
        headers: authHeader(),
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "TITLE_FLOW_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Failed to download title flow template:", error);
      alert("Failed to download Title Flow template");
    }
  };

  // ---------- BASIC FORM HANDLERS ----------
  const validate = () => {
    const e = {};
    if (!form.appId.trim()) e.appId = "Required";
    if (!form.applicant.trim()) e.applicant = "Required";
    if (!form.initiationDate) e.initiationDate = "Required";
    if (!form.taluka.trim()) e.taluka = "Required";

    // Validate Document List (Part II)
    let docErrors = [];
    documentList.forEach((doc, idx) => {
      const isBlank = (
        !doc.documentType?.trim() &&
        !doc.executionDate &&
        !doc.executedBy?.trim() &&
        !doc.executedInFavourOf?.trim() &&
        !doc.registrationOffice?.trim() &&
        !doc.registrationNumber?.trim() &&
        !doc.remarks?.trim()
      );
      if (!isBlank) {
        // If not blank, all required fields must be present
        const missing = [];
        if (!doc.documentType?.trim()) missing.push("Document Type");
        if (!doc.executionDate) missing.push("Execution Date");
        if (!doc.executedBy?.trim()) missing.push("Executed By");
        if (!doc.executedInFavourOf?.trim()) missing.push("Executed in favour of");
        if (!doc.registrationOffice?.trim()) missing.push("Registration Office");
        if (!doc.registrationNumber?.trim()) missing.push("Registration Number");
        
        if (missing.length > 0) {
          docErrors.push(`Row ${idx + 1} is missing: ${missing.join(", ")}`);
        }
      }
    });

    // Validate Title Evidence (Part IV)
    let evidenceErrors = [];
    titleEvidence.forEach((item, idx) => {
      const isBlank = (
        !item.documentType?.trim() &&
        !item.executionDate &&
        !item.executedBy?.trim() &&
        !item.executedInFavourOf?.trim() &&
        !item.registrationOffice?.trim() &&
        !item.registrationNumber?.trim() &&
        !item.remarks?.trim()
      );
      if (!isBlank) {
        const missing = [];
        if (!item.documentType?.trim()) missing.push("Document Type");
        if (!item.executionDate) missing.push("Execution Date");
        if (!item.executedBy?.trim()) missing.push("Executed By");
        if (!item.executedInFavourOf?.trim()) missing.push("Executed in favour of");
        if (!item.registrationOffice?.trim()) missing.push("Registration Office");
        if (!item.registrationNumber?.trim()) missing.push("Registration Number");
        
        if (missing.length > 0) {
          evidenceErrors.push(`Row ${idx + 1} is missing: ${missing.join(", ")}`);
        }
      }
    });

    if (docErrors.length > 0) {
      e.documentList = "Please complete all required fields for documents in Part II";
      alert(`Part II (Documents List) Validation Error:\n` + docErrors.join("\n"));
    }
    if (evidenceErrors.length > 0) {
      e.titleEvidence = "Please complete all required fields for title evidence in Part IV";
      alert(`Part IV (Title Evidence) Validation Error:\n` + evidenceErrors.join("\n"));
    }

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

  // ---------- VIEW DETAILS HANDLER ----------
  const handleViewDetails = async (record) => {
    setViewingRecord(record);
    setViewingDocs([]);
    setViewingEvidence([]);
    try {
      const docRes = await API.get(`/tsr-document-list/${record._id}`, {
        headers: authHeader(),
      });
      setViewingDocs(docRes.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch documents for viewing modal:", err);
    }
    try {
      const evidenceRes = await API.get(`/tsr-title-evidence/${record._id}`, {
        headers: authHeader(),
      });
      setViewingEvidence(evidenceRes.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch title evidence for viewing modal:", err);
    }
  };

  // ---------- EDIT RECORD HANDLER ----------
  const handleEdit = async (record) => {
    setIsEditing(true);
    setEditingRecordId(record._id);

    // Populate main form
    setForm({
      author: record.author || "Narayan",
      appId: record.appId || "",
      refNo: record.refNo || "",
      branch: record.branch || "Main",
      initiationDate: record.initiationDate || "",
      applicant: record.applicant || "",
      coApplicant: record.coApplicant || "",
      existingOwner: record.existingOwner || "",
      transactionType: record.transactionType || "",
      bankBranch: record.bankBranch || "Hadapsar Branch, Pune",
      municipalPropertyNo: record.municipalPropertyNo || "",
      rccConstructionArea: record.rccConstructionArea || "",
      entireLandDescription: record.entireLandDescription || "",
      subjectPropertyDescription: record.subjectPropertyDescription || "",
      village: record.village || "",
      taluka: record.taluka || "",
      district: record.district || "",
      municipalCouncil: record.municipalCouncil || "",
      landParcels: record.landParcels?.length > 0 ? record.landParcels : [
        { surveyNo: "", hissaNo: "", area: "", unit: "", remarks: "" }
      ],
      boundaryEast: record.boundaryEast || "",
      boundaryWest: record.boundaryWest || "",
      boundarySouth: record.boundarySouth || "",
      boundaryNorth: record.boundaryNorth || "",
      executiveMobile: record.executiveMobile || "",
      executiveEmail: record.executiveEmail || "",
      uploadedChecklist: record.uploadedChecklistId?.documents?.length > 0
        ? record.uploadedChecklistId.documents
        : record.uploadedChecklist?.length > 0 ? record.uploadedChecklist : [
        { name: "", fileName: "", filePath: "", remarks: "" },
        { name: "", fileName: "", filePath: "", remarks: "" },
        { name: "", fileName: "", filePath: "", remarks: "" },
        { name: "", fileName: "", filePath: "", remarks: "" },
        { name: "", fileName: "", filePath: "", remarks: "" },
      ],
    });

    // Fetch document list and title evidence checklist if they exist
    try {
      const docRes = await API.get(`/tsr-document-list/${record._id}`, { headers: authHeader() });
      if (docRes.data?.data?.length > 0) {
        setDocumentList(docRes.data.data);
      } else {
        setDocumentList(INITIAL_DOCUMENT_LIST);
      }
    } catch (err) {
      console.error("Failed to fetch document list for edit:", err);
      setDocumentList(INITIAL_DOCUMENT_LIST);
    }

    try {
      const evidenceRes = await API.get(`/tsr-title-evidence/${record._id}`, { headers: authHeader() });
      if (evidenceRes.data?.data?.length > 0) {
        setTitleEvidence(evidenceRes.data.data);
      } else {
        setTitleEvidence(INITIAL_TITLE_EVIDENCE);
      }
    } catch (err) {
      console.error("Failed to fetch title evidence for edit:", err);
      setTitleEvidence(INITIAL_TITLE_EVIDENCE);
    }

    // Populate other provisions if populated
    if (record.otherProvisionId?.answers?.length > 0) {
      setOtherProvisions(record.otherProvisionId.answers);
    } else {
      setOtherProvisions(INITIAL_OTHER_PROVISIONS);
    }

    // Populate waiting report if populated
    if (record.waitingReportId) {
      setWaitingReport({
        chalanNo: record.waitingReportId.chalanNo || "",
        date: record.waitingReportId.date || "",
        reportSrNo: record.waitingReportId.reportSrNo || "",
        documents: record.waitingReportId.documents?.length > 0 ? record.waitingReportId.documents : [],
      });
    } else {
      setWaitingReport(INITIAL_WAITING_REPORT);
    }

    if (record.titleFlowId) {
      setTitleFlowData(record.titleFlowId.events || null);
      setTitleFlowDescription(record.titleFlowId.description || "");
    } else {
      setTitleFlowData(null);
      setTitleFlowDescription("");
    }

    // Set active tab to 'basic' to start editing
    setActiveTab("basic");

    // Scroll to the top of the wizard container or window
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- SAVE UPLOADED DOCS (Section 1.5 - independent, standalone) ----------
  const handleSaveUploadedDocs = async () => {
    // 1. Validate Basic Info fields (App ID, Applicant Name, Initiation Date, Taluka)
    const e = {};
    if (!form.appId?.trim()) e.appId = "Required";
    if (!form.applicant?.trim()) e.applicant = "Required";
    if (!form.initiationDate) e.initiationDate = "Required";
    if (!form.taluka?.trim()) e.taluka = "Required";

    if (Object.keys(e).length > 0) {
      setErrors(e);
      setActiveTab("basic");
      showToast("Please fill in App ID, Applicant Name, Initiation Date and Taluka first.", "error");
      return;
    }

    // 2. Filter out completely blank rows in Section 1.5
    const cleanedDocs = (form.uploadedChecklist || []).filter(
      (doc) => doc.name?.trim() || doc.fileName?.trim() || doc.remarks?.trim()
    );

    if (cleanedDocs.length === 0) {
      showToast("Please add at least one document in Section 1.5 before saving.", "error");
      return;
    }

    setSubmitting(true);
    try {
      // Filter out completely empty land parcels to avoid passing empty items to backend
      const cleanedLandParcels = (form.landParcels || []).filter(
        (p) =>
          p.surveyNo?.trim() ||
          p.hissaNo?.trim() ||
          p.area?.trim() ||
          p.unit?.trim() ||
          p.remarks?.trim()
      );

      const submitPayload = {
        ...form,
        landParcels: cleanedLandParcels,
      };
      delete submitPayload.uploadedChecklist; // Section 1.5 now saved separately below

      delete submitPayload._id;
      delete submitPayload.createdAt;
      delete submitPayload.updatedAt;
      delete submitPayload.__v;

      let tsrId = editingRecordId;

      if (editingRecordId) {
        // UPDATE existing record with Basic Info
        await API.put(`/tsr-initiation/${editingRecordId}`, submitPayload, {
          headers: authHeader(),
        });
      } else {
        // CREATE new record with Basic Info
        const tsrResponse = await API.post("/tsr-initiation/create", submitPayload, {
          headers: authHeader(),
        });
        tsrId = tsrResponse.data.data._id;
      }

      // Save Section 1.5 documents into their own linked collection
      await API.post(
        "/tsr-uploaded-checklist/save",
        { tsrInitiationId: tsrId, documents: cleanedDocs },
        { headers: authHeader() }
      );

      // ✅ Set editing state immediately
      setIsEditing(true);
      setEditingRecordId(tsrId);

      // Refresh records list — silently, without alerting on 404
      try {
        const recordsRes = await API.get("/tsr-initiation/list", { headers: authHeader() });
        const updatedRecords = recordsRes.data.data || [];
        setRecords(updatedRecords);

        // Find the updated record and auto-expand it in the Uploaded Section
        const updatedRecord = updatedRecords.find((r) => r._id === tsrId);
        if (updatedRecord) {
          setSelectedRecordForDocs(updatedRecord);
          setActiveRecordsTab("uploaded");
        }
      } catch (refreshErr) {
        // Silently ignore refresh errors — the save itself succeeded
        console.warn("Could not refresh records list after save:", refreshErr.message);
      }

      showToast("✅ Documents saved successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || err.message || "Failed to save documents.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- SUBMIT (saves all sections except 1.5) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      // Filter out completely empty land parcels to avoid passing empty items to backend
      const cleanedLandParcels = form.landParcels.filter(
        (p) =>
          p.surveyNo?.trim() ||
          p.hissaNo?.trim() ||
          p.area?.trim() ||
          p.unit?.trim() ||
          p.remarks?.trim()
      );

      // Filter out completely empty checklist items
      const cleanedUploadedChecklist = (form.uploadedChecklist || []).filter(
        (doc) => doc.name?.trim() || doc.fileName?.trim() || doc.remarks?.trim()
      );

      const submitPayload = {
        ...form,
        landParcels: cleanedLandParcels,
        otherProvisionId: form.otherProvisionId?._id || form.otherProvisionId || null,
        waitingReportId: form.waitingReportId?._id || form.waitingReportId || null,
        titleFlowId: form.titleFlowId?._id || form.titleFlowId || null,
      };
      delete submitPayload.uploadedChecklist; // Section 1.5 now saved separately below

      delete submitPayload._id;
      delete submitPayload.createdAt;
      delete submitPayload.updatedAt;
      delete submitPayload.__v;

      let tsrId = editingRecordId;
      if (isEditing) {
        // STEP 1 - UPDATE PART I (Basic Info)
        await API.put(`/tsr-initiation/${editingRecordId}`, submitPayload, {
          headers: authHeader(),
        });
      } else {
        // STEP 1 - SAVE PART I (Basic Info)
        const tsrResponse = await API.post("/tsr-initiation/create", submitPayload, {
          headers: authHeader(),
        });
        tsrId = tsrResponse.data.data._id;
      }

      // STEP 1.5 - SAVE Section 1.5 checklist (in case it was filled but "Save Progress" was never clicked)
      await API.post(
        "/tsr-uploaded-checklist/save",
        { tsrInitiationId: tsrId, documents: cleanedUploadedChecklist },
        { headers: authHeader() }
      );

      const isDocumentBlank = (doc) => {
        return (
          !doc.documentType?.trim() &&
          !doc.executionDate &&
          !doc.executedBy?.trim() &&
          !doc.executedInFavourOf?.trim() &&
          !doc.registrationOffice?.trim() &&
          !doc.registrationNumber?.trim() &&
          !doc.remarks?.trim()
        );
      };

      // STEP 2 - SAVE/UPDATE PART II (Documents List)
      await Promise.all(
        documentList.map((doc) => {
          if (doc._id) {
            if (isDocumentBlank(doc)) {
              return API.delete(`/tsr-document-list/${doc._id}`, {
                headers: authHeader(),
              });
            } else {
              return API.put(`/tsr-document-list/${doc._id}`, doc, {
                headers: authHeader(),
              });
            }
          } else {
            if (!isDocumentBlank(doc)) {
              return API.post(
                "/tsr-document-list",
                {
                  tsrId,
                  ...doc,
                },
                {
                  headers: authHeader(),
                },
              );
            }
            return Promise.resolve();
          }
        }),
      );

      // STEP 3 - SAVE PART III (Title Flow Excel and/or Description)
      if (titleFlowFile) {
        const formData = new FormData();
        formData.append("file", titleFlowFile);
        formData.append("tsrInitiationId", tsrId);

        const uploadRes = await API.post("/tsr-title-flow/upload-and-save", formData, {
          headers: {
            ...authHeader(),
            "Content-Type": "multipart/form-data",
          },
        });

        // Save description if filled
        if (titleFlowDescription?.trim()) {
          await API.post("/tsr-title-flow/create", {
            tsrInitiationId: tsrId,
            events: uploadRes.data.data?.events || [],
            description: titleFlowDescription
          }, {
            headers: authHeader()
          });
        }
      } else {
        // Save description and any parsed events without a new file upload
        await API.post("/tsr-title-flow/create", {
          tsrInitiationId: tsrId,
          events: titleFlowData || [],
          description: titleFlowDescription || ""
        }, {
          headers: authHeader()
        });
      }

      // STEP 4 - SAVE/UPDATE PART IV (Title Evidence)
      await Promise.all(
        titleEvidence.map((item) => {
          if (item._id) {
            if (isDocumentBlank(item)) {
              return API.delete(`/tsr-title-evidence/${item._id}`, {
                headers: authHeader(),
              });
            } else {
              return API.put(`/tsr-title-evidence/${item._id}`, item, {
                headers: authHeader(),
              });
            }
          } else {
            if (!isDocumentBlank(item)) {
              return API.post(
                "/tsr-title-evidence",
                {
                  tsrId,
                  ...item,
                },
                {
                  headers: authHeader(),
                },
              );
            }
            return Promise.resolve();
          }
        }),
      );

      // STEP 5 - SAVE PART V (Other Provisions - upsert handles it in backend)
      await API.post(
        "/tsr-other-provisions/create",
        {
          tsrInitiationId: tsrId,
          answers: otherProvisions,
        },
        { headers: authHeader() },
      );

      // STEP 6 - SAVE PART VI (Waiting Report - upsert handles it in backend)
      await API.post(
        "/tsr-waiting-report/create",
        {
          tsrInitiationId: tsrId,
          ...waitingReport,
        },
        { headers: authHeader() },
      );

      alert(isEditing ? "TSR Updated Successfully" : "TSR Initiated Successfully");

      // ✅ IMMEDIATELY set editing state so Section 1.5 Save Progress works right away
      // This must happen before any subsequent GET calls that might fail
      setIsEditing(true);
      setEditingRecordId(tsrId);

      // Refresh the records list
      try {
        const recordsRes = await API.get("/tsr-initiation/list", { headers: authHeader() });
        const updatedRecords = recordsRes.data.data || [];
        setRecords(updatedRecords);

        // Find the saved record from the list to update the Uploaded Section
        const savedFromList = updatedRecords.find((r) => r._id === tsrId);
        if (savedFromList) {
          setSelectedRecordForDocs(savedFromList);
        }
      } catch (_) { /* ignore list refresh errors */ }

      // Optionally fetch the fully populated record to refresh child state
      try {
        const recordRes = await API.get(`/tsr-initiation/${tsrId}`, { headers: authHeader() });
        const savedRecord = recordRes.data.data;

        if (savedRecord) {
          setSelectedRecordForDocs(savedRecord);
          setForm({
            ...savedRecord,
            uploadedChecklist: savedRecord.uploadedChecklistId?.documents?.length > 0
              ? savedRecord.uploadedChecklistId.documents
              : savedRecord.uploadedChecklist?.length > 0 ? savedRecord.uploadedChecklist : [
              { name: "", fileName: "", filePath: "", remarks: "" },
              { name: "", fileName: "", filePath: "", remarks: "" },
              { name: "", fileName: "", filePath: "", remarks: "" },
              { name: "", fileName: "", filePath: "", remarks: "" },
              { name: "", fileName: "", filePath: "", remarks: "" },
            ],
          });
        }
      } catch (_) { /* ignore if GET by ID fails */ }

      // Refresh child lists to get their database _ids
      try {
        const docRes = await API.get(`/tsr-document-list/${tsrId}`, { headers: authHeader() });
        if (docRes.data?.data?.length > 0) setDocumentList(docRes.data.data);
      } catch (_) { /* not yet created – ignore */ }

      try {
        const tfRes = await API.get(`/tsr-title-flow/${tsrId}`, { headers: authHeader() });
        if (tfRes.data?.data) {
          setTitleFlowData(tfRes.data.data.events || []);
          setTitleFlowDescription(tfRes.data.data.description || "");
        }
      } catch (_) { /* not yet created – ignore */ }

      try {
        const evRes = await API.get(`/tsr-title-evidence/${tsrId}`, { headers: authHeader() });
        if (evRes.data?.data?.length > 0) setTitleEvidence(evRes.data.data);
      } catch (_) { /* not yet created – ignore */ }

      try {
        const opRes = await API.get(`/tsr-other-provisions/${tsrId}`, { headers: authHeader() });
        if (opRes.data?.data) setOtherProvisions(opRes.data.data.answers || INITIAL_OTHER_PROVISIONS);
      } catch (_) { /* not yet created – ignore */ }

      try {
        const wrRes = await API.get(`/tsr-waiting-report/${tsrId}`, { headers: authHeader() });
        if (wrRes.data?.data) setWaitingReport(wrRes.data.data);
      } catch (_) { /* not yet created – ignore */ }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || (isEditing ? "Failed to update TSR" : "Failed to save TSR"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this TSR Initiation record?")) return;
    try {
      await API.delete(`/tsr-initiation/${id}`, { headers: authHeader() });
      if (selectedRecordForDocs?._id === id) setSelectedRecordForDocs(null);
      if (viewingUploadedRecord?._id === id) setViewingUploadedRecord(null);
      if (editingRecordId === id) {
        setIsEditing(false);
        setEditingRecordId(null);
      }
      fetchRecords();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  // ---------- UPLOADED SECTION: VIEW (basic info + documents only) ----------
  const handleViewUploaded = (record) => {
    setViewingUploadedRecord(record);
  };

  // ---------- UPLOADED SECTION: EDIT (resume exactly at Section 1.5) ----------
  const handleEditUploaded = async (record) => {
    await handleEdit(record);
    setActiveTab("uploadedChecklist");
    showToast("Resumed from Section 1.5 — continue filling the form.", "success");
  };

  // ---------- UPLOADED SECTION: DELETE ----------
  const handleDeleteUploaded = async (id) => {
    if (!window.confirm("Delete this entry and all its uploaded documents? This cannot be undone.")) return;
    try {
      await API.delete(`/tsr-initiation/${id}`, { headers: authHeader() });
      if (selectedRecordForDocs?._id === id) setSelectedRecordForDocs(null);
      if (viewingUploadedRecord?._id === id) setViewingUploadedRecord(null);
      if (editingRecordId === id) {
        setIsEditing(false);
        setEditingRecordId(null);
      }
      await fetchRecords();
      showToast("Entry deleted successfully.", "success");
    } catch (err) {
      console.error("Failed to delete uploaded entry", err);
      showToast(err.response?.data?.message || err.message || "Failed to delete entry.", "error");
    }
  };

  return (
    <div
      className="animate-in"
      style={{ display: "flex", flexDirection: "column", gap: 28 }}
    >
      {/* ---- Toast Notification ---- */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 28,
            zIndex: 99999,
            background: toast.type === "success" ? "#000000" : "#dc2626",
            color: "white",
            padding: "14px 22px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "DM Sans, sans-serif",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            maxWidth: 380,
            animation: "fadeSlideUp 0.3s ease forwards",
            borderLeft: toast.type === "success" ? "4px solid #c9a84c" : "4px solid #fca5a5",
          }}
        >
          <span style={{ fontSize: 18 }}>
            {toast.type === "success" ? "✅" : "❌"}
          </span>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              fontSize: 16,
              marginLeft: "auto",
              padding: "0 0 0 8px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
      )}

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
            { key: "uploadedChecklist", label: "1.5 Document Uploaded" },
            { key: "documentsUpload", label: "II. Documents List" },
            { key: "documents", label: "III. Title Flow" },
            { key: "titleEvidence", label: "IV. Title Evidence" },
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

          {activeTab === "uploadedChecklist" && (
            <TSRUploadedChecklist
              documents={form.uploadedChecklist || []}
              setDocuments={(docs) => setForm({ ...form, uploadedChecklist: docs })}
              handleFileUpload={handleUploadedChecklistFileUpload}
              handleViewFile={handleViewFile}
            />
          )}

          {activeTab === "documentsUpload" && (
            <TSRDocumentList
              documents={documentList}
              setDocuments={setDocumentList}
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
              handleDownloadTitleFlowTemplate={handleDownloadTitleFlowTemplate}
              description={titleFlowDescription}
              setDescription={setTitleFlowDescription}
            />
          )}

          {activeTab === "titleEvidence" && (
            <TSRTitleEvidence
              titleEvidence={titleEvidence}
              setTitleEvidence={setTitleEvidence}
            />
          )}

          {activeTab === "otherProvisions" && (
            <TSROtherProvisions
              otherProvisions={otherProvisions}
              handleProvisionChange={handleProvisionChange}
            />
          )}

          {activeTab === "waitingReport" && (
            <TSRWaitingReport
              waitingReport={waitingReport}
              setWaitingReport={setWaitingReport}
              handleAddDoc={handleAddDoc}
              handleDocChange={handleDocChange}
              handleRemoveDoc={handleRemoveDoc}
              handleFileUpload={handleWaitingReportFileUpload}
              handleViewFile={handleViewFile}
            />
          )}

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
                  if (activeTab === "uploadedChecklist") {
                    setActiveTab("basic");
                  } else if (activeTab === "documentsUpload") {
                    setActiveTab("uploadedChecklist");
                  } else if (activeTab === "documents") {
                    setActiveTab("documentsUpload");
                  } else if (activeTab === "titleEvidence") {
                    setActiveTab("documents");
                  } else if (activeTab === "otherProvisions") {
                    setActiveTab("titleEvidence");
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

            <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Cancel editing this report? Any unsaved changes will be lost.")) {
                      setIsEditing(false);
                      setEditingRecordId(null);
                      setForm(INITIAL);
                      setDocumentList(INITIAL_DOCUMENT_LIST);
                      setOtherProvisions(INITIAL_OTHER_PROVISIONS);
                      setWaitingReport(INITIAL_WAITING_REPORT);
                      setTitleEvidence(INITIAL_TITLE_EVIDENCE);
                      setTitleFlowFile(null);
                      setTitleFlowData(null);
                      setTitleFlowDescription("");
                      setActiveTab("basic");
                    }
                  }}
                  style={{
                    background: "white",
                    color: "#dc2626",
                    border: "1px solid #dc2626",
                    padding: "12px 24px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel Edit
                </button>
              )}

              {activeTab === "documentsUpload" && (
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "white",
                    color: "#059669",
                    border: "1px solid #a7f3d0",
                    padding: "12px 24px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    marginRight: 8,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.background = "#ecfdf5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      e.currentTarget.style.background = "white";
                    }
                  }}
                >
                  {submitting ? "Saving..." : "Save Progress"}
                </button>
              )}

              {activeTab === "uploadedChecklist" && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSaveUploadedDocs}
                  style={{
                    background: "white",
                    color: "#059669",
                    border: "1px solid #a7f3d0",
                    padding: "12px 24px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    marginRight: 8,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) e.currentTarget.style.background = "#ecfdf5";
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) e.currentTarget.style.background = "white";
                  }}
                >
                  {submitting ? "Saving..." : "Save Progress"}
                </button>
              )}

              {activeTab === "basic" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("uploadedChecklist");
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

              {activeTab === "uploadedChecklist" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("documentsUpload");
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

              {activeTab === "documentsUpload" && (
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
                    setActiveTab("titleEvidence");
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

              {activeTab === "titleEvidence" && (
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

              {(activeTab === "otherProvisions" ||
                activeTab === "waitingReport") && (
                <button
                  type={activeTab === "waitingReport" ? "submit" : "button"}
                  disabled={submitting}
                  onClick={(e) => {
                    if (activeTab === "otherProvisions") {
                      e.preventDefault();
                      setActiveTab("waitingReport");
                    }
                  }}
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
                  {activeTab === "waitingReport"
                    ? submitting
                      ? isEditing ? "Updating..." : "Initiating..."
                      : isEditing ? "Update TSR Report ✓" : "Initiate TSR Report ✓"
                    : "Next Section ➔"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Records Table Card with Tabs */}
      <div
        style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Tab Headers */}
        <div
          style={{
            padding: "18px 28px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
        >
          <h2
            onClick={() => setActiveRecordsTab("records")}
            style={{
              fontSize: 18,
              color: activeRecordsTab === "records" ? "var(--navy)" : "#94a3b8",
              margin: 0,
              fontWeight: 700,
              cursor: "pointer",
              position: "relative",
              paddingBottom: 6,
            }}
          >
            TSR Initiation Records
            {activeRecordsTab === "records" && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: 3,
                  background: "var(--navy)",
                  borderRadius: 2,
                }}
              />
            )}
          </h2>

          <h2
            onClick={() => setActiveRecordsTab("uploaded")}
            style={{
              fontSize: 18,
              color: activeRecordsTab === "uploaded" ? "var(--navy)" : "#94a3b8",
              margin: 0,
              fontWeight: 700,
              cursor: "pointer",
              position: "relative",
              paddingBottom: 6,
            }}
          >
            Uploaded Section
            {activeRecordsTab === "uploaded" && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: 3,
                  background: "var(--navy)",
                  borderRadius: 2,
                }}
              />
            )}
          </h2>

          <span
            style={{
              background: "#f3f4f6",
              color: "var(--muted)",
              padding: "4px 12px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              marginLeft: "auto",
            }}
          >
            {activeRecordsTab === "records"
              ? `${records.filter(r => r.waitingReportId).length} records`
              : `${records.filter(r => (r.uploadedChecklistId?.documents?.length || r.uploadedChecklist?.length || 0) > 0).length} with documents`}
          </span>
        </div>

        {activeRecordsTab === "records" ? (
          records.filter(r => r.waitingReportId).length === 0 ? (
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
                  {records.filter(r => r.waitingReportId).map((r, i) => (
                    <tr
                      key={r._id}
                      onClick={() => setSelectedRecordForDocs(r)}
                      style={{
                        borderTop: "1px solid var(--border)",
                        animation: `fadeSlideUp 0.3s ease forwards`,
                        animationDelay: `${i * 0.04}s`,
                        opacity: 0,
                        cursor: "pointer",
                        background:
                          selectedRecordForDocs?._id === r._id
                            ? "#f1f5f9"
                            : "transparent",
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(r);
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(r);
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
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(r._id);
                            }}
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
          )
        ) : (
          /* Uploaded Section Tab Content */
          <div style={{ padding: "20px 28px", minHeight: 250 }}>
            {(() => {
              // Filter all records that have at least one uploaded document
              const recordsWithDocs = records.filter(
                (r) => getChecklistDocs(r).length > 0
              );

              if (recordsWithDocs.length === 0) {
                return (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)", fontSize: 14 }}>
                    No documents uploaded yet. Go to <strong>1.5 Document Uploaded</strong> tab in the form above, upload documents, then click <strong>Save Progress</strong>.
                  </div>
                );
              }

              return (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "var(--black)", color: "white" }}>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, width: 90 }}>ID</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, width: 150 }}>App ID</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600 }}>Applicant</th>
                      <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, width: 110 }}>Docs</th>
                      <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: 600, width: 230 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recordsWithDocs.map((record, rIdx) => (
                      <>
                        {/* Summary row */}
                        <tr
                          key={`row-${record._id}`}
                          style={{
                            borderBottom: "1px solid #e2e8f0",
                            background: selectedRecordForDocs?._id === record._id ? "#f5f5f5" : rIdx % 2 === 0 ? "#ffffff" : "#f9fafb",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onClick={() =>
                            setSelectedRecordForDocs(
                              selectedRecordForDocs?._id === record._id ? null : record
                            )
                          }
                        >
                          <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--navy)", fontSize: 12 }}>
                            INIT-{String(rIdx + 1).padStart(3, "0")}
                          </td>
                          <td style={{ padding: "12px 14px", color: "#374151", fontSize: 12 }}>
                            {record.appId || "—"}
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontWeight: 600, color: "var(--black)", fontSize: 13 }}>
                              {record.applicant || "—"}
                            </div>
                            {record.coApplicant && (
                              <div style={{ fontSize: 11, color: "#64748b" }}>
                                + {record.coApplicant}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span style={{
                              background: "#f1f1f1",
                              color: "var(--black)",
                              borderRadius: 12,
                              padding: "2px 10px",
                              fontSize: 12,
                              fontWeight: 700,
                              border: "1px solid #d1d5db",
                            }}>
                              {getChecklistDocs(record).length} file{getChecklistDocs(record).length !== 1 ? "s" : ""}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ display: "inline-flex", gap: 6 }}>
                              <button
                                type="button"
                                title="View basic info & documents"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewUploaded(record);
                                }}
                                style={{
                                  background: "white",
                                  color: "var(--black)",
                                  border: "1px solid #cbd5e1",
                                  padding: "5px 10px",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                👁 View
                              </button>
                              <button
                                type="button"
                                title="Resume filling the form from Section 1.5"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditUploaded(record);
                                }}
                                style={{
                                  background: "white",
                                  color: "#1d4ed8",
                                  border: "1px solid #bfdbfe",
                                  padding: "5px 10px",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                ✎ Edit
                              </button>
                              <button
                                type="button"
                                title="Delete this entry permanently"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUploaded(record._id);
                                }}
                                style={{
                                  background: "white",
                                  color: "#dc2626",
                                  border: "1px solid #fecaca",
                                  padding: "5px 10px",
                                  borderRadius: 6,
                                  cursor: "pointer",
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                🗑 Delete
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded documents row */}
                        {selectedRecordForDocs?._id === record._id && (
                          <tr key={`docs-${record._id}`}>
                            <td colSpan={5} style={{ padding: "0 14px 14px 14px", background: "#f7f7f7", borderTop: "1px solid #e2e8f0" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 10, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                                <thead>
                                  <tr style={{ background: "var(--black)", color: "white" }}>
                                    <th style={{ padding: "8px 12px", textAlign: "left", width: 40 }}>Sr.</th>
                                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Document Name</th>
                                    <th style={{ padding: "8px 12px", textAlign: "left" }}>File Name</th>
                                    <th style={{ padding: "8px 12px", textAlign: "left" }}>Remarks</th>
                                    <th style={{ padding: "8px 12px", textAlign: "center", width: 90 }}>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {getChecklistDocs(record).map((doc, dIdx) => (
                                    <tr
                                      key={dIdx}
                                      style={{
                                        borderTop: "1px solid #e2e8f0",
                                        background: dIdx % 2 === 0 ? "white" : "#f9fafb",
                                      }}
                                    >
                                      <td style={{ padding: "8px 12px", color: "#64748b" }}>{dIdx + 1}</td>
                                      <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--navy)" }}>
                                        {doc.name || "—"}
                                      </td>
                                      <td style={{ padding: "8px 12px", color: "var(--muted)" }}>
                                        {doc.fileName ? `📎 ${doc.fileName}` : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No file</span>}
                                      </td>
                                      <td style={{ padding: "8px 12px", color: "#64748b" }}>
                                        {doc.remarks || "—"}
                                      </td>
                                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                                        {doc.filePath ? (
                                          <button
                                            type="button"
                                            onClick={() => handleViewFile(doc.filePath)}
                                            style={{
                                              background: "transparent",
                                              color: "var(--black)",
                                              border: "1.5px solid var(--black)",
                                              padding: "4px 10px",
                                              borderRadius: 5,
                                              cursor: "pointer",
                                              fontSize: 11,
                                              fontWeight: 600,
                                            }}
                                          >
                                            👁 View
                                          </button>
                                        ) : (
                                          <span style={{ color: "#cbd5e1" }}>—</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        )}
      </div>

      {/* Uploaded Section — lightweight View modal (basic info + documents only) */}
      {viewingUploadedRecord &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              boxSizing: "border-box",
            }}
            onClick={() => setViewingUploadedRecord(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                width: "100%",
                maxWidth: 760,
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                animation: "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: "var(--black)",
                  padding: "20px 28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: 18, fontFamily: "Playfair Display" }}>
                    Basic Info & Uploaded Documents — {viewingUploadedRecord.appId || "—"}
                  </h2>
                  <span style={{ fontSize: 12, opacity: 0.8 }}>
                    Saved on{" "}
                    {viewingUploadedRecord.updatedAt
                      ? new Date(viewingUploadedRecord.updatedAt).toLocaleDateString("en-IN")
                      : "—"}
                  </span>
                </div>
                <button
                  onClick={() => setViewingUploadedRecord(null)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: 28, overflowY: "auto", display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <h3
                    style={{
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: 8,
                      color: "var(--navy)",
                      margin: "0 0 16px 0",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Basic Info
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px 24px",
                      fontSize: 13,
                    }}
                  >
                    <div>
                      <strong>App ID:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.appId || "—"}</span>
                    </div>
                    <div>
                      <strong>TSR Reference No:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.refNo || "—"}</span>
                    </div>
                    <div>
                      <strong>Branch:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.branch || "—"}</span>
                    </div>
                    <div>
                      <strong>Initiation Date:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.initiationDate || "—"}</span>
                    </div>
                    <div>
                      <strong>Applicant:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.applicant || "—"}</span>
                    </div>
                    <div>
                      <strong>Co-Applicant:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.coApplicant || "—"}</span>
                    </div>
                    <div>
                      <strong>Existing Owner:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.existingOwner || "—"}</span>
                    </div>
                    <div>
                      <strong>Transaction Type:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.transactionType || "—"}</span>
                    </div>
                    <div>
                      <strong>Bank Branch:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.bankBranch || "—"}</span>
                    </div>
                    <div>
                      <strong>Municipal Property No:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.municipalPropertyNo || "—"}</span>
                    </div>
                    <div>
                      <strong>RCC Construction Area:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.rccConstructionArea || "—"}</span>
                    </div>
                    <div>
                      <strong>Village:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.village || "—"}</span>
                    </div>
                    <div>
                      <strong>Taluka:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.taluka || "—"}</span>
                    </div>
                    <div>
                      <strong>District:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.district || "—"}</span>
                    </div>
                    <div>
                      <strong>Municipal Council:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.municipalCouncil || "—"}</span>
                    </div>
                    <div>
                      <strong>Executive Mobile:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.executiveMobile || "—"}</span>
                    </div>
                    <div>
                      <strong>Executive Email:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.executiveEmail || "—"}</span>
                    </div>
                    <div>
                      <strong>Boundary East:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.boundaryEast || "—"}</span>
                    </div>
                    <div>
                      <strong>Boundary West:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.boundaryWest || "—"}</span>
                    </div>
                    <div>
                      <strong>Boundary South:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.boundarySouth || "—"}</span>
                    </div>
                    <div>
                      <strong>Boundary North:</strong>{" "}
                      <span style={{ color: "#475569" }}>{viewingUploadedRecord.boundaryNorth || "—"}</span>
                    </div>
                  </div>

                  {(viewingUploadedRecord.entireLandDescription || viewingUploadedRecord.subjectPropertyDescription) && (
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                      {viewingUploadedRecord.entireLandDescription && (
                        <div style={{ fontSize: 13 }}>
                          <strong>Entire Land Description:</strong>{" "}
                          <span style={{ color: "#475569" }}>{viewingUploadedRecord.entireLandDescription}</span>
                        </div>
                      )}
                      {viewingUploadedRecord.subjectPropertyDescription && (
                        <div style={{ fontSize: 13 }}>
                          <strong>Subject Property Description:</strong>{" "}
                          <span style={{ color: "#475569" }}>{viewingUploadedRecord.subjectPropertyDescription}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {viewingUploadedRecord.landParcels?.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <strong style={{ fontSize: 13 }}>Land Parcels:</strong>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginTop: 8, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                        <thead>
                          <tr style={{ background: "#f8fafc" }}>
                            <th style={{ padding: "6px 10px", textAlign: "left" }}>Survey No</th>
                            <th style={{ padding: "6px 10px", textAlign: "left" }}>Hissa No</th>
                            <th style={{ padding: "6px 10px", textAlign: "left" }}>Area</th>
                            <th style={{ padding: "6px 10px", textAlign: "left" }}>Unit</th>
                            <th style={{ padding: "6px 10px", textAlign: "left" }}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingUploadedRecord.landParcels.map((p, pIdx) => (
                            <tr key={pIdx} style={{ borderTop: "1px solid #e2e8f0" }}>
                              <td style={{ padding: "6px 10px" }}>{p.surveyNo || "—"}</td>
                              <td style={{ padding: "6px 10px" }}>{p.hissaNo || "—"}</td>
                              <td style={{ padding: "6px 10px" }}>{p.area || "—"}</td>
                              <td style={{ padding: "6px 10px" }}>{p.unit || "—"}</td>
                              <td style={{ padding: "6px 10px" }}>{p.remarks || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <h3
                    style={{
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: 8,
                      color: "var(--navy)",
                      margin: "0 0 16px 0",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    Uploaded Documents (Section 1.5)
                  </h3>
                  {getChecklistDocs(viewingUploadedRecord).length === 0 ? (
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>No documents uploaded.</div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th style={{ padding: "8px 12px", textAlign: "left", width: 40 }}>Sr.</th>
                          <th style={{ padding: "8px 12px", textAlign: "left" }}>Document Name</th>
                          <th style={{ padding: "8px 12px", textAlign: "left" }}>File</th>
                          <th style={{ padding: "8px 12px", textAlign: "left" }}>Remarks</th>
                          <th style={{ padding: "8px 12px", textAlign: "center", width: 80 }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getChecklistDocs(viewingUploadedRecord).map((doc, dIdx) => (
                          <tr key={dIdx} style={{ borderTop: "1px solid #e2e8f0" }}>
                            <td style={{ padding: "8px 12px", color: "#64748b" }}>{dIdx + 1}</td>
                            <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--navy)" }}>{doc.name || "—"}</td>
                            <td style={{ padding: "8px 12px", color: "var(--muted)" }}>
                              {doc.fileName ? `📎 ${doc.fileName}` : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No file</span>}
                            </td>
                            <td style={{ padding: "8px 12px", color: "#64748b" }}>{doc.remarks || "—"}</td>
                            <td style={{ padding: "8px 12px", textAlign: "center" }}>
                              {doc.filePath ? (
                                <button
                                  type="button"
                                  onClick={() => handleViewFile(doc.filePath, doc.name)}
                                  style={{
                                    background: "transparent",
                                    color: "var(--black)",
                                    border: "1px solid var(--black)",
                                    padding: "4px 8px",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    fontSize: 11,
                                    fontWeight: 600,
                                  }}
                                >
                                  👁 View
                                </button>
                              ) : (
                                <span style={{ color: "#cbd5e1" }}>—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "16px 28px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "flex-end",
                  background: "#fafafa",
                }}
              >
                <button
                  onClick={() => setViewingUploadedRecord(null)}
                  style={{
                    background: "var(--black)",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {viewingRecord &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(15, 23, 42, 0.4)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                width: "100%",
                maxWidth: 1000,
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                animation: "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  background: "var(--black)",
                  padding: "20px 28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 20,
                      fontFamily: "Playfair Display",
                    }}
                  >
                    TSR Initiation Details — {viewingRecord.appId}
                  </h2>
                  <span style={{ fontSize: 12, opacity: 0.8 }}>
                    Created on{" "}
                    {new Date(viewingRecord.createdAt).toLocaleDateString(
                      "en-IN",
                    )}
                  </span>
                </div>
                <button
                  onClick={() => setViewingRecord(null)}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(255,255,255,0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.15)")
                  }
                >
                  ✕
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div
                style={{
                  padding: 28,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 32,
                }}
              >
                {/* Section 1: Basic Info */}
                <div>
                  <h3
                    style={{
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: 8,
                      color: "var(--navy)",
                      margin: "0 0 16px 0",
                      fontSize: 15,
                      fontWeight: 700,
                    }}
                  >
                    I. Basic Info & Particulars
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "16px 24px",
                      fontSize: 13,
                      marginBottom: 16,
                    }}
                  >
                    <div>
                      <strong>Author/Advocate:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.author || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>TSR Reference No:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.refNo || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Branch:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.branch || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Initiation Date:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.initiationDate || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Applicant:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.applicant || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Co-Applicant:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.coApplicant || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Existing Owner:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.existingOwner || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Transaction Type:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.transactionType || "—"}
                      </span>
                    </div>
                    <div>
                      <strong>Bank Branch:</strong>{" "}
                      <span style={{ color: "#475569" }}>
                        {viewingRecord.bankBranch || "—"}
                      </span>
                    </div>
                      <div>
                        <strong>Municipal Property No:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.municipalPropertyNo || "—"}
                        </span>
                      </div>
                      <div>
                        <strong>RCC Construction Area:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.rccConstructionArea || "—"}
                        </span>
                      </div>
                      <div>
                        <strong>Village:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.village || "—"}
                        </span>
                      </div>
                      <div>
                        <strong>Taluka:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.taluka || "—"}
                        </span>
                      </div>
                      <div>
                        <strong>District:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.district || "—"}
                        </span>
                      </div>
                      <div>
                        <strong>Municipal Council:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.municipalCouncil || "—"}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        background: "#f8fafc",
                        padding: 16,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#475569",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Boundaries
                      </h4>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          gap: 16,
                          fontSize: 13,
                        }}
                      >
                        <div>
                          <strong>East:</strong>{" "}
                          <span style={{ color: "#475569" }}>
                            {viewingRecord.boundaryEast || "—"}
                          </span>
                        </div>
                        <div>
                          <strong>West:</strong>{" "}
                          <span style={{ color: "#475569" }}>
                            {viewingRecord.boundaryWest || "—"}
                          </span>
                        </div>
                        <div>
                          <strong>South:</strong>{" "}
                          <span style={{ color: "#475569" }}>
                            {viewingRecord.boundarySouth || "—"}
                          </span>
                        </div>
                        <div>
                          <strong>North:</strong>{" "}
                          <span style={{ color: "#475569" }}>
                            {viewingRecord.boundaryNorth || "—"}
                          </span>
                        </div>
                      </div>

                  </div>

                  {/* Scanned/Uploaded Documents List */}
                  {viewingRecord.uploadedDocuments?.length > 0 && (
                    <div
                      style={{
                        background: "#f8fafc",
                        padding: 16,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        marginTop: 16,
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#475569",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        OCR Scanned / Primary Documents
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {viewingRecord.uploadedDocuments.map((doc, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: "white",
                              padding: "8px 12px",
                              borderRadius: 6,
                              border: "1px solid #e2e8f0",
                              fontSize: 12,
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: "var(--black)",
                                }}
                              >
                                {doc.originalName}
                              </span>
                              <span style={{ color: "#64748b", marginLeft: 8 }}>
                                ({(doc.fileSize / 1024).toFixed(1)} KB)
                              </span>
                              {doc.extractedFields?.length > 0 && (
                                <div
                                  style={{
                                    fontSize: 10,
                                    color: "#059669",
                                    marginTop: 2,
                                  }}
                                >
                                  Extracted fields:{" "}
                                  {doc.extractedFields.join(", ")}
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleViewFile(doc.filePath, doc.originalName)
                              }
                              style={{
                                background: "transparent",
                                color: "var(--black)",
                                border: "1.5px solid var(--black)",
                                padding: "4px 8px",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: 11,
                                fontWeight: 600,
                              }}
                            >
                              👁 View File
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Land Parcels sub-section */}
                  {viewingRecord.landParcels?.length > 0 && (
                    <div
                      style={{
                        background: "#f8fafc",
                        padding: 16,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                        marginTop: 16,
                      }}
                    >
                      <h4
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#475569",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        Land Parcels
                      </h4>
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: 12,
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      >
                        <thead>
                          <tr style={{ background: "#ffffff" }}>
                            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Survey No.</th>
                            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Hissa No.</th>
                            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Area</th>
                            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Unit</th>
                            <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingRecord.landParcels.map((p, idx) => (
                            <tr
                              key={idx}
                              style={{
                                borderBottom: idx < viewingRecord.landParcels.length - 1 ? "1px solid #f1f5f9" : "none",
                                background: "#ffffff",
                              }}
                            >
                              <td style={{ padding: "8px 12px" }}>{p.surveyNo || "—"}</td>
                              <td style={{ padding: "8px 12px" }}>{p.hissaNo || "—"}</td>
                              <td style={{ padding: "8px 12px" }}>{p.area || "—"}</td>
                              <td style={{ padding: "8px 12px" }}>{p.unit || "—"}</td>
                              <td style={{ padding: "8px 12px" }}>{p.remarks || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>




                {/* Section 2: Documents List */}
                {viewingDocs?.length > 0 && (
                  <div>
                    <h3
                      style={{
                        borderBottom: "2px solid #f1f5f9",
                        paddingBottom: 8,
                        color: "var(--navy)",
                        margin: "16px 0 16px 0",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      II. Documents List (Submitted for Scrutiny)
                    </h3>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 12,
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        overflow: "hidden",
                        marginBottom: 20,
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Document Type</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Date of Execution</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Executed By</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>In Favour Of</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Registration Office</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Reg. No.</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingDocs.map((doc, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < viewingDocs.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <td style={{ padding: "8px 12px", fontWeight: 500 }}>{doc.documentType || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.executionDate ? new Date(doc.executionDate).toLocaleDateString() : "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.executedBy || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.executedInFavourOf || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.registrationOffice || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.registrationNumber || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.remarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Section 3: Title Flow Events */}
                {viewingRecord.titleFlowId && (
                  <div>
                    <h3
                      style={{
                        borderBottom: "2px solid #f1f5f9",
                        paddingBottom: 8,
                        color: "var(--navy)",
                        margin: "16px 0 16px 0",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      III. Title Flow Events ({viewingRecord.titleFlowId.events?.length || 0} Events)
                    </h3>
                    {viewingRecord.titleFlowId.events?.length > 0 ? (
                      <div
                        style={{
                          maxHeight: 350,
                          overflowY: "auto",
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                        }}
                      >
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: 12,
                            textAlign: "left",
                          }}
                        >
                          <thead>
                            <tr
                              style={{
                                background: "#f8fafc",
                                position: "sticky",
                                top: 0,
                                zIndex: 1,
                              }}
                            >
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>Evt.</th>
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>Type</th>
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>From Party</th>
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>To Party</th>
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>Document Type</th>
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>Reg. No</th>
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>Date</th>
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>Area</th>
                              <th style={{ padding: "10px 12px", borderBottom: "1px solid #e2e8f0" }}>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {viewingRecord.titleFlowId.events.map(
                              (evt, idx) => (
                                <tr
                                  key={idx}
                                  style={{
                                    borderBottom: "1px solid #f1f5f9",
                                    background:
                                      evt.currentOwner === "YES"
                                        ? "#f0fdf4"
                                        : "transparent",
                                  }}
                                >
                                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{evt.eventNo}</td>
                                  <td style={{ padding: "10px 12px" }}>
                                    <span
                                      style={{
                                        background: "#f1f5f9",
                                        padding: "2px 6px",
                                        borderRadius: 4,
                                        fontSize: 10,
                                        fontWeight: 600,
                                        color: "#475569",
                                      }}
                                    >
                                      {evt.eventType}
                                    </span>
                                  </td>
                                  <td style={{ padding: "10px 12px" }}>{evt.fromParty || "—"}</td>
                                  <td style={{ padding: "10px 12px" }}>
                                    {evt.toParty || "—"}
                                    {evt.currentOwner === "YES" && (
                                      <span
                                        style={{
                                          color: "#16a34a",
                                          fontSize: 10,
                                          fontWeight: 700,
                                          marginLeft: 6,
                                        }}
                                      >
                                        (Owner)
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ padding: "10px 12px" }}>{evt.documentType || "—"}</td>
                                  <td style={{ padding: "10px 12px" }}>
                                    {evt.registrationNo
                                      ? `${evt.registrationNo} (${evt.sroName || ""})`
                                      : "—"}
                                  </td>
                                  <td style={{ padding: "10px 12px" }}>{evt.documentDate || "—"}</td>
                                  <td style={{ padding: "10px 12px" }}>{evt.areaTransferred || "—"}</td>
                                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{evt.remarks || "—"}</td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ padding: 12, color: "#64748b", fontStyle: "italic", fontSize: 13 }}>
                        No events registered in this Title Flow.
                      </div>
                    )}
                  </div>
                )}



                {/* Section 4: Title Evidence */}
                {viewingEvidence?.length > 0 && (
                  <div>
                    <h3
                      style={{
                        borderBottom: "2px solid #f1f5f9",
                        paddingBottom: 8,
                        color: "var(--navy)",
                        margin: "16px 0 16px 0",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      IV. Title Evidence
                    </h3>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: 12,
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        overflow: "hidden",
                        marginBottom: 20,
                      }}
                    >
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Document Type</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Date of Execution</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Executed By</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>In Favour Of</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Registration Office</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Reg. No.</th>
                          <th style={{ padding: "8px 12px", borderBottom: "1px solid #e2e8f0", textAlign: "left" }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewingEvidence.map((doc, idx) => (
                          <tr key={idx} style={{ borderBottom: idx < viewingEvidence.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                            <td style={{ padding: "8px 12px", fontWeight: 500 }}>{doc.documentType || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.executionDate ? new Date(doc.executionDate).toLocaleDateString() : "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.executedBy || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.executedInFavourOf || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.registrationOffice || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.registrationNumber || "—"}</td>
                            <td style={{ padding: "8px 12px" }}>{doc.remarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Section 5: Other Provisions */}
                {viewingRecord.otherProvisionId?.answers?.length > 0 && (
                  <div>
                    <h3
                      style={{
                        borderBottom: "2px solid #f1f5f9",
                        paddingBottom: 8,
                        color: "var(--navy)",
                        margin: "0 0 16px 0",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      V. Other Provisions Scrutiny
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        maxHeight: 250,
                        overflowY: "auto",
                        paddingRight: 8,
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: 16,
                      }}
                    >
                      {viewingRecord.otherProvisionId.answers.map(
                        (ans, idx) => (
                          <div
                            key={idx}
                            style={{
                              borderBottom:
                                idx <
                                viewingRecord.otherProvisionId.answers.length -
                                  1
                                  ? "1px solid #f1f5f9"
                                  : "none",
                              paddingBottom: 8,
                              marginBottom: 8,
                              fontSize: 13,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontWeight: 600,
                              }}
                            >
                              <span>
                                {ans.code}. {ans.question}
                              </span>
                              <span
                                style={{
                                  color:
                                    ans.answer === "Yes"
                                      ? "#047857"
                                      : ans.answer === "No"
                                        ? "#b91c1c"
                                        : "#475569",
                                  background:
                                    ans.answer === "Yes"
                                      ? "#d1fae5"
                                      : ans.answer === "No"
                                        ? "#fee2e2"
                                        : "#f1f5f9",
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  fontSize: 11,
                                }}
                              >
                                {ans.answer}
                              </span>
                            </div>
                            {ans.remarks && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#64748b",
                                  marginTop: 4,
                                }}
                              >
                                <em>Remarks:</em> {ans.remarks}
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Section 6: Waiting Report & Checklist */}
                {viewingRecord.waitingReportId && (
                  <div>
                    <h3
                      style={{
                        borderBottom: "2px solid #f1f5f9",
                        paddingBottom: 8,
                        color: "var(--navy)",
                        margin: "0 0 16px 0",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      VI. Waiting Report & Pending Documents
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 16,
                        fontSize: 13,
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <strong>Chalan No:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.waitingReportId.chalanNo || "—"}
                        </span>
                      </div>
                      <div>
                        <strong>Chalan Date:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.waitingReportId.date || "—"}
                        </span>
                      </div>
                      <div>
                        <strong>Report Sr No:</strong>{" "}
                        <span style={{ color: "#475569" }}>
                          {viewingRecord.waitingReportId.reportSrNo || "—"}
                        </span>
                      </div>
                    </div>

                    {viewingRecord.waitingReportId.documents?.length > 0 && (
                      <table
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          fontSize: 12,
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      >
                        <thead>
                          <tr style={{ background: "#f8fafc" }}>
                            <th
                              style={{
                                padding: "8px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                width: 40,
                                textAlign: "center",
                              }}
                            >
                              Sr.
                            </th>
                            <th
                              style={{
                                padding: "8px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "left",
                              }}
                            >
                              Document Name
                            </th>
                            <th
                              style={{
                                padding: "8px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                width: 80,
                                textAlign: "center",
                              }}
                            >
                              Available
                            </th>
                            <th
                              style={{
                                padding: "8px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                textAlign: "left",
                              }}
                            >
                              Remarks
                            </th>
                            <th
                              style={{
                                padding: "8px 12px",
                                borderBottom: "1px solid #e2e8f0",
                                width: 90,
                                textAlign: "center",
                              }}
                            >
                              Attachment
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewingRecord.waitingReportId.documents.map(
                            (d, idx) => (
                              <tr
                                key={idx}
                                style={{
                                  borderBottom:
                                    idx <
                                    viewingRecord.waitingReportId.documents
                                      .length -
                                      1
                                      ? "1px solid #f1f5f9"
                                      : "none",
                                }}
                              >
                                <td
                                  style={{
                                    padding: "8px 12px",
                                    textAlign: "center",
                                  }}
                                >
                                  {d.srNo}
                                </td>
                                <td
                                  style={{
                                    padding: "8px 12px",
                                    fontWeight: 500,
                                  }}
                                >
                                  {d.name}
                                </td>
                                <td
                                  style={{
                                    padding: "8px 12px",
                                    textAlign: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      color:
                                        d.available === "Yes"
                                          ? "#047857"
                                          : "#b91c1c",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {d.available}
                                  </span>
                                </td>
                                <td style={{ padding: "8px 12px" }}>
                                  {d.remarks || "—"}
                                </td>
                                <td
                                  style={{
                                    padding: "8px 12px",
                                    textAlign: "center",
                                  }}
                                >
                                  {d.filePath ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleViewFile(d.filePath, d.name)
                                      }
                                      style={{
                                        background: "transparent",
                                        color: "var(--black)",
                                        border: "1px solid var(--black)",
                                        padding: "4px 8px",
                                        borderRadius: 4,
                                        cursor: "pointer",
                                        fontSize: 11,
                                        fontWeight: 600,
                                      }}
                                    >
                                      👁 View
                                    </button>
                                  ) : (
                                    <span style={{ color: "#cbd5e1" }}>—</span>
                                  )}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}


              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: "16px 28px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "flex-end",
                  background: "#fafafa",
                }}
              >
                <button
                  onClick={() => setViewingRecord(null)}
                  style={{
                    background: "var(--black)",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Inline File Previewer Overlay */}
      {previewFile &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              zIndex: 100000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 40,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: 16,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                width: "100%",
                maxWidth: 1100,
                height: "85vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                animation: "scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  background: "var(--black)",
                  padding: "16px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "white",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                    Document Preview: {previewFile.name}
                  </h3>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: 12,
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Open in New Tab
                  </a>
                  <button
                    onClick={() => setPreviewFile(null)}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
              {/* Body */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  background: "#f8fafc",
                  overflow: "hidden",
                }}
              >
                {previewFile.isPdf ? (
                  <iframe
                    src={previewFile.url}
                    style={{ width: "100%", height: "100%", border: "none" }}
                    title="PDF Document Preview"
                  />
                ) : previewFile.isImage ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      overflow: "auto",
                      padding: 20,
                    }}
                  >
                    <img
                      src={previewFile.url}
                      alt={previewFile.name}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: 8,
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      gap: 16,
                      padding: 40,
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: "#64748b", fontSize: 14 }}>
                      Preview not available for this file type.
                    </p>
                    <a
                      href={previewFile.url}
                      download
                      style={{
                        background: "var(--black)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

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
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `,
        }}
      />
    </div>
  );
}
